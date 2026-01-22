import React, { useState } from 'react';

export default function Contact() {
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
            answer: "Contact our student support team immediately at support@boardingfinder.com or call +94 77 123 4567. We'll mediate the situation and help find a resolution within 48 hours."
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

    return (
        <div className="bg-[#f9f9f9] min-h-screen font-sans text-[#333]">
            {/* Page Header */}
            <div
                className="relative bg-[#1a5fb4] text-white py-20 text-center bg-cover bg-center"
                style={{
                    backgroundImage: "linear-gradient(rgba(26, 95, 180, 0.9), rgba(26, 95, 180, 0.85)), url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
                }}
            >
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Contact Us</h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        We're here to help! Get in touch with our support team for any questions about BoardingFinder.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Contact Form */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-[#1a5fb4] mb-8 pb-4 border-b-2 border-[#f0f7ff] font-poppins">
                                Send Us a Message
                            </h2>
                            <form id="contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-gray-600 font-semibold mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a5fb4] focus:ring-4 focus:ring-[#1a5fb4]/10 transition-all"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-gray-600 font-semibold mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a5fb4] focus:ring-4 focus:ring-[#1a5fb4]/10 transition-all"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="subject" className="block text-gray-600 font-semibold mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a5fb4] focus:ring-4 focus:ring-[#1a5fb4]/10 transition-all"
                                        placeholder="What is your message about?"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-600 font-semibold mb-2">Message *</label>
                                    <textarea
                                        id="message"
                                        className="w-full p-4 border border-gray-300 rounded-md min-h-[150px] focus:outline-none focus:border-[#1a5fb4] focus:ring-4 focus:ring-[#1a5fb4]/10 transition-all resize-y"
                                        placeholder="Please provide details about your inquiry..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#ff9800] text-white rounded-md font-bold text-lg hover:bg-[#e68900] transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl p-10 shadow-lg h-full">
                            <h2 className="text-2xl font-bold text-[#1a5fb4] mb-8 pb-4 border-b-2 border-[#f0f7ff] font-poppins">
                                Contact Information
                            </h2>

                            <div className="flex items-start mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                                <div className="w-12 h-12 bg-[#e8f2ff] rounded-full flex items-center justify-center mr-5 shrink-0 text-[#1a5fb4] text-xl">
                                    ✉️
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Email Address</h3>
                                    <p className="text-gray-600 mb-1"><a href="mailto:support@boardingfinder.com" className="text-[#1a5fb4] hover:underline hover:text-[#0f4a97]">support@boardingfinder.com</a></p>
                                    <p className="text-gray-600 mb-1"><a href="mailto:info@boardingfinder.com" className="text-[#1a5fb4] hover:underline hover:text-[#0f4a97]">info@boardingfinder.com</a></p>
                                    <p className="text-sm text-gray-500 mt-2">Response time: Within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                                <div className="w-12 h-12 bg-[#e8f2ff] rounded-full flex items-center justify-center mr-5 shrink-0 text-[#1a5fb4] text-xl">
                                    📞
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Phone Number</h3>
                                    <p className="text-gray-600 mb-1"><a href="tel:+94112345678" className="text-[#1a5fb4] hover:underline hover:text-[#0f4a97]">+94 11 234 5678</a> (Office)</p>
                                    <p className="text-gray-600 mb-1"><a href="tel:+94771234567" className="text-[#1a5fb4] hover:underline hover:text-[#0f4a97]">+94 77 123 4567</a> (Student Support)</p>
                                    <p className="text-gray-600 mb-1"><a href="tel:+94771234568" className="text-[#1a5fb4] hover:underline hover:text-[#0f4a97]">+94 77 123 4568</a> (Owner Support)</p>
                                    <p className="text-sm text-gray-500 mt-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                                <div className="w-12 h-12 bg-[#e8f2ff] rounded-full flex items-center justify-center mr-5 shrink-0 text-[#1a5fb4] text-xl">
                                    📍
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Office Location</h3>
                                    <p className="text-gray-600 mb-1">BoardingFinder Headquarters</p>
                                    <p className="text-gray-600 mb-1">123 University Avenue, Colombo 03</p>
                                    <p className="text-gray-600 mb-1">Sri Lanka</p>
                                    <p className="text-sm text-gray-500 mt-2">Visits by appointment only</p>
                                </div>
                            </div>

                            <div className="flex items-start mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                                <div className="w-12 h-12 bg-[#e8f2ff] rounded-full flex items-center justify-center mr-5 shrink-0 text-[#1a5fb4] text-xl">
                                    🎧
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Live Chat Support</h3>
                                    <p className="text-gray-600 mb-1">Available on our website during business hours</p>
                                    <p className="text-gray-600 mb-1">Look for the chat icon in the bottom right corner</p>
                                    <p className="text-sm text-gray-500 mt-2">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#1a5fb4] mb-4 font-poppins">Find Our Office</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Located in the heart of Colombo, close to major universities
                        </p>
                    </div>

                    <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px] bg-[#e8f2ff] flex flex-col items-center justify-center text-[#1a5fb4]">
                        {/* Note: In a real app, embed Google Maps iframe here */}
                        <div className="text-6xl mb-4 opacity-70">🗺️</div>
                        <h3 className="text-2xl font-bold mb-2">Our Location in Colombo</h3>
                        <p className="text-gray-600 text-center max-w-lg mb-6 px-4">
                            BoardingFinder Headquarters is located at 123 University Avenue, Colombo 03, Sri Lanka. We're conveniently situated near University of Colombo and other educational institutions.
                        </p>
                        <a
                            href="https://maps.google.com/?q=123+University+Avenue,+Colombo+03,+Sri+Lanka"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1a5fb4] text-white px-6 py-3 rounded-md font-bold hover:bg-[#0f4a97] transition-colors flex items-center gap-2"
                        >
                            <span>Open in Google Maps</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-[#f0f7ff]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#1a5fb4] mb-4 font-poppins">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Quick answers to common questions about BoardingFinder
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${activeFaq === index ? 'shadow-md' : ''}`}
                            >
                                <button
                                    className="w-full px-6 py-5 text-left font-bold text-lg text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`text-[#1a5fb4] transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                <div
                                    className={`px-6 text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
