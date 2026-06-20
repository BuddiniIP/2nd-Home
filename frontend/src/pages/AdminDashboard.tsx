import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  UserX, 
  TrendingUp, 
  BarChart3, 
  Search,
  MessageSquare,
  AlertOctagon,
  Bell,
  CreditCard,
  Users as UsersIcon,
  LayoutDashboard,
  Mail,
  UserCheck,
  MapPin,
  Clock,
  ClipboardList,
  X,
   Plus,
   Eye,
   Edit3,
   Image as ImageIcon
} from 'lucide-react';

const AdminDashboard = () => {
   const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [boardingReports, setBoardingReports] = useState<any[]>([]);
   const [boardings, setBoardings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [verifiers, setVerifiers] = useState<any[]>([]);

  const [filterUni, setFilterUni] = useState('All');
  const [assignmentModal, setAssignmentModal] = useState<any>(null);
   const [selectedBoarding, setSelectedBoarding] = useState<any>(null);
   const [boardingEditor, setBoardingEditor] = useState<any>(null);
   const [boardingImages, setBoardingImages] = useState<File[]>([]);
   const [existingImagePaths, setExistingImagePaths] = useState<string[]>([]);
   const [isSavingBoarding, setIsSavingBoarding] = useState(false);
   const [boardingActionError, setBoardingActionError] = useState('');

  const UNIVERSITIES = [
    'University of Colombo',
    'University of Sri Jayewardenepura',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Peradeniya'
  ];

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetchBoardingReports();
      fetchBoardings();
    fetchStats();
      fetchUsers();
    fetchPayments();
    fetchMessages();
  }, []);

   const getAdminHeaders = () => {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
   };

   const normalizeBoardingImage = (imagePath: string) => {
      if (!imagePath) return '/images/house_orange.jpg';
      return imagePath.startsWith('http') ? imagePath : `${apiBase}${imagePath}`;
   };

   const handleBoardingImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setBoardingImages(files);
   };

   const uploadBoardingImages = async (token: string) => {
      if (!boardingImages.length) {
         return [];
      }

      const formData = new FormData();
      boardingImages.forEach((file) => formData.append('images', file));

      const response = await fetch(`${apiBase}/api/boardings/upload-images`, {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}` },
         body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Failed to upload images');
      }

      return Array.isArray(data.images) ? data.images : [];
   };

   const mapBoarding = (boarding: any) => ({
      id: boarding.id,
      title: boarding.title,
      description: boarding.description,
      price: Number(boarding.price || 0),
      address: boarding.location?.address || boarding.address || 'Unknown location',
      images: Array.isArray(boarding.images) ? boarding.images : [],
      imageCount: Array.isArray(boarding.images) ? boarding.images.length : 0,
      owner: boarding.owner?.name || boarding.owner?.email || 'Unknown owner',
      ownerEmail: boarding.owner?.email || '',
      capacity: Number(boarding.capacity || 0),
      isAvailable: Boolean(boarding.isAvailable),
      amenities: Array.isArray(boarding.amenities) ? boarding.amenities : [],
      raw: boarding,
   });

   const fetchBoardings = async () => {
      try {
         const response = await fetch(`${apiBase}/api/admin/boardings`, {
            headers: getAdminHeaders(),
         });
         const data = await response.json();
         const items = Array.isArray(data.data) ? data.data : [];
         setBoardings(items.map(mapBoarding));
      } catch (error) {
         console.error('Error fetching boardings:', error);
      }
   };

  const fetchStats = async () => {
    try {
         const response = await fetch(`${apiBase}/api/admin/stats`, {
            headers: getAdminHeaders(),
         });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

   const fetchUsers = async () => {
      try {
         const response = await fetch(`${apiBase}/api/admin/users`, {
            headers: getAdminHeaders(),
         });
         const data = await response.json();
         const items = Array.isArray(data) ? data : [];

         setUsers(items);
         setVerifiers(
            items
               .filter((user: any) => user.role === 'verifier')
               .map((user: any) => ({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  university: user.university,
                  status: user.status,
                  tasks: 0,
               }))
         );
      } catch (error) {
         console.error('Error fetching users:', error);
      }
   };

  const fetchPayments = async () => {
    try {
         const response = await fetch(`${apiBase}/api/admin/payments`, {
            headers: getAdminHeaders(),
         });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchMessages = async () => {
    try {
         const response = await fetch(`${apiBase}/api/admin/messages`, {
            headers: getAdminHeaders(),
         });
      const json = await response.json();
      setMessages(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchBoardingReports = async () => {
    try {
         const response = await fetch(`${apiBase}/api/admin/reports`, {
            headers: getAdminHeaders(),
         });
      const json = await response.json();
      const items = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      setBoardingReports(items);
    } catch (error) {
      console.error("Error fetching boarding reports:", error);
    }
  };

   const openBoardingDetails = (boarding: any) => {
      setSelectedBoarding(boarding);
   };

   const openBoardingEditor = (boarding: any) => {
      setBoardingActionError('');
      setSelectedBoarding(null);
      setExistingImagePaths(boarding.images || []);
      setBoardingImages([]);
      setBoardingEditor({
         id: boarding.id,
         title: boarding.title,
         description: boarding.description,
         address: boarding.address,
         price: String(boarding.price),
         capacity: String(boarding.capacity),
         isAvailable: boarding.isAvailable,
         amenitiesText: boarding.amenities.join(', '),
         images: boarding.images,
      });
   };

   const handleBoardingDelete = async (boardingId: string) => {
      const token = localStorage.getItem('token');
      if (!token) {
         alert('Please log in again as admin to perform this action.');
         return;
      }

      const confirmed = window.confirm('Delete this boarding listing? This cannot be undone.');
      if (!confirmed) return;

      try {
         const response = await fetch(`${apiBase}/api/boardings/${boardingId}`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to delete boarding.');
         }

         setSelectedBoarding(null);
         await fetchBoardings();
      } catch (error: any) {
         alert(error?.message || 'Failed to delete boarding.');
      }
   };

   const handleBoardingSave = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!boardingEditor) return;

      const token = localStorage.getItem('token');
      if (!token) {
         setBoardingActionError('Please log in again as admin to save changes.');
         return;
      }

      setIsSavingBoarding(true);
      setBoardingActionError('');

      try {
         const uploadedImages = boardingImages.length ? await uploadBoardingImages(token) : existingImagePaths;

         const response = await fetch(`${apiBase}/api/boardings/${boardingEditor.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               title: boardingEditor.title.trim(),
               description: boardingEditor.description.trim(),
               address: boardingEditor.address.trim(),
               price: Number(boardingEditor.price),
               capacity: Number(boardingEditor.capacity),
               isAvailable: Boolean(boardingEditor.isAvailable),
                  images: uploadedImages,
               amenities: String(boardingEditor.amenitiesText || '')
                  .split(',')
                  .map((item: string) => item.trim())
                  .filter(Boolean),
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || 'Failed to update boarding.');
         }

         setBoardingEditor(null);
         setExistingImagePaths([]);
         setBoardingImages([]);
         await fetchBoardings();
         setSelectedBoarding(null);
      } catch (error: any) {
         setBoardingActionError(error?.message || 'Failed to update boarding.');
      } finally {
         setIsSavingBoarding(false);
      }
   };

   const filteredBoardings = boardings.filter((boarding) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      return [boarding.title, boarding.address, boarding.owner, boarding.description]
         .filter(Boolean)
         .some((value) => String(value).toLowerCase().includes(query));
   });

  const statsCards = stats ? [
    { label: "Total Students", value: stats.summary.studentCount.toLocaleString(), icon: <UsersIcon size={20} />, color: "bg-blue-500" },
    { label: "Total Owners", value: stats.summary.ownerCount.toLocaleString(), icon: <Shield size={20} />, color: "bg-indigo-500" },
    { label: "Active Boardings", value: stats.summary.activeBoardings.toString(), icon: <LayoutDashboard size={20} />, color: "bg-accent-orange" },
    { label: "Monthly Revenue", value: `LKR ${stats.summary.monthlyRevenue.toLocaleString()}`, icon: <CreditCard size={20} />, color: "bg-green-500" },
  ] : [];

  const handleAction = (id: number, action: 'keep' | 'remove' | 'warn') => {
    let message = "";
    if (action === 'keep') message = "Report dismissed. Review will remain.";
    if (action === 'remove') message = "Review has been removed from the platform.";
    if (action === 'warn') message = "Warning issued to the student. Review remains under monitoring.";
    
    alert(message);
    setReports(reports.filter(r => r.id !== id));
  };

  const handleBoardingAction = async (id: number, action: 'warn' | 'remove') => {
    try {
      let url = `${apiBase}/api/reports/admin/reports/${id}`;
      let body: any = {};
      
      if (action === 'warn') {
        body = { status: 'resolved', actionTaken: 'warned' };
      } else if (action === 'remove') {
        body = { status: 'resolved', actionTaken: 'boarding_removed' };
      }

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        alert(`Report ${action === 'warn' ? 'warning issued' : 'action completed'}`);
        fetchBoardingReports(); // Refresh the list
      } else {
        alert("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent-orange">
                 <Shield size={24} />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Central Moderation</span>
              </div>
              <h1 className="text-5xl font-display font-bold text-black tracking-tight">Admin Console</h1>
              <p className="text-gray-400 text-sm">Review platform activity and resolve disputes.</p>
           </div>
           
           <div className="flex flex-col xl:flex-row items-center gap-6">
               <div className="relative">
                 <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-accent-orange transition-all">
                    <Bell size={24} />
                 </button>
                  {(boardingReports.length > 0 || messages.some((m: any) => !m.isRead)) && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
               </div>
               
                        <div className="flex bg-white p-2 rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                           {['analytics', 'boardings', 'users', 'verifiers', 'boarding-reports', 'payments', 'messages'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
                    >
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
               </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {statsCards.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-6">
                 <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center`}>
                    {stat.icon}
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h4 className="text-2xl font-display font-bold">{stat.value}</h4>
                 </div>
              </div>
           ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 min-h-[500px]">
           <AnimatePresence mode="wait">
              {activeTab === 'analytics' && stats && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                   <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-display font-bold">Platform Growth</h3>
                        <p className="text-gray-400 text-sm">Monthly user acquisition and revenue trends.</p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-accent-orange rounded-full"></span> Users
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-black rounded-full"></span> Revenue
                         </div>
                      </div>
                   </div>

                   {/* SVG Growth Graph */}
                   <div className="relative h-80 w-full bg-gray-50 rounded-[2.5rem] p-8 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                         <path d={`M 0 300 ${(stats?.growthData || []).map((d: any, i: number) => `L ${i * 250} ${300 - (d.users / 1500) * 300}`).join(' ')} L 1000 300 Z`} fill="url(#gradient-users)" className="opacity-20" />
                         <path d={`M 0 ${300 - ((stats?.growthData?.[0]?.users || 0) / 1500) * 300} ${(stats?.growthData || []).map((d: any, i: number) => `L ${i * 250} ${300 - (d.users / 1500) * 300}`).join(' ')}`} fill="none" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                         <path d={`M 0 300 ${(stats?.growthData || []).map((d: any, i: number) => `L ${i * 250} ${300 - (d.revenue / 600000) * 300}`).join(' ')} L 1000 300 Z`} fill="url(#gradient-revenue)" className="opacity-10" />
                         <path d={`M 0 ${300 - ((stats?.growthData?.[0]?.revenue || 0) / 600000) * 300} ${(stats?.growthData || []).map((d: any, i: number) => `L ${i * 250} ${300 - (d.revenue / 600000) * 300}`).join(' ')}`} fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                         <defs>
                           <linearGradient id="gradient-users" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6B00" /><stop offset="100%" stopColor="#FF6B00" stopOpacity="0" /></linearGradient>
                           <linearGradient id="gradient-revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#000000" /><stop offset="100%" stopColor="#000000" stopOpacity="0" /></linearGradient>
                         </defs>
                      </svg>
                      <div className="flex justify-between mt-6 px-2">
                         {(stats?.growthData || []).map((d: any, i: number) => (
                           <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.month}</div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="p-8 bg-black text-white rounded-[2.5rem] shadow-xl flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Platform Users</p>
                            <h4 className="text-2xl font-display font-bold">{(stats?.summary?.totalUsers || 0).toLocaleString()}</h4>
                         </div>
                         <UsersIcon size={32} className="text-accent-orange" />
                      </div>
                      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                         <div className="space-y-1">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Rate</p>
                             <h4 className="text-2xl font-display font-bold text-green-500">--</h4>
                         </div>
                         <TrendingUp size={32} className="text-green-500" />
                      </div>
                      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                         <div className="space-y-1">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Reach</p>
                             <h4 className="text-2xl font-display font-bold text-black">--</h4>
                         </div>
                         <BarChart3 size={32} className="text-black" />
                      </div>
                   </div>
                </motion.div>
              )}

                     {activeTab === 'boardings' && (
                        <motion.div
                           key="boardings"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           className="space-y-8"
                        >
                            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-8 border-b border-gray-50">
                                 <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-orange">Boarding moderation</p>
                                    <h3 className="text-3xl font-display font-bold">All boardings in one place</h3>
                                    <p className="text-gray-400 text-sm max-w-2xl">
                                       Review the listings created by owners, inspect image sets clearly, and edit or remove anything inappropriate.
                                    </p>
                                 </div>

                                 <div className="relative w-full xl:w-96">
                                    <input
                                       type="text"
                                       value={searchTerm}
                                       onChange={(e) => setSearchTerm(e.target.value)}
                                       placeholder="Search boardings, owners, or locations..."
                                       className="w-full bg-[#F8F8F8] rounded-full px-12 py-4 text-sm focus:outline-none border border-transparent focus:border-accent-orange transition-all"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                 </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="p-6 bg-black text-white rounded-[2rem] shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total boardings</p>
                                    <h4 className="mt-2 text-3xl font-display font-bold">{boardings.length}</h4>
                                 </div>
                                 <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visible boardings</p>
                                    <h4 className="mt-2 text-3xl font-display font-bold">{filteredBoardings.length}</h4>
                                 </div>
                                 <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Listings with multiple images</p>
                                    <h4 className="mt-2 text-3xl font-display font-bold">{boardings.filter((boarding) => boarding.imageCount > 1).length}</h4>
                                 </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {filteredBoardings.map((boarding) => {
                                    const images = boarding.images.length > 0 ? boarding.images : ['/images/house_orange.jpg'];
                                    const primaryImage = normalizeBoardingImage(images[0]);
                                    const secondaryImages = images.slice(1, 4).map(normalizeBoardingImage);

                                    return (
                                       <div key={boarding.id} className="bg-[#FBFBFB] rounded-[2.75rem] border border-gray-100 overflow-hidden shadow-sm">
                                          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-0">
                                             <div className="relative p-4 sm:p-5">
                                                <div className="grid grid-cols-3 gap-3 rounded-[2.25rem] overflow-hidden h-[280px] sm:h-[320px]">
                                                   <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                       <img loading="lazy" src={primaryImage} alt={boarding.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                       <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                                                          Main image
                                                       </div>
                                                    </div>
                                                    <div className="relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                       <img loading="lazy" src={secondaryImages[0] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                    </div>
                                                    <div className="relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                       <img loading="lazy" src={secondaryImages[1] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                    </div>
                                                    <div className="relative overflow-hidden rounded-[2rem] bg-gray-200 xl:col-start-3">
                                                       <img loading="lazy" src={secondaryImages[2] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                      {images.length > 4 && (
                                                         <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                                                            +{images.length - 4}
                                                         </div>
                                                      )}
                                                   </div>
                                                </div>
                                             </div>

                                             <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
                                                <div className="space-y-5">
                                                   <div className="flex flex-wrap items-center gap-3">
                                                      <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] ${boarding.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                         {boarding.isAvailable ? 'Available' : 'Not available'}
                                                      </span>
                                                      <span className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] bg-gray-900 text-white">
                                                         {boarding.imageCount} image{boarding.imageCount === 1 ? '' : 's'}
                                                      </span>
                                                   </div>

                                                   <div className="space-y-3">
                                                      <h4 className="text-3xl font-display font-bold text-black tracking-tight">{boarding.title}</h4>
                                                      <p className="text-gray-500 leading-relaxed max-h-24 overflow-hidden">{boarding.description}</p>
                                                   </div>

                                                   <div className="grid grid-cols-2 gap-4 text-sm">
                                                      <div className="bg-white rounded-[1.5rem] p-4 border border-gray-100">
                                                         <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Price</p>
                                                         <p className="mt-2 text-xl font-display font-bold">LKR {boarding.price.toLocaleString()}</p>
                                                      </div>
                                                      <div className="bg-white rounded-[1.5rem] p-4 border border-gray-100">
                                                         <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Beds</p>
                                                         <p className="mt-2 text-xl font-display font-bold">{boarding.capacity}</p>
                                                      </div>
                                                   </div>

                                                   <div className="space-y-3">
                                                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                                         <MapPin size={16} className="text-accent-orange" />
                                                         <span>{boarding.address}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                                         <ClipboardList size={16} className="text-accent-orange" />
                                                         <span>Owner: {boarding.owner}</span>
                                                      </div>
                                                   </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                   <button
                                                      onClick={() => openBoardingDetails(boarding)}
                                                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-accent-orange transition-colors"
                                                   >
                                                      <Eye size={16} /> View
                                                   </button>
                                                   <button
                                                      onClick={() => openBoardingEditor(boarding)}
                                                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white border border-gray-200 text-black text-[10px] font-bold uppercase tracking-[0.25em] hover:border-accent-orange hover:text-accent-orange transition-colors"
                                                   >
                                                      <Edit3 size={16} /> Edit
                                                   </button>
                                                   <button
                                                      onClick={() => handleBoardingDelete(boarding.id)}
                                                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-red-100 transition-colors"
                                                   >
                                                      <Trash2 size={16} /> Delete
                                                   </button>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })}
                            </div>

                            {filteredBoardings.length === 0 && (
                               <div className="bg-gray-50 rounded-[2.5rem] p-10 text-center border border-dashed border-gray-200">
                                  <ImageIcon size={32} className="mx-auto text-gray-300" />
                                  <h4 className="mt-4 text-xl font-display font-bold text-black">No boardings found</h4>
                                  <p className="mt-2 text-gray-500">Try a different search term or refresh the page.</p>
                               </div>
                            )}
                        </motion.div>
                     )}

              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8" >
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                      <h3 className="text-2xl font-display font-bold">User Management</h3>
                      <div className="relative group w-72">
                         <input type="text" placeholder="Search users..." className="w-full bg-[#F8F8F8] rounded-full px-12 py-3 text-xs focus:outline-none focus:border-accent-orange border border-transparent transition-all" />
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-accent-orange/10 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                              <div><h4 className="font-bold text-black">{user.name}</h4><p className="text-xs text-gray-400">{user.email}</p></div>
                           </div>
                           <div className="flex items-center gap-12">
                              <div className="text-center"><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Role</p><p className="text-xs font-bold text-black uppercase">{user.role}</p></div>
                              <div className="text-center"><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</p><span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{user.status}</span></div>
                              <button className="p-3 hover:bg-white hover:text-red-500 rounded-xl transition-all text-gray-400"><UserX size={18} /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8" >
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                      <h3 className="text-2xl font-display font-bold">Transaction History</h3>
                       <button onClick={() => { console.log('Export CSV clicked'); alert('Coming soon'); }} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"><CreditCard size={14} /> Export CSV</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4">
                         <thead><tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"><th className="px-6 py-2">Transaction ID</th><th className="px-6 py-2">User</th><th className="px-6 py-2">Property</th><th className="px-6 py-2">Amount</th><th className="px-6 py-2">Status</th></tr></thead>
                         <tbody>
                             {payments.map((payment) => {
                                const studentName = payment.student ? `${payment.student.firstName || ''} ${payment.student.lastName || ''}`.trim() : 'Unknown';
                                const isPaid = payment.paymentStatus === 'paid';
                                return (
                                <tr key={payment._id} className="bg-gray-50 hover:bg-white transition-all shadow-sm group">
                                   <td className="px-6 py-6 rounded-l-[2rem] font-mono text-xs">{String(payment._id).slice(-8)}</td>
                                   <td className="px-6 py-6 font-bold text-sm">{studentName || 'Unknown'}</td>
                                   <td className="px-6 py-6 text-sm text-gray-500">{payment.listing?.title || 'N/A'}</td>
                                   <td className="px-6 py-6 font-display font-bold">LKR {(payment.amount || 0).toLocaleString()}</td>
                                   <td className="px-6 py-6 rounded-r-[2rem]"><span className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{isPaid ? 'Paid' : 'Pending'}</span></td>
                                </tr>
                             )})}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8" >
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50"><h3 className="text-2xl font-display font-bold">User Messages</h3></div>
                   <div className="space-y-6">
                        {messages.map((msg: any) => {
                           const senderName = msg.sender ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || msg.sender.email || msg.email || 'Anonymous' : msg.email || 'Anonymous';
                           const isUnread = !msg.isRead;
                           const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '';
                           return (
                         <div key={msg._id || msg.id} className={`p-8 rounded-[2.5rem] border transition-all ${isUnread ? 'bg-white border-accent-orange shadow-xl' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-6">
                               <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${isUnread ? 'bg-accent-orange text-white' : 'bg-black text-white'}`}>{senderName.charAt(0)}</div>
                                  <div><h4 className="font-bold text-black flex items-center gap-3">{senderName}{isUnread && <span className="w-2 h-2 bg-accent-orange rounded-full"></span>}</h4><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{msg.email || senderName} • {dateStr}</p></div>
                               </div>
                                <button onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  await fetch(`${apiBase}/api/admin/messages/${msg._id || msg.id}/read`, {
                                    method: 'PATCH',
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  fetchMessages();
                                }} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all">Mark as read</button>
                            </div>
                            <h5 className="font-bold text-black mb-2">{msg.subject}</h5>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{msg.message}</p>
                            
                            {msg.type === 'verification' && (
                              <div className="flex gap-4 pt-6 border-t border-gray-100">
                                 <button onClick={async () => {
                                   const token = localStorage.getItem('token');
                                   try {
                                     const res = await fetch(`${apiBase}/api/admin/messages/${msg._id || msg.id}/approve`, {
                                       method: 'PATCH',
                                       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                     });
                                     if (res.ok) { alert('Boarding Verified!'); fetchMessages(); } else { alert('Failed to verify'); }
                                   } catch { alert('Failed to verify'); }
                                 }} className="flex-1 bg-green-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all">
                                    Approve & Verify
                                 </button>
                                 <button onClick={async () => {
                                   const token = localStorage.getItem('token');
                                   try {
                                     const res = await fetch(`${apiBase}/api/admin/messages/${msg._id || msg.id}/reject`, {
                                       method: 'PATCH',
                                       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                     });
                                     if (res.ok) { alert('Rejection sent to owner'); fetchMessages(); } else { alert('Failed to reject'); }
                                   } catch { alert('Failed to reject'); }
                                 }} className="flex-1 bg-red-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">
                                    Reject
                                 </button>
                              </div>
                            )}
                         </div>
                           );
                       })}
                   </div>
                </motion.div>
              )}

              {activeTab === 'verifiers' && (
                <motion.div key="verifiers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                      <h3 className="text-2xl font-display font-bold">Verifier Management</h3>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-gray-400">
                            <UserCheck size={16} />
                            <select 
                              value={filterUni}
                              onChange={(e) => setFilterUni(e.target.value)}
                              className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-none cursor-pointer"
                            >
                               <option value="All">All Universities</option>
                               {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {verifiers.filter(v => filterUni === 'All' || v.university === filterUni).map((verifier) => (
                        <div key={verifier.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-accent-orange/10 transition-all flex flex-col justify-between">
                           <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[#8B5CF6] shadow-sm">{verifier.name.charAt(0)}</div>
                                    <div>
                                       <h4 className="font-bold text-black">{verifier.name}</h4>
                                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{verifier.university}</p>
                                    </div>
                                 </div>
                                 <span className="text-[9px] font-bold bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase tracking-widest">{verifier.status}</span>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2"><MapPin size={10} /> {verifier.university}</p>
                                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2"><Mail size={10} /> {verifier.email}</p>
                                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2"><Clock size={10} /> {verifier.tasks} Active Tasks</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setAssignmentModal(verifier)}
                             className="w-full mt-8 py-4 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
                           >
                              Assign Verification
                           </button>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'boarding-reports' && (
                <motion.div
                  key="boarding-reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                      <h3 className="text-2xl font-display font-bold">Reported Boardings</h3>
                   </div>
                    <div className="space-y-6">
                         {boardingReports.map((report: any) => {
                           const reporterName = report.reporter ? `${report.reporter.firstName || ''} ${report.reporter.lastName || ''}`.trim() || report.reporter.email || 'Unknown' : 'Unknown';
                           const boardingName = report.targetListing?.title || report.targetListing?.toString() || 'Unknown boarding';
                           return (
                            <div key={report._id || report.id} className="p-8 rounded-[2.5rem] bg-[#FBFBFB] border border-gray-50 space-y-6">
                               <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-black">{boardingName}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{reporterName}</p>
                                    <p className="text-sm text-gray-500 mt-2">{report.reason || 'No reason provided'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                       onClick={() => handleBoardingAction(report._id || report.id, 'warn')}
                                       className="px-6 py-2 bg-yellow-100 text-yellow-600 rounded-full text-[9px] font-bold uppercase hover:bg-yellow-200"
                                     >
                                        Warn
                                    </button>
                                    <button 
                                       onClick={() => handleBoardingAction(report._id || report.id, 'remove')}
                                       className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-[9px] font-bold uppercase hover:bg-red-200"
                                     >
                                        Remove Boarding
                                     </button>
                                  </div>
                               </div>
                            </div>
                           );
                         })}
                    </div>
                </motion.div>
              )}
           </AnimatePresence>
         </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {assignmentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
               <div className="bg-black text-white p-10 flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.4em]">Task Assignment</p>
                     <h3 className="text-2xl font-display font-bold">Assign to {assignmentModal.name}</h3>
                  </div>
                  <button onClick={() => setAssignmentModal(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-10 space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Select Property</label>
                      <select id="boarding-select" className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-8 py-4 text-sm outline-none appearance-none cursor-pointer">
                          <option value="">Select a boarding...</option>
                          {boardings.map((b: any) => <option key={b.id} value={b.id}>{b.title} ({b.location})</option>)}
                       </select>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Visit Date</label>
                      <input id="visit-date" type="date" className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-8 py-4 text-sm outline-none" />
                   </div>
                    <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                       <p className="text-[10px] font-bold text-accent-orange uppercase tracking-widest mb-2">Message to Verifier</p>
                       <p className="text-[11px] text-accent-orange italic">
                         A verifier will visit the property to inspect all details.
                       </p>
                    </div>
                    <button 
                      onClick={async () => {
                         const boardingSelect = document.querySelector<HTMLSelectElement>('#boarding-select');
                         const dateInput = document.querySelector<HTMLInputElement>('#visit-date');
                         const listingId = boardingSelect?.value;
                         const verifierId = assignmentModal?._id;
                         const visitDate = dateInput?.value;
                         if (!listingId) { alert('Please select a property'); return; }
                         if (!verifierId) { alert('Verifier not found'); return; }
                         try {
                            const res = await fetch(`${apiBase}/api/verifications/assign`, {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
                               body: JSON.stringify({ verifierId, listingId, visitDate }),
                            });
                            if (res.ok) { alert('Verifier assigned successfully!'); setAssignmentModal(null); }
                            else { const d = await res.json(); alert(d.message || 'Assignment failed'); }
                         } catch { alert('Assignment failed'); }
                      }}
                      className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all"
                    >
                      Confirm Assignment
                    </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

         {/* Boarding Detail Modal */}
         <AnimatePresence>
            {selectedBoarding && !boardingEditor && (
               <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-md flex items-center justify-center p-6">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.94, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.94, y: 20 }}
                     className="w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                  >
                     <div className="flex items-start justify-between gap-6 p-8 md:p-10 border-b border-gray-100">
                        <div className="space-y-2">
                           <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent-orange">Boarding details</p>
                           <h3 className="text-3xl md:text-4xl font-display font-bold text-black">{selectedBoarding.title}</h3>
                           <p className="text-gray-500 max-w-3xl">{selectedBoarding.address}</p>
                        </div>
                        <button
                           onClick={() => setSelectedBoarding(null)}
                           className="w-11 h-11 rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                        >
                           <X size={18} />
                        </button>
                     </div>

                     <div className="overflow-y-auto p-8 md:p-10 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
                           <div className="grid grid-cols-3 gap-4 min-h-[420px]">
                              {(selectedBoarding.images.length > 0 ? selectedBoarding.images : ['/images/house_orange.jpg']).slice(0, 4).map((image: string, index: number) => (
                                 <div
                                    key={image + index}
                                    className={`${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'} rounded-[2rem] overflow-hidden bg-gray-100 relative`}
                                 >
                                     <img
                                        loading="lazy"
                                        src={normalizeBoardingImage(image)}
                                        alt={`${selectedBoarding.title} ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    {index === 0 && (
                                       <div className="absolute left-4 top-4 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                                          Highlight image
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>

                           <div className="space-y-6">
                              <div className="rounded-[2.5rem] bg-[#FBFBFB] p-6 border border-gray-100 space-y-4">
                                 <div className="flex flex-wrap gap-3">
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] ${selectedBoarding.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                       {selectedBoarding.isAvailable ? 'Available' : 'Not available'}
                                    </span>
                                    <span className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] bg-black text-white">
                                       {selectedBoarding.imageCount} image{selectedBoarding.imageCount === 1 ? '' : 's'}
                                    </span>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-[1.5rem] p-4 border border-gray-100">
                                       <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Price</p>
                                       <p className="mt-2 text-2xl font-display font-bold">LKR {selectedBoarding.price.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white rounded-[1.5rem] p-4 border border-gray-100">
                                       <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Beds</p>
                                       <p className="mt-2 text-2xl font-display font-bold">{selectedBoarding.capacity}</p>
                                    </div>
                                 </div>

                                 <div className="space-y-3 text-sm text-gray-600">
                                    <p className="flex items-start gap-3"><MapPin size={16} className="text-accent-orange shrink-0 mt-0.5" /> {selectedBoarding.address}</p>
                                    <p className="flex items-start gap-3"><ClipboardList size={16} className="text-accent-orange shrink-0 mt-0.5" /> Owner: {selectedBoarding.owner}</p>
                                    <p className="flex items-start gap-3"><Clock size={16} className="text-accent-orange shrink-0 mt-0.5" /> {selectedBoarding.ownerEmail || 'No owner email available'}</p>
                                 </div>
                              </div>

                              <div className="rounded-[2.5rem] bg-black text-white p-6 space-y-4">
                                 <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-bold">Admin actions</p>
                                 <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                       onClick={() => {
                                          openBoardingEditor(selectedBoarding);
                                          setSelectedBoarding(null);
                                       }}
                                       className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-accent-orange hover:text-white transition-colors"
                                    >
                                       <Edit3 size={16} /> Edit
                                    </button>
                                    <button
                                       onClick={() => handleBoardingDelete(selectedBoarding.id)}
                                       className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-red-500 text-white py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-red-600 transition-colors"
                                    >
                                       <Trash2 size={16} /> Delete
                                    </button>
                                 </div>
                              </div>

                              <div className="rounded-[2.5rem] bg-[#FBFBFB] p-6 border border-gray-100 space-y-4">
                                 <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-bold">Amenities</p>
                                 <div className="flex flex-wrap gap-2">
                                    {(selectedBoarding.amenities.length > 0 ? selectedBoarding.amenities : ['No amenities listed']).map((amenity: string) => (
                                       <span key={amenity} className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-black">
                                          {amenity}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Boarding Edit Modal */}
         <AnimatePresence>
            {boardingEditor && (
               <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-md flex items-center justify-center p-6">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.94, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.94, y: 20 }}
                     className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                  >
                     <div className="p-8 md:p-10 bg-black text-white flex items-start justify-between gap-6">
                        <div className="space-y-2">
                           <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent-orange">Edit boarding</p>
                           <h3 className="text-3xl font-display font-bold">Update listing information</h3>
                           <p className="text-white/60 text-sm">Admin can fix the text, pricing, availability, and listed features without touching the backend logic.</p>
                        </div>
                        <button
                           onClick={() => setBoardingEditor(null)}
                           className="w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                        >
                           <X size={18} />
                        </button>
                     </div>

                     <form onSubmit={handleBoardingSave} className="overflow-y-auto p-8 md:p-10 space-y-6">
                        {boardingActionError && (
                           <div className="rounded-[1.5rem] bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
                              {boardingActionError}
                           </div>
                        )}

                        <div className="space-y-4">
                           <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div>
                                 <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Images</p>
                                 <p className="text-sm text-gray-500">Keep current images or upload new ones to replace the gallery.</p>
                              </div>
                              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-accent-orange transition-colors">
                                 <ImageIcon size={16} /> Upload Images
                                 <input type="file" className="hidden" multiple accept="image/*" onChange={handleBoardingImageChange} />
                              </label>
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {(boardingImages.length
                                 ? boardingImages.map((file, index) => ({ id: `${file.name}-${index}`, src: URL.createObjectURL(file), label: file.name }))
                                 : existingImagePaths.map((imagePath, index) => ({ id: `${imagePath}-${index}`, src: normalizeBoardingImage(imagePath), label: `Current image ${index + 1}` }))
                              ).map((image) => (
                                 <div key={image.id} className="rounded-[1.5rem] overflow-hidden bg-gray-100 border border-gray-100 aspect-square relative">
                                     <img loading="lazy" src={image.src} alt={image.label} className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-2 backdrop-blur-sm">
                                       {boardingImages.length ? 'New upload' : 'Current'}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Title</span>
                              <input
                                 value={boardingEditor.title}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, title: e.target.value }))}
                                 className="w-full bg-[#F8F8F8] rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Address</span>
                              <input
                                 value={boardingEditor.address}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, address: e.target.value }))}
                                 className="w-full bg-[#F8F8F8] rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="md:col-span-2 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Description</span>
                              <textarea
                                 value={boardingEditor.description}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, description: e.target.value }))}
                                 rows={6}
                                 className="w-full bg-[#F8F8F8] rounded-[1.75rem] px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all resize-none"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Price</span>
                              <input
                                 type="number"
                                 value={boardingEditor.price}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, price: e.target.value }))}
                                 className="w-full bg-[#F8F8F8] rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Capacity</span>
                              <input
                                 type="number"
                                 min="1"
                                 value={boardingEditor.capacity}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, capacity: e.target.value }))}
                                 className="w-full bg-[#F8F8F8] rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Amenities</span>
                              <input
                                 value={boardingEditor.amenitiesText}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, amenitiesText: e.target.value }))}
                                 placeholder="WiFi, Parking, Security"
                                 className="w-full bg-[#F8F8F8] rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2 md:col-span-1">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Availability</span>
                              <div className="flex items-center gap-3 bg-[#F8F8F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-accent-orange transition-all">
                                 <input
                                    type="checkbox"
                                    checked={boardingEditor.isAvailable}
                                    onChange={(e) => setBoardingEditor((current: any) => ({ ...current, isAvailable: e.target.checked }))}
                                    className="w-4 h-4 accent-black"
                                 />
                                 <span className="text-sm font-medium text-gray-600">Mark as available</span>
                              </div>
                           </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                           <button
                              type="button"
                              onClick={() => setBoardingEditor(null)}
                              className="flex-1 rounded-full bg-gray-100 text-black py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-200 transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              type="submit"
                              disabled={isSavingBoarding}
                              className="flex-1 rounded-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-accent-orange transition-colors disabled:opacity-60"
                           >
                              {isSavingBoarding ? 'Saving...' : 'Save changes'}
                           </button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

