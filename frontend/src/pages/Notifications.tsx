import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ChevronLeft,
  Mail,
  Zap,
  CreditCard,
  MessageSquare,
  AlertOctagon,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'student');
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);

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

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-widest"
              >
                <ChevronLeft size={14} /> Go Back
              </button>
              <h1 className="text-5xl font-display font-bold text-black tracking-tight">Notifications</h1>
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
                  key={n.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row gap-6 relative group ${n.isRead ? 'bg-white border-gray-50' : 'bg-white border-accent-orange/20 shadow-xl shadow-accent-orange/5'}`}
                >
                   {!n.isRead && (
                      <div className="absolute top-8 right-8 w-3 h-3 bg-accent-orange rounded-full" />
                   )}
                   
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                     n.type === 'urgent' ? 'bg-red-50 text-red-500' : 
                     n.type === 'success' ? 'bg-green-50 text-green-500' : 
                     'bg-gray-50 text-black'
                   }`}>
                      {n.icon}
                   </div>

                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                         <h3 className={`text-lg font-bold font-display ${!n.isRead ? 'text-black' : 'text-gray-500'}`}>{n.title}</h3>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{n.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{n.message}</p>
                   </div>

                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteNotification(n.id)}
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
