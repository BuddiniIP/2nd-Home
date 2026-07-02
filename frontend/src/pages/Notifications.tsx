import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ChevronLeft,
  Zap,
  CreditCard,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  const [notifications, setNotifications] = useState<any[]>([]);
  const goBack = () => { if (window.history.length > 1) navigate(-1); else navigate('/'); };

  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/notifications`, { headers: authHeaders });
      const json = await res.json();
      setNotifications(Array.isArray(json.data) ? json.data : []);
    } catch { /* ignore */ }
  }, [apiBase, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Clock size={24} />;
      case 'payment': return <CreditCard size={24} />;
      case 'verification': return <CheckCircle2 size={24} />;
      case 'report': return <AlertTriangle size={24} />;
      case 'system': return <Zap size={24} />;
      case 'message': return <MessageSquare size={24} />;
      default: return <Bell size={24} />;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-50 text-blue-500';
      case 'payment': return 'bg-green-50 text-green-500';
      case 'verification': return 'bg-purple-50 text-purple-500';
      case 'report': return 'bg-red-50 text-red-500';
      case 'system': return 'bg-yellow-50 text-yellow-500';
      case 'message': return 'bg-cyan-50 text-cyan-500';
      default: return 'bg-gray-50 text-black';
    }
  };

  const formatTime = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(createdAt).toLocaleDateString();
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      await fetch(`${apiBase}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  const deleteNotification = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${apiBase}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { /* ignore */ }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-4">
              <button 
                onClick={goBack}
                className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-widest"
              >
                <ChevronLeft size={14} /> Go Back
              </button>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-black tracking-tight">Notifications</h1>
              <p className="text-gray-400 text-sm">Stay updated with your boarding activity and messages.</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={markAllRead}
                className="px-6 py-3 bg-white text-black border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
              >
                 Mark All Read
              </button>
           </div>
        </div>

        {/* Notifications List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <motion.div 
                  key={n._id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 relative group ${n.isRead ? 'bg-white border-gray-50' : 'bg-white border-accent-orange/20 shadow-xl shadow-accent-orange/5'}`}
                >
                   {!n.isRead && (
                      <div className="absolute top-8 right-8 w-3 h-3 bg-accent-orange rounded-full" />
                   )}
                   
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getIconStyle(n.type)}`}>
                      {getIcon(n.type)}
                   </div>

                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                         <h3 className={`text-lg font-bold font-display ${!n.isRead ? 'text-black' : 'text-gray-500'}`}>{n.title}</h3>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatTime(n.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{n.message}</p>
                   </div>

                   <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteNotification(n._id)}
                        className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 space-y-6"
              >
                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Bell size={48} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display">All caught up!</h3>
                    <p className="text-gray-400 text-sm">No new notifications at the moment.</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
