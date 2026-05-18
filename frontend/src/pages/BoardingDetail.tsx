import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Wifi, 
  Wind, 
  Utensils, 
  ShieldCheck, 
  Info, 
  ChevronLeft,
  Phone,
  MessageCircle,
  Zap,
  Droplets,
  AlertOctagon,
  Flag,
  X,
  Clock
} from 'lucide-react';

const BoardingDetail = () => {
  const { id } = useParams();

  // Mock data for a detailed boarding
  const boarding = {
    id: id,
    name: "Green View Premium Hostel",
    location: "Colombo 03, near University of Colombo",
    lat: 6.9147,
    lng: 79.8510,
    price: 18000,
    includesBills: true,
    totalBeds: 4,
    remainingBeds: 2,
    gender: "Male Only",
    rating: 4.8,
    reviews: 24,
    description: "Experience premium student living in the heart of Colombo. Our hostel offers a quiet, clean, and secure environment perfect for focused studies. Located just 5 minutes away from the Faculty of Graduate Studies.",
    features: [
      { icon: <Wifi size={20} />, label: "High-speed WiFi" },
      { icon: <Wind size={20} />, label: "Ceiling Fan" },
      { icon: <Utensils size={20} />, label: "Shared Kitchen" },
      { icon: <ShieldCheck size={20} />, label: "24/7 Security" },
      { icon: <Zap size={20} />, label: "Electricity Inc." },
      { icon: <Droplets size={20} />, label: "Water Inc." }
    ],
    nearestUniversity: "University of Colombo",
    nearestFaculty: "Faculty of Graduate Studies",
    images: [
      "/images/room1.jpg",
      "/images/bedroom.jpg",
      "/images/house_white.jpg"
    ]
  };

   const [reviews, setReviews] = useState([
    { id: 1, user: "Amali P.", rating: 5, comment: "Amazing place! Very clean and quiet. The owner is very helpful.", date: "2026-05-01", reported: false },
    { id: 2, user: "Kasun T.", rating: 4, comment: "Good location, but the WiFi can be a bit slow sometimes.", date: "2026-04-25", reported: false }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'guest');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      user: localStorage.getItem('userName') || "Student",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      reported: false
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
    alert("Review added! The owner has been notified.");
  };

  const handleReport = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, reported: true } : r));
    alert("Review reported to admin. They will investigate and take action.");
  };

  const handleReportBoarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setIsSubmittingReport(true);
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardingId: id,
          boardingName: boarding.name,
          reporterName: localStorage.getItem('userName') || "Student",
          reason: reportReason
        })
      });

      if (response.ok) {
        alert("Boarding reported successfully. Admin will review this.");
        setIsReportModalOpen(false);
        setReportReason("");
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error reporting boarding:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Button */}
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent-orange transition-colors"
        >
          <ChevronLeft size={14} /> Back to listings
        </Link>

        {/* Hero Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="rounded-[3rem] overflow-hidden shadow-lg"
           >
              <img src={boarding.images[0]} alt={boarding.name} className="w-full h-full object-cover" />
           </motion.div>
           <div className="grid grid-cols-1 gap-6 h-full">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-[2.5rem] overflow-hidden shadow-md h-[238px]"
              >
                 <img src={boarding.images[1]} alt="Interior" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-[2.5rem] overflow-hidden shadow-md h-[238px]"
              >
                 <img src={boarding.images[2]} alt="Common area" className="w-full h-full object-cover" />
              </motion.div>
           </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-12">
              {/* Title & Stats */}
              <div className="space-y-6">
                 <div className="flex flex-wrap items-center gap-4">
                    <span className="px-5 py-2 bg-accent-orange text-white rounded-full text-[10px] font-bold uppercase tracking-widest">{boarding.gender}</span>
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                       <Star size={16} fill="currentColor" />
                       {boarding.rating} ({reviews.length} Reviews)
                    </div>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-black">{boarding.name}</h1>
                 <div className="flex items-center gap-3 text-gray-400 text-lg">
                    <MapPin size={20} className="text-accent-orange" />
                    {boarding.location}
                 </div>
              </div>

              {/* Academic Proximity */}
              <div className="flex flex-col sm:flex-row gap-8 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                 <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nearest University</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                          <Users size={18} />
                       </div>
                       <p className="font-display font-bold text-xl">{boarding.nearestUniversity}</p>
                    </div>
                 </div>
                 <div className="w-[1px] h-full bg-gray-200 hidden sm:block" />
                 <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nearest Faculty</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-accent-orange text-white rounded-xl flex items-center justify-center">
                          <Info size={18} />
                       </div>
                       <p className="font-display font-bold text-xl">{boarding.nearestFaculty}</p>
                    </div>
                 </div>
              </div>

              {/* Core Details Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-100">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Price</p>
                    <p className="text-2xl font-display font-bold text-black">LKR {boarding.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
                       <Info size={10} /> Bills Included
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Capacity</p>
                    <div className="flex items-center gap-2">
                       <Users size={20} className="text-black" />
                       <p className="text-2xl font-display font-bold text-black">{boarding.totalBeds} Beds</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Remaining</p>
                    <div className="flex items-center gap-2">
                       <Bed size={20} className="text-accent-orange" />
                       <p className="text-2xl font-display font-bold text-accent-orange">{boarding.remainingBeds} Left</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ideal For</p>
                    <p className="text-2xl font-display font-bold text-black">{boarding.gender.split(' ')[0]}</p>
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                 <h3 className="text-2xl font-display font-bold">About the property</h3>
                 <p className="text-gray-500 leading-relaxed text-lg font-light">
                    {boarding.description}
                 </p>
              </div>

              {/* Features */}
              <div className="space-y-8">
                 <h3 className="text-2xl font-display font-bold">Room Features</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {boarding.features.map((feature, i) => (
                       <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-accent-orange/20 transition-all">
                          <div className="text-accent-orange">
                             {feature.icon}
                          </div>
                          <span className="text-xs font-bold text-black uppercase tracking-widest">{feature.label}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Map */}
              <div className="space-y-8">
                 <h3 className="text-2xl font-display font-bold">Location</h3>
                 <div className="h-[400px] rounded-[3rem] overflow-hidden shadow-sm border border-gray-100">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${boarding.lat},${boarding.lng}`}
                      allowFullScreen
                    ></iframe>
                 </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-12 pt-12 border-t border-gray-100">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="text-3xl font-display font-bold">Student Reviews</h3>
                    {isLoggedIn && userRole === 'student' && (
                       <p className="text-[10px] font-bold uppercase tracking-widest text-accent-orange bg-accent-orange/5 px-4 py-2 rounded-full">Your opinion matters</p>
                    )}
                 </div>

                 {/* Add Review Form */}
                 {isLoggedIn && userRole === 'student' && (
                    <form onSubmit={handleAddReview} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">Your Rating</span>
                          <div className="flex gap-2">
                             {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star} 
                                  type="button"
                                  onClick={() => setNewReview({ ...newReview, rating: star })}
                                  className={`transition-all ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-200'}`}
                                >
                                   <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                </button>
                             ))}
                          </div>
                       </div>
                       <textarea 
                         placeholder="Describe your stay experience..." 
                         required
                         value={newReview.comment}
                         onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                         className="w-full bg-white border border-gray-200 rounded-[2rem] px-8 py-6 text-sm focus:outline-none focus:border-accent-orange min-h-[150px] transition-all"
                       />
                       <button type="submit" className="bg-black text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all shadow-xl shadow-black/10">
                          Submit My Review
                       </button>
                    </form>
                 )}

                 {/* Reviews List */}
                 <div className="space-y-8">
                    {reviews.map(review => (
                       <div key={review.id} className="p-8 rounded-[2.5rem] bg-white border border-gray-50 shadow-sm space-y-4 hover:shadow-xl transition-all group">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold">
                                   {review.user.charAt(0)}
                                </div>
                                <div>
                                   <h4 className="font-bold text-black">{review.user}</h4>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</p>
                                </div>
                             </div>
                             <div className="flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                             </div>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>
                          
                          <div className="flex justify-between items-center pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             {userRole === 'owner' && !review.reported && (
                                <button 
                                  onClick={() => handleReport(review.id)}
                                  className="text-[9px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-2"
                                >
                                   <AlertOctagon size={12} /> Report as Fake
                                </button>
                             )}
                             {review.reported && (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-accent-orange flex items-center gap-2">
                                   <Clock size={12} /> Under Investigation
                                </span>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar: Booking */}
           <div className="space-y-8">
              <div className="sticky top-32 bg-black text-white p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total per month</p>
                    <h4 className="text-4xl font-display font-bold">LKR {boarding.price.toLocaleString()}</h4>
                 </div>
                 
                 <div className="space-y-4">
                    <button className="w-full bg-white text-black py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange hover:text-white transition-all shadow-xl">
                       Book This Place
                    </button>
                    <button className="w-full bg-white/10 text-white border border-white/20 py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                       <MessageCircle size={18} /> Chat with Owner
                    </button>
                 </div>

                 <div className="pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-white/60">
                       <ShieldCheck size={16} className="text-green-400" />
                       Physical verification completed
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                       <Info size={16} className="text-accent-orange" />
                       No hidden platform fees
                    </div>
                 </div>

                 {isLoggedIn && userRole === 'student' && (
                    <button 
                      onClick={() => setIsReportModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors"
                    >
                       <Flag size={14} /> Report this boarding
                    </button>
                 )}
              </div>
           </div>
        </div>

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setIsReportModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
                  <AlertOctagon size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-bold">Report Boarding</h3>
                  <p className="text-gray-500 text-sm">Please tell us why you are reporting this property. Your report will be reviewed by our administrators.</p>
                </div>

                <form onSubmit={handleReportBoarding} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">Reason for Reporting</label>
                    <textarea 
                      required
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="e.g. Inaccurate photos, deceptive pricing, safety issues..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-400 min-h-[120px] transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingReport}
                    className="w-full bg-red-500 text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                  >
                    {isSubmittingReport ? "Submitting..." : "Submit Report"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardingDetail;
