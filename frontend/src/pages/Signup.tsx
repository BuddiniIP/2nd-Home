import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Home as HomeIcon, Camera, ChevronLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [fileName, setFileName] = useState("No file chosen");

  const handleRoleSelect = (selectedRole: 'student' | 'owner') => {
    setRole(selectedRole);
    setStep('form');
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [gender, setGender] = useState('');
  const [year, setYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, password, role, phone,
          university: role === 'student' ? university : undefined,
          gender: role === 'student' ? gender : undefined,
          year: role === 'student' ? year : undefined,
          faculty: role === 'student' ? faculty : undefined,
          universityEmail: role === 'student' ? universityEmail : undefined,
          nicNumber: role === 'owner' ? nicNumber : undefined,
          whatsappNumber: role === 'owner' ? whatsappNumber : undefined,
          recoveryEmail: role === 'owner' ? recoveryEmail : undefined,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id || data.user.id);
      if (data.user.profilePicture) localStorage.setItem('profilePicture', data.user.profilePicture);
      
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(data.user.role === 'student' ? '/student-dashboard' : '/owner-dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const universities = [
    "University of Colombo",
    "University of Peradeniya",
    "University of Moratuwa",
    "University of Kelaniya",
    "University of Sri Jayewardenepura",
    "Other University"
  ];

  const faculties = [
    "Computing", "Technology", "Engineering", "Medicine", "Science", "Arts", "Law", "Management", "Other"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-6 py-20">
      <div className="flex bg-white rounded-[3.5rem] shadow-sm overflow-hidden max-w-6xl w-full min-h-[700px]">
        {/* Left Side: Image (Dynamic based on role) */}
        <div className="hidden lg:block w-1/3 relative">
           <img 
             src={role === 'student' 
               ? "/images/house_white.jpg" 
               : "/images/house_orange.jpg"
             } 
             alt="Sign up theme" 
             className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
           />
           <div className="absolute inset-0 bg-black/40" />
           <div className="absolute top-12 left-12 right-12 text-white">
              <h2 className="font-display text-3xl font-bold mb-4">
                {step === 'role' ? 'Start your journey.' : (role === 'student' ? 'Join as a Student.' : 'Join as an Owner.')}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                {role === 'student' 
                  ? 'Join thousands of students finding verified accommodations.' 
                  : 'List your property and reach university students across the country.'}
              </p>
           </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-12 md:p-16 relative">
          <AnimatePresence mode="wait">
            {step === 'role' ? (
              <motion.div 
                key="role-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-center space-y-12"
              >
                <div className="space-y-4">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-black text-center lg:text-left">Create Account</h1>
                  <p className="text-gray-400 text-sm text-center lg:text-left">Choose your role to get started with 2nd Home</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button 
                     onClick={() => handleRoleSelect('student')}
                     className="flex flex-col items-center justify-center p-12 border-2 border-gray-50 rounded-[3rem] hover:border-accent-orange hover:bg-accent-orange/5 transition-all group gap-6"
                   >
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-accent-orange group-hover:text-white transition-colors">
                         <User size={40} strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                         <h3 className="font-bold text-xl">I am a Student</h3>
                         <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">Find Boarding</p>
                      </div>
                   </button>
                   <button 
                     onClick={() => handleRoleSelect('owner')}
                     className="flex flex-col items-center justify-center p-12 border-2 border-gray-50 rounded-[3rem] hover:border-accent-orange hover:bg-accent-orange/5 transition-all group gap-6"
                   >
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-accent-orange group-hover:text-white transition-colors">
                         <HomeIcon size={40} strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                         <h3 className="font-bold text-xl">I am an Owner</h3>
                         <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">List Property</p>
                      </div>
                   </button>
                </div>

                <div className="text-center pt-8 border-t border-gray-50">
                  <p className="text-gray-400 text-xs">
                    Already have an account? <Link to="/login" className="text-black font-bold hover:text-accent-orange transition-colors">Sign in</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <button 
                  onClick={() => setStep('role')}
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-widest mb-8"
                >
                  <ChevronLeft size={14} /> Back to selection
                </button>

                <div className="space-y-4">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-black">
                    {role === 'student' ? 'Student Registration' : 'Owner Registration'}
                  </h1>
                  <p className="text-gray-400 text-sm">Please provide your details to create your account.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-8">
                  {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-full">{error}</p>}
                  {/* Profile Picture */}
                  <div className="space-y-4">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Profile Picture</label>
                     <div 
                       className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] hover:border-accent-orange transition-all cursor-pointer bg-[#F8F8F8]/50 group"
                       onClick={() => document.getElementById('profilePic')?.click()}
                     >
                        <Camera className="text-gray-300 group-hover:text-accent-orange transition-colors mb-2" size={32} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fileName}</span>
                        <input type="file" id="profilePic" className="hidden" onChange={handleFileChange} accept="image/*" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">First Name</label>
                      <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Last Name</label>
                      <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email Address</label>
                      <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Confirm Password</label>
                      <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Password</label>
                      <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required minLength={6} />
                    </div>
                  </div>

                  {/* Student Specific Fields */}
                  {role === 'student' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Gender</label>
                          <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Contact Number</label>
                          <input type="tel" placeholder="+94 7X XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">University Email</label>
                        <input type="email" placeholder="name@university.edu" value={universityEmail} onChange={e => setUniversityEmail(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">University</label>
                          <select value={university} onChange={e => setUniversity(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer">
                            <option value="">Select</option>
                            {universities.map(u => <option key={u} value={u.toLowerCase()}>{u}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Year</label>
                          <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer">
                            <option value="">Select</option>
                            <option value="1">Year 1</option>
                            <option value="2">Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                            <option value="postgrad">Postgrad</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Faculty</label>
                          <select value={faculty} onChange={e => setFaculty(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer">
                            <option value="">Select</option>
                            {faculties.map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Owner Specific Fields */}
                  {role === 'owner' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">NIC Number</label>
                          <input type="text" placeholder="XXXXXXXXXV / 20XXXXXXXXX" value={nicNumber} onChange={e => setNicNumber(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Contact Number</label>
                          <input type="tel" placeholder="+94 7X XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">WhatsApp Number</label>
                          <input type="tel" placeholder="+94 7X XXX XXXX" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Recovery Email</label>
                          <input type="email" placeholder="owner_recovery@email.com" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-6">
                    <button type="submit" disabled={submitting} className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange hover:text-white transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                      {submitting ? 'Creating...' : `Create ${role === 'student' ? 'Student' : 'Owner'} Account`}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
