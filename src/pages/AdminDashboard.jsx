import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User Management State
  const [users, setUsers] = useState([
    { id: 'ST-40291', name: 'Amal Perera', email: 'amal@sjp.ac.lk', role: 'Student', status: 'Active', joined: '2026-01-15' },
    { id: 'OW-88321', name: 'Kamal Silva', email: 'kamal@unistay.lk', role: 'Owner', status: 'Active', joined: '2025-11-20' },
    { id: 'VR-10923', name: 'Ruwan Jayasena', email: 'ruwan@unistay.lk', role: 'Verifier', status: 'Active', joined: '2024-05-10' },
    { id: 'ST-40292', name: 'Nethmi Rajapaksha', email: 'nethmi@cmb.ac.lk', role: 'Student', status: 'Suspended', joined: '2026-02-01' },
    { id: 'OW-88322', name: 'Anoma Perera', email: 'anoma@gmail.com', role: 'Owner', status: 'Active', joined: '2026-03-12' },
  ]);
  const [filterRole, setFilterRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Disputes State
  const [disputeTab, setDisputeTab] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const MOCK_DISPUTES = [
    { id: 'TKT-9021', subject: 'Payment not reflecting for March', user: 'Sachini Fernando', role: 'Student', status: 'Open', date: '2026-04-10', priority: 'High', type: 'Payment', 
      messages: [
        { sender: 'Sachini Fernando', time: 'Apr 10, 10:30 AM', content: 'I paid Rs. 12000 for March via bank transfer but the owner still says unpaid on the portal. Please help.' }
      ]
    },
    { id: 'TKT-9020', subject: 'Student causing disturbance', user: 'Kamal Silva', role: 'Owner', status: 'In Progress', date: '2026-04-08', priority: 'Medium', type: 'Complaint',
      messages: [
        { sender: 'Kamal Silva', time: 'Apr 08, 02:15 PM', content: 'The students in Room 3 are playing loud music after 10 PM. I have warned them twice.' },
        { sender: 'System Admin', time: 'Apr 08, 03:00 PM', content: 'We have sent an official warning to the students. Please let us know if the issue persists.' }
      ]
    },
    { id: 'TKT-9019', subject: 'Verification delay', user: 'Anoma Perera', role: 'Owner', status: 'Resolved', date: '2026-04-05', priority: 'Low', type: 'System',
      messages: [
        { sender: 'Anoma Perera', time: 'Apr 05, 09:00 AM', content: 'I submitted my property 3 days ago but no verifier has visited yet.' },
        { sender: 'System Admin', time: 'Apr 06, 11:30 AM', content: 'A verifier (Ruwan) has been assigned and will visit tomorrow at 10 AM.' }
      ]
    },
  ];

  const filteredTickets = MOCK_DISPUTES.filter(t => disputeTab === 'All' || t.status === disputeTab);

  const STATUS_COLORS = {
    'Open': 'bg-red-50 text-red-600 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
    'Resolved': 'bg-green-50 text-green-600 border-green-200'
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
    setActionMenuOpen(null);
  };

  const ROLE_COLORS = {
    Student: 'bg-blue-50 text-blue-700',
    Owner: 'bg-emerald-50 text-emerald-700',
    Verifier: 'bg-violet-50 text-violet-700',
    Admin: 'bg-orange-50 text-orange-700'
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'users', label: 'User Management', icon: 'fas fa-users' },
    { id: 'disputes', label: 'Disputes & Support', icon: 'fas fa-exclamation-triangle' },
    { id: 'settings', label: 'Platform Settings', icon: 'fas fa-cog' },
  ];

  const renderOverview = () => (
    <div className="flex flex-col gap-[30px] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="bg-[linear-gradient(rgba(255,152,0,0.85),rgba(255,152,0,0.7)),url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white p-[40px] rounded-[15px] shadow-[0_10px_30px_rgba(255,152,0,0.2)]">
        <h1 className="text-[2.2rem] sm:text-[1.8rem] font-bold font-poppins mb-[10px]">
          System Overview
        </h1>
        <p className="text-[1.1rem] opacity-90"><i className="fas fa-shield-alt mr-[8px]"></i>Master Control Panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#2196f3] hover:-translate-y-[5px] transition-transform">
          <div className="w-[40px] h-[40px] bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-[10px]">
            <i className="fas fa-users text-[#2196f3] text-[1.1rem]"></i>
          </div>
          <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">1,248</div>
          <div className="text-[#666] text-[0.8rem] font-medium uppercase">Total Users</div>
          <div className="text-xs text-gray-400 mt-1">+12% this month</div>
        </div>
        <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#4caf50] hover:-translate-y-[5px] transition-transform">
          <div className="w-[40px] h-[40px] bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-[10px]">
            <i className="fas fa-building text-[#4caf50] text-[1.1rem]"></i>
          </div>
          <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">342</div>
          <div className="text-[#666] text-[0.8rem] font-medium uppercase">Active Boardings</div>
          <div className="text-xs text-gray-400 mt-1">+5% this month</div>
        </div>
        <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#ff9800] hover:-translate-y-[5px] transition-transform">
          <div className="w-[40px] h-[40px] bg-[#fff3e0] rounded-full flex items-center justify-center mx-auto mb-[10px]">
            <i className="fas fa-chart-line text-[#ff9800] text-[1.1rem]"></i>
          </div>
          <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">Rs. 4.2M</div>
          <div className="text-[#666] text-[0.8rem] font-medium uppercase">Monthly Revenue</div>
          <div className="text-xs text-gray-400 mt-1">+18% this month</div>
        </div>
        <div className="bg-white rounded-[10px] p-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center border-b-[4px] border-[#9c27b0] hover:-translate-y-[5px] transition-transform">
          <div className="w-[40px] h-[40px] bg-[#f3e5f5] rounded-full flex items-center justify-center mx-auto mb-[10px]">
            <i className="fas fa-check-circle text-[#9c27b0] text-[1.1rem]"></i>
          </div>
          <div className="text-[1.5rem] font-bold text-[#333] mb-[2px]">24</div>
          <div className="text-[#666] text-[0.8rem] font-medium uppercase">Pending Verifications</div>
          <div className="text-xs text-red-400 mt-1">Requires attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        <div className="lg:col-span-2 bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
           <div className="flex justify-between items-center mb-[20px] pb-[15px] border-b-2 border-[#fff3e0]">
             <h3 className="text-[1.3rem] font-bold font-poppins text-[#ff9800]">Platform Growth</h3>
             <select className="p-2 border border-[#ddd] rounded-md text-sm focus:outline-none focus:border-[#ff9800]">
               <option>Last 6 Months</option>
               <option>Last Year</option>
             </select>
           </div>
           <div className="h-64 flex items-end gap-2 mt-4">
             {[40, 55, 45, 70, 65, 85, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#ffe0b2] rounded-t-md relative group cursor-pointer hover:bg-[#ffcc80] transition-colors" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 w-full bg-[#ff9800] rounded-t-md" style={{ height: `${h * 0.7}%` }}></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">M{i+1}</span>
                </div>
             ))}
           </div>
           <div className="flex justify-center gap-6 mt-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#ffe0b2] rounded-sm"></div>
               <span className="text-xs text-gray-500 font-bold uppercase">New Users</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#ff9800] rounded-sm"></div>
               <span className="text-xs text-gray-500 font-bold uppercase">Active Properties</span>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] h-full">
          <div className="flex justify-between items-center mb-[20px] pb-[15px] border-b-2 border-[#fff3e0]">
            <h3 className="text-[1.3rem] font-bold font-poppins text-[#ff9800]">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-[20px]">
            {[
              { id: 1, action: 'New Boarding Registered', details: 'Greenwood Student Annex by Kamal Silva', time: '10 mins ago', icon: 'fas fa-home', color: 'text-[#2196f3]', bg: 'bg-[#e3f2fd]' },
              { id: 2, action: 'User Suspended', details: 'Student ID: ST-40291 (Policy Violation)', time: '1 hour ago', icon: 'fas fa-ban', color: 'text-[#f44336]', bg: 'bg-[#ffebee]' },
              { id: 3, action: 'Verification Completed', details: 'Colombo 07 Girls Hostel (Verified)', time: '2 hours ago', icon: 'fas fa-check-double', color: 'text-[#9c27b0]', bg: 'bg-[#f3e5f5]' },
              { id: 4, action: 'Dispute Resolved', details: 'Ticket #4092 - Payment Issue', time: '5 hours ago', icon: 'fas fa-shield-alt', color: 'text-[#4caf50]', bg: 'bg-[#e8f5e9]' }
            ].map(activity => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="w-8 flex-shrink-0 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${activity.bg} ${activity.color}`}>
                    <i className={activity.icon}></i>
                  </div>
                  {activity.id !== 4 && <div className="w-[2px] h-full bg-[#f0f0f0] absolute top-8 bottom-[-20px]"></div>}
                </div>
                <div className="pb-2">
                  <p className="text-[0.95rem] font-bold text-[#333]">{activity.action}</p>
                  <p className="text-[0.85rem] text-[#666] mt-0.5">{activity.details}</p>
                  <p className="text-[0.75rem] text-[#999] mt-1 font-semibold">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex justify-between items-center mb-[25px] pb-[15px] border-b-2 border-[#fff3e0]">
        <h3 className="text-[1.5rem] font-bold font-poppins text-[#ff9800]">User Management</h3>
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f9f9f9] p-[15px] rounded-[8px] border border-[#eee] mb-[20px]">
        <div className="relative w-full sm:w-[400px]">
          <i className="fas fa-search text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
          <input 
            type="text" 
            placeholder="Search users by name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-[10px] border border-[#ddd] rounded-lg text-[0.9rem] focus:outline-none focus:border-[#ff9800] focus:ring-1 focus:ring-[#ff9800]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <i className="fas fa-filter text-gray-500"></i>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-[#ddd] rounded-lg text-[0.9rem] py-[10px] px-3 focus:outline-none focus:border-[#ff9800] text-[#333] cursor-pointer bg-white"
          >
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Owner">Owners</option>
            <option value="Verifier">Verifiers</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#eee] rounded-[8px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#eee]">
              <th className="p-[15px] font-semibold text-[#666] text-[0.85rem] uppercase tracking-wider">User Info</th>
              <th className="p-[15px] font-semibold text-[#666] text-[0.85rem] uppercase tracking-wider">Role</th>
              <th className="p-[15px] font-semibold text-[#666] text-[0.85rem] uppercase tracking-wider">Status</th>
              <th className="p-[15px] font-semibold text-[#666] text-[0.85rem] uppercase tracking-wider">Joined Date</th>
              <th className="p-[15px] font-semibold text-[#666] text-[0.85rem] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
               <tr>
                 <td colSpan="5" className="p-[30px] text-center text-[#888] font-medium">No users found matching your criteria.</td>
               </tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-[#eee] hover:bg-[#fcfcfc] transition-colors">
                <td className="p-[15px]">
                  <div className="flex items-center gap-3">
                    <div className="w-[35px] h-[35px] rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#666] font-bold text-[0.85rem] uppercase">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-[#333] text-[0.95rem]">{user.name}</p>
                      <p className="text-[0.8rem] text-[#888]">{user.email} • <span className="text-[#666] font-medium">{user.id}</span></p>
                    </div>
                  </div>
                </td>
                <td className="p-[15px]">
                  <span className={`inline-block px-[10px] py-[4px] rounded-[20px] text-[0.75rem] font-bold uppercase tracking-wider ${ROLE_COLORS[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-[15px]">
                  {user.status === 'Active' ? (
                    <span className="inline-flex items-center gap-[5px] text-[0.85rem] font-bold text-[#4caf50]">
                      <i className="fas fa-check-circle"></i> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[5px] text-[0.85rem] font-bold text-[#f44336]">
                      <i className="fas fa-ban"></i> Suspended
                    </span>
                  )}
                </td>
                <td className="p-[15px] text-[#666] text-[0.9rem] font-medium">{user.joined}</td>
                <td className="p-[15px] text-right relative">
                  <button 
                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                    className="w-[30px] h-[30px] flex items-center justify-center text-[#888] hover:text-[#333] hover:bg-[#f0f0f0] rounded-full transition-colors ml-auto"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  
                  {actionMenuOpen === user.id && (
                    <div className="absolute right-[40px] top-[15px] w-[160px] bg-white border border-[#eee] rounded-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] z-[10] py-[5px] overflow-hidden">
                      <button className="w-full text-left px-[15px] py-[10px] text-[0.85rem] font-semibold text-[#555] hover:bg-[#f9f9f9] flex items-center gap-[10px]">
                         <i className="fas fa-eye text-[#888]"></i> View Details
                      </button>
                      <div className="border-t border-[#eee]"></div>
                      {user.status === 'Active' ? (
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className="w-full text-left px-[15px] py-[10px] text-[0.85rem] font-semibold text-[#f44336] hover:bg-[#ffebee] flex items-center gap-[10px]"
                        >
                          <i className="fas fa-ban"></i> Suspend User
                        </button>
                      ) : (
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className="w-full text-left px-[15px] py-[10px] text-[0.85rem] font-semibold text-[#4caf50] hover:bg-[#e8f5e9] flex items-center gap-[10px]"
                        >
                          <i className="fas fa-check-circle"></i> Reactivate User
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDisputes = () => (
    <div className="bg-white rounded-[10px] p-[30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] h-full animate-[fadeIn_0.3s_ease-in-out] flex flex-col">
      <div className="flex justify-between items-center mb-[20px] pb-[15px] border-b-2 border-[#fff3e0] shrink-0">
        <h3 className="text-[1.5rem] font-bold font-poppins text-[#ff9800]">Disputes & Support</h3>
      </div>

      <div className="flex flex-col md:flex-row flex-1 border border-[#eee] rounded-[8px] overflow-hidden min-h-[500px]">
        {/* Inbox List (Left Panel) */}
        <div className={`w-full md:w-[350px] flex flex-col border-r border-[#eee] bg-[#fdfdfd] ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-[15px] border-b border-[#eee] bg-[#f9f9f9]">
            <div className="relative mb-[10px]">
              <i className="fas fa-search text-gray-400 absolute left-[12px] top-1/2 -translate-y-1/2"></i>
              <input type="text" placeholder="Search tickets..." className="w-full pl-[35px] pr-[10px] py-[8px] border border-[#ddd] rounded-[6px] text-[0.85rem] focus:outline-none focus:border-[#ff9800]" />
            </div>
            <div className="flex gap-[5px] overflow-x-auto pb-[5px] hide-scrollbar">
              {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setDisputeTab(tab)}
                  className={`px-[12px] py-[6px] text-[0.7rem] uppercase tracking-widest font-bold rounded-full whitespace-nowrap transition-colors ${
                    disputeTab === tab ? 'bg-[#333] text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f0f0f0]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.map(ticket => (
              <button 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-[15px] border-b border-[#eee] transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-[#fff8e1] border-l-[3px] border-l-[#ff9800]' : 'hover:bg-[#f9f9f9] border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-[5px]">
                  <span className="text-[0.75rem] font-bold text-[#888]">{ticket.id}</span>
                  <span className="text-[0.7rem] text-[#999] font-medium">{ticket.date}</span>
                </div>
                <h3 className="font-bold text-[#333] text-[0.9rem] mb-[5px] line-clamp-1">{ticket.subject}</h3>
                <p className="text-[0.8rem] text-[#666] mb-[8px]">{ticket.user} ({ticket.role})</p>
                <div className="flex gap-[5px]">
                  <span className={`text-[0.65rem] uppercase tracking-wider font-bold px-[8px] py-[2px] rounded-full border ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-wider font-bold px-[8px] py-[2px] rounded-full bg-[#f0f0f0] text-[#666]">
                    {ticket.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Detail (Right Panel) */}
        {selectedTicket ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="p-[20px] border-b border-[#eee] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-[15px]">
                <button className="md:hidden w-[30px] h-[30px] flex items-center justify-center bg-[#f0f0f0] rounded-full text-[#666]" onClick={() => setSelectedTicket(null)}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div>
                  <h2 className="font-bold text-[1.2rem] text-[#333]">{selectedTicket.subject}</h2>
                  <p className="text-[0.8rem] text-[#888]">{selectedTicket.id} • Opened by <span className="font-semibold text-[#555]">{selectedTicket.user}</span></p>
                </div>
              </div>
              <div className="hidden sm:block">
                 <select className="text-[0.85rem] border border-[#ddd] rounded-md py-[6px] px-[10px] focus:outline-none focus:border-[#ff9800] font-medium text-[#555]">
                   <option>Mark as Open</option>
                   <option>Mark In Progress</option>
                   <option>Mark Resolved</option>
                 </select>
              </div>
            </div>
            
            <div className="flex-1 p-[20px] overflow-y-auto bg-[#fdfdfd] flex flex-col gap-[20px]">
              {selectedTicket.messages.map((msg, i) => (
                <div key={i} className={`flex gap-[15px] max-w-[85%] ${msg.sender === 'System Admin' ? 'ml-auto flex-row-reverse' : ''}`}>
                   <div className="w-[35px] h-[35px] rounded-full bg-[#eee] flex-shrink-0 flex items-center justify-center text-[0.8rem] font-bold text-[#555] uppercase">
                     {msg.sender === 'System Admin' ? 'SA' : msg.sender[0]}
                   </div>
                   <div className={`flex flex-col ${msg.sender === 'System Admin' ? 'items-end' : 'items-start'}`}>
                     <div className="flex items-center gap-[10px] mb-[5px]">
                       <span className="text-[0.8rem] font-bold text-[#555]">{msg.sender}</span>
                       <span className="text-[0.7rem] text-[#999] font-medium">{msg.time}</span>
                     </div>
                     <div className={`p-[15px] rounded-[15px] text-[0.9rem] leading-relaxed shadow-sm ${
                       msg.sender === 'System Admin' 
                        ? 'bg-[#ff9800] text-white rounded-tr-none' 
                        : 'bg-white border border-[#eee] text-[#444] rounded-tl-none'
                     }`}>
                       {msg.content}
                     </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="p-[15px] border-t border-[#eee] bg-[#f9f9f9] shrink-0">
              <div className="flex gap-[10px]">
                <textarea 
                  rows={2} 
                  placeholder="Type your reply here..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-[15px] py-[10px] border border-[#ddd] rounded-[10px] text-[0.9rem] focus:outline-none focus:border-[#ff9800] focus:ring-[2px] focus:ring-[#ff9800]/20 resize-none"
                />
                <button onClick={() => {if(replyText) { alert('Reply sent'); setReplyText(''); }}} className="px-[25px] bg-[#333] text-white rounded-[10px] font-bold hover:bg-[#000] transition-colors flex flex-col items-center justify-center gap-[5px] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                  <i className="fas fa-paper-plane"></i> <span className="text-[0.75rem]">Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#ccc] hidden md:flex bg-[#fdfdfd]">
            <i className="fas fa-comments text-[3rem] mb-[15px] text-[#eee]"></i>
            <p className="font-medium text-[#999]">Select a ticket from the inbox to view details</p>
          </div>
        )}
      </div>
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
      <div className={`w-[280px] bg-[#1a1a1a] text-white flex flex-col fixed h-[calc(100vh-80px)] top-[80px] transition-all duration-300 z-[40] ${isSidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}>
        <div className="p-[25px] border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-[15px]">
            <div className="w-[45px] h-[45px] bg-[#ff9800] rounded-full flex items-center justify-center text-white font-bold text-[1.2rem] shadow-[0_0_15px_rgba(255,152,0,0.4)]">
              <i className="fas fa-user-shield"></i>
            </div>
            <div>
              <div className="font-bold text-white text-[1rem] tracking-wide">System Admin</div>
              <div className="text-[0.75rem] text-[#ff9800] font-semibold uppercase tracking-wider">Master Control</div>
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
              className={`flex items-center gap-[15px] w-full text-left p-[14px_18px] rounded-[10px] font-semibold transition-all ${activeTab === item.id ? 'bg-[#ff9800] text-white shadow-[0_4px_12px_rgba(255,152,0,0.3)] translate-x-[5px]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
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
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#ff9800] text-[1.3rem] w-[40px] h-[40px] rounded-[8px] bg-[#fff3e0] flex items-center justify-center">
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="font-bold text-[#ff9800] text-[1.2rem] font-poppins">{navItems.find(i => i.id === activeTab)?.label}</h2>
        </div>

        {/* Tab Contents */}
        <div className="p-[20px] md:p-[40px] flex-1 max-w-[1400px] w-full mx-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
               <div className="w-[50px] h-[50px] border-[5px] border-[#fff3e0] border-t-[#ff9800] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'disputes' && renderDisputes()}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-[10px] p-[40px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center animate-[fadeIn_0.3s_ease-in-out]">
                  <div className="w-[80px] h-[80px] bg-[#fff3e0] rounded-full mx-auto flex items-center justify-center text-[#ff9800] text-[2rem] mb-[20px]">
                    <i className="fas fa-cogs"></i>
                  </div>
                  <h3 className="text-[1.8rem] font-bold text-[#333] mb-[10px]">Platform Settings</h3>
                  <p className="text-[#666] mb-[20px]">System configuration module is currently under development.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
