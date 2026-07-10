import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactSection as ContactForm } from '../components/ContactSection';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-20">
      {[
        { icon: <Mail className="text-accent-orange" />, title: "Email Us", detail: "hello@2ndhome.lk", sub: "24/7 Support" },
        { icon: <Phone className="text-accent-orange" />, title: "Call Us", detail: "+94 11 234 5678", sub: "Mon-Fri, 9am-6pm" },
        { icon: <MapPin className="text-accent-orange" />, title: "Visit Us", detail: "Colombo 07, Sri Lanka", sub: "HQ Office" },
        { icon: <Clock className="text-accent-orange" />, title: "Response Time", detail: "Under 2 Hours", sub: "During working hours" }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
            {item.icon}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-black uppercase text-[10px] tracking-widest">{item.title}</h4>
            <p className="text-lg font-display text-black">{item.detail}</p>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img src="/images/house_white.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-orange text-[10px] font-bold uppercase tracking-[0.4em] mb-4"
          >
            2nd HOME SUPPORT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm sm:text-lg mt-4 max-w-xl"
          >
            We're here to help — reach out anytime.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-24">
        <div className="mb-10 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display tracking-tight text-black mb-6">We're Here to Help</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Whether you're a student looking for a safe home or an owner wanting to list your property, our team is ready to assist you.
          </p>
        </div>

        <ContactInfo />

        <div className="bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8">
           <ContactForm />
        </div>

        {/* Decorative Image Grid */}
        <div className="flex flex-row gap-4 sm:gap-8 mt-16 sm:mt-32 mb-12 sm:mb-20">
          {[
            { src: "/images/university-of-kelaniya.jpg", alt: "University Campus" },
            { src: "/images/about-students.png", alt: "Students Collaborating" },
            { src: "/images/about-campus.png", alt: "Campus Life" }
          ].map((img, i) => (
            <ExpandableImage key={i} src={img.src} alt={img.alt} delay={i * 0.15} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ExpandableImage = ({ src, alt, delay }: { src: string; alt: string; delay: number }) => {
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = () => {
    setExpanded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setExpanded(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        className="flex-1 aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm cursor-pointer relative group"
        onClick={handleClick}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </motion.div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-12"
            onClick={() => { setExpanded(false); if (timerRef.current) clearTimeout(timerRef.current); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl w-full max-h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src={src} alt={alt} className="w-full h-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact;
