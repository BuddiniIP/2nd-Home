import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import Cursor from '../components/Cursor';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(auth === 'true');
    setUserRole(role || 'student');
  }, [location]);

  const [userRole, setUserRole] = useState('student');

  const dashboardPath =
    userRole === 'admin'
      ? '/admin-dashboard'
      : userRole === 'owner'
        ? '/owner-dashboard'
        : userRole === 'verifier'
          ? '/verifier-dashboard'
          : '/student-dashboard';

  const profilePath =
    userRole === 'admin'
      ? '/admin-dashboard'
      : userRole === 'owner'
        ? '/owner-dashboard?tab=profile'
        : userRole === 'verifier'
          ? '/verifier-dashboard?tab=profile'
          : '/student-dashboard?tab=profile';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <nav className="bg-white/90 backdrop-blur-md rounded-full px-8 py-3 flex items-center justify-between shadow-sm border border-gray-100">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={logo} 
              alt="2nd Home Logo" 
              className="h-20 w-auto object-contain" 
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Home', 'Search', 'About', 'How It Works', 'Contact'].map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }}>
                <Link 
                  to={item === 'Home' ? '/' : (item === 'Search' ? (isLoggedIn ? '/search' : '/login') : `/${item.toLowerCase().replace(/\s+/g, '-')}`)} 
                  className="hover:text-accent-orange transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="relative mr-2">
                 <Link to="/notifications" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black hover:text-accent-orange transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-accent-orange border-2 border-white rounded-full" />
                 </Link>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={dashboardPath}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:text-accent-orange transition-colors"
                >
                  Dashboard
                </Link>
              </motion.div>
              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Logout
                </button>
                <Link to={profilePath}>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent-orange shadow-sm"
                  >
                    <img src={userRole === 'owner' ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} alt="Profile" className="w-full h-full object-cover" />
                  </motion.div>
                </Link>
              </div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup" 
                  className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-accent-orange transition-all shadow-lg shadow-black/5"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-24">
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
               <img src={logo} alt="2nd Home" className="h-24 w-auto invert brightness-0 grayscale opacity-80 hover:opacity-100 transition-opacity" />
               <span className="font-display text-3xl font-bold">2nd HOME</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Connecting university students with verified boarding facilities. Simple, safe, and reliable.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-[0.2em] mb-6">For Students</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-medium">
              <li><Link to="/how-it-works" className="hover:text-accent-orange transition-colors">How it Works</Link></li>
              <li><Link to="#" className="hover:text-accent-orange transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-[0.2em] mb-6">For Owners</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-medium">
              <li><Link to="/login" className="hover:text-accent-orange transition-colors">List Your Property</Link></li>
              <li><Link to="#" className="hover:text-accent-orange transition-colors">Verification Process</Link></li>
              <li><Link to="#" className="hover:text-accent-orange transition-colors">Owner Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-[0.2em] mb-6">Support</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-medium">
              <li><Link to="/contact" className="hover:text-accent-orange transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-accent-orange transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-accent-orange transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-extrabold">
           <span>© {currentYear} 2nd HOME. All rights reserved.</span>
           <div className="flex gap-12">
             <a href="#" className="hover:text-white">Privacy</a>
             <a href="#" className="hover:text-white">Terms</a>
             <a href="#" className="hover:text-white">Cookies</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode, key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen font-sans selection:bg-accent-orange selection:text-white bg-white overflow-x-hidden cursor-none">
      <Cursor />
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
