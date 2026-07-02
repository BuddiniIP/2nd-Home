import React from 'react';
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero';
import { ContactSection as ContactForm } from '../components/ContactSection';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
      {[
        { icon: <Mail className="text-accent-orange" />, title: "Email Us", detail: "hello@2ndhome.lk", sub: "24/7 Support" },
        { icon: <Phone className="text-accent-orange" />, title: "Call Us", detail: "+94 11 234 5678", sub: "Mon-Fri, 9am-6pm" },
        { icon: <MapPin className="text-accent-orange" />, title: "Visit Us", detail: "Colombo 07, Sri Lanka", sub: "HQ Office" },
        { icon: <Clock className="text-accent-orange" />, title: "Response Time", detail: "Under 2 Hours", sub: "During working hours" }
      ].map((item, i) => (
        <div key={i} className="space-y-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
            {item.icon}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-black uppercase text-[10px] tracking-widest">{item.title}</h4>
            <p className="text-lg font-display text-black">{item.detail}</p>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Contact = () => {
  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/contact.jpg"
        bgImageSrc="/images/lets_get_in_touch.jpg"
        title="Get In Touch"
        date="2nd HOME SUPPORT"
        scrollToExpand="SCROLL TO CONNECT"
        textBlend
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-20 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display tracking-tight text-black mb-6">We're Here to Help</h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Whether you're a student looking for a safe home or an owner wanting to list your property, our team is ready to assist you.
            </p>
          </div>
          
          <ContactInfo />
          
          <div className="bg-[#F8F8F8] rounded-[2rem] sm:rounded-[3rem] p-4">
             <ContactForm />
          </div>

          {/* Decorative Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 sm:mt-32 mb-12 sm:mb-20">
<div className="aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm">
                <img src="/images/town.jpg" alt="Student Community" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
};

export default Contact;
