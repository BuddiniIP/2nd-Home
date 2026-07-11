import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  Camera, 
  User, 
  MapPin, 
  ClipboardList, 
  ShieldCheck,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import Toast from '../components/Toast';

const VerifierDashboard = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('pending');
  const [inspectionModal, setInspectionModal] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState('Verifier');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; action: () => void; isRedFlag?: boolean } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form State
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [boardingImageFiles, setBoardingImageFiles] = useState<File[]>([]);
  const [boardingImagePreviews, setBoardingImagePreviews] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [verdict, setVerdict] = useState<'verified' | 'rejected'>('verified');

  const INSPECTION_CHECKLIST = [
    "Location accuracy verified",
    "Room capacity matches listing",
    "Security measures present (Locks/CCTV)",
    "Clean water supply available",
    "Electricity safety confirmed",
    "Bathroom facilities functional",
    "Study area provided",
    "Kitchen facilities available",
    "Proper ventilation"
  ];

  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [userRes, verRes] = await Promise.all([
          fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/api/verifications/my`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserProfile(userData);
          setUserName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Verifier');
        }
        if (verRes.ok) {
          const assignments = await verRes.json();
          const all = Array.isArray(assignments) ? assignments : [];
          setPendingVerifications(all.filter((a: any) => a.status === 'assigned' || a.status === 'accepted' || a.status === 'in_progress'));
          setVerificationHistory(all.filter((a: any) => a.status === 'verified' || a.status === 'rejected' || a.redFlag));
        }
      } catch { /* ignore */ }
    };
    fetchData();
  }, [apiBase]);

  const toggleCheck = (item: string) => {
    const newChecklist = new Set(checklist);
    if (newChecklist.has(item)) newChecklist.delete(item);
    else newChecklist.add(item);
    setChecklist(newChecklist);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${apiBase}/api/verifications/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url || null;
      }
    } catch { /* ignore */ }
    return null;
  };

  const handleInspectionSubmit = async () => {
    if (!selfieFile) {
      setToast({ message: "Please upload a selfie at the boarding location first.", type: 'error' });
      return;
    }
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const selfieUrl = await uploadFile(selfieFile);
      const imageUrls: string[] = [];
      for (const f of boardingImageFiles) {
        const url = await uploadFile(f);
        if (url) imageUrls.push(url);
      }

      const res = await fetch(`${apiBase}/api/verifications/${inspectionModal._id}/inspect`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verdict,
          checklist: Array.from(checklist),
          notes,
          selfie: selfieUrl,
          images: imageUrls,
        }),
      });
      if (res.ok) {
        setVerificationHistory(prev => [{ ...inspectionModal, status: verdict === 'verified' ? 'verified' : 'rejected' }, ...prev]);
        setPendingVerifications(prev => prev.filter((a: any) => a._id !== inspectionModal._id));
        setIsSubmitted(true);
      } else {
      const data = await res.json();
      setToast({ message: data.message || 'Failed to submit inspection', type: 'error' });
    }
  } catch {
    setToast({ message: 'Failed to submit inspection. Please try again.', type: 'error' });
  }
  finally {
    setIsSubmitting(false);
  }
};
  const handleVerifierProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const res = await fetch(`${apiBase}/api/auth/upload/profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data.profilePicture;
        setUserProfile((prev: any) => prev ? { ...prev, profilePicture: url } : prev);
        localStorage.setItem('profilePicture', url);
        window.dispatchEvent(new Event('profile-pic-updated'));
      }
    } catch { /* ignore */ }
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="pb-16 sm:pb-24 px-4 sm:px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 sm:gap-12">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 space-y-4"
        >
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-50 flex flex-col items-center space-y-4">
             <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B5CF6] shadow-lg flex items-center justify-center bg-violet-50 text-[#8B5CF6]">
                   {userProfile?.profilePicture ? (
                     <img src={userProfile.profilePicture.startsWith('http') ? userProfile.profilePicture : `${apiBase}${userProfile.profilePicture}`} alt={userName} className="w-full h-full object-cover" />
                   ) : (
                     <User size={48} />
                   )}
                </div>
              </div>
             <div className="text-center">
                <h3 className="font-display font-bold text-xl">{userName}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Verifier</p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-50">
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Clock size={18} />
              Pending Tasks
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <CheckCircle2 size={18} />
              History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <User size={18} />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'pending' && (
              <motion.div
                key="pending"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4 px-4">
                  <h2 className="text-2xl font-display font-bold">Pending Inspections</h2>
                  <span className="bg-violet-100 text-[#8B5CF6] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{pendingVerifications.length} Assignments</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingVerifications.map((task: any) => {
                    const listing = task.listing || {};
                    const owner = listing.owner || {};
                    const ownerName = `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Owner';
                    const deadline = task.visitDate ? new Date(task.visitDate).toLocaleDateString() : 'Not scheduled';
                    const isAssign = task.status === 'assigned';
                    const isAccepted = task.status === 'accepted' || task.status === 'in_progress';
                    const responseDeadline = task.verifierResponseDeadline ? new Date(task.verifierResponseDeadline).getTime() : 0;
                    const timeLeftMs = responseDeadline - Date.now();
                    const timeLeftMins = Math.max(0, Math.floor(timeLeftMs / 60000));
                    const timeLeftSecs = Math.max(0, Math.floor((timeLeftMs % 60000) / 1000));
                    const expired = isAssign && timeLeftMs <= 0;
                    return (
                    <div key={task._id || task.id} className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-50 space-y-6 hover:shadow-xl hover:shadow-black/5 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold">{listing.title || 'Untitled Boarding'}</h4>
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <MapPin size={12} className="text-[#8B5CF6]" />
                            {listing.address || 'Address not set'}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${isAccepted ? 'bg-purple-100 text-purple-600' : isAssign ? 'bg-amber-100 text-amber-700' : 'bg-gray-50'}`}>
                          {isAccepted ? 'Accepted' : isAssign ? 'Response Needed' : task.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-4 border-y border-gray-50">
                        <div className="space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Owner</p>
                          <p className="text-sm font-bold">{ownerName}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Visit Date</p>
                          <p className="text-sm font-bold text-red-500">{deadline}</p>
                        </div>
                      </div>

                      {isAssign && !expired && (
                        <div>
                          <div className="bg-amber-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                            <Clock size={16} className="text-amber-600 shrink-0" />
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Response Required</p>
                              <p className="text-xs text-amber-600">You have <strong>{timeLeftMins}m {timeLeftSecs}s</strong> to accept or reject this assignment.</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`${apiBase}/api/verifications/${task._id}/respond`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                  body: JSON.stringify({ accept: true }),
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setPendingVerifications(prev => prev.map(t => t._id === task._id ? { ...t, status: 'accepted', verifierAccepted: true } : t));
                                  setToast({ message: 'You have accepted the assignment! You can now start the inspection.', type: 'success' });
                                } else { const d = await res.json(); setToast({ message: d.message || 'Failed to accept', type: 'error' }); }
                              } catch { setToast({ message: 'Failed to accept assignment', type: 'error' }); }
                            }} className="flex-1 py-3 bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all">Accept</button>
                            <button onClick={() => setConfirmDialog({ message: 'Reject this verification assignment?', action: async () => {
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`${apiBase}/api/verifications/${task._id}/respond`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                  body: JSON.stringify({ accept: false }),
                                });
                                if (res.ok) {
                                  setPendingVerifications(prev => prev.filter(t => t._id !== task._id));
                                  setToast({ message: 'Assignment rejected.', type: 'info' });
                                } else { const d = await res.json(); setToast({ message: d.message || 'Failed to reject', type: 'error' }); }
                              } catch { setToast({ message: 'Failed to reject assignment', type: 'error' }); }
                            }})} className="flex-1 py-3 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all">Reject</button>
                          </div>
                        </div>
                      )}

                      {isAssign && expired && (
                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Response window expired</p>
                          <p className="text-xs text-gray-400 mt-1">This assignment has been released.</p>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="space-y-3">
                          <button onClick={() => setInspectionModal(task)} className="w-full py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B5CF6] transition-all">Start Inspection</button>
                          <button onClick={() => setConfirmDialog({ message: 'Cancel this accepted assignment? This will mark a red flag on your record.', isRedFlag: true, action: async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const res = await fetch(`${apiBase}/api/verifications/${task._id}/cancel-accepted`, {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              if (res.ok) {
                                setPendingVerifications(prev => prev.filter(t => t._id !== task._id));
                                setToast({ message: 'Assignment cancelled. A red flag has been recorded.', type: 'error' });
                              } else { const d = await res.json(); setToast({ message: d.message || 'Failed to cancel', type: 'error' }); }
                            } catch { setToast({ message: 'Failed to cancel assignment', type: 'error' }); }
                          }})} className="w-full py-3 bg-red-50 text-red-500 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all border border-red-200">Cancel Assignment (Red Flag)</button>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-50"
              >
                <h3 className="text-2xl font-display font-bold mb-8">Verification History</h3>
                <div className="space-y-4">
                  {verificationHistory.map((item: any) => {
                    const listing = item.listing || {};
                    const owner = listing.owner || {};
                    const ownerName = `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Owner';
                    const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '';
                    const isVerified = item.status === 'verified';
                    const isRedFlag = item.redFlag || item.verifierCancelledAfterAccept;
                    return (
                    <div key={item._id || item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${isRedFlag ? 'bg-red-600' : isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isRedFlag ? <AlertCircle size={24} /> : isVerified ? <ShieldCheck size={24} /> : <X size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-black">{listing.title || 'Untitled Boarding'}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ownerName} • {dateStr}</p>
                          {isRedFlag && <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1 inline-block">⚠ Red Flag — Cancelled after acceptance</span>}
                        </div>
                      </div>
                      <span className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${isRedFlag ? 'bg-red-100 text-red-600' : isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isRedFlag ? 'Cancelled (Red Flag)' : item.status}
                      </span>
                    </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-[3.5rem] p-6 sm:p-10 shadow-sm border border-gray-50 max-w-3xl">
                   <h3 className="text-2xl font-display font-bold mb-6 sm:mb-10">Edit Profile</h3>
                   <form className="space-y-6 sm:space-y-8">
                      <div className="flex flex-col items-center sm:flex-row gap-4 sm:gap-8 pb-6 sm:pb-10 border-b border-gray-50 mb-6 sm:mb-10">
                         <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                               <img src={userProfile?.profilePicture ? (userProfile.profilePicture.startsWith('http') ? userProfile.profilePicture : `${apiBase}${userProfile.profilePicture}`) : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                           <button
                             type="button"
                             className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-[#8B5CF6] transition-colors shadow-lg"
                             onClick={() => document.getElementById('verifier-profile-edit-upload')?.click()}
                           >
                              <Camera size={16} />
                           </button>
                           <input type="file" id="verifier-profile-edit-upload" className="hidden" accept="image/*" onChange={handleVerifierProfileUpload} />
                         </div>
                         <div className="space-y-2 text-center sm:text-left">
                            <h4 className="font-bold text-black">Profile Photo</h4>
                            <p className="text-xs text-gray-400 max-w-[200px] sm:max-w-none">Update your verifier profile picture for official identification.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Full Name</label>
                          <input type="text" value={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : ""} readOnly className="w-full bg-gray-50 border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email</label>
                          <input type="email" value={userProfile?.email || ""} readOnly className="w-full bg-gray-50 border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                      </div>
                      <div className="pt-6">
                        <button type="button" onClick={() => navigate('/profile')} className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B5CF6] transition-all shadow-lg shadow-black/10">
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

      {/* Inspection Modal */}
      <AnimatePresence>
        {inspectionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="bg-black text-white p-10 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.4em]">Inspection Report</p>
                  <h3 className="text-3xl font-display font-bold">{inspectionModal.title}</h3>
                </div>
                <button onClick={() => setInspectionModal(null)} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-12">
                {isSubmitted ? (
                   <div className="py-20 text-center space-y-6">
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                         <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-display font-bold">Inspection Submitted!</h3>
                      <p className="text-gray-400 max-w-md mx-auto">The detailed report has been sent to the Admin for final verification.</p>
                      <button 
                          onClick={() => {
                            setInspectionModal(null);
                            setIsSubmitted(false);
                            setSelfieFile(null);
                            setSelfiePreview(null);
                            setBoardingImageFiles([]);
                            setBoardingImagePreviews([]);
                            setChecklist(new Set());
                          }}
                        className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
                      >
                         Return to Tasks
                      </button>
                   </div>
                ) : isSubmitting ? (
                   <div className="py-20 text-center space-y-6">
                      <div className="w-16 h-16 border-4 border-gray-100 border-t-accent-orange rounded-full animate-spin mx-auto"></div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processing Report...</p>
                   </div>
                ) : (
                  <>
                    {/* Visual Evidence Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                           <User size={12} className="text-[#8B5CF6]" /> Selfie at Boarding
                        </label>
                         {selfiePreview ? (
                           <div className="relative aspect-video bg-gray-50 rounded-[2rem] overflow-hidden group border border-gray-100 shadow-inner">
                              <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <button onClick={() => { setSelfieFile(null); setSelfiePreview(null); }} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Trash2 size={20} />
                                 </button>
                              </div>
                              <div className="absolute bottom-4 left-6 text-[10px] font-bold text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                 {selfieFile?.name || 'selfie.jpg'}
                              </div>
                           </div>
                         ) : (
                           <label className="block aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:border-[#8B5CF6] hover:bg-violet-50 transition-all">
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelfieFile(file);
                                  setSelfiePreview(URL.createObjectURL(file));
                                }
                              }} />
                              <div className="h-full flex flex-col items-center justify-center space-y-3">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                                    <Camera size={24} />
                                 </div>
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Take/Upload Selfie</span>
                              </div>
                           </label>
                         )}
                      </div>

                      <div className="space-y-4">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                              <ImageIcon size={12} className="text-[#8B5CF6]" /> Property Images
                           </label>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {boardingImagePreviews.map((preview, idx) => (
                                <div key={idx} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100">
                                   <img src={preview} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                                   <button onClick={() => {
                                     setBoardingImageFiles(prev => prev.filter((_, i) => i !== idx));
                                     setBoardingImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                   }} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                      <X size={12} />
                                   </button>
                                </div>
                              ))}
                              <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#8B5CF6] hover:bg-violet-50 transition-all flex flex-col items-center justify-center">
                                 <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                   const files = Array.from(e.target.files || []);
                                   for (const f of files) {
                                     setBoardingImageFiles(prev => [...prev, f]);
                                     setBoardingImagePreviews(prev => [...prev, URL.createObjectURL(f)]);
                                   }
                                 }} />
                                 <Plus size={20} className="text-gray-400" />
                              </label>
                           </div>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">{boardingImagePreviews.length} Images Attached</p>
                      </div>
                    </div>

                    {/* Checklist Section */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                          <ClipboardList size={12} className="text-[#8B5CF6]" /> Inspection Checklist
                       </label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {INSPECTION_CHECKLIST.map((item) => (
                            <button 
                              key={item}
                              onClick={() => toggleCheck(item)}
                              className={`flex items-center gap-4 p-6 rounded-[2rem] text-left transition-all border ${
                                checklist.has(item) 
                                ? 'bg-green-50 border-green-100 text-green-700' 
                                : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200'
                              }`}
                            >
                               <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${checklist.has(item) ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-transparent'}`}>
                                  <Check size={14} />
                               </div>
                               <span className="text-xs font-bold">{item}</span>
                            </button>
                          ))}
                       </div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">{checklist.size} of {INSPECTION_CHECKLIST.length} Matched</p>
                    </div>

                    {/* Final Result */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                          <AlertCircle size={12} className="text-[#8B5CF6]" /> Verification Decision
                       </label>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setVerdict('verified')}
                            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest transition-all border ${verdict === 'verified' ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                          >
                             <ShieldCheck size={18} /> Verified
                          </button>
                          <button 
                            onClick={() => setVerdict('rejected')}
                            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest transition-all border ${verdict === 'rejected' ? 'bg-red-500 text-white shadow-xl shadow-red-500/10' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                          >
                             <AlertCircle size={18} /> Rejected
                          </button>
                       </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                          Inspection Notes
                       </label>
                       <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add detailed feedback about the boarding state..."
                        className="w-full bg-gray-50 border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-[2rem] px-8 py-6 text-sm outline-none min-h-[120px] resize-none"
                       />
                    </div>

                    <button 
                      onClick={handleInspectionSubmit}
                      className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10"
                    >
                      Finalize & Send Report
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }} transition={{ type: "spring", duration: 0.4 }} className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-8 sm:p-10 text-center space-y-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${confirmDialog?.isRedFlag ? 'bg-red-600/10' : 'bg-red-50'}`}>
                  <AlertCircle size={32} className={confirmDialog?.isRedFlag ? 'text-red-600' : 'text-red-500'} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold">Are you sure?</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{confirmDialog?.message}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDialog(null)} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">Keep</button>
                  <button onClick={() => { confirmDialog?.action(); setConfirmDialog(null); }} className={`flex-1 py-4 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg ${confirmDialog?.isRedFlag ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}>{confirmDialog?.isRedFlag ? 'Cancel & Flag' : 'Confirm'}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toast message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
    </div>
  );
};

export default VerifierDashboard;
