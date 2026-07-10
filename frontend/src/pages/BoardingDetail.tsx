import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  AlertOctagon,
  Bed,
  ChevronLeft,
  Clock,
  Droplets,
  Info,
  MessageCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  Wind,
  Utensils,
  Zap,
} from 'lucide-react';

type BoardingResponse = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  owner: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  } | null;
  amenities: string[];
  capacity: number;
  currentOccupants: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

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

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={18} />,
  'ceiling fan': <Wind size={18} />,
  'attached kitchen': <Utensils size={18} />,
  'attached bathroom': <Droplets size={18} />,
  parking: <ShieldCheck size={18} />,
  security: <ShieldCheck size={18} />,
  electricity: <Zap size={18} />,
  'bills included': <Clock size={18} />,
};

const BoardingDetail = () => {
  const { id } = useParams();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  const [boarding, setBoarding] = useState<BoardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryToken, setRetryToken] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (!id) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${apiBase}/api/students/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const already = data.some((s: any) => {
            const lid = s.listing?._id || s.listing?.id || String(s.listing);
            return lid === id;
          });
          setIsAlreadySaved(already);
        }
      } catch { /* ignore */ }
    };
    checkSaved();
  }, [apiBase, id]);

  const handleSaveListing = async () => {
    if (!boarding?.id) return;
    if (actionLoading) return;
    setActionMessage('');
    setActionError('');
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (isAlreadySaved) {
        const res = await fetch(`${apiBase}/api/students/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const found = data.find((s: any) => {
            const lid = s.listing?._id || s.listing?.id || String(s.listing);
            return lid === boarding.id;
          });
          if (found) {
            const delRes = await fetch(`${apiBase}/api/students/saved/${found._id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (delRes.ok) {
              setIsAlreadySaved(false);
              setActionMessage('Listing removed from saved.');
              setActionLoading(false);
              return;
            }
          }
        }
      } else {
        const response = await fetch(`${apiBase}/api/students/saved`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ listing: boarding.id }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to save listing');
        }
        setIsAlreadySaved(true);
        setActionMessage('Listing saved successfully.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to save listing.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestViewing = async () => {
    if (!boarding?.id) return;
    setActionMessage('');
    setActionError('');
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);

      const response = await fetch(`${apiBase}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing: boarding.id,
          startDate: now.toISOString(),
          endDate: tomorrow.toISOString(),
          amount: boarding.price,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request viewing');
      }
      setActionMessage('Viewing request sent successfully.');
    } catch (err: any) {
      setActionError(err.message || 'Failed to request viewing.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchBoarding = async () => {
      if (!id) {
        setError('Missing boarding id.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBase}/api/boardings/${id}`, { signal: controller.signal });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load boarding details.');
        }

        setBoarding(data);
        setActiveImageIndex(0);
      } catch (fetchError: any) {
        if (fetchError?.name !== 'AbortError') {
          setError(fetchError?.message || 'Failed to load boarding details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoarding();

    return () => controller.abort();
  }, [apiBase, id, retryToken]);

  const displayImages = useMemo(() => {
    const images = boarding?.images || [];
    return images.length
      ? images.map((image) => (image.startsWith('http') ? image : `${apiBase}${image}`))
      : ['/images/house_orange.jpg'];
  }, [apiBase, boarding]);

  const amenities = boarding?.amenities || [];
  const university = universities.find((item) => amenities.includes(item)) || 'University not specified';
  const faculty = faculties.find((item) => amenities.includes(item)) || 'Faculty not specified';
  const gender = amenities.find((item) => ['male only', 'female only', 'mixed'].includes(item.toLowerCase())) || 'Mixed';
  const billsIncluded = amenities.some((item) => item.toLowerCase().includes('bill'));
  const availabilityLabel = boarding?.isAvailable ? 'Available now' : 'Currently full';
  const activeImage = displayImages[activeImageIndex] || displayImages[0];
  const previewImages = displayImages.slice(0, 5);
  const coordinates = boarding?.location?.coordinates;
  const hasCoordinates = Boolean(coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number');

  const handleRetry = () => setRetryToken((current) => current + 1);

  return (
    <div className="pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-accent-orange transition-colors"
        >
          <ChevronLeft size={14} /> Back to listings
        </Link>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[420px]">
              <div className="rounded-[3rem] bg-gray-200" />
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-[2.5rem] bg-gray-200" />
                <div className="rounded-[2.5rem] bg-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-10 w-2/3 rounded-2xl bg-gray-200" />
                <div className="h-24 rounded-[2rem] bg-gray-200" />
                <div className="h-64 rounded-[2rem] bg-gray-200" />
              </div>
              <div className="h-[420px] rounded-[3rem] bg-gray-200" />
            </div>
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertOctagon size={28} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-display font-bold text-black">Could not load boarding details</h1>
              <p className="text-gray-500">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-accent-orange transition-colors"
              >
                Try again
              </button>
              <Link
                to="/search"
                className="px-6 py-3 rounded-full bg-gray-100 text-black text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Return to search
              </Link>
            </div>
          </div>
        ) : boarding ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_0.75fr] gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl bg-black min-h-[300px] sm:min-h-[520px]"
              >
                <img
                  src={activeImage}
                  alt={boarding.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="space-y-2 max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">Featured image</p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">{boarding.title}</h2>
                    <p className="text-white/75 text-sm md:text-base">Tap the thumbnails to switch the main view.</p>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur text-[10px] font-bold uppercase tracking-[0.25em]">
                    {activeImageIndex + 1} / {displayImages.length}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {previewImages.map((image, index) => (
                  <motion.button
                    key={`${image}-${index}`}
                    type="button"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative rounded-[2.25rem] overflow-hidden shadow-md bg-gray-100 aspect-[4/3] ring-2 transition-all ${activeImageIndex === index ? 'ring-accent-orange scale-[1.01]' : 'ring-transparent hover:ring-gray-200'}`}
                  >
                    <img
                      src={image}
                      alt={`${boarding.title} preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-8">
                  <div className="space-y-5">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-accent-orange text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                        {gender}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                        {availabilityLabel}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-gray-100 text-black text-[10px] font-bold uppercase tracking-[0.25em]">
                        {boarding.capacity > 1 ? 'Shared boarding' : 'Single room'}
                      </span>
                      {billsIncluded && (
                        <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-[0.25em]">
                          Bills included
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-black">{boarding.title}</h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 text-base md:text-lg">
                        <span className="inline-flex items-center gap-2">
                          <MapPin size={18} className="text-accent-orange" />
                          {boarding.location?.address || 'Address not specified'}
                        </span>
                        <span className="hidden sm:block text-gray-300">•</span>
                        <span className="inline-flex items-center gap-2">
                          <Star size={18} className="text-yellow-500 fill-yellow-500" />
                           --
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-[2rem] bg-white p-5 border border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Monthly Price</p>
                      <p className="mt-2 text-3xl font-display font-bold text-black">LKR {boarding.price.toLocaleString()}</p>
                    </div>
                    <div className="rounded-[2rem] bg-white p-5 border border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Boarded / Capacity</p>
                      <p className="mt-2 text-3xl font-display font-bold text-black">{boarding.currentOccupants || 0} / {boarding.capacity}</p>
                    </div>
                    <div className="rounded-[2rem] bg-white p-5 border border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Posted</p>
                      <p className="mt-2 text-base font-bold text-black">{new Date(boarding.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-black">About this boarding</h2>
                    <p className="text-gray-500 leading-relaxed text-lg">{boarding.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Nearest University</p>
                      <p className="mt-2 text-lg font-display font-bold text-black">{university}</p>
                    </div>
                    <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Faculty</p>
                      <p className="mt-2 text-lg font-display font-bold text-black">{faculty}</p>
                    </div>
                    <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Last Updated</p>
                      <p className="mt-2 text-lg font-display font-bold text-black">{new Date(boarding.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-display font-bold text-black">Amenities</h2>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">What students can expect</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {amenities.length > 0 ? (
                      amenities.map((amenity) => {
                        const iconKey = amenity.toLowerCase();
                        return (
                          <div key={amenity} className="flex items-center gap-4 rounded-[1.5rem] border border-gray-100 bg-white p-5">
                            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                              {amenityIcons[iconKey] || <Info size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-black">{amenity}</p>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Included in this listing</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No amenities were provided for this listing.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-display font-bold text-black">Location</h2>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                      {hasCoordinates ? `${coordinates?.lat}, ${coordinates?.lng}` : 'Coordinates unavailable'}
                    </span>
                  </div>
                  {hasCoordinates ? (
                    <div className="h-[360px] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
                      <iframe
                        title="Boarding location map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=16&output=embed`}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="rounded-[2.5rem] border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
                      Location coordinates are not available for this boarding yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-black text-white rounded-[3rem] p-8 shadow-lg space-y-6 sticky top-36">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Owner contact</p>
                    <h3 className="text-2xl font-display font-bold">{boarding.owner?.name || 'Boarding Owner'}</h3>
                    <p className="text-sm text-white/70 break-all">{boarding.owner?.email || 'No contact email provided'}</p>
                  </div>

                  <div className="rounded-[2rem] bg-white/10 backdrop-blur-sm p-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Users size={18} />
                      <span>{boarding.currentOccupants || 0} / {boarding.capacity} boarded</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Bed size={18} />
                      <span>{boarding.isAvailable ? 'Rooms available' : 'Fully occupied'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Phone size={18} />
                      <span>Contact through the platform</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleRequestViewing}
                      className="w-full rounded-full bg-accent-orange text-white py-4 font-bold text-sm uppercase tracking-[0.25em] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Sending request...' : 'Request viewing'}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleSaveListing}
                      className={`w-full rounded-full py-4 font-bold text-sm uppercase tracking-[0.25em] disabled:opacity-50 disabled:cursor-not-allowed ${isAlreadySaved ? 'bg-accent-orange text-white' : 'bg-white text-black'}`}
                    >
                      {actionLoading ? 'Processing...' : isAlreadySaved ? 'Saved' : 'Save listing'}
                    </button>
                    {actionMessage && (
                      <p className="text-sm text-green-600 font-bold">{actionMessage}</p>
                    )}
                    {actionError && (
                      <p className="text-sm text-red-600 font-bold">{actionError}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Quick facts</p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="mt-0.5 text-accent-orange shrink-0" />
                      <span>Verified listing flow from the owner dashboard.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle size={18} className="mt-0.5 text-accent-orange shrink-0" />
                      <span>Students can review the full property details before contacting the owner.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="mt-0.5 text-accent-orange shrink-0" />
                      <span>Updated listing data is fetched live from the backend.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BoardingDetail;
