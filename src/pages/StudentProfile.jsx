import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "password", label: "Change Password" },
    { id: "saved", label: "Saved Listings (3)" },
    { id: "reviews", label: "Review History" },
    { id: "logout", label: "Logout" },
  ];

  if (!currentUser) {
    return <div className="text-center py-20 text-xl">Please log in to view your profile.</div>;
  }

  return (
    <div className="bg-[#f5f7fa] min-h-screen py-[60px] md:py-[80px] font-sans">
      <div className="w-[90%] max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-[linear-gradient(135deg,#4a6baf,#3a5a9f)] text-white p-[30px_20px] md:p-[40px] text-center relative">
            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full border-4 border-white mx-auto mb-[20px] overflow-hidden bg-[#e9ecef] relative cursor-pointer" onClick={() => alert('Profile picture upload feature')}>
              {/* Fallback to initials if no image */}
              <div className="w-full h-full bg-primary flex items-center justify-center text-[3rem] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#ff7e5f] text-white w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full flex items-center justify-center border-[2px] md:border-[3px] border-white">
                <i className="fas fa-camera text-[0.8rem] md:text-[1rem]"></i>
              </div>
            </div>
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold mb-[5px]">{currentUser.name}</h1>
            <div className="text-[1.1rem] md:text-[1.2rem] opacity-90 mb-[15px]">@{currentUser.username} • {currentUser.role === 'student' ? 'Student' : 'Owner'}</div>
            <div className="flex flex-wrap justify-center gap-[10px]">
              <span className="bg-[rgba(255,255,255,0.2)] px-[15px] py-[6px] md:px-[20px] md:py-[8px] rounded-[20px] text-[0.85rem] md:text-[0.9rem] font-semibold">Verified Member</span>
              <span className="bg-[rgba(255,255,255,0.2)] px-[15px] py-[6px] md:px-[20px] md:py-[8px] rounded-[20px] text-[0.85rem] md:text-[0.9rem] font-semibold">Joined Recently</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-[25px_15px] md:p-[40px]">
            {/* Tabs Navigation */}
            <div className="flex border-b-2 border-[#f8f9fa] mb-[30px] md:mb-[40px] overflow-x-auto whitespace-nowrap">
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  className={`px-[20px] py-[12px] md:px-[30px] md:py-[15px] cursor-pointer font-medium border-b-[3px] transition-all duration-300 text-[0.9rem] md:text-[1rem] ${activeTab === tab.id ? 'border-[#4a6baf] text-[#4a6baf]' : 'border-transparent hover:text-[#4a6baf]'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Tab Contents */}
            <div>
              {/* Personal Details */}
              {activeTab === "personal" && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    <div className="mb-[30px] lg:mb-[40px]">
                      <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] border-b-2 border-[#f8f9fa] font-semibold">Personal Information</h3>
                      <div className="flex flex-col gap-[20px]">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-[5px] sm:gap-[15px]">
                          <div className="flex items-center text-[#4a6baf] w-[20px]"><i className="fas fa-user"></i></div>
                          <div className="font-semibold text-[#2c3e50] sm:min-w-[150px]">Full Name:</div>
                          <div className="text-gray-500">{currentUser.name}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-[5px] sm:gap-[15px]">
                          <div className="flex items-center text-[#4a6baf] w-[20px]"><i className="fas fa-envelope"></i></div>
                          <div className="font-semibold text-[#2c3e50] sm:min-w-[150px]">Email:</div>
                          <div className="text-gray-500">{currentUser.email}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-[5px] sm:gap-[15px]">
                          <div className="flex items-center text-[#4a6baf] w-[20px]"><i className="fas fa-phone"></i></div>
                          <div className="font-semibold text-[#2c3e50] sm:min-w-[150px]">Contact Number:</div>
                          <div className="text-gray-500">{currentUser.phone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-[30px] lg:mb-[40px]">
                      <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] border-b-2 border-[#f8f9fa] font-semibold">University Information</h3>
                      <div className="flex flex-col gap-[20px]">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-[5px] sm:gap-[15px]">
                          <div className="flex items-center text-[#4a6baf] w-[20px]"><i className="fas fa-university"></i></div>
                          <div className="font-semibold text-[#2c3e50] sm:min-w-[150px]">University:</div>
                          <div className="text-gray-500">{currentUser.university || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[10px] md:mt-[30px]">
                    <button className="bg-[#4a6baf] text-white px-[24px] py-[12px] rounded-[4px] font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300" onClick={() => alert('Edit mode not fully implemented.')}>
                      <i className="fas fa-edit mr-2"></i> Edit Personal Details
                    </button>
                  </div>
                </div>
              )}

              {/* Change Password */}
              {activeTab === "password" && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <div className="max-w-[600px]">
                    <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] border-b-2 border-[#f8f9fa] font-semibold">Change Password</h3>
                    <p className="text-gray-500 mb-[30px]">
                      For security reasons, your new password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                    </p>

                    <div className="mb-[25px]">
                      <label className="block mb-[8px] font-medium text-[#2c3e50]">Current Password</label>
                      <input type="password" placeholder="Enter current password" className="w-full p-[12px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#4a6baf] focus:ring-[2px] focus:ring-[rgba(74,107,175,0.2)] transition-colors" />
                    </div>

                    <div className="mb-[25px]">
                      <label className="block mb-[8px] font-medium text-[#2c3e50]">New Password</label>
                      <input type="password" placeholder="Enter new password" className="w-full p-[12px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#4a6baf] focus:ring-[2px] focus:ring-[rgba(74,107,175,0.2)] transition-colors" />
                      <div className="h-[5px] bg-[#eee] rounded-[3px] mt-[5px] overflow-hidden">
                        <div className="h-full bg-[#dc3545] w-[0%] transition-all duration-300"></div>
                      </div>
                      <small className="text-gray-500 block mt-[5px]">Password strength: Weak</small>
                    </div>

                    <div className="mb-[25px]">
                      <label className="block mb-[8px] font-medium text-[#2c3e50]">Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" className="w-full p-[12px_15px] border border-[#ddd] rounded-[6px] text-[1rem] focus:outline-none focus:border-[#4a6baf] focus:ring-[2px] focus:ring-[rgba(74,107,175,0.2)] transition-colors" />
                    </div>

                    <button className="bg-[#4a6baf] text-white px-[24px] py-[12px] rounded-[4px] font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300" onClick={() => alert('Password validation logic needed')}>
                      <i className="fas fa-key mr-2"></i> Change Password
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Listings */}
              {activeTab === "saved" && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] border-b-2 border-[#f8f9fa] font-semibold">Saved Boardings (3)</h3>
                  <p className="text-gray-500 mb-[30px]">
                    Your saved boarding places. Click on any listing to view details or remove from saved.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
                    {/* Saved 1 */}
                    <div className="bg-white border border-[#e9ecef] rounded-[10px] overflow-hidden hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                      <div className="h-[180px] bg-[#e9ecef] relative">
                        <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Green View Hostel" className="w-full h-full object-cover" />
                        <div className="absolute top-[15px] right-[15px] bg-[rgba(255,255,255,0.9)] w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer text-[#dc3545] hover:bg-[#dc3545] hover:text-white transition-colors" onClick={() => confirm('Remove Green View Hostel from saved?')}>
                          <i className="fas fa-times"></i>
                        </div>
                      </div>
                      <div className="p-[20px]">
                        <h4 className="text-[1.2rem] text-[#2c3e50] font-bold mb-[10px]">Green View Hostel</h4>
                        <div className="text-[1.3rem] font-bold text-[#4a6baf] mb-[10px]">LKR 18,000<span className="text-[1rem] font-normal">/month</span></div>
                        <div className="text-gray-500 text-[0.9rem] mb-[15px]">
                          <i className="fas fa-map-marker-alt mr-2 text-[#ff9800]"></i> Colombo 03 • 1.2km from University
                        </div>
                        <div className="flex gap-[10px]">
                          <button className="flex-1 px-[10px] py-[10px] text-[0.9rem] bg-transparent border-2 border-[#4a6baf] text-[#4a6baf] font-semibold rounded-[4px] hover:bg-[#4a6baf] hover:text-white transition-colors">View Details</button>
                          <button className="flex-1 px-[10px] py-[10px] text-[0.9rem] bg-[#4a6baf] border-2 border-[#4a6baf] text-white font-semibold rounded-[4px] hover:bg-[#3a5a9f] transition-colors">Apply Now</button>
                        </div>
                      </div>
                    </div>
                    {/* Saved 2 & 3 similarly structured */}
                    {/* Saved 2 */}
                    <div className="bg-white border border-[#e9ecef] rounded-[10px] overflow-hidden hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                      <div className="h-[180px] bg-[#e9ecef] relative">
                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Premium Student Residence" className="w-full h-full object-cover" />
                        <div className="absolute top-[15px] right-[15px] bg-[rgba(255,255,255,0.9)] w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer text-[#dc3545] hover:bg-[#dc3545] hover:text-white transition-colors" onClick={() => confirm('Remove Premium Student Residence from saved?')}>
                          <i className="fas fa-times"></i>
                        </div>
                      </div>
                      <div className="p-[20px]">
                        <h4 className="text-[1.2rem] text-[#2c3e50] font-bold mb-[10px]">Premium Student Residence</h4>
                        <div className="text-[1.3rem] font-bold text-[#4a6baf] mb-[10px]">LKR 22,000<span className="text-[1rem] font-normal">/month</span></div>
                        <div className="text-gray-500 text-[0.9rem] mb-[15px]">
                          <i className="fas fa-map-marker-alt mr-2 text-[#ff9800]"></i> Colombo 07 • 0.5km from University
                        </div>
                        <div className="flex gap-[10px]">
                          <button className="flex-1 px-[10px] py-[10px] text-[0.9rem] bg-transparent border-2 border-[#4a6baf] text-[#4a6baf] font-semibold rounded-[4px] hover:bg-[#4a6baf] hover:text-white transition-colors">View Details</button>
                          <button className="flex-1 px-[10px] py-[10px] text-[0.9rem] bg-[#4a6baf] border-2 border-[#4a6baf] text-white font-semibold rounded-[4px] hover:bg-[#3a5a9f] transition-colors">Apply Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Review History */}
              {activeTab === "reviews" && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <div className="max-w-[800px]">
                    <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] border-b-2 border-[#f8f9fa] font-semibold">My Reviews (2)</h3>
                    <p className="text-gray-500 mb-[30px]">
                      Reviews you've submitted for boarding places you've stayed at.
                    </p>

                    <div className="flex flex-col gap-[20px]">
                      {/* Review 1 */}
                      <div className="bg-white border border-[#e9ecef] rounded-[10px] p-[25px] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-[15px] gap-[10px]">
                          <div>
                            <div className="font-semibold text-[#4a6baf] mb-[5px]">Green View Hostel</div>
                            <div className="text-gray-500 text-[0.9rem]">Reviewed on January 15, 2024</div>
                          </div>
                          <div className="text-[#ffc107] text-[1.1rem]">
                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i> <span className="text-gray-700 text-[0.9rem]">(5.0)</span>
                          </div>
                        </div>
                        <div className="text-gray-600 leading-[1.7] my-[15px]">
                          Excellent boarding facility! The rooms are clean and well-maintained. The owner is very responsive and helpful. Great location near the university. Highly recommended for female students.
                        </div>
                        <div className="mt-[15px]">
                          <button className="px-[16px] py-[8px] text-[0.9rem] bg-transparent border-2 border-[#4a6baf] text-[#4a6baf] font-semibold rounded-[4px] hover:bg-[#4a6baf] hover:text-white transition-colors">
                            <i className="fas fa-edit mr-2"></i> Edit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Tab */}
              {activeTab === "logout" && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <div className="max-w-[600px] mx-auto text-center py-[20px] md:py-[40px] px-[10px] md:px-[20px]">
                    <div className="text-[4rem] text-[#dc3545] mb-[20px]">
                      <i className="fas fa-sign-out-alt"></i>
                    </div>
                    <h3 className="text-[1.4rem] text-[#2c3e50] mb-[25px] pb-[10px] font-semibold">Logout from 2nd Home</h3>
                    <p className="text-[#dc3545] text-[1.1rem] mb-[30px]">
                      Are you sure you want to logout? You will need to login again to access your account.
                    </p>
                    <p className="text-gray-500 mb-[40px]">
                      If you're logging out for security reasons, make sure you're on a secure device before logging back in.
                    </p>
                    <div className="flex flex-wrap justify-center gap-[15px] md:gap-[20px]">
                      <button className="px-[24px] py-[12px] bg-transparent border-2 border-[#4a6baf] text-[#4a6baf] font-semibold rounded-[4px] hover:bg-[#4a6baf] hover:text-white transition-colors flex items-center gap-[8px]" onClick={() => setActiveTab('personal')}>
                        <i className="fas fa-arrow-left"></i> Go Back
                      </button>
                      <button className="px-[24px] py-[12px] bg-[#dc3545] border-2 border-[#dc3545] text-white font-semibold rounded-[4px] hover:bg-[#c82333] hover:-translate-y-[2px] transition-all flex items-center gap-[8px]" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
