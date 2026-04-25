import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // My Properties State
  const [properties, setProperties] = useState([
    { id: 1, title: 'Greenwood Student Annex', location: 'Gangodawila, Nugegoda', distance: '500m to USJ', price: 12000, rating: 4.5, reviews: 23, verified: true, available: true, tenants: 8, capacity: 10, image: 'https://images.unsplash.com/photo-1522771731470-ea457fbe51f5?q=80&w=600&auto=format&fit=crop' },
    { id: 2, title: 'Nugegoda Ladies Annex', location: 'Nugegoda', distance: '1km to USJ', price: 14000, rating: 4.6, reviews: 31, verified: true, available: true, tenants: 12, capacity: 12, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop' },
    { id: 3, title: 'Campus View Rooms', location: 'Gangodawila', distance: '200m to USJ', price: 15000, rating: 4.1, reviews: 7, verified: false, available: false, tenants: 0, capacity: 6, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop' },
  ]);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Property Form State
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    address: '',
    nearestUniversity: '',
    monthlyFee: '',
    distance: '',
    availability: 'available',
    gender: 'any',
    capacity: '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    accountName: '',
  });
  const [facilities, setFacilities] = useState(new Set());
  const [images, setImages] = useState([]);
  const [submittedProperty, setSubmittedProperty] = useState(false);

  // Tenants State
  const [tenantRequests, setTenantRequests] = useState([
    { id: 1, student: 'Amal Perera', email: 'amal@sjp.ac.lk', phone: '+94 77 111 2222', university: 'Univ. of Sri Jayewardenepura', property: 'Greenwood Student Annex', requestDate: '2026-04-20', avatar: 'AP' },
    { id: 2, student: 'Nethmi Rajapaksha', email: 'nethmi@cmb.ac.lk', phone: '+94 77 333 4444', university: 'Univ. of Colombo', property: 'Nugegoda Ladies Annex', requestDate: '2026-04-18', avatar: 'NR' },
    { id: 3, student: 'Dasun Kumara', email: 'dasun@sjp.ac.lk', phone: '+94 77 555 6666', university: 'Univ. of Sri Jayewardenepura', property: 'Greenwood Student Annex', requestDate: '2026-04-15', avatar: 'DK' },
  ]);
  const CURRENT_TENANTS = [
    { id: 1, student: 'Sachini Fernando', email: 'sachini@sjp.ac.lk', university: 'USJ', property: 'Greenwood Student Annex', since: 'Jan 2026', paid: true, avatar: 'SF' },
    { id: 2, student: 'Kavinda Silva', email: 'kavinda@sjp.ac.lk', university: 'USJ', property: 'Greenwood Student Annex', since: 'Feb 2026', paid: true, avatar: 'KS' },
    { id: 3, student: 'Nimali Jayawardena', email: 'nimali@sjp.ac.lk', university: 'USJ', property: 'Nugegoda Ladies Annex', since: 'Jan 2026', paid: false, avatar: 'NJ' },
    { id: 4, student: 'Tharindu Wickrama', email: 'tharindu@sjp.ac.lk', university: 'USJ', property: 'Greenwood Student Annex', since: 'Mar 2026', paid: true, avatar: 'TW' },
  ];

  // Payments State
  const PAYMENT_LEDGER = [
    { id: 1, student: 'Sachini Fernando', property: 'Greenwood Student Annex', month: 'April 2026', amount: 12000, status: 'Paid', date: '2026-04-03' },
    { id: 2, student: 'Kavinda Silva', property: 'Greenwood Student Annex', month: 'April 2026', amount: 12000, status: 'Paid', date: '2026-04-05' },
    { id: 3, student: 'Nimali Jayawardena', property: 'Nugegoda Ladies Annex', month: 'April 2026', amount: 14000, status: 'Pending', date: '—' },
    { id: 4, student: 'Tharindu Wickrama', property: 'Greenwood Student Annex', month: 'April 2026', amount: 12000, status: 'Paid', date: '2026-04-01' },
  ];

  // Profile State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.name || 'Kamal Silva',
    email: currentUser?.email || 'kamal@unistay.lk',
    phone: '+94 77 234 5678',
    nic: '198712345678',
    address: 'No. 45, Gangodawila, Nugegoda',
    bio: 'Experienced boarding owner managing student accommodations near USJ since 2020. Committed to providing clean, safe, and affordable living spaces.',
  });

  const FACILITIES_OPTIONS = [
    'WiFi', 'Air Conditioning', 'Parking', 'Meals Included', 'Laundry',
    'Study Room', 'Kitchen Access', 'Hot Water', 'CCTV', 'Generator Backup',
  ];
  const UNIVERSITIES = [
    'University of Sri Jayewardenepura', 'University of Colombo',
    'University of Moratuwa', 'University of Kelaniya', 'University of Peradeniya',
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab, isAddingProperty]);

  const navItems = [
    { id: 'properties', label: 'My Properties', icon: 'fas fa-building' },
    { id: 'tenants', label: 'Tenant Requests', icon: 'fas fa-users' },
    { id: 'payments', label: 'Payments Received', icon: 'fas fa-wallet' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
  ];

  const handleOpenAddProperty = (id = null) => {
    setEditingId(id);
    if (id) {
      const p = properties.find(x => x.id === id);
      setPropertyForm({
        title: p.title, description: 'Modern facility near university.', address: p.location, nearestUniversity: 'University of Sri Jayewardenepura',
        monthlyFee: p.price.toString(), distance: '500', availability: p.available ? 'available' : 'full', gender: 'any', capacity: p.capacity.toString(),
        bankName: 'Commercial Bank', bankBranch: 'Nugegoda', accountNumber: '1234567890', accountName: 'Kamal Silva'
      });
      setFacilities(new Set(['WiFi', 'Parking']));
    } else {
      setPropertyForm({
        title: '', description: '', address: '', nearestUniversity: '', monthlyFee: '', distance: '', availability: 'available', gender: 'any', capacity: '',
        bankName: '', bankBranch: '', accountNumber: '', accountName: ''
      });
      setFacilities(new Set());
    }
    setIsAddingProperty(true);
  };

  const renderAddEditProperty = () => {
    if (submittedProperty) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] animate-[fadeIn_0.3s_ease-in-out]">
          <div className="text-center">
            <div className="w-[80px] h-[80px] bg-[#ecfdf5] rounded-full flex items-center justify-center mx-auto mb-[20px]">
              <i className="fas fa-check-circle text-[2.5rem] text-[#10b981]"></i>
            </div>
            <p className="text-[#333] font-bold text-[1.5rem] mb-[10px]">Property {editingId ? 'Updated' : 'Added'} Successfully!</p>
            <p className="text-[#666] text-[1rem]">Redirecting to your properties...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[800px] mx-auto animate-[fadeIn_0.3s_ease-in-out]">
        <div className="flex items-center gap-[15px] mb-[30px]">
          <button onClick={() => setIsAddingProperty(false)} className="text-[#666] hover:text-[#333] transition-colors"><i className="fas fa-arrow-left"></i></button>
          <i className="fas fa-plus-circle text-[2rem] text-[#10b981]"></i>
          <h1 className="text-[1.8rem] font-bold text-[#333]">{editingId ? 'Edit Property' : 'Add New Property'}</h1>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          setSubmittedProperty(true);
          setTimeout(() => {
            setSubmittedProperty(false);
            setIsAddingProperty(false);
          }, 1500);
        }} className="space-y-[30px]">
          
          <div className="bg-white border border-[#eee] rounded-[15px] p-[30px] space-y-[20px] shadow-sm">
            <h2 className="font-bold text-[1.3rem] text-[#333] border-b border-[#eee] pb-[15px]">Property Details</h2>
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Property Title</label>
              <input type="text" value={propertyForm.title} onChange={e => setPropertyForm({...propertyForm, title: e.target.value})} required className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20" />
            </div>
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Description</label>
              <textarea value={propertyForm.description} onChange={e => setPropertyForm({...propertyForm, description: e.target.value})} required rows={4} className="w-full px-[20px] py-[15px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 resize-none" />
            </div>
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Address</label>
              <input type="text" value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} required className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Nearest University</label>
                <select value={propertyForm.nearestUniversity} onChange={e => setPropertyForm({...propertyForm, nearestUniversity: e.target.value})} required className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 appearance-none">
                  <option value="" disabled>Select university</option>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Distance (meters)</label>
                <input type="number" value={propertyForm.distance} onChange={e => setPropertyForm({...propertyForm, distance: e.target.value})} required className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Monthly Fee (Rs.)</label>
                <input type="number" value={propertyForm.monthlyFee} onChange={e => setPropertyForm({...propertyForm, monthlyFee: e.target.value})} required className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20" />
              </div>
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Availability</label>
                <select value={propertyForm.availability} onChange={e => setPropertyForm({...propertyForm, availability: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 appearance-none">
                  <option value="available">Available</option>
                  <option value="full">Currently Full</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Gender</label>
                <select value={propertyForm.gender} onChange={e => setPropertyForm({...propertyForm, gender: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 appearance-none">
                  <option value="any">Any</option>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Total Capacity (beds)</label>
              <input type="number" value={propertyForm.capacity} onChange={e => setPropertyForm({...propertyForm, capacity: e.target.value})} required className="w-full max-w-[200px] px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20" />
            </div>
          </div>

          <div className="bg-white border border-[#eee] rounded-[15px] p-[30px] shadow-sm">
            <h2 className="font-bold text-[1.3rem] text-[#333] border-b border-[#eee] pb-[15px] mb-[20px]">Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[15px]">
              {FACILITIES_OPTIONS.map(f => (
                <label key={f} className={`flex items-center gap-[10px] px-[15px] py-[12px] border rounded-[8px] cursor-pointer transition-all text-[0.9rem] font-medium ${
                  facilities.has(f) ? 'border-[#10b981] bg-[#ecfdf5] text-[#059669]' : 'border-[#ddd] hover:border-[#ccc] text-[#666]'
                }`}>
                  <input type="checkbox" checked={facilities.has(f)} onChange={() => {
                    const next = new Set(facilities);
                    next.has(f) ? next.delete(f) : next.add(f);
                    setFacilities(next);
                  }} className="accent-[#10b981]" />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-[15px] pt-[15px]">
            <button type="submit" className="bg-[#10b981] text-white px-[35px] py-[15px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#059669] transition-colors shadow-md">
              {editingId ? 'Save Changes' : 'Add Property'}
            </button>
            <button type="button" onClick={() => setIsAddingProperty(false)} className="bg-white border border-[#ddd] text-[#666] px-[35px] py-[15px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#f9f9f9] transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    );
  };

  const renderProperties = () => (
    <div className="bg-transparent animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex items-center justify-between mb-[30px] bg-white p-[20px_25px] rounded-[10px] shadow-sm border border-[#eee]">
        <div className="flex items-center gap-[15px]">
          <i className="fas fa-building text-[1.8rem] text-[#10b981]"></i>
          <h1 className="text-[1.6rem] font-bold text-[#333]">My Properties</h1>
          <span className="text-[0.75rem] bg-[#f9f9f9] border border-[#ddd] text-[#666] px-[12px] py-[4px] rounded-full font-bold">{properties.length} listings</span>
        </div>
        <button onClick={() => handleOpenAddProperty()} className="bg-[#10b981] text-white px-[20px] py-[10px] text-[0.8rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#059669] transition-colors shadow-sm flex items-center gap-[8px]">
          <i className="fas fa-plus"></i> Add Property
        </button>
      </div>

      <div className="space-y-[20px]">
        {properties.map(p => (
          <div key={p.id} className="bg-white border border-[#eee] rounded-[10px] overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
            <div className="sm:w-[260px] h-[200px] sm:h-auto flex-shrink-0 relative">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              {p.verified && (
                <div className="absolute top-[15px] left-[15px] bg-white/95 backdrop-blur-sm px-[10px] py-[5px] flex items-center gap-[5px] rounded-[6px] shadow-sm">
                  <i className="fas fa-shield-alt text-[#4caf50] text-[0.8rem]"></i>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#333]">Verified</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-[25px] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-[5px]">
                  <h3 className="font-bold text-[1.4rem] text-[#333]">{p.title}</h3>
                  <div className="flex items-center gap-[5px] text-[0.85rem] text-[#666] font-bold">
                    <i className="fas fa-star text-[#ffc107]"></i>{p.rating} ({p.reviews})
                  </div>
                </div>
                <p className="text-[0.85rem] text-[#666] flex items-center gap-[5px] mb-[10px] font-medium"><i className="fas fa-map-marker-alt text-[#10b981]"></i>{p.location} • {p.distance}</p>
                <p className="text-[#10b981] font-bold text-[1.1rem]">Rs. {p.price.toLocaleString()} <span className="text-[#888] font-medium text-[0.85rem]">/ mo</span></p>
              </div>

              <div className="flex items-center justify-between mt-[20px] pt-[15px] border-t border-[#f0f0f0]">
                <div className="flex items-center gap-[20px] text-[0.85rem] text-[#666]">
                  <span>Tenants: <strong className="text-[#333]">{p.tenants}/{p.capacity}</strong></span>
                  <button onClick={() => {
                    setProperties(prev => prev.map(item => item.id === p.id ? { ...item, available: !item.available } : item));
                  }} className="flex items-center gap-[8px] font-bold">
                    {p.available ? (
                      <><i className="fas fa-toggle-on text-[1.4rem] text-[#10b981]"></i><span className="text-[#10b981]">Available</span></>
                    ) : (
                      <><i className="fas fa-toggle-off text-[1.4rem] text-[#ccc]"></i><span className="text-[#888]">Unavailable</span></>
                    )}
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button onClick={() => handleOpenAddProperty(p.id)} className="flex items-center gap-[8px] text-[0.85rem] font-bold text-[#555] hover:text-[#10b981] px-[15px] py-[8px] border border-[#ddd] rounded-[6px] hover:border-[#10b981] transition-colors">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <Link to={`/search`} className="flex items-center gap-[8px] text-[0.85rem] font-bold text-[#555] hover:text-[#0ea5e9] px-[15px] py-[8px] border border-[#ddd] rounded-[6px] hover:border-[#0ea5e9] transition-colors">
                    <i className="fas fa-eye"></i> View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTenants = () => (
    <div className="bg-transparent animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex items-center gap-[15px] mb-[30px] bg-white p-[20px_25px] rounded-[10px] shadow-sm border border-[#eee]">
        <i className="fas fa-users text-[1.8rem] text-[#10b981]"></i>
        <h1 className="text-[1.6rem] font-bold text-[#333]">Tenant Management</h1>
      </div>

      <div className="mb-[40px]">
        <h2 className="font-bold text-[1.3rem] text-[#333] mb-[15px] flex items-center gap-[10px]">
          Pending Booking Requests
          {tenantRequests.length > 0 && (
            <span className="text-[0.65rem] bg-[#fff8e1] text-[#f57f17] px-[10px] py-[3px] rounded-full font-bold uppercase tracking-widest">{tenantRequests.length} New</span>
          )}
        </h2>

        {tenantRequests.length === 0 ? (
          <div className="bg-white border border-[#eee] rounded-[10px] p-[40px] text-center shadow-sm">
            <i className="fas fa-check-circle text-[3rem] text-[#ddd] mb-[15px]"></i>
            <p className="text-[#888] font-medium text-[1rem]">No pending requests</p>
          </div>
        ) : (
          <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9f9f9] border-b border-[#eee]">
                    <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Student</th>
                    <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Contact</th>
                    <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Property</th>
                    <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Date</th>
                    <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantRequests.map(r => (
                    <tr key={r.id} className="border-b border-[#eee] last:border-none hover:bg-[#f9f9f9] transition-colors">
                      <td className="p-[15px_20px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[35px] h-[35px] rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] font-bold text-[0.8rem]">{r.avatar}</div>
                          <div>
                            <p className="font-bold text-[#333] text-[0.9rem]">{r.student}</p>
                            <p className="text-[0.75rem] text-[#888] flex items-center gap-[5px] mt-[2px]"><i className="fas fa-graduation-cap"></i>{r.university}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-[15px_20px]">
                        <p className="text-[0.8rem] text-[#666] flex items-center gap-[5px] mb-[2px] font-medium"><i className="fas fa-envelope text-[#aaa]"></i>{r.email}</p>
                        <p className="text-[0.8rem] text-[#666] flex items-center gap-[5px] font-medium"><i className="fas fa-phone text-[#aaa]"></i>{r.phone}</p>
                      </td>
                      <td className="p-[15px_20px]">
                        <p className="text-[0.85rem] text-[#333] font-medium flex items-center gap-[5px]"><i className="fas fa-map-marker-alt text-[#aaa]"></i>{r.property}</p>
                      </td>
                      <td className="p-[15px_20px] text-[0.8rem] text-[#888] font-medium">{r.requestDate}</td>
                      <td className="p-[15px_20px]">
                        <div className="flex items-center justify-end gap-[10px]">
                          <button onClick={() => setTenantRequests(prev => prev.filter(x => x.id !== r.id))} className="flex items-center gap-[5px] px-[12px] py-[6px] bg-[#ecfdf5] text-[#10b981] rounded-[6px] text-[0.75rem] font-bold hover:bg-[#d1fae5] transition-colors">
                            <i className="fas fa-check"></i> Accept
                          </button>
                          <button onClick={() => setTenantRequests(prev => prev.filter(x => x.id !== r.id))} className="flex items-center gap-[5px] px-[12px] py-[6px] bg-[#fef2f2] text-[#ef4444] rounded-[6px] text-[0.75rem] font-bold hover:bg-[#fee2e2] transition-colors">
                            <i className="fas fa-times"></i> Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-[1.3rem] text-[#333] mb-[15px]">Current Tenants</h2>
        <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#eee]">
                  <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Tenant</th>
                  <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Property</th>
                  <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Since</th>
                  <th className="p-[15px_20px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">This Month</th>
                </tr>
              </thead>
              <tbody>
                {CURRENT_TENANTS.map(t => (
                  <tr key={t.id} className="border-b border-[#eee] last:border-none hover:bg-[#f9f9f9] transition-colors">
                    <td className="p-[15px_20px]">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[35px] h-[35px] rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#666] font-bold text-[0.8rem]">{t.avatar}</div>
                        <div>
                          <p className="font-bold text-[#333] text-[0.9rem]">{t.student}</p>
                          <p className="text-[0.75rem] text-[#888] font-medium">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-[15px_20px] text-[0.85rem] text-[#555] font-medium flex items-center gap-[5px]">
                      <i className="fas fa-map-marker-alt text-[#aaa]"></i>{t.property}
                    </td>
                    <td className="p-[15px_20px] text-[0.8rem] text-[#888] font-medium">{t.since}</td>
                    <td className="p-[15px_20px]">
                      <span className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[6px] text-[0.75rem] font-bold uppercase tracking-wider ${t.paid ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffebee] text-[#c62828]'}`}>
                        <i className={t.paid ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
                        {t.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-transparent animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex items-center justify-between mb-[30px] bg-white p-[20px_25px] rounded-[10px] shadow-sm border border-[#eee]">
        <div className="flex items-center gap-[15px]">
          <i className="fas fa-wallet text-[1.8rem] text-[#10b981]"></i>
          <h1 className="text-[1.6rem] font-bold text-[#333]">Payments Received</h1>
        </div>
        <button className="flex items-center gap-[8px] px-[15px] py-[8px] border border-[#ddd] rounded-[8px] text-[0.8rem] text-[#555] hover:border-[#10b981] hover:text-[#10b981] transition-colors font-bold shadow-sm bg-[#f9f9f9]">
          <i className="fas fa-download"></i> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] mb-[30px]">
        <div className="bg-white border border-[#eee] rounded-[10px] p-[25px] shadow-sm">
          <p className="text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Total Received</p>
          <p className="text-[1.8rem] font-bold text-[#10b981]">Rs. 84,000</p>
        </div>
        <div className="bg-white border border-[#eee] rounded-[10px] p-[25px] shadow-sm">
          <p className="text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Pending</p>
          <p className="text-[1.8rem] font-bold text-[#f57f17]">Rs. 14,000</p>
        </div>
        <div className="bg-white border border-[#eee] rounded-[10px] p-[25px] shadow-sm">
          <p className="text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">This Month</p>
          <p className="text-[1.8rem] font-bold text-[#333]">3/4 <span className="text-[0.9rem] text-[#888] font-medium">collected</span></p>
        </div>
      </div>

      <div className="bg-white border border-[#eee] rounded-[10px] overflow-hidden shadow-sm">
        <div className="p-[20px_25px] border-b border-[#eee] bg-[#fcfcfc]">
          <h2 className="font-bold text-[1.2rem] text-[#333]">Payment Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#eee]">
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Student</th>
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Property</th>
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Month</th>
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Amount</th>
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Date</th>
                <th className="p-[15px_25px] text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_LEDGER.map(p => (
                <tr key={p.id} className="border-b border-[#eee] last:border-none hover:bg-[#f9f9f9] transition-colors">
                  <td className="p-[15px_25px] font-bold text-[#333] text-[0.9rem]">{p.student}</td>
                  <td className="p-[15px_25px] text-[0.85rem] text-[#666] font-medium">{p.property}</td>
                  <td className="p-[15px_25px] text-[0.85rem] text-[#666] font-medium">{p.month}</td>
                  <td className="p-[15px_25px] font-bold text-[#333] text-[0.95rem]">Rs. {p.amount.toLocaleString()}</td>
                  <td className="p-[15px_25px] text-[0.8rem] text-[#888] font-medium">{p.date}</td>
                  <td className="p-[15px_25px]">
                    <span className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[6px] text-[0.75rem] font-bold uppercase tracking-wider ${
                      p.status === 'Paid' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff8e1] text-[#f57f17]'
                    }`}>
                      <i className={p.status === 'Paid' ? "fas fa-check-circle" : "fas fa-clock"}></i>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-[15px] p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-[#eee] max-w-[800px] mx-auto animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex items-center gap-[15px] mb-[40px] pb-[20px] border-b border-[#eee]">
        <i className="fas fa-user-circle text-[2rem] text-[#10b981]"></i>
        <h1 className="text-[1.8rem] font-bold text-[#333]">Owner Profile</h1>
      </div>

      <div className="flex items-center gap-[25px] mb-[40px] bg-[#fcfcfc] p-[20px] rounded-[10px] border border-[#f0f0f0]">
        <div className="relative">
          <div className="w-[100px] h-[100px] rounded-full bg-[#ecfdf5] border-[4px] border-white shadow-md flex items-center justify-center text-[#10b981] font-bold text-[2.5rem]">
            {profileForm.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <button className="absolute bottom-[0] right-[0] w-[32px] h-[32px] bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#059669] transition-colors border-[2px] border-white cursor-pointer">
            <i className="fas fa-camera text-[0.8rem]"></i>
          </button>
        </div>
        <div>
          <p className="font-bold text-[1.6rem] text-[#333] mb-[5px]">{profileForm.fullName}</p>
          <p className="text-[0.9rem] text-[#666] font-medium bg-[#f0f0f0] px-[12px] py-[4px] rounded-full inline-flex">
            Boarding Owner • Member since 2023
          </p>
        </div>
      </div>

      <form className="space-y-[25px]" onSubmit={(e) => { e.preventDefault(); alert('Profile saved successfully!'); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Full Name</label>
            <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 transition-all" />
          </div>
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">NIC</label>
            <input type="text" value={profileForm.nic} readOnly className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f0f0f0] text-[#666] font-medium rounded-[8px] cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Email Address</label>
          <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 transition-all" />
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Phone Number</label>
          <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 transition-all" />
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Address</label>
          <input type="text" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 transition-all" />
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Professional Bio</label>
          <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} rows={4} className="w-full px-[20px] py-[15px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#10b981] focus:ring-[2px] focus:ring-[#10b981]/20 transition-all resize-none" />
        </div>
        <div className="pt-[15px] border-t border-[#eee]">
          <button type="submit" className="bg-[#1e1b2e] text-white px-[35px] py-[15px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#111] transition-colors shadow-md flex items-center justify-center gap-[10px]">
            <i className="fas fa-save"></i> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#f5f7fa]">
        <div className="text-center bg-white p-[50px] rounded-[15px] shadow-sm">
          <h2 className="text-[2rem] text-[#333] font-bold mb-[20px]">Access Denied</h2>
          <p className="text-[#666] mb-[30px]">Please log in as an owner to view this dashboard.</p>
          <Link to="/login" className="bg-[#10b981] text-white px-[30px] py-[12px] rounded-[8px] font-bold hover:bg-[#059669] transition-all inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

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
      <div className={`w-[280px] bg-[#1a1f2e] text-white flex flex-col fixed h-[calc(100vh-80px)] top-[80px] transition-all duration-300 z-[40] ${isSidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}>
        <div className="p-[25px] border-b border-white/10 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-[15px]">
            <div className="w-[45px] h-[45px] bg-[rgba(16,185,129,0.2)] rounded-full flex items-center justify-center text-[#10b981] font-bold text-[1.2rem] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {currentUser?.name?.charAt(0) || 'K'}
            </div>
            <div>
              <div className="font-bold text-white text-[1rem] tracking-wide">{currentUser?.name || 'Kamal Silva'}</div>
              <div className="text-[0.75rem] text-[#10b981] font-semibold uppercase tracking-wider mt-[2px]">Boarding Owner</div>
            </div>
          </div>
          <button className="lg:hidden text-gray-400 w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-white/10" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[8px]">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsAddingProperty(false); setIsSidebarOpen(false); }}
              className={`flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold transition-all ${(!isAddingProperty && activeTab === item.id) ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] translate-x-[5px] border-l-[3px] border-[#10b981]' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'}`}
            >
              <i className={`${item.icon} w-[24px] text-center text-[1.1rem]`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-[20px] border-t border-white/10">
          <Link to="/login" className="flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold text-[#ef4444] hover:bg-red-500/10 transition-colors">
            <i className="fas fa-sign-out-alt w-[24px] text-center text-[1.1rem]"></i>
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content wrapper */}
      <div className="flex-1 lg:ml-[280px] w-full min-h-full flex flex-col overflow-x-hidden relative">
        {/* Mobile header */}
        <div className="lg:hidden bg-white p-[15px_20px] flex items-center gap-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px] z-[20]">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#10b981] text-[1.3rem] w-[40px] h-[40px] rounded-[8px] bg-[#ecfdf5] flex items-center justify-center">
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="font-bold text-[#1e1b2e] text-[1.2rem] font-poppins">
            {isAddingProperty ? (editingId ? 'Edit Property' : 'Add Property') : navItems.find(i => i.id === activeTab)?.label}
          </h2>
        </div>

        {/* Tab Contents */}
        <div className="p-[20px] md:p-[40px] flex-1 max-w-[1200px] w-full mx-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
               <div className="w-[50px] h-[50px] border-[5px] border-[#ecfdf5] border-t-[#10b981] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'properties' && (isAddingProperty ? renderAddEditProperty() : renderProperties())}
              {activeTab === 'tenants' && !isAddingProperty && renderTenants()}
              {activeTab === 'payments' && !isAddingProperty && renderPayments()}
              {activeTab === 'profile' && !isAddingProperty && renderProfile()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
