import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

type Tab = 'signin' | 'reset';

const Login = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  const [tab, setTab] = useState<Tab>('signin');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', data.user._id || data.user.id);
      if (data.user.profilePicture) localStorage.setItem('profilePicture', data.user.profilePicture);

      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/owner-dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    setError('');
    setSuccessMsg('');
    if (!resetEmail) { setError('Enter your email address.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCodeSent(true);
      setSuccessMsg('An 8-digit reset code has been sent to your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!resetCode || resetCode.length !== 8) { setError('Please enter the 8-digit code.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg(data.message);
      setTimeout(() => {
        setTab('signin');
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setCodeSent(false);
        setSuccessMsg('');
        setError('');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex bg-white rounded-[3.5rem] shadow-sm overflow-hidden max-w-4xl w-full min-h-[550px]"
      >
        {/* Left Side: Image */}
        <div className="hidden lg:block w-1/2 relative">
           <img 
             src="/images/house_white.jpg"
             alt="Login" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/30" />
           <div className="absolute top-12 left-12 right-12 text-white">
              <h2 className="font-display text-4xl font-bold mb-4">Welcome Back.</h2>
              <p className="text-white/70 text-sm leading-relaxed">Sign in to continue managing your 2nd Home experience.</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
          {/* Tab Switcher */}
          <div className="flex gap-0 mb-10 bg-[#F8F8F8] rounded-full p-1 w-fit">
            <button
              onClick={() => { setTab('signin'); setError(''); setSuccessMsg(''); }}
              className={`px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${tab === 'signin' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('reset'); setError(''); setSuccessMsg(''); }}
              className={`px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${tab === 'reset' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              Reset Password
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-4 mb-10">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-black">Sign In</h1>
                  <p className="text-gray-400 text-sm">Enter your credentials to access your account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-full">{error}</motion.p>
                  )}
                  {successMsg && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-xs font-bold text-center bg-green-50 py-3 rounded-full">{successMsg}</motion.p>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email</label>
                    <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Password</label>
                    <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="pt-6">
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className="w-full bg-black text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                      {submitting ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                  </motion.div>
                </form>

                <div className="mt-12 text-center">
                  <p className="text-gray-400 text-xs">
                    Don't have an account? <Link to="/signup" className="text-black font-bold hover:text-accent-orange transition-colors">Create account</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="space-y-4 mb-10">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-black">Reset Password</h1>
                  <p className="text-gray-400 text-sm">Enter your email to receive an 8-digit reset code.</p>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-full mb-6">{error}</motion.p>
                )}
                {successMsg && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-xs font-bold text-center bg-green-50 py-3 rounded-full mb-6">{successMsg}</motion.p>
                )}

                {!codeSent ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email Address</label>
                      <input type="email" placeholder="name@example.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSendCode} disabled={submitting} className="w-full bg-black text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                      {submitting ? 'Sending...' : 'Send Reset Code'}
                    </motion.button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleResetPassword}>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">8-Digit Code</label>
                      <input type="text" placeholder="e.g. 48291735" maxLength={8} value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 8))} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none text-center text-2xl tracking-[0.3em] font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">New Password</label>
                      <input type="password" placeholder="Min. 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className="w-full bg-black text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                      {submitting ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
