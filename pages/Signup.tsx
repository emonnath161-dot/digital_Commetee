
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Designation } from '../types';
import { DESIGNATIONS, BLOOD_GROUPS, APP_CONFIG } from '../constants';
import { UserPlus, Loader2, Smartphone, Lock, MapPin, ChevronDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignupProps {
  users: User[];
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '' as Designation | '',
    mobile: '',
    bloodGroup: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.designation || !formData.mobile || !formData.password || !formData.bloodGroup) {
      setError('অনুগ্রহ করে সবগুলো লাল চিহ্নিত ফিল্ড পূরণ করুন');
      return;
    }

    setLoading(true);
    try {
      const { error: sbError } = await supabase
        .from('profiles')
        .insert([{
          name: formData.name,
          designation: formData.designation,
          mobile: formData.mobile,
          blood_group: formData.bloodGroup,
          password: formData.password,
          address: formData.address,
          profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=4f46e5&color=fff&size=200`,
          email: ''
        }]);

      if (sbError) {
        if (sbError.code === '23505') throw new Error('এই মোবাইল নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে');
        throw sbError;
      }

      onSignup();
      alert('রেজিস্ট্রেশন সফল! এখন লগইন করুন।');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'নিবন্ধনে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 overflow-y-auto py-12">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/20 animate-fadeIn">
        <div className="text-center mb-8">
          {/* LOGO SECTION */}
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-3xl p-3 shadow-inner flex items-center justify-center overflow-hidden">
             <img 
               src={APP_CONFIG.logoUrl} 
               alt="Logo" 
               className="w-full h-full object-contain"
               onError={(e) => {
                 e.currentTarget.src = APP_CONFIG.placeholderLogo;
               }}
             />
          </div>
          <h2 className="text-2xl font-black text-indigo-950">সদস্য নিবন্ধন</h2>
          <p className="text-indigo-500 font-bold text-[10px] mt-1 uppercase tracking-widest">{APP_CONFIG.siteName}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">আপনার নাম *</label>
            <input 
              type="text"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
              placeholder="নাম লিখুন"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">পদবী *</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 appearance-none transition-all"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value as any})}
                  >
                    <option value="">নির্বাচন</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">রক্তের গ্রুপ *</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 appearance-none transition-all"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  >
                    <option value="">নির্বাচন</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">মোবাইল নম্বর *</label>
            <input 
              type="tel"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
              placeholder="০১XXXXXXXXX"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">পাসওয়ার্ড *</label>
            <input 
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
              placeholder="পাসওয়ার্ড দিন"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">ঠিকানা</label>
            <input 
              type="text"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-gray-700 transition-all"
              placeholder="ঠিকানা লিখুন"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black text-center p-2 bg-red-50 rounded-lg border border-red-100">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 active:scale-95 transition-all hover:bg-indigo-700"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
            <span>নিবন্ধন করুন</span>
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm font-bold">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-indigo-600 font-black hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
