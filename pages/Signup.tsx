
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Designation } from '../types';
import { DESIGNATIONS, BLOOD_GROUPS } from '../constants';
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

    // Basic Validation
    if (!formData.name.trim()) return setError('আপনার পূর্ণ নাম লিখুন');
    if (!formData.designation) return setError('আপনার পদবী নির্বাচন করুন');
    if (!formData.bloodGroup) return setError('রক্তের গ্রুপ নির্বাচন করুন');
    if (formData.mobile.length < 11) return setError('সঠিক মোবাইল নম্বর প্রদান করুন (১১ ডিজিট)');
    if (formData.password.length < 4) return setError('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে');

    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('mobile')
        .eq('mobile', formData.mobile)
        .single();

      if (existingUser) {
        throw new Error('এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।');
      }

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

      if (sbError) throw sbError;

      onSignup();
      alert('রেজিস্ট্রেশন সফল হয়েছে! এখন আপনার মোবাইল ও পাসওয়ার্ড দিয়ে লগইন করুন।');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 overflow-y-auto">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/20 relative z-10 my-auto animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 border-2 border-white/30">
            <UserPlus size={30} />
          </div>
          <h2 className="text-3xl font-black text-indigo-950 leading-tight">নতুন সদস্য নিবন্ধন</h2>
          <p className="text-indigo-400 font-bold text-[9px] mt-2 uppercase tracking-[0.4em]">বাগীশিক উত্তর মাদার্শা</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">পূর্ণ নাম</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <ShieldCheck size={18} />
              </div>
              <input 
                type="text"
                className="w-full pl-12 pr-5 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                placeholder="আপনার নাম লিখুন"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">পদবী</label>
              <div className="relative group">
                <select 
                  className="w-full pl-5 pr-10 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none font-bold text-gray-700 shadow-sm"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value as Designation})}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-indigo-600">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">রক্তের গ্রুপ</label>
              <div className="relative group">
                <select 
                  className="w-full pl-5 pr-10 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none font-black text-red-600 shadow-sm"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="">গ্রুপ নির্বাচন</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-indigo-600">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">মোবাইল নম্বর</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Smartphone size={18} />
              </div>
              <input 
                type="tel"
                className="w-full pl-12 pr-5 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                placeholder="০১XXXXXXXXX"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">পাসওয়ার্ড</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <Lock size={18} />
              </div>
              <input 
                type="password"
                className="w-full pl-12 pr-5 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                placeholder="গোপন পাসওয়ার্ড দিন"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-900/40 uppercase ml-4 tracking-widest">ঠিকানা (ঐচ্ছিক)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-600">
                <MapPin size={18} />
              </div>
              <input 
                type="text"
                className="w-full pl-12 pr-5 py-4 bg-indigo-50/30 border border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                placeholder="গ্রাম, ইউনিয়ন"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-[1.5rem] text-[11px] font-black text-center border border-red-100 flex items-center justify-center space-x-2 animate-shake">
               <AlertCircle size={16} />
               <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : null}
            <span>{loading ? 'প্রসেসিং...' : 'নিবন্ধন সম্পন্ন করুন'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-indigo-50 text-center">
          <p className="text-gray-400 font-bold text-sm">
            ইতিমধ্যে অ্যাকাউন্ট আছে? 
            <Link to="/login" className="text-indigo-600 font-black hover:underline ml-2">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
