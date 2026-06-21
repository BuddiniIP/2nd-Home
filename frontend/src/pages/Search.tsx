import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Filter, Search as SearchIcon, X, ChevronDown, Check, Map as MapIcon, Grid, Navigation } from 'lucide-react';

const Search = () => {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    university: "",
    faculty: "",
    minPrice: "",
    maxPrice: "",
    gender: [] as string[],
    roomType: [] as string[]
  });
  
  const [sortBy, setSortBy] = useState("recommended");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBase}/api/boardings`);
        const data = await response.json();
        const items = Array.isArray(data.data) ? data.data : [];

        const universityLabels = universities.map((u) => u.label);
        const facultyLabels = faculties;
        const genderLabels = ['male only', 'female only', 'mixed'];

        const mappedProperties = items.map((boarding: any) => {
          const amenities = boarding.amenities || [];
          const university = amenities.find((item: string) => universityLabels.includes(item)) || '';
          const faculty = amenities.find((item: string) => facultyLabels.includes(item)) || '';
          const rawGender = amenities.find((item: string) => genderLabels.includes(item.toLowerCase())) || 'mixed';
          const gender = rawGender.replace(/ only$/, '');
          const imagePath = boarding.images?.[0] || '';

          return {
            id: boarding.id,
            title: boarding.title,
            location: boarding.location?.address || boarding.address || 'Unknown location',
            image: imagePath ? (imagePath.startsWith('http') ? imagePath : `${apiBase}${imagePath}`) : '/images/house_orange.jpg',
            rating: 4.5, // TODO: replace with real rating from API
            type: boarding.capacity > 1 ? 'double' : 'single',
            currentOccupants: Number(boarding.currentOccupants || 0),
            capacity: Number(boarding.capacity || 0),
            gender,
            faculty,
            university,
            price: Number(boarding.price || 0),
          };
        });

        setProperties(mappedProperties);
      } catch {
        setError('Failed to load boardings');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardings();
  }, [apiBase]);

  const handleFilterChange = (id: string, value: string) => {
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const toggleCheckbox = (group: 'gender' | 'roomType', value: string) => {
    setFilters(prev => {
      const current = [...prev[group]];
      const index = current.indexOf(value);
      if (index > -1) current.splice(index, 1);
      else current.push(value);
      return { ...prev, [group]: current };
    });
  };

  const handleNearMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setViewMode('map');
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          alert("Unable to retrieve your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Text search
      const matchesSearch = searchQuery === "" || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Filters
      if (filters.university && p.university !== filters.university) return false;
      if (filters.faculty && p.faculty !== filters.faculty) return false;
      if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
      if (filters.gender.length > 0 && !filters.gender.includes(p.gender)) return false;
      if (filters.roomType.length > 0 && !filters.roomType.includes(p.type.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [filters, sortBy, searchQuery, properties]);

  const universities = [
    { id: "colombo", label: "University of Colombo" },
    { id: "peradeniya", label: "University of Peradeniya" },
    { id: "moratuwa", label: "University of Moratuwa" },
    { id: "kelaniya", label: "University of Kelaniya" },
    { id: "sjp", label: "University of Sri Jayewardenepura" },
  ];

  const faculties = [
    "Computing", "Technology", "Engineering", "Medicine", "Science", "Arts", "Law", "Management", "Other"
  ];

  return (
    <div className="pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent-orange text-[10px] font-bold uppercase tracking-[0.4em]"
            >
              Explore Boardings
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl text-black tracking-tight"
            >
              Find Your 2nd Home
            </motion.h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl">
            <div className="relative flex-1 group">
               <input 
                 type="text" 
                 placeholder="Search by location or name..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-gray-100 rounded-full pl-14 pr-6 py-5 text-sm focus:outline-none focus:border-accent-orange transition-all shadow-sm"
               />
               <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent-orange transition-colors" size={20} />
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => setIsFilterOpen(!isFilterOpen)}
                 className={`flex items-center justify-center gap-3 px-8 py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${isFilterOpen ? 'bg-accent-orange text-white' : 'bg-black text-white hover:bg-accent-orange'}`}
               >
                 <Filter size={18} />
                 {isFilterOpen ? 'Close' : 'Filters'}
               </button>
               <button 
                 onClick={handleNearMe}
                 disabled={isLocating}
                 className="flex items-center justify-center gap-3 px-8 py-5 rounded-full text-xs font-bold uppercase tracking-widest bg-white border border-gray-100 text-black hover:border-accent-orange hover:text-accent-orange transition-all shadow-sm group"
               >
                 <Navigation size={18} className={isLocating ? 'animate-pulse' : 'group-hover:rotate-45 transition-transform'} />
                 {isLocating ? 'Locating...' : 'Near Me'}
               </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {/* University Select */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-2">University</label>
                  <div className="relative">
                    <select 
                      value={filters.university}
                      onChange={(e) => handleFilterChange('university', e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-2xl px-6 py-4 text-sm outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="">All Universities</option>
                      {universities.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Faculty Select */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-2">Faculty</label>
                  <div className="relative">
                    <select 
                      value={filters.faculty}
                      onChange={(e) => handleFilterChange('faculty', e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-2xl px-6 py-4 text-sm outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="">All Faculties</option>
                      {faculties.map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-2">Price (LKR)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-2xl px-4 py-4 text-sm outline-none"
                    />
                    <input 
                      type="number" 
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-2xl px-4 py-4 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Gender Preference */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-2">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {['male', 'female', 'mixed'].map(g => (
                      <button 
                        key={g}
                        onClick={() => toggleCheckbox('gender', g)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filters.gender.includes(g) ? 'bg-black text-white border-black' : 'bg-[#F8F8F8] text-gray-400 border-transparent hover:border-gray-200'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 px-2">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['single', 'double'].map(r => (
                      <button 
                        key={r}
                        onClick={() => toggleCheckbox('roomType', r)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filters.roomType.includes(r) ? 'bg-black text-white border-black' : 'bg-[#F8F8F8] text-gray-400 border-transparent hover:border-gray-200'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info & Toggle View */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-8 gap-6">
           <p className="text-gray-400 text-sm">Showing <span className="text-black font-bold">{filteredProperties.length}</span> boardings available</p>
           <div className="flex items-center gap-6">
              <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                 >
                    <Grid size={18} />
                 </button>
                 <button 
                   onClick={() => setViewMode('map')}
                   className={`p-2.5 rounded-full transition-all ${viewMode === 'map' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                 >
                    <MapIcon size={18} />
                 </button>
              </div>
              <div className="h-6 w-[1px] bg-gray-100 mx-2" />
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Sort By</span>
                 <div className="relative">
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="bg-transparent text-sm font-bold text-black focus:outline-none appearance-none pr-8 cursor-pointer"
                   >
                     <option value="recommended">Recommended</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                     <option value="rating">Top Rated</option>
                   </select>
                   <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} />
                 </div>
              </div>
           </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-[3rem]" />
                <div className="space-y-3 px-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Retry</button>
          </div>
        )}

        {/* Conditional View Rendering */}
        {!loading && !error && (
        <>
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredProperties.map((item, idx) => (
                <Link to={`/boarding/${item.id}`} key={item.id} className="block group space-y-6">
                  <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative shadow-sm">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                       <Star size={12} className="text-accent-orange fill-accent-orange" />
                       {item.rating}
                    </div>
                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                       <span className="bg-black/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/10">
                          {item.type}
                       </span>
                       <span className="bg-black/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/10">
                          {item.gender}
                       </span>
                       <span className="bg-accent-orange/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/10">
                          {item.faculty}
                       </span>
                    </div>
                  </div>
                  <div className="space-y-2 px-2">
                    <h3 className="text-xl font-display font-bold tracking-tight text-black group-hover:text-accent-orange transition-colors">{item.title}</h3>
                     <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-accent-orange" />
                        <span>{item.location}</span>
                     </div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {item.currentOccupants} / {item.capacity} boarded
                     </div>
                     <div className="flex items-end justify-between pt-4">
                       <p className="text-2xl font-display font-bold text-black">LKR {item.price.toLocaleString()}<span className="text-[10px] font-normal text-gray-400 ml-1">/ mo</span></p>
                       <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-accent-orange transition-colors shadow-lg shadow-black/5">
                          <ChevronDown className="-rotate-90" size={18} />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="map-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-[70vh] rounded-[4rem] overflow-hidden shadow-sm border border-gray-100 bg-gray-50"
            >
              {import.meta.env.VITE_GOOGLE_MAPS_KEY ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${userLocation ? `${userLocation.lat},${userLocation.lng}` : '6.9271,79.8612'}&zoom=14`}
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium">
                  Map unavailable — set VITE_GOOGLE_MAPS_KEY in your environment
                </div>
              )}
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl max-w-sm space-y-4">
                 <div className="flex items-center gap-3 text-accent-orange">
                    <Navigation size={24} fill="currentColor" />
                    <h4 className="font-display font-bold text-xl">Near You</h4>
                 </div>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Displaying boardings within <span className="text-black font-bold">5km</span> of your current location.
                 </p>
                 <div className="pt-2 space-y-3">
                    {filteredProperties.slice(0, 3).map(p => (
                       <div key={p.id} className="flex items-center gap-4 p-3 bg-[#F8F8F8] rounded-2xl">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                             <p className="text-xs font-bold">{p.title}</p>
                             <p className="text-[10px] text-accent-orange font-bold uppercase tracking-widest">{p.price.toLocaleString()} LKR</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </> )}

        {!loading && filteredProperties.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 space-y-6"
          >
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <X size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold">No results found</h3>
                <p className="text-gray-400">Try adjusting your filters to find more boarding options.</p>
             </div>
             <button 
               onClick={() => setFilters({ university: "", faculty: "", minPrice: "", maxPrice: "", gender: [], roomType: [] })}
               className="text-accent-orange text-xs font-bold uppercase tracking-widest border-b border-accent-orange pb-1"
             >
               Reset All Filters
             </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
