import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pb-24 bg-[#F8F8F8]">
      {/* Hero Section */}
      <section className="px-6 mb-16 sm:mb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 space-y-10"
          >
            <div className="space-y-6">
              <p className="text-accent-orange text-[10px] font-bold uppercase tracking-[0.3em]">Our Story</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-black">Redefining Student<br />Living in Sri Lanka</h1>
            </div>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg max-w-xl font-light">
               <p>
                 2nd Home was founded with a simple mission: to make finding safe, verified, and comfortable student accommodation easier than ever before.
               </p>
               <p>
                 We understand the challenges students face when moving away from home for the first time. Our platform bridges the gap between property owners and students, ensuring a transparent and secure experience for both parties.
               </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex-[0.8] w-full"
          >
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1523240715639-960c609559c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students collaborating" className="w-full h-full object-cover" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-black text-white py-16 sm:py-32 px-6 rounded-[2rem] sm:rounded-[5rem] mx-4 sm:mx-6">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
               <h2 className="text-4xl md:text-6xl font-display tracking-tight">Our Philosophy</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">Built on trust, transparency, and the pursuit of student well-being.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
               {[
                 { title: "Verified", desc: "Every property is physically checked for safety and quality." },
                 { title: "Transparent", desc: "Honest pricing and real photos without hidden catches." },
                 { title: "Supportive", desc: "24/7 assistance throughout your entire stay." }
               ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-6 border-l border-white/10 pl-10"
                  >
                     <h3 className="text-4xl font-display">{item.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 sm:py-40 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-[16/10] rounded-[3rem] overflow-hidden"
            >
               <img src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="University campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="aspect-[16/10] rounded-[3rem] overflow-hidden"
            >
               <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students social area" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
         </div>
      </section>
    </div>
  );
};

export default About;
