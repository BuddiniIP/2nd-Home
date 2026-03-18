import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { properties as allProperties } from "../data/mockData";

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ownerProperties, setOwnerProperties] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "Boarding House",
    location: "",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    amenities: "",
    description: "",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    available: true
  });

  useEffect(() => {
    // If no user or wrong role, redirect or handle state gracefully
    if (!currentUser) return;
    
    // Fetch properties belonging to this owner
    const myProperties = allProperties.filter(p => p.ownerId === currentUser.id);
    setOwnerProperties(myProperties);
  }, [currentUser]);

  const handleOpenModal = (property = null) => {
    if (property) {
      setEditingId(property.id);
      setFormData({
        title: property.title,
        type: property.type,
        location: property.location,
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        amenities: property.amenities.join(", "),
        description: property.description,
        image: property.image,
        available: property.available
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        type: "Boarding House",
        location: "",
        price: "",
        bedrooms: "1",
        bathrooms: "1",
        amenities: "",
        description: "",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        available: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProperty = (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      amenities: formData.amenities.split(",").map(item => item.trim()).filter(item => item !== "")
    };

    if (editingId) {
      // Update existing property in global array and local state
      const globalIndex = allProperties.findIndex((p) => p.id === editingId);
      if (globalIndex !== -1) {
        allProperties[globalIndex] = { ...allProperties[globalIndex], ...formattedData };
      }
      setOwnerProperties(ownerProperties.map((p) => (p.id === editingId ? { ...p, ...formattedData } : p)));
    } else {
      // Create new property
      const newProperty = {
        id: `p${Date.now()}`,
        ownerId: currentUser.id,
        rating: 0,
        reviews: 0,
        ...formattedData
      };
      allProperties.push(newProperty);
      setOwnerProperties([...ownerProperties, newProperty]);
    }
    
    handleCloseModal();
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      const globalIndex = allProperties.findIndex((p) => p.id === id);
      if (globalIndex !== -1) {
        allProperties.splice(globalIndex, 1);
      }
      setOwnerProperties(ownerProperties.filter((p) => p.id !== id));
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#f5f7fa] min-h-screen py-[60px] md:py-[80px] font-sans">
        <div className="w-[90%] max-w-[1200px] mx-auto text-center">
          <h2 className="text-[2rem] text-[#2c3e50] font-bold mb-[20px]">Access Denied</h2>
          <p className="text-gray-600 mb-[30px]">Please log in as an owner to view this dashboard.</p>
          <Link to="/login" className="bg-[#4a6baf] text-white px-[24px] py-[12px] rounded-[4px] font-semibold hover:bg-[#3a5a9f] transition-all">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fa] min-h-screen py-[60px] md:py-[80px] font-sans relative">
      <div className="w-[90%] max-w-[1200px] mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-[15px] p-[30px] md:p-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-[40px] flex flex-col md:flex-row justify-between items-center md:items-start gap-[20px] bg-[linear-gradient(to_right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)),url('https://images.unsplash.com/photo-1560518846-1ea11a123f81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
          <div>
            <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[#2c3e50] mb-[10px]">Welcome back, {currentUser.name}! 👋</h1>
            <p className="text-gray-600 text-[1.1rem]">Manage your properties, view applications, and track your performance.</p>
          </div>
          <button className="bg-[#ff7e5f] text-white px-[24px] py-[12px] rounded-[6px] font-semibold hover:bg-[#ff6b4a] hover:-translate-y-[2px] shadow-lg transition-all whitespace-nowrap" onClick={() => handleOpenModal()}>
            <i className="fas fa-plus mr-2"></i> Add New Property
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mb-[40px]">
          <h2 className="text-[1.5rem] font-bold text-[#2c3e50] mb-[20px] pl-[10px] border-l-[4px] border-[#4a6baf]">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <div className="bg-white p-[25px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center gap-[20px] hover:-translate-y-[5px] transition-transform">
              <div className="w-[60px] h-[60px] rounded-full bg-[#e8f0fe] text-[#4a6baf] flex items-center justify-center text-[1.8rem]">
                <i className="fas fa-home"></i>
              </div>
              <div>
                <div className="text-[1.8rem] font-bold text-[#2c3e50]">{ownerProperties.length}</div>
                <div className="text-gray-500 font-medium text-[0.9rem]">Total Properties</div>
              </div>
            </div>
            
            <div className="bg-white p-[25px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center gap-[20px] hover:-translate-y-[5px] transition-transform">
              <div className="w-[60px] h-[60px] rounded-full bg-[#fef0e8] text-[#ff7e5f] flex items-center justify-center text-[1.8rem]">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <div className="text-[1.8rem] font-bold text-[#2c3e50]">
                  {ownerProperties.length > 0 ? (ownerProperties.length * 3) + 2 : 0}
                </div>
                <div className="text-gray-500 font-medium text-[0.9rem]">Active Tenancies</div>
              </div>
            </div>
            
            <div className="bg-white p-[25px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center gap-[20px] hover:-translate-y-[5px] transition-transform">
              <div className="w-[60px] h-[60px] rounded-full bg-[#e6f4ea] text-[#28a745] flex items-center justify-center text-[1.8rem]">
                <i className="fas fa-eye"></i>
              </div>
              <div>
                <div className="text-[1.8rem] font-bold text-[#2c3e50]">{ownerProperties.length > 0 ? '1,245' : '0'}</div>
                <div className="text-gray-500 font-medium text-[0.9rem]">Profile Views</div>
              </div>
            </div>
            
            <div className="bg-white p-[25px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center gap-[20px] hover:-translate-y-[5px] transition-transform">
              <div className="w-[60px] h-[60px] rounded-full bg-[#fff8e1] text-[#ffc107] flex items-center justify-center text-[1.8rem]">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div>
                <div className="text-[1.8rem] font-bold text-[#2c3e50]">12</div>
                <div className="text-gray-500 font-medium text-[0.9rem]">New Applications</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
          {/* Main Content Area (My Properties) */}
          <div className="lg:col-span-2 space-y-[30px]">
            
            {/* Properties List */}
            <div className="bg-white rounded-[15px] p-[25px] md:p-[35px] shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-[#f0f0f0]">
              <div className="flex justify-between items-center mb-[25px] border-b border-[#f0f0f0] pb-[15px]">
                <h3 className="text-[1.4rem] font-bold text-[#2c3e50] m-0"><i className="fas fa-building text-[#4a6baf] mr-2"></i> My Properties</h3>
              </div>

              {ownerProperties.length === 0 ? (
                <div className="text-center py-[40px] px-[20px] bg-[#f8f9fa] rounded-[10px] border border-dashed border-[#ddd]">
                  <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center mx-auto mb-[15px] text-[2rem] text-[#ccc] shadow-sm">
                    <i className="fas fa-home"></i>
                  </div>
                  <h4 className="text-[1.2rem] text-[#2c3e50] font-semibold mb-[10px]">No properties listed yet</h4>
                  <p className="text-gray-500 mb-[20px]">You haven't added any properties to your profile. Start adding places to get students applying!</p>
                  <button className="bg-[#4a6baf] text-white px-[20px] py-[10px] rounded-[4px] font-semibold hover:bg-[#3a5a9f] transition-colors" onClick={() => handleOpenModal()}>
                    <i className="fas fa-plus mr-2"></i> Add Your First Property
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-[20px]">
                  {ownerProperties.map(property => (
                    <div key={property.id} className="flex flex-col sm:flex-row gap-[20px] p-[15px] border border-[#f0f0f0] rounded-[10px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all group">
                      <div className="w-full sm:w-[150px] h-[120px] rounded-[8px] overflow-hidden flex-shrink-0 relative">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
                        <div className={`absolute top-[10px] left-[10px] text-[0.75rem] font-bold px-[10px] py-[4px] rounded-[20px] text-white ${property.available ? 'bg-[rgba(40,167,69,0.9)]' : 'bg-[rgba(220,53,69,0.9)]'}`}>
                          {property.available ? 'Available' : 'Occupied'}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-[5px]">
                        <div>
                          <div className="flex justify-between items-start mb-[5px]">
                            <h4 className="text-[1.2rem] font-bold text-[#2c3e50] leading-tight">
                              <Link to={`/search?university=${encodeURIComponent(property.location)}`} className="hover:text-[#4a6baf] transition-colors">{property.title}</Link>
                            </h4>
                            <div className="text-[1.2rem] font-bold text-[#4a6baf]">LKR {property.price.toLocaleString()}</div>
                          </div>
                          <div className="text-gray-500 text-[0.9rem] mb-[10px]">
                            <i className="fas fa-map-marker-alt text-[#ff9800] mr-[5px]"></i> {property.location}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto border-t border-[#f8f9fa] pt-[10px]">
                          <div className="flex gap-[15px] text-[0.85rem] text-gray-500">
                            <span><i className="fas fa-bed mr-[5px]"></i> {property.bedrooms} Bed</span>
                            <span><i className="fas fa-eye mr-[5px]"></i> {property.reviews * 14} Views</span>
                          </div>
                          <div className="flex gap-[10px]">
                            <button className="text-[#4a6baf] bg-[#e8f0fe] w-[35px] h-[35px] rounded-full hover:bg-[rgba(74,107,175,0.2)] transition-colors flex items-center justify-center cursor-pointer border-none" title="Edit Property" onClick={() => handleOpenModal(property)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="text-[#dc3545] bg-[#fdf2f2] w-[35px] h-[35px] rounded-full hover:bg-[rgba(220,53,69,0.2)] transition-colors flex items-center justify-center cursor-pointer border-none" title="Delete Property" onClick={() => handleDeleteProperty(property.id)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-[30px]">
            
            {/* Recent Applications */}
            <div className="bg-white rounded-[15px] p-[25px] shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-[#f0f0f0]">
              <div className="flex justify-between items-center mb-[20px] border-b border-[#f0f0f0] pb-[10px]">
                <h3 className="text-[1.2rem] font-bold text-[#2c3e50] m-0">Recent Applications</h3>
                <span className="bg-[#ffc107] text-[#856404] text-[0.8rem] px-[8px] py-[2px] rounded-[10px] font-bold">12 New</span>
              </div>
              
              <div className="flex flex-col gap-[15px]">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex gap-[15px] items-center p-[10px] hover:bg-[#f8f9fa] rounded-[8px] transition-colors cursor-pointer">
                    <div className="w-[45px] h-[45px] rounded-full bg-[#4a6baf] text-white flex justify-center items-center font-bold text-[1.1rem] flex-shrink-0 shadow-sm">
                      S{num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#2c3e50] truncate">Student Application #{num}</div>
                      <div className="text-[0.85rem] text-gray-500 truncate">For {ownerProperties[0]?.title || 'Property'}</div>
                    </div>
                    <div className="w-[30px] h-[30px] rounded-full bg-[#e8f0fe] text-[#4a6baf] flex justify-center items-center">
                      <i className="fas fa-chevron-right text-[0.8rem]"></i>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-[20px] text-center">
                <Link to="#" className="text-[#4a6baf] font-semibold text-[0.95rem] hover:underline">View All Applications</Link>
              </div>
            </div>

            {/* Performance Review */}
            <div className="bg-gradient-to-br from-[#1a5fb4] to-[#4a6baf] rounded-[15px] p-[25px] text-white shadow-[0_10px_20px_rgba(26,95,180,0.2)]">
              <h3 className="text-[1.2rem] font-bold mb-[15px] flex items-center">
                <i className="fas fa-chart-line mr-[10px]"></i> Performance Rank
              </h3>
              <div className="flex items-center gap-[20px] mb-[20px]">
                <div className="text-[4rem] text-[#ffc107]"><i className="fas fa-medal"></i></div>
                <div>
                  <div className="text-[1.1rem] font-bold">Top Landlord</div>
                  <div className="text-[0.9rem] opacity-90 text-[#e0e0e0]">You respond to 95% of queries within 1 hour. Keep it up!</div>
                </div>
              </div>
              <div className="bg-[rgba(255,255,255,0.15)] rounded-[8px] p-[15px] backdrop-blur-sm">
                <div className="flex justify-between text-[0.9rem] mb-[5px]">
                  <span>Profile Completion</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full bg-[rgba(0,0,0,0.2)] rounded-full h-[6px]">
                  <div className="bg-[#28a745] h-[6px] rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[9999] flex justify-center items-center p-[20px] overflow-y-auto">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto relative animate-[fadeIn_0.3s]">
            <div className="sticky top-0 bg-white border-b border-[#eee] p-[20px] flex justify-between items-center z-10 rounded-t-[10px]">
              <h2 className="text-[1.5rem] font-bold text-[#2c3e50] m-0">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
              <button 
                onClick={handleCloseModal}
                className="w-[30px] h-[30px] rounded-full bg-[#f8f9fa] flex items-center justify-center text-gray-500 hover:bg-[#ffe5e5] hover:text-[#dc3545] transition-colors cursor-pointer border-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveProperty} className="p-[20px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[20px]">
                
                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Property Title *</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" placeholder="e.g. Cozy Student Room" />
                </div>
                
                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Property Type *</label>
                  <select required name="type" value={formData.type} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]">
                    <option value="Boarding House">Boarding House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Room">Room</option>
                    <option value="House">House</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Annex">Annex</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Location (City / University) *</label>
                  <input required name="location" value={formData.location} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" placeholder="e.g. Colombo 03" />
                </div>
                
                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Price per Month (LKR) *</label>
                  <input required name="price" type="number" value={formData.price} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" placeholder="e.g. 15000" />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Bedrooms *</label>
                  <input required name="bedrooms" type="number" min="1" value={formData.bedrooms} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Bathrooms *</label>
                  <input required name="bathrooms" type="number" min="1" value={formData.bathrooms} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="font-semibold text-dark text-[0.9rem]">Amenities (Comma separated) *</label>
                  <input required name="amenities" value={formData.amenities} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf]" placeholder="e.g. WiFi, AC, Kitchen" />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-[10px] cursor-pointer mt-[10px]">
                    <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} className="w-[18px] h-[18px] accent-[#4a6baf]" />
                    <span className="font-semibold text-dark">Is Available Now?</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-[8px] mb-[20px]">
                <label className="font-semibold text-dark text-[0.9rem]">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="p-[10px] border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#4a6baf] resize-y min-h-[100px]" placeholder="Detailed description of the property..."></textarea>
              </div>

              <div className="flex justify-end gap-[15px] pt-[20px] border-t border-[#eee]">
                <button type="button" onClick={handleCloseModal} className="px-[20px] py-[10px] text-gray-600 bg-[#f8f9fa] border border-[#ddd] rounded-[4px] font-semibold hover:bg-[#e9ecef] transition-colors">Cancel</button>
                <button type="submit" className="px-[20px] py-[10px] bg-[#4a6baf] text-white rounded-[4px] font-semibold hover:bg-[#3a5a9f] transition-colors">{editingId ? 'Save Changes' : 'Create Property'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
