import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, X, ChevronDown } from 'lucide-react';

const universities = ["University of Colombo", "University of Peradeniya", "University of Moratuwa", "University of Kelaniya", "University of Sri Jayewardenepura"];
const faculties = ["Computing", "Technology", "Engineering", "Medicine", "Science", "Arts", "Law", "Management"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SearchBoardings = () => {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [boardings, setBoardings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    university: '',
    faculty: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    roomType: '',
  });

  useEffect(() => {
    fetchBoardings();
  }, []);

  const fetchBoardings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/boardings`);
      const data = await res.json();
      setBoardings(Array.isArray(data) ? data : data?.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const filtered = boardings.filter((b: any) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const title = (b.title || b.name || '').toLowerCase();
      const addr = (b.location?.address || b.address || '').toLowerCase();
      const desc = (b.description || '').toLowerCase();
      if (!title.includes(q) && !addr.includes(q) && !desc.includes(q)) return false;
    }
    if (filters.university) {
      const amenities = b.amenities || b.features || [];
      const uniAmenity = (Array.isArray(amenities) ? amenities : []).find((a: any) =>
        typeof a === 'string' ? a.toLowerCase().includes(filters.university.toLowerCase()) : false
      );
      if (!uniAmenity) return false;
    }
    if (filters.gender && b.gender?.toLowerCase() !== filters.gender) return false;
    if (filters.roomType && b.type?.toLowerCase() !== filters.roomType) return false;
    if (filters.minPrice && (b.price || 0) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && (b.price || 0) > Number(filters.maxPrice)) return false;
    return true;
  });

  const clearFilters = () => setFilters({ university: '', faculty: '', minPrice: '', maxPrice: '', gender: '', roomType: '' });
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search boardings by name, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-full pl-12 pr-6 py-4 text-sm outline-none focus:border-accent-orange transition-all shadow-sm"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'}`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-accent-orange text-white rounded-full text-[10px] flex items-center justify-center">{activeFilterCount}</span>
          )}
        </motion.button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="relative">
                  <select value={filters.university} onChange={e => setFilters(f => ({ ...f, university: e.target.value }))} className="w-full bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all appearance-none cursor-pointer">
                    <option value="">All Universities</option>
                    {universities.map(u => <option key={u} value={u}>{u.split(' ').pop()}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
                <div className="relative">
                  <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} className="w-full bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all appearance-none cursor-pointer">
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="mixed">Mixed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
                <div className="relative">
                  <select value={filters.roomType} onChange={e => setFilters(f => ({ ...f, roomType: e.target.value }))} className="w-full bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all appearance-none cursor-pointer">
                    <option value="">Any Room</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
                <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} className="bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all" />
                <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className="bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all" />
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-accent-orange hover:text-black transition-colors flex items-center gap-1">
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          {loading ? 'Searching...' : `${filtered.length} boarding${filtered.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-[2rem] h-72 animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-gray-400 font-bold text-sm">No boardings match your search</p>
          <button onClick={clearFilters} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-accent-orange hover:text-black transition-colors">
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b: any, i: number) => {
            const id = b._id || b.id;
            const title = b.title || b.name || 'Boarding';
            const location = b.location?.address || b.address || '';
            const img = b.images?.[0] || b.image || '/images/house_white.png';
            return (
              <Link key={id || i} to={`/boarding/${id}`}>
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-md transition-all group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-black">{title}</h3>
                      <span className="text-accent-orange font-bold text-sm">LKR {b.price?.toLocaleString()}</span>
                    </div>
                    {location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> {location}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {b.gender && <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-gray-50 text-gray-500">{b.gender}</span>}
                      {b.type && <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-gray-50 text-gray-500">{b.type}</span>}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default SearchBoardings;
