import React, { useState, useEffect, useRef } from 'react';
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

    const amenityList = (Array.isArray(b.amenities) ? b.amenities : []).map((a: any) => typeof a === 'string' ? a.toLowerCase() : '');

    if (filters.university && !amenityList.some((a: string) => a.includes(filters.university.toLowerCase()))) return false;

    if (filters.gender) {
      const genderMap: Record<string, string> = { male: 'male only', female: 'female only', mixed: 'mixed' };
      const searchFor = genderMap[filters.gender] || filters.gender;
      if (!amenityList.some((a: string) => a.includes(searchFor))) return false;
    }

    if (filters.roomType && !amenityList.some((a: string) => a.includes(filters.roomType.toLowerCase()))) return false;

    if (filters.minPrice && (b.price || 0) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && (b.price || 0) > Number(filters.maxPrice)) return false;
    return true;
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  const SelectDropdown = ({ field, label, options }: { field: string; label: string; options: { value: string; label: string }[] }) => {
    const value = (filters as any)[field] || '';
    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === field ? null : field)}
          className="w-full bg-gray-50 rounded-full px-4 py-3 text-xs font-bold outline-none border border-transparent focus:border-accent-orange transition-all flex items-center justify-between gap-2 hover:border-gray-200"
        >
          <span className={value ? 'text-black' : 'text-gray-400'}>{value ? options.find(o => o.value === value)?.label || value : label}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === field ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {openDropdown === field && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute left-0 top-full mt-1 w-full min-w-[180px] bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-1.5">
                <button
                  onClick={() => { setFilters((f: any) => ({ ...f, [field]: '' })); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${!value ? 'bg-gray-50 text-black' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
                >
                  {label}
                </button>
                {options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilters((f: any) => ({ ...f, [field]: opt.value })); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${value === opt.value ? 'bg-accent-orange/10 text-accent-orange' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

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
            className=""
          >
            <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm space-y-4" ref={dropdownRef}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <SelectDropdown
                  field="university"
                  label="All Universities"
                  options={universities.map(u => ({ value: u, label: u.split(' ').pop() || u }))}
                />
                <SelectDropdown
                  field="gender"
                  label="Any Gender"
                  options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'mixed', label: 'Mixed' }]}
                />
                <SelectDropdown
                  field="roomType"
                  label="Any Room"
                  options={[{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double' }]}
                />
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
