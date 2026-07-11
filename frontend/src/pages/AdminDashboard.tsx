import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
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
   Image as ImageIcon,
   Phone,
   ShieldCheck,
   ShieldAlert,
   Check,
    User,
    ChevronDown
} from 'lucide-react';
import Toast from '../components/Toast';

const AdminDashboard = () => {
   const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState('');
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
   const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
   const [showNotifications, setShowNotifications] = useState(false);
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
   const [assignVisitDate, setAssignVisitDate] = useState('');

  const UNIVERSITIES = [
    'University of Colombo',
    'University of Sri Jayewardenepura',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Peradeniya'
  ];

  const [reports, setReports] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [openAssignDropdown, setOpenAssignDropdown] = useState<string | null>(null);
  const assignDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchBoardingReports();
      fetchBoardings();
    fetchStats();
      fetchUsers();
    fetchPayments();
    fetchMessages();
    fetchVerifications();
  }, []);

   const getAdminHeaders = () => {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
   };

   const downloadExcelReport = () => {
    const wb = XLSX.utils.book_new();

    const addSheet = (name: string, data: any[][], colWidths?: number[]) => {
      const ws = XLSX.utils.aoa_to_sheet(data);
      if (colWidths) ws['!cols'] = colWidths.map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    const paid = payments.filter((p: any) => p.paymentStatus === 'paid' || p.status === 'confirmed');
    const totalPaid = paid.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    addSheet('User Analytics', [
      ['2nd Home — User Analytics Report', '', '', ''],
      ['', '', '', ''],
      ['Metric', 'Count', 'Percentage', ''],
      ['Total Users', stats?.summary?.totalUsers || 0, '100%', ''],
      ['Students', stats?.summary?.studentCount || 0, stats?.summary?.totalUsers ? `${((stats.summary.studentCount / stats.summary.totalUsers) * 100).toFixed(1)}%` : '0%', ''],
      ['Owners', stats?.summary?.ownerCount || 0, stats?.summary?.totalUsers ? `${((stats.summary.ownerCount / stats.summary.totalUsers) * 100).toFixed(1)}%` : '0%', ''],
      ['Admins', stats?.summary?.adminCount || 0, stats?.summary?.totalUsers ? `${((stats.summary.adminCount / stats.summary.totalUsers) * 100).toFixed(1)}%` : '0%', ''],
      ['Verifiers', users.filter((u: any) => u.role === 'verifier').length, stats?.summary?.totalUsers ? `${((users.filter((u: any) => u.role === 'verifier').length / stats.summary.totalUsers) * 100).toFixed(1)}%` : '0%', ''],
    ], [30, 15, 15, 10]);

    addSheet('Boarding Listings', [
      ['2nd Home — Boarding Listings Report', '', ''],
      ['', '', ''],
      ['Metric', 'Value', 'Details'],
      ['Total Listings', boardings.length, 'All registered boarding houses'],
      ['Active', stats?.summary?.activeBoardings || 0, 'Currently available for booking'],
      ['Full', boardings.filter((b: any) => !b.isAvailable).length, 'Currently not available'],
      ['Total Images', boardings.reduce((sum: number, b: any) => sum + (b.imageCount || 0), 0), 'Across all listings'],
      ['', '', ''],
      ['Availability Ratio', `${boardings.length ? ((boardings.filter((b: any) => b.isAvailable).length / boardings.length) * 100).toFixed(1) : 0}%`, `${boardings.filter((b: any) => b.isAvailable).length} available out of ${boardings.length} total`],
    ], [30, 20, 35]);

    addSheet('Booking Reports', [
      ['2nd Home — Booking Reports', '', ''],
      ['', '', ''],
      ['Status', 'Count', 'Percentage'],
      ['Total', payments.length, '100%'],
      ['Confirmed', payments.filter((p: any) => p.status === 'confirmed').length, payments.length ? `${((payments.filter((p: any) => p.status === 'confirmed').length / payments.length) * 100).toFixed(1)}%` : '0%'],
      ['Pending', payments.filter((p: any) => p.status === 'pending').length, payments.length ? `${((payments.filter((p: any) => p.status === 'pending').length / payments.length) * 100).toFixed(1)}%` : '0%'],
      ['Cancelled', payments.filter((p: any) => p.status === 'cancelled').length, payments.length ? `${((payments.filter((p: any) => p.status === 'cancelled').length / payments.length) * 100).toFixed(1)}%` : '0%'],
    ], [30, 15, 15]);

    addSheet('Payment Reports', [
      ['2nd Home — Payment Reports', '', '', ''],
      ['', '', '', ''],
      ['Payment Status', 'Count', 'Total Amount (LKR)', ''],
      ['Paid', payments.filter((p: any) => p.paymentStatus === 'paid').length, payments.filter((p: any) => p.paymentStatus === 'paid').reduce((s: number, p: any) => s + Number(p.amount || 0), 0).toLocaleString(), ''],
      ['Unpaid', payments.filter((p: any) => p.paymentStatus === 'unpaid').length, payments.filter((p: any) => p.paymentStatus === 'unpaid').reduce((s: number, p: any) => s + Number(p.amount || 0), 0).toLocaleString(), ''],
      ['Failed', payments.filter((p: any) => p.paymentStatus === 'failed').length, payments.filter((p: any) => p.paymentStatus === 'failed').reduce((s: number, p: any) => s + Number(p.amount || 0), 0).toLocaleString(), ''],
      ['Processing', payments.filter((p: any) => p.paymentStatus === 'processing').length, payments.filter((p: any) => p.paymentStatus === 'processing').reduce((s: number, p: any) => s + Number(p.amount || 0), 0).toLocaleString(), ''],
      ['', '', '', ''],
      ['Total Collected', '', `LKR ${totalPaid.toLocaleString()}`, ''],
      ['Collection Rate', `${payments.length ? ((payments.filter((p: any) => p.paymentStatus === 'paid').length / payments.length) * 100).toFixed(1) : 0}%`, '', ''],
    ], [30, 15, 25, 10]);

    addSheet('Verification Reports', [
      ['2nd Home — Verification Reports', '', ''],
      ['', '', ''],
      ['Status', 'Count', 'Percentage'],
      ['Total Requests', verifications.length, '100%'],
      ['Approved', verifications.filter((v: any) => v.status === 'verified').length, verifications.length ? `${((verifications.filter((v: any) => v.status === 'verified').length / verifications.length) * 100).toFixed(1)}%` : '0%'],
      ['Pending', verifications.filter((v: any) => v.status === 'pending').length, verifications.length ? `${((verifications.filter((v: any) => v.status === 'pending').length / verifications.length) * 100).toFixed(1)}%` : '0%'],
      ['In Progress', verifications.filter((v: any) => v.status === 'in_progress').length, verifications.length ? `${((verifications.filter((v: any) => v.status === 'in_progress').length / verifications.length) * 100).toFixed(1)}%` : '0%'],
      ['Rejected', verifications.filter((v: any) => v.status === 'rejected').length, verifications.length ? `${((verifications.filter((v: any) => v.status === 'rejected').length / verifications.length) * 100).toFixed(1)}%` : '0%'],
    ], [30, 15, 15]);

    addSheet('Revenue Reports', [
      ['2nd Home — Revenue Reports', '', ''],
      ['', '', ''],
      ['Metric', 'Value (LKR)', ''],
      ['Total Revenue', (stats?.summary?.totalRevenue || 0).toLocaleString(), ''],
      ['This Month', (stats?.summary?.monthlyRevenue || 0).toLocaleString(), ''],
      ['', '', ''],
      ['Month', 'Revenue (LKR)', 'Users'],
      ...(stats?.growthData || []).map((d: any) => [d.month || '', (d.revenue || 0).toLocaleString(), d.users || 0]),
    ], [25, 20, 15]);

    XLSX.writeFile(wb, '2nd_Home_Admin_Reports.xlsx');
  };

  const handleDeleteUser = (user: any) => {
    setDeleteConfirm(user);
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(`${apiBase}/api/admin/users/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (response.ok) {
        setUsers(prev => prev.filter((u: any) => u.id !== deleteConfirm.id));
        setDeleteConfirm(null);
} else {
  const data = await response.json();
  setToast({ message: data.message || 'Failed to delete user', type: 'error' });
  setDeleteConfirm(null);
}
} catch {
  setToast({ message: 'Failed to delete user', type: 'error' });
  setDeleteConfirm(null);
}
  };

  const normalizeBoardingImage = (imagePath: string) => {
      if (!imagePath) return '/images/house_orange.png';
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

  const fetchVerifications = async () => {
     try {
       const [allRes, pendingRes] = await Promise.all([
         fetch(`${apiBase}/api/verifications/all`, { headers: getAdminHeaders() }),
         fetch(`${apiBase}/api/verifications/pending-requests`, { headers: getAdminHeaders() }),
       ]);
       const allData = await allRes.json();
       setVerifications(Array.isArray(allData) ? allData : []);
       const pendingData = await pendingRes.json();
       setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
     } catch (error) {
       console.error("Error fetching verifications:", error);
     }
   };

  useEffect(() => {
    if (!openAssignDropdown) return;
    const handler = (e: MouseEvent) => {
      if (assignDropdownRef.current && !assignDropdownRef.current.contains(e.target as Node)) {
        setOpenAssignDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openAssignDropdown]);

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
    setToast({ message: 'Please log in again as admin to perform this action.', type: 'error' });
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
  setToast({ message: error?.message || 'Failed to delete boarding.', type: 'error' });
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
    
  setToast({ message, type: 'success' });
  setReports(reports.filter(r => r.id !== id));
  };

  const handleBoardingAction = async (id: number, action: 'warn' | 'remove') => {
    try {
      let url = `${apiBase}/api/reports/admin/${id}`;
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
    setToast({ message: `Report ${action === 'warn' ? 'warning issued' : 'action completed'}`, type: 'success' });
    fetchBoardingReports();
  } else {
    setToast({ message: "Action failed. Please try again.", type: 'error' });
  }
} catch (error) {
  setToast({ message: "An error occurred. Please try again.", type: 'error' });
    }
  };

  return (
    <div className="pb-16 sm:pb-24 px-4 sm:px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
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
                  <button onClick={() => setShowNotifications(!showNotifications)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-accent-orange transition-all relative">
                     <Bell size={24} />
                     {(boardingReports.length > 0 || messages.some((m: any) => !m.isRead)) && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                     )}
                  </button>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                       className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[90vw] sm:w-96 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                         <h4 className="font-bold text-sm">Notifications</h4>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{boardingReports.length + messages.filter((m: any) => !m.isRead).length} New</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                         {boardingReports.length > 0 && (
                           <div className="p-4 hover:bg-red-50 transition-colors cursor-pointer" onClick={() => { setActiveTab('boarding-reports'); setShowNotifications(false); }}>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0 mt-0.5"><AlertTriangle size={14} /></div>
                                 <div><p className="text-xs font-bold text-black">{boardingReports.length} reported boarding{boardingReports.length > 1 ? 's' : ''}</p><p className="text-[10px] text-gray-400 mt-0.5">Requires your attention</p></div>
                              </div>
                           </div>
                         )}
                         {messages.filter((m: any) => !m.isRead).map((msg: any) => {
                            const senderName = msg.sender ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || msg.email || 'Anonymous' : msg.email || 'Anonymous';
                            return (
                            <div key={msg._id || msg.id} className="p-4 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => { setActiveTab('messages'); setShowNotifications(false); }}>
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0 mt-0.5"><MessageSquare size={14} /></div>
                                  <div><p className="text-xs font-bold text-black truncate">{msg.subject}</p><p className="text-[10px] text-gray-400 mt-0.5 truncate">{senderName}</p></div>
                               </div>
                            </div>
                            );
                         })}
                         {boardingReports.length === 0 && messages.filter((m: any) => !m.isRead).length === 0 && (
                           <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                         )}
                      </div>
                      <div className="p-3 border-t border-gray-50 text-center">
                         <button onClick={() => { setActiveTab('messages'); setShowNotifications(false); }} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">View All</button>
                      </div>
                    </motion.div>
                  )}
                </div>
               
                        <div className="flex bg-white p-2 rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                           {['analytics', 'boardings', 'users', 'verifiers', 'boarding-reports', 'payments', 'messages', 'reports'].map((tab) => (
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
        <div className="bg-white rounded-[3.5rem] p-6 sm:p-10 shadow-sm border border-gray-50 min-h-[500px]">
           <AnimatePresence mode="wait">
              {activeTab === 'analytics' && stats && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 sm:space-y-12"
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
                                       className="w-full bg-gray-50 rounded-full px-12 py-4 text-sm focus:outline-none border border-transparent focus:border-accent-orange transition-all"
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
                                    const images = boarding.images.length > 0 ? boarding.images : ['/images/house_orange.png'];
                                    const primaryImage = normalizeBoardingImage(images[0]);
                                    const secondaryImages = images.slice(1, 4).map(normalizeBoardingImage);

                                    return (
                                       <div key={boarding.id} className="bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                                          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-0">
                                             <div className="relative p-4 sm:p-5">
                                                <div className="grid grid-cols-3 gap-3 rounded-[2.25rem] overflow-hidden h-[280px] sm:h-[320px]">
                                                   <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                      <img src={primaryImage} alt={boarding.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                                                         Main image
                                                      </div>
                                                   </div>
                                                   <div className="relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                      <img src={secondaryImages[0] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                   </div>
                                                   <div className="relative overflow-hidden rounded-[2rem] bg-gray-200">
                                                      <img src={secondaryImages[1] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                   </div>
                                                   <div className="relative overflow-hidden rounded-[2rem] bg-gray-200 xl:col-start-3">
                                                      <img src={secondaryImages[2] || primaryImage} alt={`${boarding.title} detail`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                               <div className="bg-gray-50 rounded-[2.5rem] p-6 sm:p-10 text-center border border-dashed border-gray-200">
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
                          <input type="text" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full bg-gray-50 rounded-full px-12 py-3 text-xs focus:outline-none focus:border-accent-orange border border-transparent transition-all" />
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      </div>
                   </div>
                    <div className="space-y-4">
                       {users.filter((u: any) => {
                          const q = userSearch.toLowerCase().trim();
                          if (!q) return true;
                          return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                       }).map((user: any) => (
                         <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-transparent hover:border-accent-orange/10 transition-all gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold shrink-0">{user.name.charAt(0)}</div>
                              <div className="min-w-0"><h4 className="font-bold text-black text-sm sm:text-base truncate">{user.name}</h4><p className="text-xs text-gray-400 truncate">{user.email}</p></div>
                           </div>
                           <div className="flex items-center gap-4 sm:gap-8 ml-14 sm:ml-0">
                              <div className="text-center"><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Role</p><p className="text-xs font-bold text-black uppercase">{user.role}</p></div>
                              <div className="text-center"><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</p><span className={`text-[9px] font-bold uppercase px-2 sm:px-3 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{user.status}</span></div>
                               <button onClick={() => handleDeleteUser(user)} className="p-2 sm:p-3 hover:bg-white hover:text-red-500 rounded-xl transition-all text-gray-400"><Trash2 size={18} /></button>
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
                      <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"><CreditCard size={14} /> Export CSV</button>
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
                               <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all">Mark as read</button>
                            </div>
                            <h5 className="font-bold text-black mb-2">{msg.subject}</h5>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{msg.message}</p>
                            
                            {msg.type === 'verification' && (
                              <div className="flex gap-4 pt-6 border-t border-gray-100">
                                  <button onClick={() => setToast({ message: 'Boarding Verified! Owner will be notified.', type: 'success' })} className="flex-1 bg-green-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all">
                                     Approve & Verify
                                  </button>
                                  <button onClick={() => setToast({ message: 'Rejection sent to owner.', type: 'info' })} className="flex-1 bg-red-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">
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
                   {/* Tabs within verifiers section */}
                   <div className="flex gap-2 p-1 bg-gray-50 rounded-full w-fit overflow-x-auto">
                      {['Pending Requests', 'Assignments', 'Completed', 'Verifiers'].map(sub => (
                        <button key={sub} onClick={() => setFilterUni(sub)} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterUni === sub ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>{sub}</button>
                      ))}
                   </div>

                   {filterUni === 'Pending Requests' && (
                     <div className="space-y-4">
                       <h3 className="text-2xl font-display font-bold">Pending Verification Requests</h3>
                       <p className="text-sm text-gray-400">Boarding owners have submitted their availability. Assign a verifier from the list below.</p>
                       {pendingRequests.length === 0 ? (
                         <div className="bg-gray-50 rounded-[2.5rem] p-10 text-center border border-dashed border-gray-200">
                           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400"><Clock size={28} /></div>
                           <h4 className="mt-4 text-xl font-bold text-black">No pending requests</h4>
                           <p className="text-gray-400 text-sm mt-2">All requests have been assigned or completed.</p>
                         </div>
                       ) : (
                         <div className="grid grid-cols-1 gap-4">
                           {pendingRequests.map((req: any) => {
                             const listing = req.listing || {};
                             const owner = listing.owner || {};
                             return (
                               <div key={req._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                 <div className="flex items-start gap-4">
                                   <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">{listing.title?.charAt(0) || 'B'}</div>
                                   <div>
                                     <h4 className="font-bold text-black">{listing.title || 'Untitled'}</h4>
                                     <p className="text-xs text-gray-400">{listing.address || ''}</p>
                                     <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                                       <span className="flex items-center gap-1"><User size={10} /> {owner.firstName || ''} {owner.lastName || ''}</span>
                                       {req.ownerAvailability?.dateAvailable && <span className="flex items-center gap-1"><Clock size={10} /> {new Date(req.ownerAvailability.dateAvailable).toLocaleDateString()} {req.ownerAvailability.timeSlot || ''}</span>}
                                     </div>
                                   </div>
                                 </div>
                                   <div className="relative shrink-0" ref={assignDropdownRef}>
                                      <button
                                        onClick={() => setOpenAssignDropdown(openAssignDropdown === req._id ? null : req._id)}
                                        className="bg-gradient-to-r from-black to-gray-800 text-white border-2 border-transparent rounded-full px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:from-accent-orange hover:to-orange-600 hover:border-accent-orange transition-all pr-12 shadow-lg shadow-black/10 flex items-center gap-2"
                                      >
                                        <UserCheck size={14} />
                                        Assign
                                        <ChevronDown size={14} className={`transition-transform ${openAssignDropdown === req._id ? 'rotate-180' : ''}`} />
                                      </button>
                                      <AnimatePresence>
                                        {openAssignDropdown === req._id && (
                                          <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
                                          >
                                            <div className="p-2">
                                              <p className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">Select a verifier</p>
                                              {verifiers.length === 0 ? (
                                                <p className="px-4 py-3 text-xs text-gray-400">No verifiers available</p>
                                              ) : (
                                                verifiers.map((v: any) => (
                                                  <button
                                                    key={v.id}
                                                    onClick={() => {
                                                      setAssignmentModal({ ...v, requestId: req._id, listingId: listing._id });
                                                      setOpenAssignDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold hover:bg-gray-50 hover:text-accent-orange transition-all group"
                                                  >
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-black group-hover:bg-accent-orange group-hover:text-white transition-all text-[10px] font-bold">{v.name?.charAt(0) || '?'}</div>
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-bold text-black truncate">{v.name}</p>
                                                      <p className="text-[10px] text-gray-400 truncate">{v.email}</p>
                                                    </div>
                                                  </button>
                                                ))
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                   </div>
                               </div>
                             );
                           })}
                         </div>
                       )}
                     </div>
                   )}

                   {filterUni === 'Assignments' && (
                     <div className="space-y-4">
                       <h3 className="text-2xl font-display font-bold">Active Assignments</h3>
                       <p className="text-sm text-gray-400">Verifiers currently assigned to inspections.</p>
                       <div className="grid grid-cols-1 gap-4">
                         {verifications.filter((v: any) => v.status === 'assigned' || v.status === 'accepted' || v.status === 'in_progress').map((v: any) => {
                           const listing = v.listing || {};
                           const verifier = v.verifier || {};
                           const vName = `${verifier.firstName || ''} ${verifier.lastName || ''}`.trim() || 'Unknown';
                           return (
                             <div key={v._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                               <div className="flex items-start gap-4">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 ${v.status === 'accepted' ? 'bg-purple-500' : 'bg-amber-500'}`}>{vName.charAt(0)}</div>
                                 <div>
                                   <h4 className="font-bold text-black">{listing.title || 'Untitled'}</h4>
                                   <p className="text-xs text-gray-400">Verifier: {vName}</p>
                                   <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                                     <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${v.status === 'accepted' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-700'}`}>{v.status}</span>
                                     {v.visitDate && <span className="flex items-center gap-1"><Clock size={10} /> {new Date(v.visitDate).toLocaleDateString()}</span>}
                                   </div>
                                 </div>
                               </div>
                               <div className="flex gap-2 shrink-0">
                                 <button onClick={async () => {
                                    try {
                                      const res = await fetch(`${apiBase}/api/verifications/admin/unassign/${v._id}`, { method: 'POST', headers: getAdminHeaders() });
                                      if (res.ok) { fetchVerifications(); setToast({ message: 'Verifier unassigned', type: 'success' }); }
                                      else { const d = await res.json(); setToast({ message: d.message || 'Failed', type: 'error' }); }
                                    } catch { setToast({ message: 'Failed to unassign verifier', type: 'error' }); }
                                 }} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all">Unassign</button>
                               </div>
                             </div>
                           );
                         })}
                         {verifications.filter((v: any) => v.status === 'assigned' || v.status === 'accepted' || v.status === 'in_progress').length === 0 && (
                           <div className="bg-gray-50 rounded-[2.5rem] p-10 text-center border border-dashed border-gray-200">
                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400"><UserCheck size={28} /></div>
                             <h4 className="mt-4 text-xl font-bold text-black">No active assignments</h4>
                             <p className="text-gray-400 text-sm mt-2">Assign verifiers from pending requests above.</p>
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                   {filterUni === 'Completed' && (
                     <div className="space-y-4">
                       <h3 className="text-2xl font-display font-bold">Completed Verifications</h3>
                       <p className="text-sm text-gray-400">Review completed inspection reports.</p>
                       <div className="grid grid-cols-1 gap-4">
                         {verifications.filter((v: any) => v.status === 'verified' || v.status === 'rejected').map((v: any) => {
                           const listing = v.listing || {};
                           const verifier = v.verifier || {};
                           const vName = `${verifier.firstName || ''} ${verifier.lastName || ''}`.trim() || 'Unknown';
                           const isVerified = v.status === 'verified';
                           return (
                             <div key={v._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:shadow-lg transition-all">
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                 <div className="flex items-start gap-4">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 ${isVerified ? 'bg-green-500' : 'bg-red-500'}`}>{isVerified ? <ShieldCheck size={24} /> : <X size={24} />}</div>
                                   <div>
                                     <h4 className="font-bold text-black">{listing.title || 'Untitled'}</h4>
                                     <p className="text-xs text-gray-400">Verified by: {vName}</p>
                                     <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-gray-400">
                                       <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{v.status}</span>
                                       {v.verdict && <span>Verdict: {v.verdict}</span>}
                                       {v.checklist?.length > 0 && <span>{v.checklist.length} checklist items</span>}
                                       {v.updatedAt && <span className="flex items-center gap-1"><Clock size={10} /> {new Date(v.updatedAt).toLocaleDateString()}</span>}
                                     </div>
                                   </div>
                                 </div>
                                 <button onClick={() => {
                                   setAssignmentModal({ ...v, viewReport: true });
                                 }} className="px-5 py-2.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all shrink-0">View Report</button>
                               </div>
                               {v.notes && <div className="mt-4 p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 italic">"{v.notes}"</div>}
                               {v.images?.length > 0 && (
                                 <div className="mt-4 flex gap-2 overflow-x-auto">
                                   {v.images.map((img: string, i: number) => (
                                     <div key={i} className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                       <img src={img.startsWith('http') ? img : `${apiBase}${img}`} alt="" className="w-full h-full object-cover" />
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           );
                         })}
                         {verifications.filter((v: any) => v.status === 'verified' || v.status === 'rejected').length === 0 && (
                           <div className="bg-gray-50 rounded-[2.5rem] p-10 text-center border border-dashed border-gray-200">
                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400"><ClipboardList size={28} /></div>
                             <h4 className="mt-4 text-xl font-bold text-black">No completed verifications</h4>
                             <p className="text-gray-400 text-sm mt-2">Completed reports will appear here.</p>
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                   {filterUni === 'Verifiers' && (
                     <>
                       <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                         <div><h3 className="text-2xl font-display font-bold">Verifier Profiles</h3><p className="text-sm text-gray-400">All registered verifiers on the platform.</p></div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {verifiers.map((verifier) => (
                           <div key={verifier.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-accent-orange/10 transition-all">
                             <div className="flex items-start gap-4 mb-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[#8B5CF6] shadow-sm">{verifier.name.charAt(0)}</div>
                               <div className="flex-1">
                                 <h4 className="font-bold text-black">{verifier.name}</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{verifier.university || 'N/A'}</p>
                               </div>
                               <span className="text-[9px] font-bold bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase tracking-widest">{verifier.status}</span>
                             </div>
                             <div className="space-y-1.5 text-[10px] text-gray-400">
                               <p className="flex items-center gap-2"><Mail size={10} /> {verifier.email}</p>
                               <p className="flex items-center gap-2"><MapPin size={10} /> {verifier.university || 'N/A'}</p>
                             </div>
                             <div className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                               Tasks: {verifications.filter((v: any) => (v.verifier?._id === verifier.id || v.verifier?.toString() === verifier.id) && (v.status === 'verified' || v.status === 'rejected')).length} completed
                             </div>
                           </div>
                         ))}
                       </div>
                     </>
                   )}
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
                            <div key={report._id || report.id} className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-50 space-y-6">
                               <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-black">{boardingName}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{reporterName}</p>
                                    <p className="text-sm text-gray-500 mt-2">{report.reason || 'No reason provided'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                       onClick={() => handleBoardingAction(report._id || report.id, 'warn')}
className="px-6 py-2 bg-yellow-100 text-yellow-600 rounded-full text-[9px] font-bold uppercase hover:bg-yellow-200 transition-all"
                                      >
                                         Warn
                                    </button>
                                    <button 
                                       onClick={() => handleBoardingAction(report._id || report.id, 'remove')}
className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-[9px] font-bold uppercase hover:bg-red-200 transition-all"
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

              {activeTab === 'reports' && (
                <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                   <div className="flex justify-between items-center mb-6">
                      <div>
                         <h3 className="text-2xl font-display font-bold">Platform Reports</h3>
                         <p className="text-gray-400 text-sm">Comprehensive analytics across all platform modules.</p>
                      </div>
                      <button onClick={downloadExcelReport} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                         Download Excel Report
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                      {/* 1. User Analytics */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 flex items-center gap-4">
                            <UsersIcon size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">User Analytics</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 text-center border border-violet-100">
                                  <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Total</p>
                                  <p className="text-3xl font-display font-bold text-violet-700">{stats?.summary?.totalUsers || 0}</p>
                               </div>
                               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Students</p>
                                  <p className="text-3xl font-display font-bold text-blue-700">{stats?.summary?.studentCount || 0}</p>
                               </div>
                               <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
                                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Owners</p>
                                  <p className="text-3xl font-display font-bold text-amber-700">{stats?.summary?.ownerCount || 0}</p>
                               </div>
                               <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
                                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Verifiers</p>
                                  <p className="text-3xl font-display font-bold text-emerald-700">{users.filter((u: any) => u.role === 'verifier').length}</p>
                               </div>
                            </div>
                             <div className="space-y-1.5 pt-2 border-t border-gray-50">
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                   <span>Role Distribution</span>
                                   <span className="text-violet-600">{((stats?.summary?.studentCount || 0) / (stats?.summary?.totalUsers || 1) * 100).toFixed(0)}% Students</span>
                                </div>
                                <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                                   {[
                                      { key: 'Students', count: stats?.summary?.studentCount || 0, color: 'bg-violet-500' },
                                      { key: 'Owners', count: stats?.summary?.ownerCount || 0, color: 'bg-amber-500' },
                                      { key: 'Verifiers', count: users.filter((u: any) => u.role === 'verifier').length, color: 'bg-emerald-500' },
                                   ].map((seg) => {
                                      const total = stats?.summary?.totalUsers || 1;
                                      const pct = (seg.count / total) * 100;
                                      if (pct === 0) return null;
                                      return <div key={seg.key} className={`${seg.color} h-full transition-all duration-700`} style={{ width: `${pct}%` }} title={`${seg.key}: ${seg.count}`} />;
                                   })}
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest pt-0.5">
                                   {[
                                      { label: 'Students', count: stats?.summary?.studentCount || 0, color: 'bg-violet-500' },
                                      { label: 'Owners', count: stats?.summary?.ownerCount || 0, color: 'bg-amber-500' },
                                      { label: 'Verifiers', count: users.filter((u: any) => u.role === 'verifier').length, color: 'bg-emerald-500' },
                                   ].map((seg) => (
                                      <span key={seg.label} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${seg.color}`}></span>{seg.label}</span>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* 2. Boarding Listings */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center gap-4">
                            <BarChart3 size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">Boarding Listings</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Total</p>
                                  <p className="text-3xl font-display font-bold text-blue-700">{boardings.length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
                                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active</p>
                                  <p className="text-3xl font-display font-bold text-emerald-700">{stats?.summary?.activeBoardings || 0}</p>
                               </div>
                               <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
                                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Full</p>
                                  <p className="text-3xl font-display font-bold text-amber-700">{boardings.filter((b: any) => !b.isAvailable).length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 text-center border border-rose-100">
                                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Images</p>
                                  <p className="text-3xl font-display font-bold text-rose-700">{boardings.reduce((sum: number, b: any) => sum + (b.imageCount || 0), 0)}</p>
                               </div>
                            </div>
                            {/* Mini progress bar */}
                            <div className="space-y-1.5 pt-2 border-t border-gray-50">
                               <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  <span>Availability</span>
                                  <span className="text-emerald-600">{boardings.filter((b: any) => b.isAvailable).length}/{boardings.length} Available</span>
                               </div>
                               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700" style={{ width: `${boardings.length ? (boardings.filter((b: any) => b.isAvailable).length / boardings.length) * 100 : 0}%` }} />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* 3. Booking Reports */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 flex items-center gap-4">
                            <ClipboardList size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">Booking Reports</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
                                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Total</p>
                                  <p className="text-3xl font-display font-bold text-emerald-700">{payments.length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Confirmed</p>
                                  <p className="text-3xl font-display font-bold text-blue-700">{payments.filter((p: any) => p.status === 'confirmed').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
                                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Pending</p>
                                  <p className="text-3xl font-display font-bold text-amber-700">{payments.filter((p: any) => p.status === 'pending').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 text-center border border-rose-100">
                                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Cancelled</p>
                                  <p className="text-3xl font-display font-bold text-rose-700">{payments.filter((p: any) => p.status === 'cancelled').length}</p>
                               </div>
                            </div>
                             {/* Status bar */}
                             <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100 pt-2 border-t border-gray-50">
                                {['confirmed', 'pending', 'cancelled'].map((s) => {
                                   const count = payments.filter((p: any) => p.status === s).length;
                                   const pct = payments.length ? (count / payments.length) * 100 : 0;
                                   const color = s === 'confirmed' ? 'bg-blue-500' : s === 'pending' ? 'bg-amber-400' : 'bg-rose-400';
                                   return <div key={s} className={`${color} h-full transition-all duration-700`} style={{ width: count === 0 ? '0.5%' : `${pct}%`, opacity: count === 0 ? 0.3 : 1 }} title={`${s}: ${count}`} />;
                                })}
                             </div>
                            <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Confirmed</span>
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Pending</span>
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Cancelled</span>
                            </div>
                         </div>
                      </div>

                      {/* 4. Payment Reports */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 flex items-center gap-4">
                            <CreditCard size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">Payment Reports</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
                                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Paid</p>
                                  <p className="text-3xl font-display font-bold text-amber-700">{payments.filter((p: any) => p.paymentStatus === 'paid').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
                                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Revenue</p>
                                  <p className="text-2xl font-display font-bold text-emerald-700">LKR {(payments.filter((p: any) => p.paymentStatus === 'paid' || p.status === 'confirmed').reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)).toLocaleString()}</p>
                               </div>
                               <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 text-center border border-rose-100">
                                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Unpaid</p>
                                  <p className="text-3xl font-display font-bold text-rose-700">{payments.filter((p: any) => p.paymentStatus === 'unpaid').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-4 text-center border border-gray-200">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Failed</p>
                                  <p className="text-3xl font-display font-bold text-gray-500">{payments.filter((p: any) => p.paymentStatus === 'failed').length}</p>
                               </div>
                            </div>
                            <div className="space-y-1.5 pt-2 border-t border-gray-50">
                               <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  <span>Collection Rate</span>
                                  <span className="text-emerald-600">{payments.length ? ((payments.filter((p: any) => p.paymentStatus === 'paid').length / payments.length) * 100).toFixed(0) : 0}%</span>
                               </div>
                               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700" style={{ width: `${payments.length ? (payments.filter((p: any) => p.paymentStatus === 'paid').length / payments.length) * 100 : 0}%` }} />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* 5. Verification Reports */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-5 flex items-center gap-4">
                            <Shield size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">Verification Reports</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 text-center border border-rose-100">
                                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Total</p>
                                  <p className="text-3xl font-display font-bold text-rose-700">{verifications.length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center border border-emerald-100">
                                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Approved</p>
                                  <p className="text-3xl font-display font-bold text-emerald-700">{verifications.filter((v: any) => v.status === 'verified').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 text-center border border-amber-100">
                                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Pending</p>
                                  <p className="text-3xl font-display font-bold text-amber-700">{verifications.filter((v: any) => v.status === 'pending' || v.status === 'in_progress').length}</p>
                               </div>
                               <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 text-center border border-red-100">
                                  <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Rejected</p>
                                  <p className="text-3xl font-display font-bold text-red-600">{verifications.filter((v: any) => v.status === 'rejected').length}</p>
                               </div>
                            </div>
                             {/* Stacked bar */}
                             <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 pt-2 border-t border-gray-50">
                                {['verified', 'pending', 'in_progress', 'rejected'].map((s) => {
                                   const count = verifications.filter((v: any) => v.status === s).length;
                                   const pct = verifications.length ? (count / verifications.length) * 100 : 0;
                                   const color = s === 'verified' ? 'bg-emerald-500' : s === 'pending' ? 'bg-amber-400' : s === 'in_progress' ? 'bg-blue-400' : 'bg-rose-500';
                                   return <div key={s} className={`${color} h-full transition-all duration-700`} style={{ width: count === 0 ? '0.5%' : `${pct}%`, opacity: count === 0 ? 0.3 : 1 }} title={`${s}: ${count}`} />;
                                })}
                             </div>
                            <div className="flex flex-wrap gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Approved</span>
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Pending</span>
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>In Progress</span>
                               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Rejected</span>
                            </div>
                         </div>
                      </div>

                      {/* 6. Revenue Reports */}
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
                         <div className="bg-gradient-to-r from-cyan-500 to-teal-600 px-6 py-5 flex items-center gap-4">
                            <TrendingUp size={22} className="text-white/90" />
                            <h3 className="text-white font-bold text-sm tracking-wide">Revenue Reports</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                               <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-4 text-center border border-cyan-100 col-span-2">
                                  <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Total Revenue</p>
                                  <p className="text-3xl font-display font-bold text-cyan-700">LKR {(stats?.summary?.totalRevenue || 0).toLocaleString()}</p>
                               </div>
                               <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 text-center border border-teal-100">
                                  <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">This Month</p>
                                  <p className="text-xl font-display font-bold text-teal-700">LKR {(stats?.summary?.monthlyRevenue || 0).toLocaleString()}</p>
                               </div>
                               <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 text-center border border-violet-100">
                                  <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Growth</p>
                                  <p className="text-xl font-display font-bold text-violet-700">
                                     {stats?.growthData?.length >= 2 ? `+${((stats.growthData[stats.growthData.length - 1]?.revenue || 0) / (stats.growthData[stats.growthData.length - 2]?.revenue || 1) * 100 - 100).toFixed(0)}%` : 'N/A'}
                                  </p>
                               </div>
                            </div>
                            {/* Mini bar chart */}
                            {stats?.growthData && stats.growthData.length > 0 && (
                               <div className="space-y-1.5 pt-2 border-t border-gray-50">
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">Monthly Trend (LKR)</p>
                                  <div className="flex items-end gap-1.5 h-16">
                                     {stats.growthData.map((d: any, i: number) => {
                                        const maxRev = Math.max(...stats.growthData.map((g: any) => g.revenue), 1);
                                        const h = (d.revenue / maxRev) * 100;
                                        return (
                                           <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                              <div className="w-full bg-gradient-to-t from-cyan-400 to-teal-400 rounded-t-md transition-all duration-700" style={{ height: `${Math.max(h, 4)}%` }} title={`${d.month}: LKR ${d.revenue}`} />
                                              <span className="text-[7px] font-bold text-gray-400 uppercase">{d.month?.slice(0, 3)}</span>
                                           </div>
                                        );
                                     })}
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>

                   </div>
                </motion.div>
              )}
           </AnimatePresence>
         </div>
       </div>

      {/* Delete Confirmation Toast */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md" onClick={() => setDeleteConfirm(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-white" />
                </div>
                <h3 className="text-white text-2xl font-display font-bold">Delete User?</h3>
                <p className="text-white/70 text-sm mt-2">This action cannot be undone.</p>
              </div>
              <div className="px-8 py-6 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-bold text-xl uppercase">{deleteConfirm.name?.charAt(0) || '?'}</span>
                </div>
                <p className="font-bold text-black text-lg mb-1">{deleteConfirm.name}</p>
                <p className="text-gray-400 text-sm mb-6">{deleteConfirm.email}</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-all">
                    Cancel
                  </button>
                  <button onClick={confirmDeleteUser} className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assignment / View Report Modal */}
      <AnimatePresence>
        {assignmentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[3.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
              {assignmentModal.viewReport ? (
                <>
                  <div className="bg-black text-white p-8 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.4em]">Inspection Report</p>
                      <h3 className="text-2xl font-display font-bold">{assignmentModal.listing?.title || 'Verification Report'}</h3>
                    </div>
                    <button onClick={() => setAssignmentModal(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${assignmentModal.status === 'verified' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {assignmentModal.status === 'verified' ? <ShieldCheck size={24} /> : <X size={24} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                        <p className="text-lg font-bold capitalize">{assignmentModal.status}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verdict</p><p className="text-sm font-bold capitalize mt-1">{assignmentModal.verdict || 'N/A'}</p></div>
                      <div className="bg-gray-50 rounded-2xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visit Date</p><p className="text-sm font-bold mt-1">{assignmentModal.visitDate ? new Date(assignmentModal.visitDate).toLocaleDateString() : 'N/A'}</p></div>
                    </div>
                    {assignmentModal.verifier && (
                      <div className="bg-purple-50 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-2">Verifier</p>
                        <p className="text-sm font-bold">{assignmentModal.verifier.firstName || ''} {assignmentModal.verifier.lastName || ''}</p>
                        <p className="text-[11px] text-gray-500">{assignmentModal.verifier.email || ''}</p>
                      </div>
                    )}
                    {assignmentModal.checklist?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Checklist ({assignmentModal.checklist.length} items)</p>
                        <div className="space-y-2">
                          {(assignmentModal.checklist as string[]).map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl text-xs text-green-700"><Check size={14} className="shrink-0" />{item}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {assignmentModal.notes && (
                      <div className="bg-gray-50 rounded-2xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes</p><p className="text-xs text-gray-600 mt-1 italic">{assignmentModal.notes}</p></div>
                    )}
                    {assignmentModal.images?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Images ({assignmentModal.images.length})</p>
                        <div className="grid grid-cols-3 gap-3">
                          {assignmentModal.images.map((img: string, i: number) => (
                            <div key={i} className="aspect-square rounded-2xl bg-gray-100 overflow-hidden"><img src={img.startsWith('http') ? img : `${apiBase}${img}`} alt="" className="w-full h-full object-cover" /></div>
                          ))}
                        </div>
                      </div>
                    )}
                    {assignmentModal.selfie && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Verifier Selfie</p>
                        <div className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden"><img src={assignmentModal.selfie.startsWith('http') ? assignmentModal.selfie : `${apiBase}${assignmentModal.selfie}`} alt="" className="w-full h-full object-cover" /></div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-black text-white p-8 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.4em]">Task Assignment</p>
                      <h3 className="text-2xl font-display font-bold">Assign to {assignmentModal.name}</h3>
                    </div>
                    <button onClick={() => setAssignmentModal(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Selected Property</label>
                      <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {(() => { const r = pendingRequests.find((p: any) => p._id === assignmentModal.requestId); return r?.listing?.title?.charAt(0) || 'B'; })()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{(() => { const r = pendingRequests.find((p: any) => p._id === assignmentModal.requestId); return r?.listing?.title || 'Selected boarding'; })()}</p>
                          <p className="text-[10px] text-gray-400">{(() => { const r = pendingRequests.find((p: any) => p._id === assignmentModal.requestId); return r?.listing?.address || ''; })()}</p>
                        </div>
                      </div>
                      <input type="hidden" value={assignmentModal.listingId || ''} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Preferred Visit Date</label>
                      <div className="relative">
                        <input type="date" value={assignVisitDate} onChange={e => setAssignVisitDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-accent-orange focus:bg-white focus:ring-2 focus:ring-accent-orange/10 transition-all rounded-full px-8 py-4 text-sm outline-none" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6 rounded-[2rem] border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center text-white"><MessageSquare size={14} /></div>
                        <p className="text-[10px] font-bold text-accent-orange uppercase tracking-widest">Message to Verifier</p>
                      </div>
                      <p className="text-[11px] text-orange-700/70 leading-relaxed">The verifier will visit to inspect all details. They have 15 minutes to accept or reject this assignment.</p>
                    </div>
                    <button onClick={async () => {
                      const listingId = assignmentModal.listingId;
                      const verifierId = assignmentModal.id;
                      const visitDate = assignVisitDate;
                      if (!listingId) { setToast({ message: 'Property not found', type: 'error' }); return; }
                      if (!verifierId) { setToast({ message: 'Verifier not found', type: 'error' }); return; }
                      try {
                        const res = await fetch(`${apiBase}/api/verifications/assign`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
                          body: JSON.stringify({ verifierId, listingId, visitDate: visitDate || undefined }),
                        });
                        if (res.ok) {
                          setToast({ message: 'Verifier assigned successfully! They have 15 minutes to respond.', type: 'success' });
                          setAssignmentModal(null);
                          setAssignVisitDate('');
                          fetchVerifications();
                        } else { const d = await res.json(); setToast({ message: d.message || 'Assignment failed', type: 'error' }); }
                      } catch { setToast({ message: 'Assignment failed', type: 'error' }); }
                    }} className="w-full py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl bg-black text-white hover:bg-accent-orange shadow-black/10">
                      Confirm Assignment
                    </button>
                  </div>
                </>
              )}
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
                              {(selectedBoarding.images.length > 0 ? selectedBoarding.images : ['/images/house_orange.png']).slice(0, 4).map((image: string, index: number) => (
                                 <div
                                    key={image + index}
                                    className={`${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'} rounded-[2rem] overflow-hidden bg-gray-100 relative`}
                                 >
                                    <img
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
                              <div className="rounded-[2.5rem] bg-gray-50 p-6 border border-gray-100 space-y-4">
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

                              <div className="rounded-[2.5rem] bg-gray-50 p-6 border border-gray-100 space-y-4">
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
                                    <img src={image.src} alt={image.label} className="w-full h-full object-cover" />
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
                                 className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Address</span>
                              <input
                                 value={boardingEditor.address}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, address: e.target.value }))}
                                 className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="md:col-span-2 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Description</span>
                              <textarea
                                 value={boardingEditor.description}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, description: e.target.value }))}
                                 rows={6}
                                 className="w-full bg-gray-50 rounded-[2rem] px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all resize-none"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Price</span>
                              <input
                                 type="number"
                                 value={boardingEditor.price}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, price: e.target.value }))}
                                 className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Capacity</span>
                              <input
                                 type="number"
                                 min="1"
                                 value={boardingEditor.capacity}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, capacity: e.target.value }))}
                                 className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Amenities</span>
                              <input
                                 value={boardingEditor.amenitiesText}
                                 onChange={(e) => setBoardingEditor((current: any) => ({ ...current, amenitiesText: e.target.value }))}
                                 placeholder="WiFi, Parking, Security"
                                 className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none border border-transparent focus:border-accent-orange transition-all"
                              />
                           </label>

                           <label className="space-y-2 md:col-span-1">
                              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 px-1">Availability</span>
                              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4 border border-transparent focus-within:border-accent-orange transition-all">
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
      <Toast message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
    </div>
  );
};

export default AdminDashboard;

