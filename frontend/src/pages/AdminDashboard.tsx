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
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [boardingReports, setBoardingReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [verifiers, setVerifiers] = useState<any[]>([]);

  const [filterUni, setFilterUni] = useState('All');
  const [assignmentModal, setAssignmentModal] = useState<any>(null);

  const UNIVERSITIES = [
    'University of Colombo',
    'University of Sri Jayewardenepura',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Peradeniya'
  ];

  const pendingAssignments = [];

  // Mock data for reported reviews
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetchBoardingReports();
    fetchStats();
    fetchPayments();
    fetchMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchBoardingReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      const data = await response.json();
      setBoardingReports(data);
    } catch (error) {
      console.error("Error fetching boarding reports:", error);
    }
  };

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
      let url = `http://localhost:5000/api/reports/${id}/`;
      let method = 'POST';
      
      if (action === 'warn') {
        url += 'warn';
      } else if (action === 'remove') {
        url += 'boarding';
        method = 'DELETE';
      }

      const response = await fetch(url, { method });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
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
                 {(boardingReports.length > 0 || messages.some(m => m.unread)) && (
                   <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                 )}
               </div>
               
                <div className="flex bg-white p-2 rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                  {['analytics', 'users', 'verifiers', 'boarding-reports', 'payments', 'messages'].map((tab) => (
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
                            <h4 className="text-2xl font-display font-bold text-green-500">+24.5%</h4>
                         </div>
                         <TrendingUp size={32} className="text-green-500" />
                      </div>
                      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Reach</p>
                            <h4 className="text-2xl font-display font-bold text-black">12.5k Visits</h4>
                         </div>
                         <BarChart3 size={32} className="text-black" />
                      </div>
                   </div>
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
                      <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"><CreditCard size={14} /> Export CSV</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4">
                         <thead><tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"><th className="px-6 py-2">Transaction ID</th><th className="px-6 py-2">User</th><th className="px-6 py-2">Property</th><th className="px-6 py-2">Amount</th><th className="px-6 py-2">Status</th></tr></thead>
                         <tbody>
                            {payments.map((payment) => (
                               <tr key={payment.id} className="bg-gray-50 hover:bg-white transition-all shadow-sm group">
                                  <td className="px-6 py-6 rounded-l-[2rem] font-mono text-xs">{payment.id}</td>
                                  <td className="px-6 py-6 font-bold text-sm">{payment.user}</td>
                                  <td className="px-6 py-6 text-sm text-gray-500">{payment.boarding}</td>
                                  <td className="px-6 py-6 font-display font-bold">LKR {payment.amount.toLocaleString()}</td>
                                  <td className="px-6 py-6 rounded-r-[2rem]"><span className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${payment.status === 'Success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{payment.status}</span></td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8" >
                   <div className="flex justify-between items-center pb-8 border-b border-gray-50"><h3 className="text-2xl font-display font-bold">User Messages</h3></div>
                   <div className="space-y-6">
                       {messages.map((msg) => (
                        <div key={msg.id} className={`p-8 rounded-[2.5rem] border transition-all ${msg.unread ? 'bg-white border-accent-orange shadow-xl' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${msg.unread ? 'bg-accent-orange text-white' : 'bg-black text-white'}`}>{msg.sender.charAt(0)}</div>
                                 <div><h4 className="font-bold text-black flex items-center gap-3">{msg.sender}{msg.unread && <span className="w-2 h-2 bg-accent-orange rounded-full"></span>}</h4><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{msg.email} • {msg.date}</p></div>
                              </div>
                              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all">Mark as read</button>
                           </div>
                           <h5 className="font-bold text-black mb-2">{msg.subject}</h5>
                           <p className="text-gray-500 text-sm leading-relaxed mb-6">{msg.message}</p>
                           
                           {msg.type === 'Verification' && msg.role === 'verifier' && (
                             <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button onClick={() => alert('Boarding Verified!')} className="flex-1 bg-green-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all">
                                   Approve & Verify
                                </button>
                                <button onClick={() => alert('Rejection sent to owner')} className="flex-1 bg-red-500 text-white py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">
                                   Reject
                                </button>
                             </div>
                           )}
                        </div>
                      ))}
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
                        {boardingReports.map((report) => (
                           <div key={report.id} className="p-8 rounded-[2.5rem] bg-[#FBFBFB] border border-gray-50 space-y-6">
                              <div className="flex justify-between items-start">
                                 <div><h4 className="font-bold text-black">{report.boardingName}</h4><p className="text-[10px] text-gray-400 font-bold uppercase">{report.reporterName}</p></div>
                                 <button 
                                      onClick={() => handleBoardingAction(report.id, 'remove')}
                                      className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-[9px] font-bold uppercase hover:bg-red-200"
                                    >
                                       Remove Boarding
                                    </button>
                              </div>
                           </div>
                        ))}
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
                     <select className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-8 py-4 text-sm outline-none appearance-none cursor-pointer">
                        <option value="">Select a boarding...</option>
                        {pendingAssignments.map(p => <option key={p.id} value={p.id}>{p.title} ({p.location})</option>)}
                     </select>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Visit Date</label>
                     <input type="date" className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-8 py-4 text-sm outline-none" />
                  </div>
                  <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                     <p className="text-[10px] font-bold text-accent-orange uppercase tracking-widest mb-2">Message to Verifier</p>
                     <p className="text-[11px] text-accent-orange italic">
                       "this is the location of the boarding, go and check this boarding in this day."
                     </p>
                  </div>
                  <button 
                    onClick={() => {
                       alert('Task assigned successfully!');
                       setAssignmentModal(null);
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
    </div>
  );
};

export default AdminDashboard;

