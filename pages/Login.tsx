
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 overflow-y-auto">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 my-auto animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-indigo-50 to-white p-3 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden border border-indigo-100">
            <img 
              src={APP_CONFIG.logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = APP_CONFIG.placeholderLogo;
              }}
            />
          </div>
          <h2 className="text-3xl font-black text-indigo-950 leading-tight">{APP_CONFIG.siteName}</h2>
          <p className="text-orange-500 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">{APP_CONFIG.siteTagline}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">মোবাইল নাম্বার</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Smartphone size={18} />
              </div>
              <input 
                type="tel"
                className="w-full pl-12 pr-5 py-4 bg-indigo-50/50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700"
                placeholder="নম্বর লিখুন"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">পদবী</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <ChevronDown size={18} />
              </div>
              <select 
                className="w-full pl-12 pr-10 py-4 bg-indigo-50/50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none font-bold text-gray-700"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">পাসওয়ার্ড</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-indigo-50/50 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700"
                placeholder="পাসওয়ার্ড দিন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[11px] font-black text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-3 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <span>লগইন করুন</span>}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 font-bold text-sm">
          অ্যাকাউন্ট নেই? <Link to="/signup" className="text-indigo-600 font-black hover:underline ml-2">রেজিস্ট্রেশন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
