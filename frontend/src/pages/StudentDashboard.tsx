import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  Heart, 
  CreditCard, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Clock, 
  Bell, 
  Camera,
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<any>(null);
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [showRawSaved, setShowRawSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${apiBase}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setUserProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${apiBase}/api/payments/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDashboardStats(data);
      } catch { /* ignore */ }
    };
    if (activeTab === 'overview') fetchStats();
  }, [activeTab]);

  useEffect(() => {
    const fetchSaved = async () => {
      setSavedLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSavedListings([]);
          return;
        }

        const res = await fetch(`${apiBase}/api/students/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          // Deduplicate by listing id in case backend has duplicate records
          const map = new Map<string, any>();
          data.forEach((s: any) => {
            const lid = s.listing?._id || s.listing?.id || String(s.listing);
            if (!map.has(lid)) map.set(lid, s);
          });
          setSavedListings(Array.from(map.values()));
        } else {
          setSavedListings([]);
        }
      } catch (err) {
        console.error('Failed to fetch saved listings', err);
        setSavedListings([]);
      } finally {
        setSavedLoading(false);
      }
    };

    if (activeTab === 'saved') fetchSaved();
  }, [activeTab]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${apiBase}/api/payments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const mapped = data.map((b: any) => ({
            id: b._id,
            _id: b._id,
            amount: b.amount,
            paymentStatus: b.paymentStatus || 'unpaid',
            status: b.paymentStatus === 'paid' ? 'Paid' : 'Pending',
            method: b.paymentId ? 'Card' : 'Unpaid',
            date: new Date(b.createdAt).toLocaleDateString(),
            time: new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            listing: b.listing,
          }));
          setPayments(mapped);
          if (sessionStorage.getItem('paymentReturn') === 'true') {
            sessionStorage.removeItem('paymentReturn');
            const justPaid = mapped.find(p => p.paymentStatus === 'paid');
            if (justPaid) {
              setShowPaySuccess(true);
            }
          }
        }
      } catch { /* ignore */ }
    };
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab]);



  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'search', label: 'Search Boarding', icon: <MapPin size={18} /> },
    { id: 'current', label: 'Current Boarding', icon: <HomeIcon size={18} /> },
    { id: 'saved', label: 'Saved Boardings', icon: <Heart size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'profile', label: 'Edit Profile', icon: <UserIcon size={18} /> },
  ];

  const [currentBoarding, setCurrentBoarding] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);
  const [studentNotifications, setStudentNotifications] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({
    totalSpent: "LKR 0",
    unpaidBookings: [],
    currentStays: [],
  });
  const [showPaySuccess, setShowPaySuccess] = useState(false);

  const handlePayBooking = async (bookingId: string) => {
    setPayLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${apiBase}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bookingId,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        sessionStorage.setItem('paymentReturn', 'true');
        window.location.href = data.url;
      } else {
        alert(data.message || 'Failed to create payment');
      }
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  const handleRemoveSaved = async (savedId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${apiBase}/api/students/saved/${savedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedListings(prev => prev.filter(s => s._id !== savedId));
    } catch { /* ignore */ }
  };

  const handleRemindOwner = () => {
    alert("Reminder sent to owner: 'Please update the payment' via WhatsApp and Email.");
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 space-y-4"
        >
          {/* Header Actions for Student */}
          <div className="flex justify-between items-center px-4 mb-2">
             <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dashboard</h2>
             <div className="relative">
                <Link 
                  to="/notifications"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-sm border border-gray-100 hover:text-accent-orange transition-colors relative"
                >
                   <Bell size={18} />
                   <span className="absolute top-0 right-0 w-3 h-3 bg-accent-orange border-2 border-white rounded-full" />
                </Link>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center space-y-4">
             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent-orange shadow-lg">
                <img src="/images/house_white.jpg" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div className="text-center">
                <h3 className="font-display font-bold text-xl">
                  {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Loading..."}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-wrap break-words px-2">
                  {userProfile?.university || "University Student"}
                </p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-50 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'search') {
                    navigate('/search');
                    return;
                  }

                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col justify-between aspect-square">
                     <div className="w-12 h-12 bg-accent-orange/10 rounded-2xl flex items-center justify-center text-accent-orange">
                        <CreditCard size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Spent</p>
                        <h4 className="text-4xl font-display font-bold text-black">{dashboardStats.totalSpent}</h4>
                     </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-black rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between aspect-square text-white">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                        <Clock size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Next Payment</p>
                        <h4 className="text-3xl font-display font-bold">{dashboardStats.unpaidBookings?.[0] ? `LKR ${dashboardStats.unpaidBookings[0].amount?.toLocaleString()}` : '-'}</h4>
                        <p className="text-[10px] text-accent-orange font-bold uppercase tracking-widest">{dashboardStats.unpaidBookings?.[0]?.listingTitle || '-'}</p>
                     </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col justify-between aspect-square">
                     <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <MapPin size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Stay{dashboardStats.currentStays?.length > 1 ? 's' : ''}</p>
                        {dashboardStats.currentStays?.length > 0 ? (
                          <div className="space-y-2 max-h-[140px] overflow-y-auto">
                            {dashboardStats.currentStays.map((stay: any) => (
                              <div key={stay.bookingId} className="border-b border-gray-50 pb-1 last:border-0">
                                <h4 className="font-display font-bold text-sm text-black leading-tight">{stay.title}</h4>
                                <p className="text-[8px] text-gray-400 font-medium truncate">{stay.address || 'Address not set'}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <h4 className="text-xl font-display font-bold text-black">None</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No active stays</p>
                          </>
                        )}
                     </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'current' && (
              <motion.div
                key="current"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {currentBoarding ? (
                  <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 flex flex-col lg:flex-row gap-12 overflow-hidden">
                     <div className="w-full lg:w-1/2 aspect-square rounded-[2.5rem] overflow-hidden shadow-lg">
                        <img src={currentBoarding.image} alt={currentBoarding.title} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 space-y-8 py-4">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <span className="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-[8px] font-bold uppercase tracking-widest">Verified Stay</span>
                              <span className="px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[8px] font-bold uppercase tracking-widest">Active</span>
                           </div>
                           <h2 className="text-4xl font-display font-bold tracking-tight">{currentBoarding.title}</h2>
                           <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                              <MapPin size={16} className="text-accent-orange" />
                              {currentBoarding.location}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-50">
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Owner</p>
                              <p className="font-bold text-black">{currentBoarding.owner}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Rent</p>
                              <p className="font-bold text-black">LKR {currentBoarding.monthlyRent?.toLocaleString() || 0}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Check-in</p>
                              <p className="font-bold text-black">{currentBoarding.startDate}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</p>
                              <p className="font-bold text-black">{currentBoarding.phone}</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button className="flex-1 bg-black text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all">
                              View Full Agreement
                           </button>
                           <button className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                              <Phone size={24} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 text-center py-[100px]">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex flex-col items-center justify-center mx-auto mb-6 text-gray-300">
                        <HomeIcon size={32} />
                      </div>
                      <h3 className="font-display font-bold text-2xl mb-4 text-black">No Current Boarding</h3>
                      <p className="text-gray-500 max-w-sm mx-auto font-medium">You haven't booked any boarding yet. Explore verified listings and find your second home!</p>
                    </motion.div>
                  )}
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {showPaySuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowPaySuccess(false)}
                  >
                    <motion.div
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-md mx-6 text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} className="text-green-600" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-black">Payment Successful!</h3>
                      <p className="text-gray-500 font-medium">Your booking has been confirmed. The owner will be notified.</p>
                      <button
                        onClick={() => setShowPaySuccess(false)}
                        className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
                      >
                        Done
                      </button>
                    </motion.div>
                  </motion.div>
                )}

               <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-2xl font-display font-bold">Payment History</h3>
                  </div>

                  {(dashboardStats.unpaidBookings?.length > 0) && (
                    <div className="mb-10 pb-10 border-b border-gray-50">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Select a booking to pay</p>
                      <div className="space-y-4">
                        {dashboardStats.unpaidBookings.map((ub: any) => (
                          <div key={ub._id} className="flex items-center justify-between p-6 rounded-[2rem] bg-[#FBFBFB] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-50">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <Clock size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-black">{ub.listingTitle}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">LKR {ub.amount?.toLocaleString()} • {ub.listingAddress || 'Address not set'}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePayBooking(ub._id)}
                              disabled={payLoading}
                              className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all disabled:opacity-50"
                            >
                              {payLoading ? 'Redirecting...' : 'Pay Now'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                     {payments.filter(p => p.paymentStatus === 'paid').map((payment) => (
                       <motion.div 
                         variants={itemVariants}
                         key={payment.id} 
                         className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] bg-[#FBFBFB] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all border border-transparent hover:border-gray-50 group"
                       >
                          <div className="flex items-center gap-6 mb-4 md:mb-0">
                             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 text-green-600">
                                <CheckCircle2 size={24} />
                             </div>
                             <div>
                                <h4 className="font-bold text-black">LKR {payment.amount.toLocaleString()}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{payment.date} • {payment.time}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-12">
                             <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Method</p>
                                <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-black">
                                   {payment.method}
                                </span>
                             </div>
                             <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                                <CheckCircle2 size={16} /> Paid
                             </div>
                          </div>
                       </motion.div>
                     ))}
                     {payments.filter(p => p.paymentStatus === 'paid').length === 0 && (
                       <div className="text-center py-10 text-gray-400 font-medium">
                         <p>No payment history yet.</p>
                       </div>
                     )}
                  </div>
               </div>

              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {savedLoading ? (
                  <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 text-center py-[100px]">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <Heart size={32} />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-4 text-black">Loading saved boardings...</h3>
                  </motion.div>
                ) : savedListings.length === 0 ? (
                  <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 text-center py-[100px]">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <Heart size={32} />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-4 text-black">No Saved Boardings</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">You haven't saved any boardings yet.</p>
                  </motion.div>
                ) : (
                  savedListings.map((s) => {
                    const listing = s.listing || {};
                    const lid = listing._id || listing.id || s.listing;
                    return (
                      <motion.div variants={itemVariants} key={s._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50">
                        <div className="flex gap-4 items-center">
                          <div className="w-28 h-20 rounded-[1rem] overflow-hidden bg-gray-100">
                            <img src={listing.images?.[0] || '/images/house_white.jpg'} alt={listing.title || 'Listing'} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{listing.title || 'Untitled Listing'}</h4>
                            <p className="text-sm text-gray-500 mt-2">{listing.location?.address || listing.address || ''}</p>
                            <div className="mt-4 flex gap-3">
                              <Link to={`/boarding/${lid}`} className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold">View</Link>
                              <button onClick={() => handleRemoveSaved(s._id)} className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all">Remove</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                {savedListings.length > 0 && (
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <button onClick={() => setShowRawSaved(v => !v)} className="text-xs font-bold text-accent-orange">
                      {showRawSaved ? 'Hide raw saved data' : 'Show raw saved data'}
                    </button>
                    {showRawSaved && (
                      <pre className="text-xs p-4 bg-black/5 rounded mt-2 overflow-auto max-h-60">{JSON.stringify(savedListings, null, 2)}</pre>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 max-w-3xl">
                   <h3 className="text-2xl font-display font-bold mb-10">Edit Your Profile</h3>
                   <form className="space-y-8">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center sm:flex-row gap-8 pb-10 border-b border-gray-50 mb-10">
                         <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button 
                              type="button"
                              className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-accent-orange transition-colors shadow-lg"
                              onClick={() => document.getElementById('profile-upload')?.click()}
                            >
                               <Camera size={16} />
                            </button>
                            <input type="file" id="profile-upload" className="hidden" accept="image/*" />
                         </div>
                         <div className="space-y-2 text-center sm:text-left">
                            <h4 className="font-bold text-black">Profile Photo</h4>
                            <p className="text-xs text-gray-400 max-w-[200px]">Update your profile picture for better identification in the boarding house.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Full Name</label>
                          <input type="text" value={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : ""} readOnly className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">University</label>
                          <input type="text" value={userProfile?.university || ""} readOnly className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Account Email</label>
                        <input type="email" value={userProfile?.email || ""} readOnly className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                      </div>
                      <div className="pt-6">
                        <button type="button" className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all shadow-lg shadow-black/10">
                          Update Profile Settings
                        </button>
                      </div>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;




