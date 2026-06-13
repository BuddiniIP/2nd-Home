import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  PlusCircle, 
  CreditCard, 
  User as UserIcon, 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Camera,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  DollarSign,
  Search as SearchIcon,
  ShieldCheck,
  ShieldAlert,
  X
} from 'lucide-react';

const OwnerDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<any>(null);
   const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

   const universities = [
      'University of Colombo',
      'University of Peradeniya',
      'University of Moratuwa',
      'University of Kelaniya',
      'University of Sri Jayewardenepura',
   ];

   const faculties = [
      'Computing',
      'Technology',
      'Engineering',
      'Medicine',
      'Science',
      'Arts',
      'Law',
      'Management',
      'Other',
   ];

   const boardingFeatures = [
      'WiFi',
      'Ceiling Fan',
      'Attached Kitchen',
      'Attached Bathroom',
      'Parking',
      'Security',
   ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setUserProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchUser();
  }, []);

   const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

   const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'my-boardings', label: 'My Boardings', icon: <HomeIcon size={18} /> },
    { id: 'my-students', label: 'My Students', icon: <Users size={18} /> },
    { id: 'add-boarding', label: 'Add Boarding', icon: <PlusCircle size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'profile', label: 'Edit Profile', icon: <UserIcon size={18} /> },
  ];

  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [ownerNotifications, setOwnerNotifications] = useState<any[]>([]);
  const [myBoardings, setMyBoardings] = useState<any[]>([]);
  const [studentPayments, setStudentPayments] = useState<any[]>([]);
   const [selectedBoardingId, setSelectedBoardingId] = useState<string | null>(null);
   const [existingImagePaths, setExistingImagePaths] = useState<string[]>([]);
   const [boardingTitle, setBoardingTitle] = useState('');
   const [boardingDescription, setBoardingDescription] = useState('');
   const [boardingAddress, setBoardingAddress] = useState('');
   const [boardingUniversity, setBoardingUniversity] = useState('');
   const [boardingFaculty, setBoardingFaculty] = useState('');
   const [boardingPrice, setBoardingPrice] = useState('');
   const [boardingLatitude, setBoardingLatitude] = useState('');
   const [boardingLongitude, setBoardingLongitude] = useState('');
   const [boardingCapacity, setBoardingCapacity] = useState('');
   const [remainingBeds, setRemainingBeds] = useState('');
   const [selectedGenderPreference, setSelectedGenderPreference] = useState('mixed');
   const [billsIncluded, setBillsIncluded] = useState<'yes' | 'no'>('yes');
   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
   const [boardingImages, setBoardingImages] = useState<File[]>([]);
   const [boardingError, setBoardingError] = useState('');
   const [boardingSuccess, setBoardingSuccess] = useState('');
   const [isSubmittingBoarding, setIsSubmittingBoarding] = useState(false);

   const matchesUniversity = (amenity: string) => universities.includes(amenity);
   const matchesFaculty = (amenity: string) => faculties.includes(amenity);
   const matchesGender = (amenity: string) => ['male only', 'female only', 'mixed'].includes(amenity.toLowerCase());
   const matchesFeature = (amenity: string) => boardingFeatures.includes(amenity);

   const populateBoardingForm = (boarding: any) => {
      const amenities = boarding.amenities || [];
      const latitude = boarding.location?.coordinates?.lat ?? boarding.coordinates?.lat ?? '';
      const longitude = boarding.location?.coordinates?.lng ?? boarding.coordinates?.lng ?? '';
      const description = String(boarding.description || '');
      const cleanDescription = description.split(' | Nearest university:')[0].trim();

      setSelectedBoardingId(boarding.id);
      setExistingImagePaths(boarding.images || []);
      setBoardingTitle(boarding.title || '');
      setBoardingDescription(cleanDescription || description);
      setBoardingAddress(boarding.location?.address || boarding.address || '');
      setBoardingUniversity(amenities.find(matchesUniversity) || '');
      setBoardingFaculty(amenities.find(matchesFaculty) || '');
      setSelectedGenderPreference(amenities.find(matchesGender) || 'mixed');
      setBillsIncluded(amenities.includes('Bills included') ? 'yes' : 'no');
      setSelectedFeatures(amenities.filter(matchesFeature));
      setBoardingPrice(String(boarding.price ?? ''));
      setBoardingLatitude(String(latitude));
      setBoardingLongitude(String(longitude));
      setBoardingCapacity(String(boarding.capacity ?? ''));
      setRemainingBeds(String(boarding.isAvailable ? boarding.capacity ?? '' : 0));
      setBoardingError('');
      setBoardingSuccess('');
      setActiveTab('add-boarding');
   };

   const resetBoardingForm = () => {
      setSelectedBoardingId(null);
      setExistingImagePaths([]);
      setBoardingTitle('');
      setBoardingDescription('');
      setBoardingAddress('');
      setBoardingUniversity('');
      setBoardingFaculty('');
      setBoardingPrice('');
      setBoardingLatitude('');
      setBoardingLongitude('');
      setBoardingCapacity('');
      setRemainingBeds('');
      setSelectedGenderPreference('mixed');
      setBillsIncluded('yes');
      setSelectedFeatures([]);
      setBoardingImages([]);
   };

  const [verificationRequests, setVerificationRequests] = useState<Set<number>>(new Set());
  const [showVerifyModal, setShowVerifyModal] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  const handleConfirmPayment = (id: number) => {
    alert("Payment confirmed! The student will be notified immediately.");
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const handleSendReminder = (name: string) => {
    alert(`Reminder sent to ${name}: "Please pay the rent of the month".`);
  };

  const [studentSearch, setStudentSearch] = useState('');

  const filteredStudents = myStudents.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    s.university.toLowerCase().includes(studentSearch.toLowerCase())
  );

   useEffect(() => {
      const fetchOwnerBoardings = async () => {
         try {
            if (!userProfile?._id && !userProfile?.id) {
               return;
            }

            const response = await fetch(`${apiBase}/api/boardings`);
            const data = await response.json();
            const items = Array.isArray(data.data) ? data.data : [];
            const ownerId = (userProfile._id || userProfile.id || '').toString();

            const ownedBoardings = items
               .filter((boarding: any) => boarding.owner?.id === ownerId)
               .map((boarding: any) => ({
                  id: boarding.id,
                  title: boarding.title,
                  description: boarding.description,
                  location: boarding.location?.address || boarding.address || 'Unknown location',
                  image: boarding.images?.[0] ? `${apiBase}${boarding.images[0]}` : '/images/house_orange.jpg',
                  images: boarding.images || [],
                  price: Number(boarding.price || 0),
                  capacity: Number(boarding.capacity || 0),
                  available: Boolean(boarding.isAvailable),
                  amenities: boarding.amenities || [],
                  raw: boarding,
               }));

            setMyBoardings(ownedBoardings);
         } catch (error) {
            console.error('Failed to fetch owner boardings', error);
         }
      };

      fetchOwnerBoardings();
   }, [apiBase, userProfile]);

   const toggleFeature = (feature: string) => {
      setSelectedFeatures((current) =>
         current.includes(feature)
            ? current.filter((item) => item !== feature)
            : [...current, feature]
      );
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

   const handleBoardingSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setBoardingError('');
      setBoardingSuccess('');
      setIsSubmittingBoarding(true);

      try {
         const token = localStorage.getItem('token');

         if (!token) {
            throw new Error('Please log in again before creating a boarding listing.');
         }

         const priceValue = Number(boardingPrice);
         const capacityValue = Number(boardingCapacity);
         const latitudeValue = Number(boardingLatitude);
         const longitudeValue = Number(boardingLongitude);
         const remainingBedsValue = Number(remainingBeds);

         if (!boardingTitle.trim()) throw new Error('Property name is required.');
         if (!boardingAddress.trim()) throw new Error('Location / address is required.');
         if (!boardingDescription.trim()) throw new Error('Description is required.');
         if (Number.isNaN(priceValue) || priceValue < 0) throw new Error('Enter a valid monthly rent.');
         if (Number.isNaN(capacityValue) || capacityValue < 1) throw new Error('Enter a valid total beds count.');
         if (Number.isNaN(latitudeValue) || Number.isNaN(longitudeValue)) throw new Error('Enter valid latitude and longitude.');

         const uploadedImages = boardingImages.length ? await uploadBoardingImages(token) : existingImagePaths;

         const descriptionParts = [
            boardingDescription.trim(),
         ].filter(Boolean);

         const response = await fetch(`${apiBase}/api/boardings${selectedBoardingId ? `/${selectedBoardingId}` : ''}`, {
            method: selectedBoardingId ? 'PUT' : 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               title: boardingTitle.trim(),
               description: descriptionParts.join(' '),
               price: priceValue,
               address: boardingAddress.trim(),
               coordinates: {
                  lat: latitudeValue,
                  lng: longitudeValue,
               },
               images: uploadedImages,
               amenities: [
                  boardingUniversity,
                  boardingFaculty,
                  selectedGenderPreference,
                  billsIncluded === 'yes' ? 'Bills included' : 'Separate bills',
                  ...selectedFeatures,
               ].filter(Boolean),
               capacity: capacityValue,
               isAvailable: remainingBedsValue > 0,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || 'Failed to create boarding listing.');
         }

         const updatedBoarding = {
            id: data.id,
            title: data.title,
            description: data.description,
            location: data.location?.address || boardingAddress.trim(),
            image: data.images?.[0] ? `${apiBase}${data.images[0]}` : '/images/house_orange.jpg',
            images: data.images || [],
            price: Number(data.price || priceValue),
            capacity: Number(data.capacity || capacityValue),
            available: Boolean(data.isAvailable),
            amenities: data.amenities || [],
            raw: data,
         };

         setMyBoardings((current) => {
            const withoutCurrent = current.filter((boarding) => boarding.id !== data.id);
            return [updatedBoarding, ...withoutCurrent];
         });

         setBoardingSuccess(selectedBoardingId ? 'Boarding listing updated successfully.' : 'Boarding listing created successfully.');
         resetBoardingForm();
         setActiveTab('my-boardings');
      } catch (error: any) {
         setBoardingError(error.message || 'Failed to create boarding listing.');
      } finally {
         setIsSubmittingBoarding(false);
      }
   };

   const handleDeleteBoarding = async (boardingId: string) => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            throw new Error('Please log in again before deleting a boarding listing.');
         }

         const response = await fetch(`${apiBase}/api/boardings/${boardingId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
         });

         if (!response.ok && response.status !== 204) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to delete boarding listing.');
         }

         setMyBoardings((current) => current.filter((boarding) => boarding.id !== boardingId));
      } catch (error: any) {
         alert(error.message || 'Failed to delete boarding listing.');
      }
   };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 space-y-4"
        >
          {/* Header Actions for Owner */}
          <div className="flex justify-between items-center px-4 mb-2">
             <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dashboard</h2>
             <div className="relative">
                <Link 
                  to="/notifications"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-sm border border-gray-100 hover:text-accent-orange transition-colors relative"
                >
                   <Bell size={18} />
                   <span className="absolute top-0 right-0 w-3 h-3 bg-accent-orange border-2 border-white rounded-full" />
                </Link>
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center space-y-4">
             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent-orange shadow-lg">
                <img src="/images/house_orange.jpg" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div className="text-center">
                <h3 className="font-display font-bold text-xl">
                  {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Loading..."}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-wrap break-words px-2">Boarding Owner</p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-50 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col justify-between aspect-square">
                     <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                        <TrendingUp size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Revenue</p>
                        <h4 className="text-4xl font-display font-bold text-black">LKR 0</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">-</p>
                     </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-black rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between aspect-square text-white">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                        <Users size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Students</p>
                        <h4 className="text-4xl font-display font-bold">0 Stays</h4>
                        <p className="text-[10px] text-accent-orange font-bold uppercase tracking-widest">-</p>
                     </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col justify-between aspect-square">
                     <div className="w-12 h-12 bg-accent-orange/10 rounded-2xl flex items-center justify-center text-accent-orange">
                        <Bell size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pending Actions</p>
                        <h4 className="text-4xl font-display font-bold text-black">0 Items</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">-</p>
                     </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'my-students' && (
              <motion.div
                key="my-students"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                 <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                       <h3 className="text-2xl font-display font-bold">My Students</h3>
                       <div className="relative w-full md:w-72 group">
                          <input 
                            type="text" 
                            placeholder="Search students..." 
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange transition-all rounded-full px-12 py-3 text-xs outline-none"
                          />
                          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent-orange transition-colors" size={16} />
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="text-left border-b border-gray-50">
                                <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Student</th>
                                <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Boarding</th>
                                <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Academic</th>
                                <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Status</th>
                                <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {filteredStudents.map(student => (
                                <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                                   <td className="py-6 px-4">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {student.name.charAt(0)}
                                         </div>
                                         <div>
                                            <p className="text-sm font-bold text-black">{student.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{student.phone}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-6 px-4 text-xs font-medium text-gray-500">{student.boarding}</td>
                                   <td className="py-6 px-4">
                                      <p className="text-[10px] font-bold text-black uppercase">{student.faculty}</p>
                                      <p className="text-[10px] text-gray-400">{student.university}</p>
                                   </td>
                                   <td className="py-6 px-4">
                                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${student.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                         {student.status}
                                      </span>
                                   </td>
                                   <td className="py-6 px-4">
                                      {student.status === 'Unpaid' ? (
                                         <button 
                                           onClick={() => handleSendReminder(student.name)}
                                           className="px-6 py-2 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
                                         >
                                            Remind
                                         </button>
                                      ) : (
                                         <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={14} />
                                         </div>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </motion.div>
            )}

                  {activeTab === 'my-boardings' && (
                     <motion.div
                        key="my-boardings"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                     >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                           <div>
                              <h3 className="text-2xl font-display font-bold">My Boardings</h3>
                              <p className="text-sm text-gray-400">Listings created from your owner account.</p>
                           </div>
                           <button
                              type="button"
                              onClick={() => setActiveTab('add-boarding')}
                              className="px-6 py-3 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all"
                           >
                              Add New Boarding
                           </button>
                        </div>

                        {myBoardings.length === 0 ? (
                           <div className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm text-center space-y-4">
                              <h4 className="font-display text-2xl font-bold">No boardings yet</h4>
                              <p className="text-gray-400 text-sm max-w-md mx-auto">
                                 Create your first boarding listing in the Add Boarding tab. After you submit, it will appear here and also in the public student search.
                              </p>
                              <button
                                 type="button"
                                 onClick={() => setActiveTab('add-boarding')}
                                 className="px-6 py-3 rounded-full bg-accent-orange text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                              >
                                 Create Boarding
                              </button>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {myBoardings.map((boarding) => (
                                 <motion.div variants={itemVariants} key={boarding.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-50 group">
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                       <img src={boarding.image} alt={boarding.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                       <div className="absolute top-6 left-6">
                                          <div className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${boarding.available ? 'bg-green-500/90 text-white' : 'bg-black/50 text-white'}`}>
                                             {boarding.available ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                             {boarding.available ? 'Available' : 'Unavailable'}
                                          </div>
                                       </div>
                                       <div className="absolute top-6 right-6">
                                          <button type="button" className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg">
                                             <MoreVertical size={18} />
                                          </button>
                                       </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                       <div className="space-y-2">
                                          <h4 className="text-2xl font-display font-bold">{boarding.title}</h4>
                                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                             <MapPin size={12} className="text-accent-orange" />
                                             {boarding.location}
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                          <div>
                                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Monthly Rent</p>
                                             <p className="text-lg font-bold text-accent-orange">LKR {boarding.price.toLocaleString()}</p>
                                          </div>
                                          <div>
                                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Capacity</p>
                                             <p className="text-lg font-bold">{boarding.capacity} beds</p>
                                          </div>
                                       </div>

                                       <div className="flex flex-wrap gap-2">
                                          {boarding.amenities.slice(0, 4).map((item: string) => (
                                             <span key={item} className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                {item}
                                             </span>
                                          ))}
                                       </div>

                                       <div className="flex gap-4 pt-4 border-t border-gray-50">
                                          <button
                                             type="button"
                                             onClick={() => populateBoardingForm(boarding.raw)}
                                             className="flex-1 py-4 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                          >
                                             Manage Property
                                          </button>
                                          <button
                                             type="button"
                                             onClick={() => handleDeleteBoarding(boarding.id)}
                                             className="px-5 py-4 rounded-full border border-red-200 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                          >
                                             Delete
                                          </button>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        )}
                     </motion.div>
                  )}

            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-display font-bold">Recent Payments</h3>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-600 text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle2 size={14} /> Received
                         </div>
                         <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={14} /> Pending
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {studentPayments.map((p) => (
                        <motion.div 
                          variants={itemVariants}
                          key={p.id} 
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] bg-[#FBFBFB] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all border border-transparent hover:border-gray-50 group"
                        >
                           <div className="flex items-center gap-6 mb-4 md:mb-0">
                              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-black font-bold">
                                 {p.student.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-bold text-black">{p.student}</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.date} • {p.type} Payment</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-12">
                              <div className="text-right">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Amount</p>
                                 <p className="font-bold text-black">LKR {p.amount.toLocaleString()}</p>
                              </div>
                              {p.status === 'Pending' ? (
                                <button 
                                  onClick={() => handleConfirmPayment(p.id)}
                                  className="px-6 py-3 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all shadow-md"
                                >
                                   Confirm Received
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                                   <CheckCircle2 size={16} /> Confirmed
                                </div>
                              )}
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>

                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-l-accent-orange">
                   <div className="space-y-4">
                      <h4 className="text-xl font-bold font-display uppercase tracking-widest">Payment Reminder System</h4>
                      <p className="text-gray-400 text-sm max-w-md">
                        Students can send you reminders if you forget to update their physical payments. Keeping this updated ensures a trustful relationship with your tenants.
                      </p>
                   </div>
                   <button className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all">
                      View Payment Rules
                   </button>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'add-boarding' && (
              <motion.div
                key="add-boarding"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-gray-50">
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-16 h-16 bg-accent-orange rounded-3xl flex items-center justify-center text-white shadow-lg shadow-accent-orange/20">
                         <PlusCircle size={32} />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-3xl font-display font-bold">List New Property</h3>
                         <p className="text-gray-400 text-sm">Expand your reach and find the best university students.</p>
                      </div>
                   </div>

                    {boardingError && (
                      <div className="mb-8 rounded-[2rem] bg-red-50 text-red-600 px-6 py-4 text-sm font-medium">
                        {boardingError}
                      </div>
                    )}

                    {boardingSuccess && (
                      <div className="mb-8 rounded-[2rem] bg-green-50 text-green-600 px-6 py-4 text-sm font-medium">
                        {boardingSuccess}
                      </div>
                    )}

                    <form className="space-y-12" onSubmit={handleBoardingSubmit}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Property Name</label>
                             <input
                               type="text"
                               placeholder="e.g. Green View Premium Hostel"
                               value={boardingTitle}
                               onChange={(e) => setBoardingTitle(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Images</label>
                             <label
                               htmlFor="boarding-images"
                               className="w-full bg-[#F8F8F8] border-2 border-dashed border-gray-200 rounded-[2rem] px-6 py-3 text-sm flex items-center justify-between cursor-pointer hover:border-accent-orange transition-colors"
                             >
                                <span className="text-gray-400">
                                  {boardingImages.length ? `${boardingImages.length} photo(s) selected` : 'Upload property photos...'}
                                </span>
                                <Camera size={18} className="text-gray-400" />
                             </label>
                             <input type="file" id="boarding-images" className="hidden" multiple accept="image/*" onChange={handleBoardingImageChange} />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Location / Address</label>
                             <input
                               type="text"
                               placeholder="No. 12, Main Street, Colombo"
                               value={boardingAddress}
                               onChange={(e) => setBoardingAddress(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Description</label>
                             <textarea
                               rows={3}
                               placeholder="Describe the rooms, facilities, and surroundings"
                               value={boardingDescription}
                               onChange={(e) => setBoardingDescription(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-[2rem] px-6 py-4 text-sm outline-none resize-none"
                               required
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Nearest University</label>
                             <select
                               value={boardingUniversity}
                               onChange={(e) => setBoardingUniversity(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer"
                               required
                             >
                               <option value="">Select university</option>
                               {universities.map((university) => (
                                 <option key={university} value={university}>{university}</option>
                               ))}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Nearest Faculty</label>
                             <select
                               value={boardingFaculty}
                               onChange={(e) => setBoardingFaculty(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none appearance-none cursor-pointer"
                               required
                             >
                               <option value="">Select faculty</option>
                               {faculties.map((faculty) => (
                                 <option key={faculty} value={faculty}>{faculty}</option>
                               ))}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Availability</label>
                             <input
                               type="number"
                               min="0"
                               placeholder="Beds remaining"
                               value={remainingBeds}
                               onChange={(e) => setRemainingBeds(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Monthly Rent (LKR)</label>
                             <input
                               type="number"
                               min="0"
                               placeholder="18000"
                               value={boardingPrice}
                               onChange={(e) => setBoardingPrice(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Latitude</label>
                             <input
                               type="number"
                               step="any"
                               placeholder="6.9271"
                               value={boardingLatitude}
                               onChange={(e) => setBoardingLatitude(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Longitude</label>
                             <input
                               type="number"
                               step="any"
                               placeholder="79.8612"
                               value={boardingLongitude}
                               onChange={(e) => setBoardingLongitude(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Total Beds</label>
                             <input
                               type="number"
                               min="1"
                               placeholder="4"
                               value={boardingCapacity}
                               onChange={(e) => setBoardingCapacity(e.target.value)}
                               className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none"
                               required
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Gender Preference</label>
                             <div className="grid grid-cols-3 gap-4">
                                {[
                                  { value: 'male only', label: 'Male Only' },
                                  { value: 'female only', label: 'Female Only' },
                                  { value: 'mixed', label: 'Mixed' },
                                ].map((gender) => (
                                   <button
                                     key={gender.value}
                                     type="button"
                                     onClick={() => setSelectedGenderPreference(gender.value)}
                                     className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedGenderPreference === gender.value ? 'bg-black text-white' : 'bg-[#F8F8F8] text-gray-500 hover:bg-accent-orange hover:text-white'}`}
                                   >
                                      {gender.label}
                                   </button>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Bills Included?</label>
                             <div className="grid grid-cols-2 gap-4">
                                {[
                                  { value: 'yes', label: 'Yes (Electricity & Water)' },
                                  { value: 'no', label: 'No (Separate Bills)' },
                                ].map((billOption) => (
                                  <button
                                    key={billOption.value}
                                    type="button"
                                    onClick={() => setBillsIncluded(billOption.value as 'yes' | 'no')}
                                    className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${billsIncluded === billOption.value ? 'bg-black text-white' : 'bg-[#F8F8F8] text-gray-500 hover:bg-accent-orange hover:text-white'}`}
                                  >
                                    {billOption.label}
                                  </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Additional Features</label>
                          <div className="flex flex-wrap gap-4">
                             {boardingFeatures.map((feature) => {
                               const isSelected = selectedFeatures.includes(feature);

                               return (
                                 <button
                                   key={feature}
                                   type="button"
                                   onClick={() => toggleFeature(feature)}
                                   className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all group ${isSelected ? 'border-accent-orange bg-accent-orange text-white' : 'bg-gray-50 border-transparent hover:border-accent-orange/20 text-gray-500 hover:text-black'}`}
                                 >
                                    <div className={`w-4 h-4 rounded border transition-colors ${isSelected ? 'border-white bg-white' : 'border-gray-300 group-hover:border-accent-orange'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{feature}</span>
                                 </button>
                               );
                             })}
                          </div>
                       </div>

                       <div className="pt-12 border-t border-gray-50">
                          <button
                            type="submit"
                            disabled={isSubmittingBoarding}
                            className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSubmittingBoarding ? 'Submitting...' : 'Launch Boarding Listing'}
                          </button>
                       </div>
                    </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50 max-w-3xl">
                   <h3 className="text-2xl font-display font-bold mb-10">Owner Settings</h3>
                   <form className="space-y-8">
                      <div className="flex flex-col items-center sm:flex-row gap-8 pb-10 border-b border-gray-50 mb-10">
                         <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-accent-orange transition-colors">
                               <Camera size={16} />
                            </button>
                         </div>
                         <div className="space-y-2 text-center sm:text-left">
                            <h4 className="font-bold text-black">Official Profile Picture</h4>
                            <p className="text-xs text-gray-400 max-w-[200px]">This photo will be visible to students when they view your boardings.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Full Name</label>
                          <input type="text" value={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : ""} readOnly className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4">Email</label>
                          <input type="email" value={userProfile?.email || ""} readOnly className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
                        </div>
                      </div>
                      <div className="pt-6">
                        <button type="button" className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all shadow-lg shadow-black/10">
                          Save Official Settings
                        </button>
                      </div>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl"
            >
              {verifySuccess ? (
                <div className="p-12 text-center space-y-8">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <ShieldCheck size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold">Request Sent!</h3>
                    <p className="text-gray-400 text-sm">Your verification request for "{showVerifyModal.title}" has been sent to the admin. A verifier will visit soon.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowVerifyModal(null);
                      setVerifySuccess(false);
                    }}
                    className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all"
                  >
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-black text-white p-10 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.4em]">Official Verification</p>
                      <h3 className="text-2xl font-display font-bold">Verify Property</h3>
                    </div>
                    <button onClick={() => setShowVerifyModal(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-accent-orange">
                          <ShieldAlert size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Property</p>
                          <p className="text-sm font-bold">{showVerifyModal.title}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed italic">
                        "this is my boarding, i want to verify it"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 text-accent-orange">
                         <Clock size={20} className="shrink-0 mt-1" />
                         <p className="text-[11px] font-medium leading-relaxed">
                           A verifier will visit your property at a random time to verify all details including capacity, facilities, and safety.
                         </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsVerifying(true);
                        setTimeout(() => {
                          setVerificationRequests(prev => new Set(prev).add(showVerifyModal.id));
                          setIsVerifying(false);
                          setVerifySuccess(true);
                        }, 1500);
                      }}
                      disabled={isVerifying}
                      className="w-full bg-black text-white py-6 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-accent-orange transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-4"
                    >
                      {isVerifying ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Send Verification Request'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;
