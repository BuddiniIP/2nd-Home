import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { properties } from "../data/mockData";

const Search = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    university: "",
    faculty: "",
    minPrice: "",
    maxPrice: "",
    gender: [],
    roomType: []
  });
  
  const [sortBy, setSortBy] = useState("recommended");

  // Read initial filters from URL when the component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const uniParam = searchParams.get('university');
    if (uniParam) {
      // Basic normalization to match our select options
      const normalizedQuery = Object.keys({
         "colombo": "University of Colombo",
         "peradeniya": "University of Peradeniya",
         "moratuwa": "University of Moratuwa",
         "kelaniya": "University of Kelaniya",
         "sjp": "University of Sri Jayewardenepura",
      }).find(k => k === uniParam.toLowerCase() || uniParam.toLowerCase().includes(k)) || "other";
      
      setFilters(prev => ({ ...prev, university: normalizedQuery }));
    }
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      let groupName = "";
      if (['maleOnly', 'femaleOnly', 'mixed'].includes(id)) groupName = 'gender';
      if (['singleRoom', 'doubleRoom'].includes(id)) groupName = 'roomType';
      
      if (!groupName) return;

      const checkboxValue = id.replace('Only', '').replace('Room', '').toLowerCase();
      
      setFilters(prev => {
        const currentGroup = [...prev[groupName]];
        if (checked) {
          currentGroup.push(checkboxValue);
        } else {
          const index = currentGroup.indexOf(checkboxValue);
          if (index > -1) currentGroup.splice(index, 1);
        }
        return { ...prev, [groupName]: currentGroup };
      });
    } else {
      setFilters(prev => ({ ...prev, [id]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({
      university: "",
      faculty: "",
      minPrice: "",
      maxPrice: "",
      gender: [],
      roomType: []
    });
    // For checkboxes, since they are largely uncontrolled in this simple setup or rely on ID matching:
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('university').value = "";
    document.getElementById('minPrice').value = "";
    document.getElementById('maxPrice').value = "";
  };

  const filteredAndSortedBoardings = useMemo(() => {
    let result = properties.filter(boarding => {
      // University filter (matching against description/location since mockData is generic)
      if (filters.university && 
          !boarding.location.toLowerCase().includes(filters.university) && 
          !boarding.description.toLowerCase().includes(filters.university)) return false;
      
      // Price filter
      const price = padding => parseInt(boarding.price);
      if (filters.minPrice && price() < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && price() > parseInt(filters.maxPrice)) return false;
      
      // Room type filter
      if (filters.roomType.length > 0 && !filters.roomType.includes(boarding.type.toLowerCase())) return false;
      
      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        // distance not in mockData, default to rating
        case 'distance': return b.rating - a.rating; 
        default: return 0; // recommended
      }
    });

    return result;
  }, [filters, sortBy]);

  const saveBoarding = (title) => {
    alert(`${title} has been saved to your favorites!`);
  };

  const viewDetails = (title) => {
    alert(`Viewing details for: ${title}\n\nThis would typically redirect to a detailed view page.`);
  };

  return (
    <section className="py-[120px] pb-[40px]">
      <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
        <div className="text-center mb-[40px]">
          <h1 className="text-[2.5rem] md:text-[2rem] text-dark font-bold mb-[15px]">Find Your Perfect Boarding Place</h1>
          <p className="text-gray text-[1.1rem] max-w-[600px] mx-auto">
            Search through verified boarding facilities with advanced filters to find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-[30px]">
          {/* Filters Sidebar */}
          <div className="bg-white rounded-[12px] p-[25px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] h-fit lg:sticky lg:top-[100px]">
            <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-light">
              <h3 className="text-dark text-[1.3rem] font-bold">Filter Results</h3>
              <button className="bg-transparent border-2 border-primary text-primary px-4 py-2 rounded-[4px] font-semibold hover:bg-primary hover:text-white transition-colors text-[0.9rem]" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* University Filter */}
            <div className="mb-[25px]">
              <div className="font-semibold text-dark mb-[15px] text-[1.1rem]">University</div>
              <select id="university" value={filters.university} className="w-full p-[12px_15px] border border-[#ddd] rounded-[6px] text-[1rem] bg-white focus:outline-none focus:border-primary" onChange={handleFilterChange}>
                <option value="">All Universities</option>
                <option value="colombo">University of Colombo</option>
                <option value="peradeniya">University of Peradeniya</option>
                <option value="moratuwa">University of Moratuwa</option>
                <option value="kelaniya">University of Kelaniya</option>
                <option value="sjp">University of Sri Jayewardenepura</option>
                <option value="other">Other Universities</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-[25px]">
              <div className="font-semibold text-dark mb-[15px] text-[1.1rem]">Price Range (LKR/month)</div>
              <div className="flex items-center gap-[10px] mb-[15px]">
                <input type="number" id="minPrice" className="flex-1 p-[10px] border border-[#ddd] rounded-[6px] focus:outline-none focus:border-primary" placeholder="Min" min="0" max="100000" onChange={handleFilterChange} />
                <span>to</span>
                <input type="number" id="maxPrice" className="flex-1 p-[10px] border border-[#ddd] rounded-[6px] focus:outline-none focus:border-primary" placeholder="Max" min="0" max="100000" onChange={handleFilterChange} />
              </div>
            </div>

            {/* Gender Preference */}
            <div className="mb-[25px]">
              <div className="font-semibold text-dark mb-[15px] text-[1.1rem]">Gender Preference</div>
              <div className="mb-[12px]">
                <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                  <input type="checkbox" id="maleOnly" className="w-[18px] h-[18px] accent-primary" onChange={handleFilterChange} />
                  <span>Male Only</span>
                </label>
              </div>
              <div className="mb-[12px]">
                <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                  <input type="checkbox" id="femaleOnly" className="w-[18px] h-[18px] accent-primary" onChange={handleFilterChange} />
                  <span>Female Only</span>
                </label>
              </div>
              <div className="mb-[12px]">
                <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                  <input type="checkbox" id="mixed" className="w-[18px] h-[18px] accent-primary" onChange={handleFilterChange} />
                  <span>Mixed</span>
                </label>
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-[25px]">
              <div className="font-semibold text-dark mb-[15px] text-[1.1rem]">Room Type</div>
              <div className="mb-[12px]">
                <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                  <input type="checkbox" id="singleRoom" className="w-[18px] h-[18px] accent-primary" onChange={handleFilterChange} />
                  <span>Single Room</span>
                </label>
              </div>
              <div className="mb-[12px]">
                <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                  <input type="checkbox" id="doubleRoom" className="w-[18px] h-[18px] accent-primary" onChange={handleFilterChange} />
                  <span>Double Room</span>
                </label>
              </div>
            </div>

            {/* Facilities Dummy */}
            <div className="mb-[25px]">
              <div className="font-semibold text-dark mb-[15px] text-[1.1rem]">Facilities (Example UI)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[12px]">
                {["Wi-Fi", "Private Bathroom", "Kitchen Access", "Laundry", "24/7 Security", "Parking"].map(fac => (
                  <div key={fac} className="mb-[12px]">
                    <label className="flex items-center gap-[10px] cursor-pointer text-gray">
                      <input type="checkbox" className="w-[18px] h-[18px] accent-primary" />
                      <span>{fac}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full p-[14px] mt-[20px] bg-primary text-white rounded-[4px] font-semibold hover:bg-[#3a5a9f] transition-colors" onClick={() => {/* Filters auto applied via react state */}}>
              <i className="fas fa-filter mr-2"></i> Apply Filters
            </button>
          </div>

          {/* Results Section */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[30px] gap-[15px]">
              <div>
                <h2 className="text-[1.8rem] font-bold text-dark">Available Boardings</h2>
                <div className="text-gray">Showing {filteredAndSortedBoardings.length} results</div>
              </div>
              <div>
                <select 
                  className="p-[10px_15px] border border-[#ddd] rounded-[6px] bg-white text-dark focus:outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
            </div>

            {filteredAndSortedBoardings.length === 0 ? (
              <div className="text-center py-[60px] px-[20px] w-full">
                <i className="fas fa-search text-[4rem] text-gray mb-[20px]"></i>
                <h3 className="text-dark text-[1.5rem] font-bold mb-[10px]">No boardings found</h3>
                <p className="text-gray mb-[20px]">Try adjusting your filters to find more results.</p>
                <button className="bg-primary text-white px-[24px] py-[12px] rounded-[4px] font-semibold hover:bg-[#3a5a9f] transition-all" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[25px]">
                {filteredAndSortedBoardings.map(boarding => (
                  <div key={boarding.id} className="bg-white rounded-[12px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.08)] hover:-translate-y-[5px] transition-transform duration-300 flex flex-col">
                    <div className="h-[200px] relative overflow-hidden group">
                      <img src={boarding.image} alt={boarding.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className={`absolute top-[15px] right-[15px] text-white px-[10px] py-[5px] rounded-[20px] text-[0.8rem] font-semibold ${boarding.badge === 'Verified' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {boarding.badge}
                      </div>
                    </div>
                    
                    <div className="p-[20px] flex flex-col flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-[10px] mb-[15px]">
                        <div>
                          <h3 className="text-[1.3rem] text-dark font-bold mb-[5px]">{boarding.title}</h3>
                          <div className="text-gray flex items-center gap-[8px]">
                            <i className="fas fa-map-marker-alt"></i>
                            {boarding.location}
                          </div>
                        </div>
                        <div className="text-[1.4rem] font-bold text-primary self-start sm:self-auto shrink-0">
                          LKR {boarding.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex justify-between mb-[15px] text-gray text-[0.9rem]">
                        <div><i className="fas fa-home"></i> {boarding.type}</div>
                        <div><i className="fas fa-bed"></i> {boarding.bedrooms} {boarding.bedrooms === 1 ? 'Bed' : 'Beds'}</div>
                        <div className="flex items-center gap-[5px] text-warning font-semibold">
                          <i className="fas fa-star"></i> {boarding.rating} ({boarding.reviews})
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-[10px] my-[15px]">
                        {boarding.amenities.map(amenity => (
                          <span key={amenity} className="bg-light px-[10px] py-[5px] rounded-[15px] text-[0.8rem] text-gray">
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-[10px] mt-auto pt-[10px]">
                        <button className="flex-1 bg-transparent border-2 border-primary text-primary px-[10px] py-[10px] font-semibold rounded-[4px] hover:bg-primary hover:text-white transition-colors" onClick={() => viewDetails(boarding.name)}>
                          <i className="fas fa-eye mr-2"></i> Details
                        </button>
                        <button className="flex-1 bg-primary text-white border-2 border-primary px-[10px] py-[10px] font-semibold rounded-[4px] hover:bg-[#3a5a9f] transition-colors" onClick={() => saveBoarding(boarding.name)}>
                          <i className="fas fa-heart mr-2"></i> Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAndSortedBoardings.length > 0 && (
              <div className="flex justify-center gap-[10px] mt-[40px]">
                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] bg-primary text-white border border-primary font-bold">1</button>
                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] bg-white border border-[#ddd] hover:bg-light transition-colors">2</button>
                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] bg-white border border-[#ddd] hover:bg-light transition-colors">3</button>
                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] bg-white border border-[#ddd] hover:bg-light transition-colors">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
