import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "../components/SkeletonCard";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGateway, setShowGateway] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handlePay = () => {
    setPaymentStep(1);
    setTimeout(() => setPaymentStep(2), 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
    { id: 'search', label: 'Search Boardings', icon: 'fas fa-search' },
    { id: 'bookings', label: 'My Bookings', icon: 'fas fa-calendar-check' },
    { id: 'saved', label: 'Saved Listings', icon: 'fas fa-heart' },
    { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'profile', label: 'Profile Settings', icon: 'fas fa-user-cog' },
  ];

  const renderOverview = () => (
    <div className="flex flex-col gap-[30px] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="bg-[linear-gradient(rgba(26,95,180,0.85),rgba(26,95,180,0.7)),url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white p-[40px] rounded-[15px] shadow-[0_10px_30px_rgba(26,95,180,0.2)]">
        <h1 className="text-[2.2rem] sm:text-[1.8rem] font-bold font-poppins mb-[10px]">
          Welcome back, {currentUser?.name || 'Student'}!
        </h1>
        <p className="text-[1.1rem] opacity-90"><i className="fas fa-graduation-cap mr-[8px]"></i>{currentUser?.university || 'University Student'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        <div className="lg:col-span-2 flex flex-col gap-[30px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
            <div onClick={() => setActiveTab('saved')} className="cursor-pointer bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#1a5fb4] hover:-translate-y-[5px] transition-transform">
              <div className="w-[40px] h-[40px] bg-[#e8f2ff] rounded-full flex items-center justify-center mx-auto mb-[10px]">
                <i className="fas fa-heart text-[#1a5fb4] text-[1.1rem]"></i>
              </div>
              <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">12</div>
              <div className="text-[#666] text-[0.8rem] font-medium">Saved Listings</div>
            </div>
            
            <div onClick={() => setActiveTab('bookings')} className="cursor-pointer bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#ff9800] hover:-translate-y-[5px] transition-transform">
              <div className="w-[40px] h-[40px] bg-[#fff8e1] rounded-full flex items-center justify-center mx-auto mb-[10px]">
                <i className="fas fa-calendar-check text-[#ff9800] text-[1.1rem]"></i>
              </div>
              <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">2</div>
              <div className="text-[#666] text-[0.8rem] font-medium">Active Bookings</div>
            </div>
            
            <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#4caf50] hover:-translate-y-[5px] transition-transform">
              <div className="w-[40px] h-[40px] bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-[10px]">
                <i className="fas fa-calendar-alt text-[#4caf50] text-[1.1rem]"></i>
              </div>
              <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">3</div>
              <div className="text-[#666] text-[0.8rem] font-medium">Scheduled Visits</div>
            </div>
            
            <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#9c27b0] hover:-translate-y-[5px] transition-transform">
              <div className="w-[40px] h-[40px] bg-[#f3e5f5] rounded-full flex items-center justify-center mx-auto mb-[10px]">
                <i className="fas fa-comments text-[#9c27b0] text-[1.1rem]"></i>
              </div>
              <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">7</div>
              <div className="text-[#666] text-[0.8rem] font-medium">Messages</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-[20px] pb-[15px] border-b-2 border-[#f0f7ff]">
              <h3 className="text-[1.3rem] font-bold font-poppins text-[#1a5fb4]">Recently Viewed</h3>
              <button onClick={() => setActiveTab('search')} className="text-[#1a5fb4] font-medium text-[0.9rem] hover:underline">Find More</button>
            </div>
            
            <div className="flex flex-col gap-[15px]">
              <div className="flex gap-[15px] p-[10px] rounded-[8px] hover:bg-[#f9f9f9] transition-colors cursor-pointer border border-transparent hover:border-[#eee]">
                <div className="w-[80px] h-[80px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522771731470-ea457fbe51f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"}}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[1rem] text-[#333] mb-[3px]">Student Haven Hostel</h4>
                  <div className="text-[#666] text-[0.85rem] mb-[5px] flex items-center gap-[5px]">
                    <i className="fas fa-map-marker-alt text-[#ff9800]"></i> Near University Library
                  </div>
                  <div className="text-[#1a5fb4] font-bold text-[1rem]">Rs.9000/month</div>
                </div>
              </div>
              <div className="flex gap-[15px] p-[10px] rounded-[8px] hover:bg-[#f9f9f9] transition-colors cursor-pointer border border-transparent hover:border-[#eee]">
                <div className="w-[80px] h-[80px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"}}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[1rem] text-[#333] mb-[3px]">Modern Student Housing</h4>
                  <div className="text-[#666] text-[0.85rem] mb-[5px] flex items-center gap-[5px]">
                    <i className="fas fa-map-marker-alt text-[#ff9800]"></i> 1.5km from Campus
                  </div>
                  <div className="text-[#1a5fb4] font-bold text-[1rem]">Rs.14000/month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-[30px]">
          <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] h-full">
            <div className="flex justify-between items-center mb-[20px] pb-[15px] border-b-2 border-[#f0f7ff]">
              <h3 className="text-[1.3rem] font-bold font-poppins text-[#1a5fb4]">Notifications</h3>
              <a href="#" className="text-[#ff9800] font-medium text-[0.85rem] hover:underline">Mark All Read</a>
            </div>
            
            <div className="flex flex-col gap-[15px]">
              <div className="p-[15px] bg-[#f9f9f9] rounded-[8px] border-l-[3px] border-[#1a5fb4]">
                <div className="flex justify-between mb-[5px]">
                  <div className="font-bold text-[#333] text-[0.95rem]">New Listing!</div>
                  <div className="text-[#888] text-[0.75rem]">2 hours ago</div>
                </div>
                <div className="text-[#666] text-[0.85rem] mb-[8px] leading-[1.4]">A new boarding matching your preferences is now available.</div>
                <span className="inline-block px-[8px] py-[3px] rounded-[4px] text-[0.7rem] font-bold bg-[#e8f2ff] text-[#1a5fb4]">NEW</span>
              </div>
              <div className="p-[15px] bg-[#f9f9f9] rounded-[8px] border-l-[3px] border-[#ff9800]">
                <div className="flex justify-between mb-[5px]">
                  <div className="font-bold text-[#333] text-[0.95rem]">Price Update</div>
                  <div className="text-[#888] text-[0.75rem]">1 day ago</div>
                </div>
                <div className="text-[#666] text-[0.85rem] mb-[8px] leading-[1.4]">Green Valley Hostel has updated their rent.</div>
                <span className="inline-block px-[8px] py-[3px] rounded-[4px] text-[0.7rem] font-bold bg-[#fff8e1] text-[#ff9800]">UPDATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="text-center mb-[30px]">
        <h2 className="text-[1.8rem] sm:text-[1.5rem] font-bold font-poppins text-[#1a5fb4] mb-[5px]">Find Your Perfect Boarding</h2>
        <p className="text-gray-500">Search verified boarding facilities with specific filters</p>
      </div>
      
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[30px]">
        <div className="flex flex-col">
          <label htmlFor="university" className="font-bold text-[0.9rem] mb-[8px] text-[#333] flex items-center gap-[8px]">
            <i className="fas fa-university text-[#1a5fb4]"></i> Select University
          </label>
          <select id="university" className="p-[12px_15px] border border-[#ddd] rounded-[8px] text-[0.95rem] bg-[#f9f9f9] focus:bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors">
            <option value="">Select your university</option>
            <option value="colombo">University of Colombo</option>
            <option value="peradeniya">University of Peradeniya</option>
            <option value="moratuwa">University of Moratuwa</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="faculty" className="font-bold text-[0.9rem] mb-[8px] text-[#333] flex items-center gap-[8px]">
            <i className="fas fa-graduation-cap text-[#1a5fb4]"></i> Select Faculty
          </label>
          <select id="faculty" className="p-[12px_15px] border border-[#ddd] rounded-[8px] text-[0.95rem] bg-[#f9f9f9] focus:bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors">
            <option value="">Select your faculty</option>
            <option value="science">Faculty of Science</option>
            <option value="engineering">Faculty of Engineering</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="room-type" className="font-bold text-[0.9rem] mb-[8px] text-[#333] flex items-center gap-[8px]">
            <i className="fas fa-bed text-[#1a5fb4]"></i> Room Type
          </label>
          <select id="room-type" className="p-[12px_15px] border border-[#ddd] rounded-[8px] text-[0.95rem] bg-[#f9f9f9] focus:bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors">
            <option value="">Select room type</option>
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="shared">Shared Room</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="gender" className="font-bold text-[0.9rem] mb-[8px] text-[#333] flex items-center gap-[8px]">
            <i className="fas fa-user-friends text-[#1a5fb4]"></i> Gender
          </label>
          <select id="gender" className="p-[12px_15px] border border-[#ddd] rounded-[8px] text-[0.95rem] bg-[#f9f9f9] focus:bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </form>
      
      <button type="button" className="w-full p-[15px] text-[1.1rem] bg-[#ff9800] text-white rounded-[8px] font-bold flex items-center justify-center gap-[10px] hover:bg-[#e68900] transition-colors shadow-[0_4px_15px_rgba(255,152,0,0.3)]">
        <Link to="/search" className="text-white hover:text-white flex items-center gap-[10px] w-full justify-center">
          <i className="fas fa-search"></i> Search Available Boardings
        </Link>
      </button>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
        <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">My Bookings</h3>
        <button className="text-[#1a5fb4] font-medium text-[0.95rem] hover:underline"><i className="fas fa-history"></i> View History</button>
      </div>
      
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col sm:flex-row gap-[20px] p-[20px] border border-[#eee] rounded-[10px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300">
          <div className="w-full sm:w-[180px] h-[130px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522771731470-ea457fbe51f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-[5px]">
                <h4 className="font-semibold text-[1.2rem] text-[#1a5fb4]">Greenwood Student Annex</h4>
                <span className="bg-[#e8f2ff] text-[#1a5fb4] text-[0.8rem] font-semibold px-[10px] py-[4px] rounded-[20px]">Active</span>
              </div>
              <div className="text-[#666] text-[0.9rem] mb-[5px] flex items-center gap-[5px]">
                <i className="fas fa-map-marker-alt text-[#ff9800]"></i> Gangodawila, Nugegoda
              </div>
              <div className="text-[#666] text-[0.85rem] mb-[10px] flex items-center gap-[5px]">
                <i className="fas fa-clock text-[#1a5fb4]"></i> Since Jan 2026
              </div>
            </div>
            <div className="flex items-center justify-between pt-[10px] border-t border-[#eee]">
              <div className="text-[#ff9800] font-bold text-[1.1rem]">Rs. 12,000 <span className="text-[0.85rem] font-normal text-[#666]">/month</span></div>
              <button className="text-[#1a5fb4] text-[0.9rem] font-medium hover:underline flex items-center gap-[5px]">View Details <i className="fas fa-external-link-alt text-[0.8rem]"></i></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-[20px] p-[20px] border border-[#eee] rounded-[10px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 opacity-80">
          <div className="w-full sm:w-[180px] h-[130px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1598928506311-c55dd717904c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}></div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-[5px]">
                <h4 className="font-semibold text-[1.2rem] text-[#333]">Colombo 07 Girls Hostel</h4>
                <span className="bg-[#f5f5f5] text-[#666] text-[0.8rem] font-semibold px-[10px] py-[4px] rounded-[20px]">Completed</span>
              </div>
              <div className="text-[#666] text-[0.9rem] mb-[5px] flex items-center gap-[5px]">
                <i className="fas fa-map-marker-alt text-[#ff9800]"></i> Colombo 07
              </div>
              <div className="text-[#666] text-[0.85rem] mb-[10px] flex items-center gap-[5px]">
                <i className="fas fa-clock text-[#666]"></i> Jun 2025 - Dec 2025
              </div>
            </div>
            <div className="flex items-center justify-between pt-[10px] border-t border-[#eee]">
              <div className="text-[#666] font-bold text-[1.1rem]">Rs. 18,000 <span className="text-[0.85rem] font-normal text-[#888]">/month</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSaved = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
        <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Your Saved Listings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
        <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
          <div className="h-[160px] bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1499955085172-a104c9463ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}>
            <div className="absolute top-[15px] right-[15px] bg-white w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.1)] text-[#ff5252] text-[1.1rem]">
              <i className="fas fa-heart"></i>
            </div>
          </div>
          <div className="p-[20px]">
            <h4 className="text-[1.2rem] font-semibold text-[#1a5fb4] mb-[8px]">Green Valley Hostel</h4>
            <div className="text-[#666] text-[0.9rem] mb-[10px] flex items-center gap-[8px]">
              <i className="fas fa-map-marker-alt text-[#ff9800]"></i> 2km from Univ.
            </div>
            <div className="flex justify-between text-[0.9rem] mb-[15px] text-[#555]">
              <div className="flex items-center gap-[5px]"><i className="fas fa-bed text-[#1a5fb4]"></i> Single</div>
              <div className="flex items-center gap-[5px]"><i className="fas fa-wifi text-[#1a5fb4]"></i> WiFi</div>
            </div>
            <div className="text-[1.3rem] font-bold text-[#ff9800] mb-[15px]">Rs.10000 <span className="text-[0.9rem] font-normal text-[#777]">/mo</span></div>
            <div className="flex gap-[10px]">
              <button className="flex-1 py-[8px] rounded-[6px] font-medium text-[0.9rem] bg-[#1a5fb4] text-white hover:bg-[#0f4a97] transition-colors">Details</button>
              <button className="flex-1 py-[8px] rounded-[6px] font-medium text-[0.9rem] bg-[#f5f5f5] text-[#666] border border-[#ddd] hover:bg-[#eee] transition-colors">Remove</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
          <div className="h-[160px] bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}>
            <div className="absolute top-[15px] right-[15px] bg-white w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.1)] text-[#ff5252] text-[1.1rem]">
              <i className="fas fa-heart"></i>
            </div>
          </div>
          <div className="p-[20px]">
            <h4 className="text-[1.2rem] font-semibold text-[#1a5fb4] mb-[8px]">Campus Comfort</h4>
            <div className="text-[#666] text-[0.9rem] mb-[10px] flex items-center gap-[8px]">
              <i className="fas fa-map-marker-alt text-[#ff9800]"></i> Near Engineering
            </div>
            <div className="flex justify-between text-[0.9rem] mb-[15px] text-[#555]">
              <div className="flex items-center gap-[5px]"><i className="fas fa-bed text-[#1a5fb4]"></i> Double</div>
              <div className="flex items-center gap-[5px]"><i className="fas fa-utensils text-[#1a5fb4]"></i> Meals</div>
            </div>
            <div className="text-[1.3rem] font-bold text-[#ff9800] mb-[15px]">Rs.10000 <span className="text-[0.9rem] font-normal text-[#777]">/mo</span></div>
            <div className="flex gap-[10px]">
              <button className="flex-1 py-[8px] rounded-[6px] font-medium text-[0.9rem] bg-[#1a5fb4] text-white hover:bg-[#0f4a97] transition-colors">Details</button>
              <button className="flex-1 py-[8px] rounded-[6px] font-medium text-[0.9rem] bg-[#f5f5f5] text-[#666] border border-[#ddd] hover:bg-[#eee] transition-colors">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
        <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Payments</h3>
        <button className="text-[#1a5fb4] font-medium text-[0.95rem] hover:underline"><i className="fas fa-download"></i> Download Invoices</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] mb-[25px]">
        <div className="bg-[#f9f9f9] border border-[#eee] rounded-[8px] p-[20px]">
          <div className="text-[#666] text-[0.85rem] font-semibold uppercase tracking-wider mb-[5px]">Monthly Fee</div>
          <div className="text-[#1a5fb4] text-[1.5rem] font-bold">Rs. 12,000</div>
        </div>
        <div className="bg-[#f9f9f9] border border-[#eee] rounded-[8px] p-[20px]">
          <div className="text-[#666] text-[0.85rem] font-semibold uppercase tracking-wider mb-[5px]">Total Paid</div>
          <div className="text-[#4caf50] text-[1.5rem] font-bold">Rs. 48,000</div>
        </div>
        <div className="bg-[#f9f9f9] border border-[#eee] rounded-[8px] p-[20px]">
          <div className="text-[#666] text-[0.85rem] font-semibold uppercase tracking-wider mb-[5px]">Next Due</div>
          <div className="text-[#ff9800] text-[1.5rem] font-bold">April 2026</div>
        </div>
      </div>

      <button onClick={() => { setShowGateway(true); setPaymentStep(0); }} className="w-full sm:w-auto px-[20px] py-[12px] bg-[#1a5fb4] text-white rounded-[6px] font-semibold flex items-center justify-center gap-[10px] hover:bg-[#0f4a97] transition-colors mb-[25px]">
        <i className="fas fa-credit-card"></i> Pay Monthly Fee - Rs. 12,000
      </button>

      <div className="overflow-x-auto border border-[#eee] rounded-[8px]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#eee]">
              <th className="p-[15px] font-semibold text-[#555] text-[0.95rem]">Month</th>
              <th className="p-[15px] font-semibold text-[#555] text-[0.95rem]">Amount</th>
              <th className="p-[15px] font-semibold text-[#555] text-[0.95rem]">Date Paid</th>
              <th className="p-[15px] font-semibold text-[#555] text-[0.95rem]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#eee] hover:bg-[#fcfcfc]">
              <td className="p-[15px] text-[#333] font-medium">April 2026</td>
              <td className="p-[15px] text-[#666]">Rs. 12,000</td>
              <td className="p-[15px] text-[#888]">—</td>
              <td className="p-[15px]"><span className="bg-[#fff8e1] text-[#ff9800] px-[10px] py-[4px] rounded-[20px] text-[0.8rem] font-semibold flex items-center w-max gap-[5px]"><i className="fas fa-clock"></i> Pending</span></td>
            </tr>
            <tr className="border-b border-[#eee] hover:bg-[#fcfcfc]">
              <td className="p-[15px] text-[#333] font-medium">March 2026</td>
              <td className="p-[15px] text-[#666]">Rs. 12,000</td>
              <td className="p-[15px] text-[#888]">2026-03-05</td>
              <td className="p-[15px]"><span className="bg-[#e8f5e9] text-[#4caf50] px-[10px] py-[4px] rounded-[20px] text-[0.8rem] font-semibold flex items-center w-max gap-[5px]"><i className="fas fa-check-circle"></i> Paid</span></td>
            </tr>
            <tr className="border-b border-[#eee] hover:bg-[#fcfcfc]">
              <td className="p-[15px] text-[#333] font-medium">February 2026</td>
              <td className="p-[15px] text-[#666]">Rs. 12,000</td>
              <td className="p-[15px] text-[#888]">2026-02-03</td>
              <td className="p-[15px]"><span className="bg-[#e8f5e9] text-[#4caf50] px-[10px] py-[4px] rounded-[20px] text-[0.8rem] font-semibold flex items-center w-max gap-[5px]"><i className="fas fa-check-circle"></i> Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-[10px] p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center animate-[fadeIn_0.3s_ease-in-out]">
      <div className="w-[120px] h-[120px] bg-[#e8f2ff] rounded-full mx-auto flex items-center justify-center text-[#1a5fb4] text-[3.5rem] font-bold mb-[20px] shadow-[0_5px_15px_rgba(26,95,180,0.2)]">
        {currentUser?.name?.charAt(0) || 'S'}
      </div>
      <h3 className="text-[2rem] font-bold text-[#333] mb-[5px] font-poppins">{currentUser?.name || 'Student Name'}</h3>
      <p className="text-[#666] mb-[5px] text-[1.1rem]"><i className="fas fa-envelope text-[#1a5fb4] mr-[5px]"></i> {currentUser?.email || 'student@university.edu'}</p>
      <p className="text-[#666] mb-[30px]"><i className="fas fa-graduation-cap text-[#1a5fb4] mr-[5px]"></i> {currentUser?.university || 'University Student'}</p>
      
      <div className="max-w-[400px] mx-auto grid grid-cols-2 gap-[15px] mb-[30px]">
         <div className="bg-[#f9f9f9] p-[15px] rounded-[8px] border border-[#eee]">
            <div className="text-[0.8rem] text-[#666] font-bold uppercase tracking-wider">Role</div>
            <div className="text-[#1a5fb4] font-semibold">Student</div>
         </div>
         <div className="bg-[#f9f9f9] p-[15px] rounded-[8px] border border-[#eee]">
            <div className="text-[0.8rem] text-[#666] font-bold uppercase tracking-wider">Joined</div>
            <div className="text-[#1a5fb4] font-semibold">Jan 2026</div>
         </div>
      </div>

      <Link to="/student-profile" className="inline-flex items-center gap-[10px] px-[30px] py-[15px] bg-[#ff9800] text-white rounded-[8px] font-bold hover:bg-[#e68900] transition-colors shadow-[0_4px_15px_rgba(255,152,0,0.3)]">
        <i className="fas fa-user-edit"></i> Edit Full Profile
      </Link>
    </div>
  );

  return (
    <div className="flex bg-[#f5f7fa] min-h-[calc(100vh-80px)] font-sans relative">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[30] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-[280px] bg-white border-r border-[#eee] flex flex-col fixed h-[calc(100vh-80px)] top-[80px] transition-all duration-300 z-[40] ${isSidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}>
        <div className="p-[25px] border-b border-[#eee] flex items-center justify-between">
          <div className="flex items-center gap-[15px]">
            <div className="w-[45px] h-[45px] bg-[#e8f2ff] rounded-full flex items-center justify-center text-[#1a5fb4] font-bold text-[1.2rem]">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="font-bold text-[#333] text-[1rem]">{currentUser?.name || 'Student Name'}</div>
              <div className="text-[0.8rem] text-[#666]">Student Dashboard</div>
            </div>
          </div>
          <button className="lg:hidden text-[#666] w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-[#f5f5f5]" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[8px]">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold transition-all ${activeTab === item.id ? 'bg-[#1a5fb4] text-white shadow-[0_4px_12px_rgba(26,95,180,0.25)] translate-x-[5px]' : 'text-[#555] hover:bg-[#f0f7ff] hover:text-[#1a5fb4]'}`}
            >
              <i className={`${item.icon} w-[24px] text-center text-[1.1rem]`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-[20px] border-t border-[#eee]">
          <Link to="/login" className="flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold text-[#ff5252] hover:bg-[#fff0f0] transition-colors">
            <i className="fas fa-sign-out-alt w-[24px] text-center text-[1.1rem]"></i>
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content wrapper */}
      <div className="flex-1 lg:ml-[280px] w-full min-h-full flex flex-col overflow-x-hidden relative">
        {/* Mobile header */}
        <div className="lg:hidden bg-white p-[15px_20px] flex items-center gap-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px] z-[20]">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#1a5fb4] text-[1.3rem] w-[40px] h-[40px] rounded-[8px] bg-[#f0f7ff] flex items-center justify-center">
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="font-bold text-[#1a5fb4] text-[1.2rem] font-poppins">{navItems.find(i => i.id === activeTab)?.label}</h2>
        </div>

        {/* Tab Contents */}
        <div className="p-[20px] md:p-[40px] flex-1 max-w-[1400px] w-full mx-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
               <div className="w-[50px] h-[50px] border-[5px] border-[#e8f2ff] border-t-[#1a5fb4] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'search' && renderSearch()}
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'saved' && renderSaved()}
              {activeTab === 'payments' && renderPayments()}
              {activeTab === 'profile' && renderProfile()}
            </>
          )}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showGateway && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[15px] w-full max-w-[450px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden relative">
            <button onClick={() => setShowGateway(false)} className="absolute top-[15px] right-[15px] text-gray-400 hover:text-gray-600 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white/10 hover:bg-black/10 transition-colors">
              <i className="fas fa-times"></i>
            </button>
            <div className="bg-[#1a5fb4] px-[30px] py-[25px] text-white">
              <p className="text-[0.75rem] uppercase tracking-wider text-blue-200 font-semibold mb-[5px]">Secure Payment Gateway</p>
              <p className="font-poppins text-[1.8rem] font-bold mb-[5px]">Rs. 12,000</p>
              <p className="text-blue-100 text-[0.9rem] flex items-center gap-[5px]"><i className="fas fa-home"></i> Monthly Fee — Greenwood Student Annex</p>
            </div>
            <div className="p-[30px]">
              {paymentStep === 0 && (
                <div className="flex flex-col gap-[15px]">
                  <div>
                    <label className="block text-[0.8rem] uppercase tracking-wider text-gray-500 font-semibold mb-[8px]">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-[15px] py-[12px] pl-[40px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[#1a5fb4]/10 transition-all" />
                      <i className="fas fa-credit-card absolute left-[15px] top-[14px] text-gray-400"></i>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[15px]">
                    <div>
                      <label className="block text-[0.8rem] uppercase tracking-wider text-gray-500 font-semibold mb-[8px]">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-[15px] py-[12px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[#1a5fb4]/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[0.8rem] uppercase tracking-wider text-gray-500 font-semibold mb-[8px]">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-[15px] py-[12px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[#1a5fb4]/10 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.8rem] uppercase tracking-wider text-gray-500 font-semibold mb-[8px]">Cardholder Name</label>
                    <input type="text" placeholder="Sachintha Karunanayaka" className="w-full px-[15px] py-[12px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[#1a5fb4]/10 transition-all" />
                  </div>
                  <button onClick={handlePay} className="w-full bg-[#ff9800] text-white py-[14px] text-[1rem] font-bold rounded-[8px] hover:bg-[#e68900] transition-colors mt-[10px] shadow-[0_4px_10px_rgba(255,152,0,0.3)]">
                    Pay Rs. 12,000 Now
                  </button>
                  <div className="flex items-center justify-center gap-[10px] mt-[10px] text-gray-400 text-[0.8rem]">
                    <i className="fas fa-lock"></i> Secured by 256-bit encryption
                  </div>
                </div>
              )}
              {paymentStep === 1 && (
                <div className="text-center py-[40px]">
                  <div className="w-[50px] h-[50px] border-[4px] border-[#1a5fb4] border-t-transparent rounded-full animate-spin mx-auto mb-[20px]"></div>
                  <p className="text-[#1a5fb4] font-bold text-[1.2rem] mb-[5px]">Processing Payment...</p>
                  <p className="text-gray-500 text-[0.9rem]">Please do not close this window</p>
                </div>
              )}
              {paymentStep === 2 && (
                <div className="text-center py-[30px]">
                  <div className="w-[70px] h-[70px] bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-[20px]">
                    <i className="fas fa-check text-[2rem] text-[#4caf50]"></i>
                  </div>
                  <p className="text-[#333] font-bold text-[1.5rem] mb-[10px]">Payment Successful!</p>
                  <p className="text-gray-500 text-[0.95rem] mb-[25px]">Rs. 12,000 paid for April 2026 rent.</p>
                  <button onClick={() => setShowGateway(false)} className="bg-[#1a5fb4] text-white px-[30px] py-[12px] font-semibold rounded-[8px] hover:bg-[#0f4a97] transition-colors w-full">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
