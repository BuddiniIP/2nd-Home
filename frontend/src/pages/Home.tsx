import React from 'react';
import { Home as HomeIcon, ShieldCheck, MapPin, User } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero';

const Features = () => {
  const items = [
    { icon: <ShieldCheck size={28} strokeWidth={1} />, text: "Verified Boarding" },
    { icon: <MapPin size={28} strokeWidth={1} />, text: "Near Universities" },
    { icon: <User size={28} strokeWidth={1} />, text: "Student Focused" },
    { icon: <HomeIcon size={28} strokeWidth={1} />, text: "Secure & Safe" },
  ];

  return (
    <div className="bg-black text-white py-12 sm:py-20 px-4 sm:px-6 relative z-20 rounded-[2rem] sm:rounded-[4rem] -mt-10 mx-4 sm:mx-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-8">
        {items.map((item, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 group"
          >
            <span className="text-accent-orange group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PopularUniversities = () => {
  const [totalBoardings, setTotalBoardings] = React.useState<number | null>(null);

  React.useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    fetch(`${apiBase}/api/boardings/count`)
      .then(r => r.json())
      .then(d => setTotalBoardings(d.total))
      .catch(() => {});
  }, []);

  const universities = [
    { title: "University of Colombo", image: "/images/university-of-colombo.jpg" },
    { title: "University of Peradeniya", image: "/images/university-of-peradeniya.jpg" },
    { title: "University of Moratuwa", image: "/images/university-of-moratuwa.jpg" },
    { title: "University of Kelaniya", image: "/images/university-of-kelaniya.jpg" },
    { title: "University of Sri Jayewardenepura", image: "/images/university-of-sri-jayewardenepura.jpg" },
    { title: "University of Ruhuna", image: "/images/university-of-ruhuna.png" },
    { title: "University of Jaffna", image: "/images/university-of-jaffna.png" },
    { title: "Rajarata University", image: "/images/university-of-rajarata.jpg" },
  ];

  const duplicatedUniversities = [...universities, ...universities];

  return (
    <section className="py-10 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4">
             <p className="text-accent-orange text-[10px] font-bold uppercase tracking-[0.3em]">Location Based Search</p>
             <h2 className="font-display text-4xl md:text-5xl tracking-tight">Popular Universities</h2>
             {totalBoardings !== null && (
               <p className="text-black/40 text-xs font-bold uppercase tracking-widest">{totalBoardings} Registered Boardings</p>
             )}
          </div>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            Discover the best student accommodations strategically located around the most prestigious universities in the country.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            ease: "linear", 
            repeat: Infinity 
          }}
          className="flex gap-6 whitespace-nowrap"
        >
          {duplicatedUniversities.map((uni, idx) => (
            <Link to="/login" key={idx}>
              <div 
                className="group relative w-72 h-96 rounded-3xl overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0"
              >
                <img 
                  src={uni.image} 
                  alt={uni.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 text-white whitespace-normal">
                  <h3 className="text-xl font-bold mb-1">{uni.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const HighlightSection = () => {
  return (
    <section className="py-10 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6 sm:space-y-10"
        >
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-accent-orange">SECURE STUDENT LIVING</p>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight tracking-tight text-black">Verified & Trusted<br />Accommodations</h2>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed text-sm font-light">
            We physically verify every boarding facility to ensure safety, cleanliness, and comfort for students. Our professional checkers visit each site so you don't have to worry.
          </p>
          <div className="flex gap-12 py-4">
             <div className="space-y-1">
                <p className="text-3xl font-display text-black">500+</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Verified Hosts</p>
             </div>
             <div className="space-y-1">
                <p className="text-3xl font-display text-black">12k+</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Happy Students</p>
             </div>
          </div>
          <Link to="/login">
            <button className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold hover:bg-accent-orange transition-colors uppercase tracking-[0.2em] shadow-lg shadow-black/10">
              Get Started Now
            </button>
          </Link>
        </motion.div>
        <div className="flex-[1.2] w-full relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="/images/house_orange.png" 
              alt="Safe Student Housing"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState('student');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUserRole('student');
      return;
    }
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then(data => {
        setIsLoggedIn(true);
        setUserRole(data.role || 'student');
      })
      .catch(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('profilePicture');
        setIsLoggedIn(false);
        setUserRole('student');
      });
  }, []);

  return (
    <div className="min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-orange z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/bedroom.png"
        bgImageSrc="/images/house_white.png"
        title="Your University Home"
        date="WELCOME TO 2nd HOME"
        scrollToExpand="SCROLL TO EXPLORE"
        textBlend
      >
        <div className="max-w-7xl mx-auto w-full">
           <div className="mb-10 sm:mb-20 text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-display tracking-tight text-black leading-none">Find Your Perfect Boarding</h1>
               <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto font-light px-4">
                 Secure, verified, and comfortable student accommodations near leading universities across Sri Lanka.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-8 px-4">
                  <Link 
                    to={isLoggedIn ? "/search" : "/login"} 
                    className="bg-black text-white px-8 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all"
                  >
                     Search Now
                  </Link>
                  <Link 
                    to={isLoggedIn ? (userRole === 'owner' ? "/owner-dashboard?tab=add-boarding" : "/student-dashboard") : "/login"} 
                    className="border border-black/10 text-black px-8 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                  >
                     {isLoggedIn && userRole === 'owner' ? "Add Property" : "List Property"}
                  </Link>
               </div>
           </div>

           <Features />
           <PopularUniversities />
           <HighlightSection />
        </div>
      </ScrollExpandMedia>
    </div>
  );
};

export default Home;
