import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserCircle, Building, CheckCircle, Search, ClipboardList, Calendar, CreditCard, Home as HomeIcon, ShieldCheck, FileCheck, MapPin, SearchCheck } from 'lucide-react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'owner'>('student');

  const studentSteps = [
    {
      title: "Create Your Student Profile",
      description: "Sign up with your university email and create a detailed profile. Include your university, course details, and accommodation preferences to get personalized recommendations.",
      icon: <UserCircle size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1523240715639-960c609559c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["University Verification", "Profile Setup", "Preference Selection"]
    },
    {
      title: "Search & Filter Boardings",
      description: "Use our advanced search filters to find boardings near your university. Filter by location, price range, amenities, room type, and distance from campus.",
      icon: <Search size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Location Search", "Price Filters", "Amenity Selection"]
    },
    {
      title: "Browse Verified Listings",
      description: "View detailed information about each boarding facility including photos, amenities, house rules, and reviews from other students. All listings are physically verified by our team.",
      icon: <CheckCircle size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Verified Photos", "Student Reviews", "Safety Checklist"]
    },
    {
      title: "Schedule a Visit",
      description: "Contact boarding owners through our secure messaging system to schedule a visit. View available time slots and book appointments that fit your schedule.",
      icon: <Calendar size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Secure Messaging", "Visit Scheduling", "Owner Contact"]
    },
    {
      title: "Complete Booking Process",
      description: "Once you've found the perfect boarding, complete the booking process through our secure platform. Review and sign the rental agreement digitally.",
      icon: <ClipboardList size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Digital Agreement", "Secure Payment", "Booking Confirmation"]
    },
    {
      title: "Move In & Leave Review",
      description: "Move into your new accommodation and start your university journey. After your stay, leave a review to help other students find great boarding options.",
      icon: <HomeIcon size={32} strokeWidth={1.5} />,
      image: "https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800",
      tags: ["Move-in Support", "Review System", "Ongoing Support"]
    }
  ];

  const ownerSteps = [
    {
      title: "Create Owner Account",
      description: "Register as a boarding owner with your personal and property details. Complete identity verification for security purposes.",
      icon: <UserCircle size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Identity Check", "Owner Dashboard", "Secure Registration"]
    },
    {
      title: "List Your Property",
      description: "Add detailed information about your boarding facility including photos, amenities, pricing, availability, and house rules.",
      icon: <Building size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Property Details", "Photo Upload", "Pricing Control"]
    },
    {
      title: "Verification Process",
      description: "Our team will contact you to schedule a physical verification of your property to ensure safety and quality standards.",
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Site Visit", "Safety Inspection", "Certified Badge"]
    },
    {
      title: "Receive Student Inquiries",
      description: "Start receiving inquiries from verified university students looking for accommodation near their campus.",
      icon: <Search size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Verified Students", "Lead Generation", "Instant Alerts"]
    },
    {
      title: "Manage Bookings",
      description: "Use our dashboard to manage bookings, schedule visits, communicate with students, and update availability.",
      icon: <ClipboardList size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Booking Calendar", "In-app Chat", "Availability Toggle"]
    },
    {
      title: "Secure Payments",
      description: "Receive payments through our secure payment system with transparent fees and automated reminders.",
      icon: <CreditCard size={32} strokeWidth={1.5} />,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Direct Payouts", "Transaction History", "Invoice Generation"]
    }
  ];

  const currentSteps = activeTab === 'student' ? studentSteps : ownerSteps;

  return (
    <div className="pt-32 pb-24 bg-white">
      {/* Header */}
      <section className="px-6 mb-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-accent-orange text-[10px] font-bold uppercase tracking-[0.4em]"
           >
             How It Works
           </motion.p>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-display text-5xl md:text-7xl text-black tracking-tight"
           >
             {activeTab === 'student' ? 'Find Your Perfect Boarding' : 'List & Manage Your Property'}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-gray-400 text-lg max-w-2xl mx-auto"
           >
             {activeTab === 'student' 
                ? 'Follow these simple steps to secure safe, verified accommodation near your university.' 
                : 'Simple steps to connect with university students and manage your boarding facility effectively.'}
           </motion.p>
        </div>
      </section>

      {/* Tab Selection */}
      <section className="px-6 mb-24">
        <div className="max-w-md mx-auto bg-gray-50 p-2 rounded-full flex relative overflow-hidden">
           <motion.div 
             className="absolute inset-y-2 rounded-full bg-black shadow-lg shadow-black/20"
             animate={{ x: activeTab === 'student' ? '0%' : '100%' }}
             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
             style={{ width: 'calc(50% - 8px)' }}
           />
           <button 
             onClick={() => setActiveTab('student')}
             className={`relative z-10 flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'student' ? 'text-white' : 'text-gray-400 hover:text-black'}`}
           >
             For Students
           </button>
           <button 
             onClick={() => setActiveTab('owner')}
             className={`relative z-10 flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'owner' ? 'text-white' : 'text-gray-400 hover:text-black'}`}
           >
             For Owners
           </button>
        </div>
      </section>

      {/* Steps Content */}
      <section className="px-6 space-y-32">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-40"
          >
            {currentSteps.map((step, idx) => (
              <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-6">
                    <span className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-display text-2xl font-bold shadow-xl shadow-black/10">
                      {idx + 1}
                    </span>
                    <div className="text-accent-orange">
                       {step.icon}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-display text-4xl text-black tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">{step.description}</p>
                    <div className="flex flex-wrap gap-3 pt-4">
                       {step.tags?.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                             {tag}
                          </span>
                       ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <motion.div 
                    whileInView={{ scale: 1.05 }}
                    transition={{ duration: 1 }}
                    className="aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100"
                  >
                    <img loading="lazy" src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Verification Process Detail */}
      <section className="bg-gray-50 py-32 mt-40 rounded-[4rem] mx-6">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-display text-black tracking-tight">Our Verification Process</h2>
                  <p className="text-gray-400 text-lg">Every boarding facility listed on 2nd Home goes through a thorough physical verification process to ensure student safety and comfort.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-8">
                  {[
                    { icon: <Building className="text-accent-orange" />, title: "Property Inspection", desc: "Our trained inspectors visit each property to verify amenities, safety features, and living conditions." },
                    { icon: <FileCheck className="text-accent-orange" />, title: "Document Verification", desc: "We verify ownership documents, rental licenses, and compliance with local regulations." },
                    { icon: <ShieldCheck className="text-accent-orange" />, title: "Safety Standards Check", desc: "We check fire safety equipment, emergency exits, security measures, and general safety standards." },
                    { icon: <MapPin className="text-accent-orange" />, title: "Location Verification", desc: "We verify the exact location and distance from nearby universities and essential amenities." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                       <div className="mt-1">{item.icon}</div>
                       <div className="space-y-1">
                          <h4 className="font-bold text-black">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="hidden md:block">
               <div className="aspect-square bg-white rounded-[3rem] shadow-sm flex items-center justify-center p-12">
                  <div className="relative">
                     <SearchCheck size={200} strokeWidth={0.5} className="text-accent-orange/10" />
                     <motion.div 
                       animate={{ scale: [1, 1.1, 1] }}
                       transition={{ repeat: Infinity, duration: 3 }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <ShieldCheck size={120} strokeWidth={1} className="text-accent-orange" />
                     </motion.div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="px-6 pt-32">
        <div className="max-w-7xl mx-auto bg-black rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-orange rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-orange rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight">Ready to Get Started?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Join thousands of students and boarding owners who trust 2nd Home for safe, verified accommodation solutions near universities.</p>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-center gap-6">
             <Link to="/signup" className="bg-white text-black px-12 py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange hover:text-white transition-all shadow-xl shadow-black/20">
                Register Now
             </Link>
             <Link to="/contact" className="border border-white/20 text-white px-12 py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                Contact Support
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
