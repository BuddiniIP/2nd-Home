import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
          <div className="space-y-4 mb-12">
            <h1 className="font-display text-4xl font-bold tracking-tight text-black">Sign In</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-full"
              >
                {error}
              </motion.p>
            )}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" 
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Password</label>
                <a href="#" className="text-[10px] font-bold text-accent-orange uppercase tracking-widest hover:text-black transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" 
                required 
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="pt-6"
            >
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-black text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {submitting ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </motion.div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-xs">
              Don't have an account? <Link to="/signup" className="text-black font-bold hover:text-accent-orange transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
