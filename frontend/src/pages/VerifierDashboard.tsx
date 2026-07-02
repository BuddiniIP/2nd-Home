import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const VerifierDashboard = () => {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('pending');
  const [inspectionModal, setInspectionModal] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState('Verifier');

  // Form State
  const [selfie, setSelfie] = useState<string | null>(null);
  const [boardingImages, setBoardingImages] = useState<string[]>([]);
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
          setUserName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Verifier');
        }
        if (verRes.ok) {
          const assignments = await verRes.json();
          const all = Array.isArray(assignments) ? assignments : [];
          setPendingVerifications(all.filter((a: any) => a.status === 'pending' || a.status === 'in_progress'));
          setVerificationHistory(all.filter((a: any) => a.status === 'verified' || a.status === 'rejected'));
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

  const handleInspectionSubmit = async () => {
    if (!selfie) {
      alert("Please upload a selfie at the boarding location first.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
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
          selfie,
          images: boardingImages,
        }),
      });
      if (res.ok) {
        setVerificationHistory(prev => [{ ...inspectionModal, status: verdict === 'verified' ? 'verified' : 'rejected' }, ...prev]);
        setPendingVerifications(prev => prev.filter((a: any) => a._id !== inspectionModal._id));
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to submit inspection');
      }
    } catch {
      alert('Failed to submit inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 space-y-4"
        >
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center space-y-4">
             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8B5CF6] shadow-lg flex items-center justify-center bg-violet-50 text-[#8B5CF6]">
                <User size={48} />
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
                    return (
                    <div key={task._id || task.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-6 hover:shadow-xl hover:shadow-black/5 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold">{listing.title || 'Untitled Boarding'}</h4>
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <MapPin size={12} className="text-[#8B5CF6]" />
                            {listing.address || 'Address not set'}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">{task.status}</span>
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

                      <button 
                        onClick={() => setInspectionModal(task)}
                        className="w-full py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B5CF6] transition-all"
                      >
                        Start Inspection
                      </button>
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
                className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50"
              >
                <h3 className="text-2xl font-display font-bold mb-8">Verification History</h3>
                <div className="space-y-4">
                  {verificationHistory.map((item: any) => {
                    const listing = item.listing || {};
                    const owner = listing.owner || {};
                    const ownerName = `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Owner';
                    const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '';
                    const isVerified = item.status === 'verified';
                    return (
                    <div key={item._id || item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isVerified ? <ShieldCheck size={24} /> : <X size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-black">{listing.title || 'Untitled Boarding'}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ownerName} • {dateStr}</p>
                        </div>
                      </div>
                      <span className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {item.status}
                      </span>
                    </div>
                    );
                  })}
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

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
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
                          setSelfie(null);
                          setBoardingImages([]);
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
                        {selfie ? (
                          <div className="relative aspect-video bg-gray-50 rounded-[2rem] overflow-hidden group border border-gray-100 shadow-inner">
                             <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                <Camera size={48} />
                             </div>
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => setSelfie(null)} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                   <Trash2 size={20} />
                                </button>
                             </div>
                             <div className="absolute bottom-4 left-6 text-[10px] font-bold text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                selfie_verified.jpg
                             </div>
                          </div>
                        ) : (
                          <label className="block aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:border-[#8B5CF6] hover:bg-violet-50 transition-all">
                             <input type="file" className="hidden" onChange={(e) => setSelfie(e.target.files?.[0]?.name || null)} />
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
                          {boardingImages.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100">
                               <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                  <ImageIcon size={20} />
                               </div>
                               <button onClick={() => setBoardingImages(boardingImages.filter((_, i) => i !== idx))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                  <X size={12} />
                               </button>
                            </div>
                          ))}
                          <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#8B5CF6] hover:bg-violet-50 transition-all flex flex-col items-center justify-center">
                             <input type="file" className="hidden" multiple onChange={(e) => {
                               const files = Array.from(e.target.files || []) as File[];
                               setBoardingImages([...boardingImages, ...files.map(f => f.name)]);
                             }} />
                             <Plus size={20} className="text-gray-400" />
                          </label>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">{boardingImages.length} Images Attached</p>
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
                        className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-[2rem] px-8 py-6 text-sm outline-none min-h-[120px] resize-none"
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
    </div>
  );
};

export default VerifierDashboard;
