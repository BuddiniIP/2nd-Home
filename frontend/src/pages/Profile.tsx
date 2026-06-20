import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Save, Camera, Loader2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', university: '', role: '', profilePicture: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const goBack = () => { if (window.history.length > 1) navigate(-1); else navigate('/'); };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      const fd = new FormData();
      fd.append('profilePicture', file);
      const res = await fetch(`${apiBase}/api/auth/upload/profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data.path;
        setForm(prev => ({ ...prev, profilePicture: url }));
        localStorage.setItem('profilePicture', url);
      }
    } catch {}
    finally { setUploadingPic(false); }
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${apiBase}/api/auth/me`, { headers: authHeaders })
      .then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.message); return data; })
      .then(data => setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        university: data.university || '',
        role: data.role || '',
        profilePicture: data.profilePicture || '',
      }))
      .catch(() => setMessage('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          university: form.university,
        }),
      });
      if (res.ok) setMessage('Profile updated successfully');
      else { const d = await res.json(); setMessage(d.message || 'Update failed'); }
    } catch { setMessage('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-4">
          <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-widest">
            <ChevronLeft size={14} /> Go Back
          </button>
          <h1 className="text-5xl font-display font-bold text-black tracking-tight">My Profile</h1>
          <p className="text-gray-400 text-sm">Manage your personal information.</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 space-y-8 animate-pulse">
            <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
              <div className="w-20 h-20 rounded-full bg-gray-100" />
              <div className="space-y-3"><div className="h-5 bg-gray-100 rounded-full w-40" /><div className="h-3 bg-gray-100 rounded-full w-20" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({length: 4}).map((_, i) => <div key={i} className="space-y-2"><div className="h-3 bg-gray-100 rounded-full w-20" /><div className="h-12 bg-gray-100 rounded-full" /></div>)}
            </div>
          </div>
        ) : (
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative overflow-hidden">
                {form.profilePicture ? (
                  <img src={`${apiBase}${form.profilePicture}`} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingPic} className="absolute -bottom-1 -right-1 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50">
                  {uploadingPic ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                </button>
              </div>
            <div>
              <h2 className="text-xl font-bold">{form.firstName} {form.lastName}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{form.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Email</label>
              <input disabled value={form.email} className="w-full bg-gray-100 border border-transparent rounded-full px-6 py-4 text-sm text-gray-400 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">University</label>
              <input name="university" value={form.university} onChange={handleChange} className="w-full bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-4 text-sm outline-none" />
            </div>
          </div>

          {message && (
            <div className={`text-sm font-bold text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={saving} className="w-full py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
        )}
      </div>
    </div>
  );
};

export default Profile;
