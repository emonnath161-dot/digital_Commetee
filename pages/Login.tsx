
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { DESIGNATIONS, APP_CONFIG } from '../constants';
import { Eye, EyeOff, Lock, Smartphone, ChevronDown, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mobile || !password || !designation) {
      setError('সবগুলো ফিল্ড পূরণ করুন');
      return;
    }

    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', mobile)
        .eq('password', password)
        .eq('designation', designation)
        .single();

      if (sbError || !data) {
        throw new Error('মোবাইল, পদবী বা পাসওয়ার্ড সঠিক নয়');
      }

      const loggedUser: User = {
        id: data.id,
        name: data.name,
        designation: data.designation,
        mobile: data.mobile,
        bloodGroup: data.blood_group,
        address: data.address || '',
        email: data.email || '',
        profilePic: data.profile_pic || ''
      };

      onLogin(loggedUser);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'লগইন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/20 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-3xl shadow-xl flex items-center justify-center p-4">
             <span className="text-white text-5xl font-black">ॐ</span>
          </div>
          <h2 className="text-2xl font-black text-indigo-950">{APP_CONFIG.siteName}</h2>
          <p className="text-indigo-500 font-bold text-[10px] mt-2 uppercase tracking-widest">{APP_CONFIG.siteTagline}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">মোবাইল নাম্বার</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
              <input 
                type="tel"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-gray-700"
                placeholder="নম্বর লিখুন"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">পদবী</label>
            <div className="relative">
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-gray-700 appearance-none"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-gray-700"
                placeholder="পাসওয়ার্ড দিন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-black text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
            <span>লগইন করুন</span>
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm font-bold">
          অ্যাকাউন্ট নেই? <Link to="/signup" className="text-indigo-600 font-black hover:underline">নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
