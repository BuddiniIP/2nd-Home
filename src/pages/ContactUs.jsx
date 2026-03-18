import { useState } from "react";

const ContactUs = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I verify my boarding facility?",
      answer: "After listing your property, our verification team will contact you within 24-48 hours to schedule a physical inspection. The verification process includes checking safety features, amenities, and location accuracy."
    },
    {
      question: "What should I do if I have issues with my boarding owner?",
      answer: "Contact our student support team immediately at support@2nd Home.com or call +94 77 123 4567. We'll mediate the situation and help find a resolution within 48 hours."
    },
    {
      question: "How long does it take to get a response to my inquiry?",
      answer: "We respond to all inquiries within 24 hours during business days. For urgent matters, please call our support lines directly for faster assistance."
    },
    {
      question: "Can I visit boarding facilities before booking?",
      answer: "Yes! We encourage students to visit boarding facilities before making a decision. Use our messaging system to schedule a visit directly with the property owner."
    },
    {
      question: "What safety measures are in place for verified boardings?",
      answer: "All verified boardings must pass our safety checklist which includes: fire safety equipment, secure locks, emergency exits, proper lighting, and verified ownership documentation."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans">
      {/* Page Header */}
      <div className="bg-[linear-gradient(rgba(26,95,180,0.9),rgba(26,95,180,0.85)),url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white py-[60px] md:py-[80px] text-center">
        <div className="container mx-auto px-[20px]">
          <h1 className="text-[2.2rem] md:text-[2.8rem] font-bold font-poppins mb-[15px]">Contact Us</h1>
          <p className="text-[1.1rem] md:text-[1.2rem] opacity-90 max-w-[700px] mx-auto">We're here to help! Get in touch with our support team for any questions about 2nd Home.</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-[60px] md:py-[80px]">
        <div className="container mx-auto px-[20px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] md:gap-[50px] items-start">
            
            {/* Contact Form */}
            <div className="bg-white rounded-[10px] p-[30px] md:p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] order-2 lg:order-1">
              <h2 className="text-[1.8rem] font-bold text-[#1a5fb4] font-poppins mb-[30px] pb-[15px] border-b-2 border-[#f0f7ff]">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-[25px]">
                  <label htmlFor="name" className="block font-semibold mb-[8px] text-[#555]">Full Name *</label>
                  <input type="text" id="name" className="w-full p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" placeholder="Enter your full name" required />
                </div>
                <div className="mb-[25px]">
                  <label htmlFor="email" className="block font-semibold mb-[8px] text-[#555]">Email Address *</label>
                  <input type="email" id="email" className="w-full p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" placeholder="Enter your email address" required />
                </div>
                <div className="mb-[25px]">
                  <label htmlFor="subject" className="block font-semibold mb-[8px] text-[#555]">Subject *</label>
                  <input type="text" id="subject" className="w-full p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" placeholder="What is your message about?" required />
                </div>
                <div className="mb-[25px]">
                  <label htmlFor="message" className="block font-semibold mb-[8px] text-[#555]">Message *</label>
                  <textarea id="message" className="w-full p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] min-h-[150px] resize-y focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" placeholder="Please provide details about your inquiry..." required></textarea>
                </div>
                <button type="submit" className="w-full p-[16px] text-[1.1rem] bg-[#ff9800] text-white rounded-[6px] font-semibold hover:bg-[#e68900] transition-colors flex items-center justify-center gap-[8px]">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-[10px] p-[30px] md:p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] order-1 lg:order-2">
              <h2 className="text-[1.8rem] font-bold text-[#1a5fb4] font-poppins mb-[30px] pb-[15px] border-b-2 border-[#f0f7ff]">Contact Information</h2>
              
              <div className="flex items-start mb-[30px] pb-[20px] border-b border-[#eee]">
                <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mr-[20px] shrink-0 text-[#1a5fb4] text-[1.2rem]">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-semibold text-[#333] mb-[5px] font-poppins">Email Address</h3>
                  <p className="text-[#666] mb-[2px]"><a href="mailto:support@2nd Home.com" className="text-[#1a5fb4] hover:text-[#0f4a97] hover:underline">support@2nd Home.com</a></p>
                  <p className="text-[#666] mb-[5px]"><a href="mailto:info@2nd Home.com" className="text-[#1a5fb4] hover:text-[#0f4a97] hover:underline">info@2nd Home.com</a></p>
                  <p className="text-[#777] text-[0.9rem] mt-[10px]">Response time: Within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start mb-[30px] pb-[20px] border-b border-[#eee]">
                <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mr-[20px] shrink-0 text-[#1a5fb4] text-[1.2rem]">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-semibold text-[#333] mb-[5px] font-poppins">Phone Number</h3>
                  <p className="text-[#666] mb-[2px]"><a href="tel:+94112345678" className="text-[#1a5fb4] hover:text-[#0f4a97] hover:underline">+94 11 234 5678</a> (Office)</p>
                  <p className="text-[#666] mb-[2px]"><a href="tel:+94771234567" className="text-[#1a5fb4] hover:text-[#0f4a97] hover:underline">+94 77 123 4567</a> (Student Support)</p>
                  <p className="text-[#666] mb-[5px]"><a href="tel:+94771234568" className="text-[#1a5fb4] hover:text-[#0f4a97] hover:underline">+94 77 123 4568</a> (Owner Support)</p>
                  <p className="text-[#777] text-[0.9rem] mt-[10px]">Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start mb-[30px] pb-[20px] border-b border-[#eee]">
                <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mr-[20px] shrink-0 text-[#1a5fb4] text-[1.2rem]">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-semibold text-[#333] mb-[5px] font-poppins">Office Location</h3>
                  <p className="text-[#666] mb-[2px]">2nd Home Headquarters</p>
                  <p className="text-[#666] mb-[2px]">123 University Avenue, Colombo 03</p>
                  <p className="text-[#666] mb-[5px]">Sri Lanka</p>
                  <p className="text-[#777] text-[0.9rem] mt-[10px]">Visits by appointment only</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mr-[20px] shrink-0 text-[#1a5fb4] text-[1.2rem]">
                  <i className="fas fa-headset"></i>
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-semibold text-[#333] mb-[5px] font-poppins">Live Chat Support</h3>
                  <p className="text-[#666] mb-[2px]">Available on our website during business hours</p>
                  <p className="text-[#666] mb-[5px]">Look for the chat icon in the bottom right corner</p>
                  <p className="text-[#777] text-[0.9rem] mt-[10px]">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-[40px] md:pt-0">
        <div className="container mx-auto px-[20px]">
          <div className="text-center mb-[40px] md:mb-[50px]">
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-[#1a5fb4] font-poppins mb-[15px]">Find Our Office</h2>
            <p className="text-[#666] max-w-[700px] mx-auto text-[1.1rem]">Located in the heart of Colombo, close to major universities</p>
          </div>
          
          <div className="rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.1)] h-[300px] md:h-[400px] relative bg-[#e8f2ff] flex flex-col items-center justify-center text-[#1a5fb4] p-[20px] text-center">
            <i className="fas fa-map-marked-alt text-[3rem] md:text-[4rem] mb-[20px] opacity-70"></i>
            <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold font-poppins mb-[10px]">Our Location in Colombo</h3>
            <p className="text-[#666] max-w-[500px] mb-[20px]">2nd Home Headquarters is located at 123 University Avenue, Colombo 03, Sri Lanka. We're conveniently situated near University of Colombo and other educational institutions.</p>
            <a href="https://maps.google.com/?q=123+University+Avenue,+Colombo+03,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="bg-[#1a5fb4] text-white px-[25px] py-[12px] rounded-[6px] font-semibold hover:bg-[#0f4a97] transition-colors flex items-center gap-[8px]">
              <i className="fas fa-directions"></i> Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f0f7ff] py-[60px] md:py-[80px]">
        <div className="container mx-auto px-[20px]">
          <div className="text-center mb-[40px] md:mb-[50px]">
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-[#1a5fb4] font-poppins mb-[15px]">Frequently Asked Questions</h2>
            <p className="text-[#666] max-w-[700px] mx-auto text-[1.1rem]">Quick answers to common questions about 2nd Home</p>
          </div>
          
          <div className="max-w-[800px] mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-[10px] mb-[15px] md:mb-[20px] overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.05)]">
                <div 
                  className="p-[20px_25px] font-semibold text-[1.1rem] text-[#333] cursor-pointer flex justify-between items-center transition-colors hover:bg-[#f9f9f9]"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <i className={`fas fa-chevron-down text-[#1a5fb4] transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}></i>
                </div>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: activeFaq === index ? '500px' : '0px' }}
                >
                  <div className="p-[0_25px_25px_25px] text-[#666]">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
