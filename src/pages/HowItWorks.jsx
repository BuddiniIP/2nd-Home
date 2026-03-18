import { useState } from "react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans">
      {/* Page Header */}
      <div className="bg-[linear-gradient(rgba(26,95,180,0.85),rgba(26,95,180,0.8)),url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white py-[100px] pb-[80px] text-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[100px] after:bg-[linear-gradient(to_bottom,transparent,#f9f9f9)]">
        <div className="container mx-auto px-[20px] relative z-10">
          <h1 className="text-[2.2rem] md:text-[3rem] font-bold font-poppins mb-[20px]">How 2nd Home Works</h1>
          <p className="text-[1.1rem] md:text-[1.3rem] opacity-90 max-w-[800px] mx-auto">Simple, safe, and reliable process for students and boarding owners to connect</p>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="container mx-auto px-[20px]">
        <div className="flex flex-col md:flex-row justify-center items-center gap-[20px] md:gap-[30px] my-[40px] md:mb-[60px] relative z-10">
          <div 
            className={`bg-white p-[25px_40px] rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center gap-[15px] transition-all duration-300 w-full max-w-[400px] md:w-[250px] ${activeTab === 'student' ? '-translate-y-[10px] shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-b-4 border-[#ff9800]' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            <i className="fas fa-user-graduate text-[2.5rem] text-[#1a5fb4]"></i>
            <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] text-center">For Students</h3>
            <p className="text-center text-[#666] text-[0.95rem]">Find verified boarding near your university in 6 easy steps</p>
          </div>
          <div 
            className={`bg-white p-[25px_40px] rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center gap-[15px] transition-all duration-300 w-full max-w-[400px] md:w-[250px] ${activeTab === 'owner' ? '-translate-y-[10px] shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-b-4 border-[#ff9800]' : ''}`}
            onClick={() => setActiveTab('owner')}
          >
            <i className="fas fa-user-tie text-[2.5rem] text-[#1a5fb4]"></i>
            <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] text-center">For Boarding Owners</h3>
            <p className="text-center text-[#666] text-[0.95rem]">List and manage your property with our secure platform</p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <section className="py-[60px] md:pb-[80px] relative">
        <div className="container mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#1a5fb4] font-poppins mb-[15px]">
              {activeTab === 'student' ? 'Find Your Perfect Boarding' : 'List & Manage Your Property'}
            </h2>
            <p className="text-[#666] max-w-[700px] mx-auto text-[1.1rem]">
              {activeTab === 'student' 
                ? 'Follow these simple steps to secure safe, verified accommodation near your university' 
                : 'Simple steps to connect with university students and manage your boarding facility'}
            </p>
          </div>
          
          <div className="max-w-[1000px] mx-auto relative">
            {/* Student Steps */}
            {activeTab === 'student' && (
              <div className="animate-[fadeIn_0.5s_ease]">
                <div className="relative pl-[40px] md:pl-[50px] before:content-[''] before:absolute before:left-[20px] md:before:left-[30px] before:top-0 before:bottom-0 before:w-[4px] before:bg-[linear-gradient(to_bottom,#1a5fb4,#2d87e0)] before:rounded-[2px]">
                  
                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden group">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">1</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-auto bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://thumbs.dreamstime.com/b/man-profile-cartoon-smiling-round-icon-vector-illustration-graphic-design-135443422.jpg')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Create Your Student Profile</h3>
                      <p className="text-[#666] mb-[15px]">Sign up with your university email and create a detailed profile. Include your university, course details, and accommodation preferences to get personalized recommendations.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">University Verification</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Profile Setup</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Preference Selection</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">2</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-[250px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Search & Filter Boardings</h3>
                      <p className="text-[#666] mb-[15px]">Use our advanced search filters to find boardings near your university. Filter by location, price range, amenities, room type, and distance from campus.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Location Search</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Price Filters</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Amenity Selection</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">3</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-[250px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Browse Verified Listings</h3>
                      <p className="text-[#666] mb-[15px]">View detailed information about each boarding facility including photos, amenities, house rules, and reviews from other students. All listings are physically verified by our team.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Verified Photos</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Student Reviews</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Safety Checklist</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">4</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-[250px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Schedule a Visit</h3>
                      <p className="text-[#666] mb-[15px]">Contact boarding owners through our secure messaging system to schedule a visit. View available time slots and book appointments that fit your schedule.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Secure Messaging</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Visit Scheduling</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Owner Contact</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">5</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-[250px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Complete Booking Process</h3>
                      <p className="text-[#666] mb-[15px]">Once you've found the perfect boarding, complete the booking process through our secure platform. Review and sign the rental agreement digitally.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Digital Agreement</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Secure Payment</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Booking Confirmation</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-[50px] bg-white rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:translate-x-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden">
                    <div className="absolute left-[-55px] md:left-[-70px] top-[20px] w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#1a5fb4] text-white rounded-full flex items-center justify-center text-[1.2rem] md:text-[1.5rem] font-bold shadow-[0_5px_15px_rgba(26,95,180,0.3)] z-10">6</div>
                    <div className="w-full h-[200px] md:w-[250px] md:h-[250px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"}}></div>
                    <div className="p-[20px] md:p-[30px] flex-1">
                      <h3 className="text-[1.3rem] md:text-[1.5rem] font-semibold text-[#1a5fb4] mb-[10px]">Move In & Leave Review</h3>
                      <p className="text-[#666] mb-[15px]">Move into your new accommodation and start your university journey. After your stay, leave a review to help other students find great boarding options.</p>
                      <div className="flex flex-wrap gap-[10px] md:gap-[15px] justify-center md:justify-start">
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Move-in Support</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Review System</span>
                        <span className="bg-[#f0f7ff] text-[#1a5fb4] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-medium">Ongoing Support</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Owner Steps */}
            {activeTab === 'owner' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] animate-[fadeIn_0.5s_ease]">
                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">1</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">Create Owner Account</h3>
                    <p className="text-[#666] mb-[20px]">Register as a boarding owner with your personal and property details. Complete identity verification for security purposes.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">2</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">List Your Property</h3>
                    <p className="text-[#666] mb-[20px]">Add detailed information about your boarding facility including photos, amenities, pricing, availability, and house rules.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">3</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">Verification Process</h3>
                    <p className="text-[#666] mb-[20px]">Our team will contact you to schedule a physical verification of your property to ensure safety and quality standards.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">4</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">Receive Student Inquiries</h3>
                    <p className="text-[#666] mb-[20px]">Start receiving inquiries from verified university students looking for accommodation near their campus.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">5</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">Manage Bookings</h3>
                    <p className="text-[#666] mb-[20px]">Use our dashboard to manage bookings, schedule visits, communicate with students, and update availability.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[linear-gradient(to_right,#1a5fb4,#2d87e0)]">
                  <div className="h-[160px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
                  <div className="w-[50px] h-[50px] bg-[#ff9800] text-white rounded-full flex items-center justify-center text-[1.3rem] font-bold mx-auto mt-[-25px] mb-[20px] relative z-10 shadow-[0_5px_15px_rgba(255,152,0,0.3)]">6</div>
                  <div className="px-[25px] pb-[30px]">
                    <h3 className="text-[1.4rem] font-semibold text-[#1a5fb4] mb-[15px]">Secure Payments</h3>
                    <p className="text-[#666] mb-[20px]">Receive payments through our secure payment system with transparent fees and automated reminders.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="bg-[#f0f7ff] py-[80px] mt-[60px]">
        <div className="container mx-auto px-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px] items-center text-center md:text-left">
            <div>
              <h2 className="text-[2.2rem] font-bold text-[#1a5fb4] font-poppins mb-[20px]">Our Verification Process</h2>
              <p className="text-[#666] text-[1.1rem] mb-[25px]">Every boarding facility listed on 2nd Home goes through a thorough physical verification process to ensure student safety and comfort.</p>
              
              <ul className="flex flex-col gap-[15px] text-left">
                <li className="flex items-start gap-[15px]">
                  <i className="fas fa-check-circle text-[#4caf50] text-[1.2rem] mt-[3px] shrink-0"></i>
                  <div>
                    <strong className="block mb-[5px]">Property Inspection</strong>
                    <p className="text-[#666]">Our trained inspectors visit each property to verify amenities, safety features, and living conditions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-[15px]">
                  <i className="fas fa-check-circle text-[#4caf50] text-[1.2rem] mt-[3px] shrink-0"></i>
                  <div>
                    <strong className="block mb-[5px]">Document Verification</strong>
                    <p className="text-[#666]">We verify ownership documents, rental licenses, and compliance with local regulations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-[15px]">
                  <i className="fas fa-check-circle text-[#4caf50] text-[1.2rem] mt-[3px] shrink-0"></i>
                  <div>
                    <strong className="block mb-[5px]">Safety Standards Check</strong>
                    <p className="text-[#666]">We check fire safety equipment, emergency exits, security measures, and general safety standards.</p>
                  </div>
                </li>
                <li className="flex items-start gap-[15px]">
                  <i className="fas fa-check-circle text-[#4caf50] text-[1.2rem] mt-[3px] shrink-0"></i>
                  <div>
                    <strong className="block mb-[5px]">Location Verification</strong>
                    <p className="text-[#666]">We verify the exact location and distance from nearby universities and essential amenities.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="hidden md:block text-center rounded-[10px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
              <img src="https://static.vecteezy.com/system/resources/thumbnails/029/896/118/small/3d-social-media-blue-verified-free-png.png" alt="Property verification process" className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[80px] text-center">
        <div className="container mx-auto px-[20px]">
          <div className="bg-[linear-gradient(135deg,#1a5fb4_0%,#2d87e0_100%)] text-white rounded-[15px] p-[40px_20px] md:p-[60px_40px] max-w-[900px] mx-auto shadow-[0_15px_40px_rgba(26,95,180,0.2)]">
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold font-poppins mb-[20px]">Ready to Get Started?</h2>
            <p className="text-[1.1rem] md:text-[1.2rem] opacity-90 mb-[40px] max-w-[700px] mx-auto">Join thousands of students and boarding owners who trust 2nd Home for safe, verified accommodation solutions near universities.</p>
            <div className="flex flex-col md:flex-row justify-center gap-[20px]">
              <Link to="/student-registration" className="bg-[#ff9800] text-white px-[24px] py-[12px] rounded-[6px] font-semibold hover:bg-[#e68900] transition-colors w-full md:w-auto">Find Boarding as Student</Link>
              <Link to="/owner-registration" className="bg-white text-[#1a5fb4] px-[24px] py-[12px] rounded-[6px] font-semibold hover:bg-gray-100 transition-colors w-full md:w-auto">List Your Property</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
