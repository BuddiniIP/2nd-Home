import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifierDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pending Verifications State
  const [pending, setPending] = useState([
    { id: 1, title: 'Lake View Student Lodge', owner: 'Amila Bandara', location: 'Gangodawila, Nugegoda', university: 'Univ. of Sri Jayewardenepura', submitted: '2026-04-18', price: 11000, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop', facilities: ['WiFi', 'A/C', 'Parking', 'Study Room'] },
    { id: 2, title: 'Kandy Heights Boarding', owner: 'Nimal Fernando', location: 'Peradeniya Rd, Kandy', university: 'Univ. of Peradeniya', submitted: '2026-04-15', price: 9500, image: 'https://images.unsplash.com/photo-1522771731470-ea457fbe51f5?q=80&w=600&auto=format&fit=crop', facilities: ['WiFi', 'Meals', 'Hot Water'] },
    { id: 3, title: 'Moratuwa Tech Stay', owner: 'Priya Wickrama', location: 'Katubedda, Moratuwa', university: 'Univ. of Moratuwa', submitted: '2026-04-12', price: 13000, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop', facilities: ['WiFi', 'A/C', 'Kitchen', 'CCTV'] },
    { id: 4, title: 'Kelaniya River Side', owner: 'Saman Kumara', location: 'Dalugama, Kelaniya', university: 'Univ. of Kelaniya', submitted: '2026-04-10', price: 8500, image: 'https://images.unsplash.com/photo-1598928506311-c55dd717904c?q=80&w=600&auto=format&fit=crop', facilities: ['WiFi', 'Parking'] },
  ]);
  const [inspectionModal, setInspectionModal] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Inspection form state
  const [checklist, setChecklist] = useState(new Set());
  const [verdict, setVerdict] = useState('verified'); // 'verified' | 'rejected'
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // History State
  const [historyFilter, setHistoryFilter] = useState('all');
  const MOCK_HISTORY = [
    { id: 1, title: 'Greenwood Student Annex', owner: 'Kamal Silva', location: 'Gangodawila, Nugegoda', date: '2026-03-25', verdict: 'Verified', notes: 'All facilities functional. Clean environment. Matches description perfectly.', checksPassed: 9, totalChecks: 9 },
    { id: 2, title: 'Colombo 07 Girls Hostel', owner: 'Anoma Perera', location: 'Colombo 07', date: '2026-03-20', verdict: 'Verified', notes: 'Well maintained. Owner cooperative. Good security measures.', checksPassed: 8, totalChecks: 9 },
    { id: 3, title: 'Katubedda Room Rental', owner: 'Saman Dias', location: 'Katubedda, Moratuwa', date: '2026-03-15', verdict: 'Rejected', notes: 'Electrical wiring unsafe. Kitchen facilities not as described. Needs significant repairs.', checksPassed: 4, totalChecks: 9 },
    { id: 4, title: 'Nugegoda Ladies Annex', owner: 'Kamal Silva', location: 'Nugegoda', date: '2026-03-10', verdict: 'Verified', notes: 'Excellent condition. CCTV installed. Fire extinguishers present.', checksPassed: 9, totalChecks: 9 },
  ];

  // Profile State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.name || 'Ruwan Jayasena',
    email: currentUser?.email || 'ruwan@unistay.lk',
    phone: '+94 77 345 6789',
    employeeId: 'VRF-2024-0012',
    assignedRegion: 'Western Province',
    bio: 'Experienced property verifier with 3 years of service. Specialized in verifying student accommodations across the Western Province.',
  });

  const INSPECTION_CHECKLIST = [
    'Property matches listed address',
    'Room count matches description',
    'Facilities (WiFi, A/C, etc.) are functional',
    'Clean and hygienic conditions',
    'Safe electrical wiring',
    'Adequate water supply',
    'Proper ventilation and lighting',
    'Fire safety measures in place',
    'No structural damage observed',
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const navItems = [
    { id: 'pending', label: 'Pending Verifications', icon: 'fas fa-clipboard-check' },
    { id: 'history', label: 'My Verification History', icon: 'fas fa-history' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
  ];

  const handleInspectionSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setPending(prev => prev.filter(p => p.id !== inspectionModal.id));
    }, 1500);
  };

  const toggleCheck = (item) => {
    setChecklist(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const renderPending = () => (
    <div className="bg-transparent animate-[fadeIn_0.3s_ease-in-out]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[15px] mb-[30px]">
        <div className="bg-white border border-[#eee] rounded-[10px] p-[20px] shadow-sm flex items-center gap-[15px]">
          <div className="w-[50px] h-[50px] bg-[#f5f3ff] rounded-[10px] flex items-center justify-center">
            <i className="fas fa-chart-bar text-[1.5rem] text-[#8b5cf6]"></i>
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Total Checked</p>
            <p className="text-[1.8rem] font-bold text-[#333]">47</p>
          </div>
        </div>
        <div className="bg-white border border-[#eee] rounded-[10px] p-[20px] shadow-sm flex items-center gap-[15px]">
          <div className="w-[50px] h-[50px] bg-[#e8f5e9] rounded-[10px] flex items-center justify-center">
            <i className="fas fa-shield-alt text-[1.5rem] text-[#4caf50]"></i>
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Verified</p>
            <p className="text-[1.8rem] font-bold text-[#4caf50]">38</p>
          </div>
        </div>
        <div className="bg-white border border-[#eee] rounded-[10px] p-[20px] shadow-sm flex items-center gap-[15px]">
          <div className="w-[50px] h-[50px] bg-[#ffebee] rounded-[10px] flex items-center justify-center">
            <i className="fas fa-ban text-[1.5rem] text-[#f44336]"></i>
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-widest text-[#888] font-bold">Rejected</p>
            <p className="text-[1.8rem] font-bold text-[#f44336]">9</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px] mb-[20px]">
        <i className="fas fa-clipboard-check text-[1.5rem] text-[#8b5cf6]"></i>
        <h2 className="text-[1.5rem] font-bold text-[#333]">Pending Verifications</h2>
        <span className="text-[0.7rem] bg-[#f5f3ff] text-[#8b5cf6] px-[10px] py-[3px] rounded-full font-bold ml-[5px]">{pending.length} pending</span>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white border border-[#eee] rounded-[10px] p-[50px] text-center shadow-sm">
          <i className="fas fa-check-circle text-[4rem] text-[#ccc] mb-[15px]"></i>
          <p className="text-[#888] font-medium text-[1.1rem]">All caught up! No pending verifications.</p>
        </div>
      ) : (
        <div className="space-y-[20px]">
          {pending.map(b => (
            <div key={b.id} className="bg-white border border-[#eee] rounded-[10px] overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
              <div className="sm:w-[220px] h-[180px] sm:h-auto flex-shrink-0 relative">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-[20px] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[1.3rem] text-[#333] mb-[5px]">{b.title}</h3>
                  <p className="text-[0.85rem] text-[#666] flex items-center gap-[5px] mb-[5px]"><i className="fas fa-map-marker-alt text-[#8b5cf6]"></i>{b.location}</p>
                  <p className="text-[0.85rem] text-[#8b5cf6] font-bold mb-[10px]">{b.university}</p>
                  <p className="text-[0.9rem] text-[#555]">Owner: <span className="font-bold text-[#333]">{b.owner}</span></p>
                  <p className="text-[#4caf50] text-[1rem] font-bold mt-[5px]">Rs. {b.price.toLocaleString()} / mo</p>
                  <div className="flex gap-[8px] mt-[10px] flex-wrap">
                    {b.facilities.map(f => (
                      <span key={f} className="text-[0.7rem] px-[10px] py-[3px] rounded-full bg-[#f5f3ff] text-[#8b5cf6] font-bold">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-[15px] pt-[15px] border-t border-[#f0f0f0]">
                  <p className="text-[0.8rem] text-[#999] flex items-center gap-[5px] font-medium"><i className="fas fa-clock"></i>Submitted {b.submitted}</p>
                  <div className="flex gap-[10px]">
                    <button onClick={() => setScheduleModal(b)} className="flex items-center gap-[8px] px-[15px] py-[8px] border border-[#ddd] rounded-[6px] text-[0.85rem] font-bold text-[#555] hover:border-[#8b5cf6] hover:text-[#8b5cf6] transition-colors">
                      <i className="fas fa-calendar-alt"></i> Schedule Visit
                    </button>
                    <button onClick={() => {
                        setInspectionModal(b);
                        setChecklist(new Set());
                        setVerdict('verified');
                        setNotes('');
                        setPhotos([]);
                        setSubmitting(false);
                        setSubmitted(false);
                      }} className="flex items-center gap-[8px] px-[15px] py-[8px] bg-[#8b5cf6] text-white rounded-[6px] text-[0.85rem] font-bold hover:bg-[#7c3aed] transition-colors shadow-sm">
                      <i className="fas fa-eye"></i> Inspect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Visit Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
          <div className="bg-white rounded-[15px] w-full max-w-[400px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden relative">
            <div className="bg-[#1e1b2e] px-[25px] py-[20px]">
              <p className="text-[0.7rem] uppercase tracking-widest text-[#8b5cf6] font-bold mb-[5px]">Schedule Visit</p>
              <p className="text-white font-bold text-[1.2rem]">{scheduleModal.title}</p>
            </div>
            <div className="p-[25px] space-y-[15px]">
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#666] font-bold mb-[8px]">Visit Date</label>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full px-[15px] py-[10px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20" />
              </div>
              <div>
                <label className="block text-[0.75rem] uppercase tracking-widest text-[#666] font-bold mb-[8px]">Time</label>
                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full px-[15px] py-[10px] border border-[#ddd] bg-[#f9f9f9] rounded-[8px] text-[0.95rem] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20" />
              </div>
              <div className="flex gap-[10px] pt-[10px]">
                <button onClick={() => { setScheduleModal(null); setScheduleDate(''); setScheduleTime(''); }} className="flex-1 bg-[#8b5cf6] text-white py-[12px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#7c3aed] transition-colors">Confirm</button>
                <button onClick={() => setScheduleModal(null)} className="flex-1 border border-[#ddd] text-[#555] py-[12px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#f5f5f5] transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Form Modal */}
      {inspectionModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[100] flex items-center justify-center p-[20px] overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-[15px] w-full max-w-[700px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] my-[40px] relative animate-[fadeIn_0.3s]">
            <button onClick={() => setInspectionModal(null)} className="absolute top-[15px] right-[15px] w-[30px] h-[30px] bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors z-10 border-none cursor-pointer">
              <i className="fas fa-times"></i>
            </button>

            <div className="bg-[#1e1b2e] px-[30px] py-[25px] rounded-t-[15px]">
              <p className="text-[0.75rem] uppercase tracking-widest text-[#8b5cf6] font-bold mb-[5px]">Inspection Report</p>
              <p className="text-white font-bold text-[1.5rem] mb-[5px]">{inspectionModal.title}</p>
              <p className="text-gray-400 text-[0.85rem] font-medium"><i className="fas fa-map-marker-alt mr-[5px]"></i>{inspectionModal.location} • <i className="fas fa-user mr-[5px]"></i>{inspectionModal.owner}</p>
            </div>

            <div className="p-[30px]">
              {submitted ? (
                <div className="text-center py-[50px]">
                  <div className="w-[80px] h-[80px] bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-[20px]">
                    <i className="fas fa-check text-[2.5rem] text-[#4caf50]"></i>
                  </div>
                  <p className="text-[#333] font-bold text-[1.5rem] mb-[10px]">Inspection Submitted!</p>
                  <p className="text-[#666] text-[1rem] mb-[30px]">Report for "{inspectionModal.title}" has been securely recorded.</p>
                  <button onClick={() => setInspectionModal(null)} className="bg-[#1e1b2e] text-white px-[35px] py-[12px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#111] transition-colors">Done</button>
                </div>
              ) : submitting ? (
                <div className="text-center py-[80px]">
                  <div className="w-[60px] h-[60px] border-[4px] border-[#f5f3ff] border-t-[#8b5cf6] rounded-full animate-spin mx-auto mb-[20px]"></div>
                  <p className="text-[#333] font-bold text-[1.2rem]">Submitting Report...</p>
                </div>
              ) : (
                <div className="space-y-[25px]">
                  {/* Photo Upload */}
                  <div>
                    <h3 className="text-[1rem] font-bold text-[#333] mb-[15px] flex items-center gap-[10px]"><i className="fas fa-camera text-[#8b5cf6]"></i>Live Inspection Photos</h3>
                    <div className="flex flex-wrap gap-[15px]">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-[90px] h-[90px] bg-[#f9f9f9] rounded-[10px] flex items-center justify-center border border-[#eee] group">
                          <i className="fas fa-image text-[2rem] text-[#ccc]"></i>
                          <span className="absolute bottom-[5px] left-[5px] right-[5px] text-[0.6rem] text-[#888] truncate text-center font-bold">{p}</span>
                          <button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-[8px] -right-[8px] w-[22px] h-[22px] bg-[#f44336] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer shadow-md">
                            <i className="fas fa-times text-[0.6rem]"></i>
                          </button>
                        </div>
                      ))}
                      <label className="w-[90px] h-[90px] border-2 border-dashed border-[#ccc] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:border-[#8b5cf6] hover:bg-[#f5f3ff] transition-all">
                        <i className="fas fa-cloud-upload-alt text-[1.5rem] text-[#999] mb-[5px]"></i>
                        <span className="text-[0.65rem] text-[#888] font-bold uppercase">Add</span>
                        <input type="file" accept="image/*" multiple onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setPhotos(prev => [...prev, ...files.map(f => f.name)]);
                        }} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <h3 className="text-[1rem] font-bold text-[#333] mb-[15px] flex items-center gap-[10px]"><i className="fas fa-clipboard-list text-[#8b5cf6]"></i>Inspection Checklist</h3>
                    <div className="space-y-[10px]">
                      {INSPECTION_CHECKLIST.map(item => (
                        <label key={item} className={`flex items-center gap-[15px] px-[20px] py-[15px] border rounded-[10px] cursor-pointer transition-all text-[0.95rem] font-medium ${
                          checklist.has(item) ? 'border-[#4caf50] bg-[#e8f5e9] text-[#2e7d32]' : 'border-[#eee] hover:border-[#ddd] text-[#555]'
                        }`}>
                          <input type="checkbox" checked={checklist.has(item)} onChange={() => toggleCheck(item)} className="w-[18px] h-[18px] accent-[#4caf50] cursor-pointer" />
                          {item}
                        </label>
                      ))}
                    </div>
                    <p className="text-[0.8rem] text-[#888] font-bold mt-[15px]">{checklist.size} / {INSPECTION_CHECKLIST.length} items checked</p>
                  </div>

                  {/* Verdict */}
                  <div>
                    <h3 className="text-[1rem] font-bold text-[#333] mb-[15px]">Verification Decision</h3>
                    <div className="flex gap-[15px]">
                      <button type="button" onClick={() => setVerdict('verified')} className={`flex-1 flex items-center justify-center gap-[10px] py-[15px] rounded-[10px] text-[1rem] font-bold border-2 transition-all ${
                        verdict === 'verified' ? 'border-[#4caf50] bg-[#e8f5e9] text-[#2e7d32]' : 'border-[#eee] text-[#888] hover:border-[#ddd] bg-white'
                      }`}>
                        <i className="fas fa-shield-alt"></i> Verified
                      </button>
                      <button type="button" onClick={() => setVerdict('rejected')} className={`flex-1 flex items-center justify-center gap-[10px] py-[15px] rounded-[10px] text-[1rem] font-bold border-2 transition-all ${
                        verdict === 'rejected' ? 'border-[#f44336] bg-[#ffebee] text-[#c62828]' : 'border-[#eee] text-[#888] hover:border-[#ddd] bg-white'
                      }`}>
                        <i className="fas fa-ban"></i> Rejected
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[0.75rem] uppercase tracking-widest text-[#666] font-bold mb-[10px]">Inspection Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add detailed notes about your inspection findings..." className="w-full px-[20px] py-[15px] border border-[#ddd] bg-[#f9f9f9] rounded-[10px] text-[0.95rem] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20 resize-none font-medium text-[#444]" />
                  </div>

                  {/* Submit */}
                  <button onClick={handleInspectionSubmit} className="w-full bg-[#8b5cf6] text-white py-[18px] text-[0.9rem] uppercase tracking-widest font-bold rounded-[10px] hover:bg-[#7c3aed] transition-colors shadow-md">
                    Submit Inspection Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => {
    const filtered = historyFilter === 'all' ? MOCK_HISTORY : MOCK_HISTORY.filter(h => h.verdict.toLowerCase() === historyFilter);
    return (
      <div className="bg-transparent animate-[fadeIn_0.3s_ease-in-out]">
        <div className="flex items-center justify-between mb-[30px] bg-white p-[25px] rounded-[10px] shadow-sm border border-[#eee]">
          <div className="flex items-center gap-[15px]">
            <i className="fas fa-history text-[1.8rem] text-[#8b5cf6]"></i>
            <h1 className="text-[1.6rem] font-bold text-[#333]">Verification History</h1>
          </div>
          <div className="flex gap-[10px]">
            {['all', 'verified', 'rejected'].map(f => (
              <button key={f} onClick={() => setHistoryFilter(f)} className={`px-[15px] py-[8px] text-[0.75rem] uppercase tracking-widest font-bold rounded-[8px] border-[2px] transition-colors ${
                historyFilter === f ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]' : 'bg-white text-[#666] border-[#eee] hover:border-[#8b5cf6]'
              }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-[20px]">
          {filtered.map(h => (
            <div key={h.id} className="bg-white border border-[#eee] rounded-[10px] p-[25px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[15px]">
                <div className="flex-1">
                  <div className="flex items-center gap-[15px] mb-[10px]">
                    <h3 className="font-bold text-[1.3rem] text-[#333]">{h.title}</h3>
                    <span className={`inline-flex items-center gap-[5px] px-[12px] py-[4px] rounded-[6px] text-[0.75rem] font-bold uppercase tracking-wider ${
                      h.verdict === 'Verified' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffebee] text-[#c62828]'
                    }`}>
                      <i className={h.verdict === 'Verified' ? "fas fa-shield-alt" : "fas fa-ban"}></i>
                      {h.verdict}
                    </span>
                  </div>
                  <p className="text-[0.9rem] text-[#666] flex items-center gap-[8px] mb-[5px] font-medium"><i className="fas fa-map-marker-alt text-[#8b5cf6]"></i>{h.location}</p>
                  <p className="text-[0.85rem] text-[#888] font-medium">Owner: <span className="text-[#555] font-bold">{h.owner}</span></p>
                </div>
                <div className="flex items-center gap-[20px] text-[0.85rem] text-[#666] bg-[#f9f9f9] px-[15px] py-[10px] rounded-[8px] border border-[#eee]">
                  <span className="flex items-center gap-[5px] font-bold"><i className="fas fa-calendar-alt text-[#8b5cf6]"></i>{h.date}</span>
                  <div className="w-[1px] h-[20px] bg-[#ddd]"></div>
                  <span className={`font-bold ${h.checksPassed === h.totalChecks ? 'text-[#4caf50]' : 'text-[#ff9800]'}`}>
                    {h.checksPassed}/{h.totalChecks} Checks Passed
                  </span>
                </div>
              </div>
              <div className="mt-[20px] pt-[15px] border-t border-[#f0f0f0] bg-[#fcfcfc] p-[15px] rounded-[8px]">
                <p className="text-[0.95rem] text-[#555] leading-relaxed"><span className="font-bold text-[#333] mr-[5px]"><i className="fas fa-comment-alt text-[#888] mr-[5px]"></i>Notes:</span> {h.notes}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border border-[#eee] rounded-[10px] p-[60px] text-center shadow-sm mt-[20px]">
            <i className="fas fa-history text-[4rem] text-[#ddd] mx-auto mb-[20px]"></i>
            <p className="text-[#888] font-bold text-[1.2rem]">No {historyFilter} verifications found.</p>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="bg-white rounded-[15px] p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-[#eee] max-w-[800px] mx-auto animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex items-center gap-[15px] mb-[40px] pb-[20px] border-b border-[#eee]">
        <i className="fas fa-user-circle text-[2rem] text-[#8b5cf6]"></i>
        <h1 className="text-[1.8rem] font-bold text-[#333]">Verifier Profile</h1>
      </div>

      <div className="flex items-center gap-[25px] mb-[40px] bg-[#fcfcfc] p-[20px] rounded-[10px] border border-[#f0f0f0]">
        <div className="relative">
          <div className="w-[100px] h-[100px] rounded-full bg-[#f5f3ff] border-[4px] border-white shadow-md flex items-center justify-center text-[#8b5cf6] font-bold text-[2.5rem]">
            {profileForm.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <button className="absolute bottom-[0] right-[0] w-[32px] h-[32px] bg-[#8b5cf6] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#7c3aed] transition-colors border-[2px] border-white cursor-pointer">
            <i className="fas fa-camera text-[0.8rem]"></i>
          </button>
        </div>
        <div>
          <p className="font-bold text-[1.6rem] text-[#333] mb-[5px]">{profileForm.fullName}</p>
          <p className="text-[0.9rem] text-[#666] flex items-center gap-[8px] font-medium bg-[#f0f0f0] px-[12px] py-[4px] rounded-full inline-flex">
            <i className="fas fa-shield-alt text-[#8b5cf6]"></i> Boarding Verifier • {profileForm.assignedRegion}
          </p>
        </div>
      </div>

      <form className="space-y-[25px]" onSubmit={(e) => { e.preventDefault(); alert('Profile saved successfully!'); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Full Name</label>
            <input type="text" value={profileForm.fullName} onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20 transition-all" />
          </div>
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Employee ID</label>
            <input type="text" value={profileForm.employeeId} readOnly className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f0f0f0] text-[#666] font-medium rounded-[8px] cursor-not-allowed" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Email Address</label>
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20 transition-all" />
          </div>
          <div>
            <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Phone Number</label>
            <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20 transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Assigned Region</label>
          <input type="text" value={profileForm.assignedRegion} readOnly className="w-full px-[20px] py-[12px] border border-[#ddd] bg-[#f0f0f0] text-[#666] font-medium rounded-[8px] cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-[0.75rem] uppercase tracking-widest text-[#888] font-bold mb-[8px]">Professional Bio</label>
          <textarea value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} rows={4} className="w-full px-[20px] py-[15px] border border-[#ddd] bg-[#f9f9f9] text-[#333] font-medium rounded-[8px] focus:outline-none focus:border-[#8b5cf6] focus:ring-[2px] focus:ring-[#8b5cf6]/20 transition-all resize-none" />
        </div>
        <div className="pt-[15px] border-t border-[#eee]">
          <button type="submit" className="bg-[#1e1b2e] text-white px-[35px] py-[15px] text-[0.85rem] uppercase tracking-widest font-bold rounded-[8px] hover:bg-[#111] transition-colors shadow-md flex items-center justify-center gap-[10px]">
            <i className="fas fa-save"></i> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );

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
      <div className={`w-[280px] bg-[#1e1b2e] text-white flex flex-col fixed h-[calc(100vh-80px)] top-[80px] transition-all duration-300 z-[40] ${isSidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}>
        <div className="p-[25px] border-b border-white/10 flex items-center justify-between bg-[#151320]">
          <div className="flex items-center gap-[15px]">
            <div className="w-[45px] h-[45px] bg-[rgba(139,92,246,0.2)] rounded-full flex items-center justify-center text-[#8b5cf6] font-bold text-[1.2rem] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              {currentUser?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <div className="font-bold text-white text-[1rem] tracking-wide">{currentUser?.name || 'Ruwan Jayasena'}</div>
              <div className="text-[0.75rem] text-[#8b5cf6] font-semibold uppercase tracking-wider mt-[2px]">Boarding Verifier</div>
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
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold transition-all ${activeTab === item.id ? 'bg-[rgba(139,92,246,0.15)] text-[#8b5cf6] translate-x-[5px] border-l-[3px] border-[#8b5cf6]' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'}`}
            >
              <i className={`${item.icon} w-[24px] text-center text-[1.1rem]`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-[20px] border-t border-white/10">
          <Link to="/login" className="flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold text-[#ff5252] hover:bg-red-500/10 transition-colors">
            <i className="fas fa-sign-out-alt w-[24px] text-center text-[1.1rem]"></i>
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content wrapper */}
      <div className="flex-1 lg:ml-[280px] w-full min-h-full flex flex-col overflow-x-hidden relative">
        {/* Mobile header */}
        <div className="lg:hidden bg-white p-[15px_20px] flex items-center gap-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px] z-[20]">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#8b5cf6] text-[1.3rem] w-[40px] h-[40px] rounded-[8px] bg-[#f5f3ff] flex items-center justify-center">
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="font-bold text-[#1e1b2e] text-[1.2rem] font-poppins">{navItems.find(i => i.id === activeTab)?.label}</h2>
        </div>

        {/* Tab Contents */}
        <div className="p-[20px] md:p-[40px] flex-1 max-w-[1200px] w-full mx-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
               <div className="w-[50px] h-[50px] border-[5px] border-[#f5f3ff] border-t-[#8b5cf6] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'pending' && renderPending()}
              {activeTab === 'history' && renderHistory()}
              {activeTab === 'profile' && renderProfile()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;
