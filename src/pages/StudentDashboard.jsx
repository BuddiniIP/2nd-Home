import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "../components/SkeletonCard";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-[#f5f7fa] min-h-screen font-sans">
      {/* Dashboard Header */}
      <div className="bg-[linear-gradient(rgba(26,95,180,0.9),rgba(26,95,180,0.85)),url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white py-[60px] pb-[40px] mb-[40px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <div className="mb-[10px]">
            <h1 className="text-[2.2rem] sm:text-[1.8rem] font-bold font-poppins mb-[10px]">
              Welcome back, {currentUser?.name || 'Student'}!
            </h1>
            <p className="text-[1.1rem] opacity-90">{currentUser?.university || 'University Student'}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        {/* Search Section */}
        <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] mt-[-80px] relative z-10 mb-[40px]">
          <div className="text-center mb-[25px] text-primary">
            <h2 className="text-[1.8rem] sm:text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Find Your Perfect Boarding</h2>
            <p className="text-gray-600">Search verified boarding facilities with specific filters</p>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[20px]">
            <div className="flex flex-col">
              <label htmlFor="university" className="font-semibold mb-[8px] text-gray-700 flex items-center gap-[8px]">
                <i className="fas fa-university text-[#1a5fb4]"></i> Select University
              </label>
              <select id="university" className="p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" required>
                <option value="">Select your university</option>
                <option value="colombo">University of Colombo</option>
                <option value="peradeniya">University of Peradeniya</option>
                <option value="moratuwa">University of Moratuwa</option>
                <option value="kelaniya">University of Kelaniya</option>
                <option value="jayewardenepura">University of Sri Jayewardenepura</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="faculty" className="font-semibold mb-[8px] text-gray-700 flex items-center gap-[8px]">
                <i className="fas fa-graduation-cap text-[#1a5fb4]"></i> Select Faculty
              </label>
              <select id="faculty" className="p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" required>
                <option value="">Select your faculty</option>
                <option value="science">Faculty of Science</option>
                <option value="engineering">Faculty of Engineering</option>
                <option value="computing">Faculty of Computing</option>
                <option value="management">Faculty of Management</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="room-type" className="font-semibold mb-[8px] text-gray-700 flex items-center gap-[8px]">
                <i className="fas fa-bed text-[#1a5fb4]"></i> Select Room Type
              </label>
              <select id="room-type" className="p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" required>
                <option value="">Select room type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="shared">Shared Room</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="gender" className="font-semibold mb-[8px] text-gray-700 flex items-center gap-[8px]">
                <i className="fas fa-user-friends text-[#1a5fb4]"></i> Select Gender
              </label>
              <select id="gender" className="p-[14px_15px] border border-[#ddd] rounded-[6px] text-[1rem] bg-white cursor-pointer focus:outline-none focus:border-[#1a5fb4] focus:ring-[3px] focus:ring-[rgba(26,95,180,0.1)] transition-colors" required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </form>
          
          <button type="button" className="w-full p-[16px] text-[1.1rem] bg-[#ff9800] text-white border-none rounded-[6px] cursor-pointer font-semibold flex items-center justify-center gap-[10px] hover:bg-[#e68900] transition-colors mt-[10px]">
            <Link to="/search" className="text-white hover:text-white flex items-center gap-[10px]">
              <i className="fas fa-search"></i> Search Boardings
            </Link>
          </button>
        </div>

        {/* Dashboard Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[30px] mb-[60px]">
          {/* Main Content (Left) */}
          <div className="flex flex-col gap-[30px]">
            {/* Saved Listings */}
            <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
                <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Your Saved Listings</h3>
                <a href="#" className="text-[#1a5fb4] font-medium text-[0.95rem] hover:underline">View All</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  <>
                    {/* Listing 1 */}
                    <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="h-[160px] bg-cover bg-center relative" style={{backgroundImage: "url('https://colomborealtors.lk/wp-content/uploads/2022/09/malabe-modern-house-office-best-rent-lease-sri-lanka-sl-colombo-realtors-lk.jpg')"}}>
                        <div className="absolute top-[15px] right-[15px] bg-white w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.1)] text-[#ff5252] text-[1.1rem]">
                          <i className="fas fa-heart"></i>
                        </div>
                      </div>
                      <div className="p-[20px]">
                        <h4 className="text-[1.2rem] font-semibold text-[#1a5fb4] mb-[8px]">Green Valley Hostel</h4>
                        <div className="text-[#666] text-[0.9rem] mb-[10px] flex items-center gap-[8px]">
                          <i className="fas fa-map-marker-alt text-[#ff9800]"></i> 2km from University of Sri Jayewardenepura
                        </div>
                        <div className="flex justify-between text-[0.9rem] mb-[15px] text-[#555]">
                          <div className="flex items-center gap-[5px]"><i className="fas fa-bed text-[#1a5fb4]"></i> Single Room</div>
                          <div className="flex items-center gap-[5px]"><i className="fas fa-wifi text-[#1a5fb4]"></i> No WiFi</div>
                        </div>
                        <div className="text-[1.3rem] font-bold text-[#ff9800] mb-[15px]">Rs.10000 <span className="text-[0.9rem] font-normal text-[#777]">/month</span></div>
                        <div className="flex gap-[10px]">
                          <a href="#" className="flex-1 text-center py-[10px] rounded-[6px] font-medium text-[0.9rem] bg-[#1a5fb4] text-white hover:bg-[#0f4a97] transition-colors">View Details</a>
                          <a href="#" className="flex-1 text-center py-[10px] rounded-[6px] font-medium text-[0.9rem] bg-[#f5f5f5] text-[#666] border border-[#ddd] hover:bg-[#eee] transition-colors">Remove</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Listing 2 */}
                    <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="h-[160px] bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"}}>
                        <div className="absolute top-[15px] right-[15px] bg-white w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.1)] text-[#ff5252] text-[1.1rem]">
                          <i className="fas fa-heart"></i>
                        </div>
                      </div>
                      <div className="p-[20px]">
                        <h4 className="text-[1.2rem] font-semibold text-[#1a5fb4] mb-[8px]">Campus Comfort</h4>
                        <div className="text-[#666] text-[0.9rem] mb-[10px] flex items-center gap-[8px]">
                          <i className="fas fa-map-marker-alt text-[#ff9800]"></i> Near Faculty of Engineering
                        </div>
                        <div className="flex justify-between text-[0.9rem] mb-[15px] text-[#555]">
                          <div className="flex items-center gap-[5px]"><i className="fas fa-bed text-[#1a5fb4]"></i> Double Room</div>
                          <div className="flex items-center gap-[5px]"><i className="fas fa-utensils text-[#1a5fb4]"></i> Bills Included</div>
                        </div>
                        <div className="text-[1.3rem] font-bold text-[#ff9800] mb-[15px]">Rs.10000 <span className="text-[0.9rem] font-normal text-[#777]">/month</span></div>
                        <div className="flex gap-[10px]">
                          <a href="#" className="flex-1 text-center py-[10px] rounded-[6px] font-medium text-[0.9rem] bg-[#1a5fb4] text-white hover:bg-[#0f4a97] transition-colors">View Details</a>
                          <a href="#" className="flex-1 text-center py-[10px] rounded-[6px] font-medium text-[0.9rem] bg-[#f5f5f5] text-[#666] border border-[#ddd] hover:bg-[#eee] transition-colors">Remove</a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
                <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Recently Viewed</h3>
                <a href="#" className="text-[#1a5fb4] font-medium text-[0.95rem] hover:underline">Clear All</a>
              </div>
              
              <div className="flex flex-col gap-[20px]">
                {/* Recent 1 */}
                <div className="flex gap-[15px] pb-[20px] border-b border-[#eee]">
                  <div className="w-[80px] h-[80px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://colomborealtors.lk/wp-content/uploads/2022/09/malabe-modern-house-office-best-rent-lease-sri-lanka-sl-colombo-realtors-lk.jpg')"}}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[1rem] text-[#1a5fb4] mb-[5px]">Student Haven Hostel</h4>
                    <div className="text-[#666] text-[0.85rem] mb-[5px] flex items-center gap-[5px]">
                      <i className="fas fa-map-marker-alt text-[#ff9800] text-[0.8rem]"></i> Near University Library
                    </div>
                    <div className="text-[#ff9800] font-semibold text-[1.1rem]">Rs.9000/month</div>
                  </div>
                </div>
                {/* Recent 2 */}
                <div className="flex gap-[15px] pb-[20px] border-b border-[#eee]">
                  <div className="w-[80px] h-[80px] rounded-[8px] bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80')"}}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[1rem] text-[#1a5fb4] mb-[5px]">Modern Student Housing</h4>
                    <div className="text-[#666] text-[0.85rem] mb-[5px] flex items-center gap-[5px]">
                      <i className="fas fa-map-marker-alt text-[#ff9800] text-[0.8rem]"></i> 1.5km from Campus
                    </div>
                    <div className="text-[#ff9800] font-semibold text-[1.1rem]">Rs.14000/month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar (Right) */}
          <div className="flex flex-col gap-[30px]">
            {/* Notifications */}
            <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
                <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Notifications</h3>
                <a href="#" className="text-[#1a5fb4] font-medium text-[0.95rem] hover:underline">Mark All Read</a>
              </div>
              
              <div className="flex flex-col gap-[20px]">
                {/* Notification 1 */}
                <div className="pb-[20px] border-b border-[#eee]">
                  <div className="flex justify-between mb-[8px]">
                    <div className="font-semibold text-[#333]">New Listing Available</div>
                    <div className="text-[#888] text-[0.85rem]">2 hours ago</div>
                  </div>
                  <div className="text-[#666] text-[0.95rem] mb-[10px]">A new boarding matching your preferences is now available.</div>
                  <span className="inline-block px-[10px] py-[4px] rounded-[20px] text-[0.8rem] font-medium bg-[#e8f2ff] text-[#1a5fb4]">NEW</span>
                </div>
                {/* Notification 2 */}
                <div className="pb-[20px] border-b border-[#eee]">
                  <div className="flex justify-between mb-[8px]">
                    <div className="font-semibold text-[#333]">Price Update</div>
                    <div className="text-[#888] text-[0.85rem]">1 day ago</div>
                  </div>
                  <div className="text-[#666] text-[0.95rem] mb-[10px]">Green Valley Hostel has updated their rent.</div>
                  <span className="inline-block px-[10px] py-[4px] rounded-[20px] text-[0.8rem] font-medium bg-[#fff8e1] text-[#ff9800]">UPDATE</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#f0f7ff]">
                <h3 className="text-[1.5rem] font-bold font-poppins text-[#1a5fb4]">Your Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-[20px]">
                <div className="text-center p-[20px_15px] bg-[#f9f9f9] rounded-[8px]">
                  <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mx-auto mb-[15px]">
                    <i className="fas fa-heart text-[#1a5fb4] text-[1.3rem]"></i>
                  </div>
                  <div className="text-[1.5rem] font-bold text-[#1a5fb4] mb-[5px]">12</div>
                  <div className="text-[#666] text-[0.9rem]">Saved Listings</div>
                </div>
                
                <div className="text-center p-[20px_15px] bg-[#f9f9f9] rounded-[8px]">
                  <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mx-auto mb-[15px]">
                    <i className="fas fa-eye text-[#1a5fb4] text-[1.3rem]"></i>
                  </div>
                  <div className="text-[1.5rem] font-bold text-[#1a5fb4] mb-[5px]">24</div>
                  <div className="text-[#666] text-[0.9rem]">Recently Viewed</div>
                </div>
                
                <div className="text-center p-[20px_15px] bg-[#f9f9f9] rounded-[8px]">
                  <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mx-auto mb-[15px]">
                    <i className="fas fa-calendar-alt text-[#1a5fb4] text-[1.3rem]"></i>
                  </div>
                  <div className="text-[1.5rem] font-bold text-[#1a5fb4] mb-[5px]">3</div>
                  <div className="text-[#666] text-[0.9rem]">Scheduled Visits</div>
                </div>
                
                <div className="text-center p-[20px_15px] bg-[#f9f9f9] rounded-[8px]">
                  <div className="w-[50px] h-[50px] bg-[#e8f2ff] rounded-full flex items-center justify-center mx-auto mb-[15px]">
                    <i className="fas fa-comments text-[#1a5fb4] text-[1.3rem]"></i>
                  </div>
                  <div className="text-[1.5rem] font-bold text-[#1a5fb4] mb-[5px]">7</div>
                  <div className="text-[#666] text-[0.9rem]">Messages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
