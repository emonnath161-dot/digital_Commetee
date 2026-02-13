
import React, { useState } from 'react';
import { User } from '../types';
import { DESIGNATION_RANK } from '../constants';
import { Phone, MapPin, Award, ShieldAlert, X, Smartphone, User as UserIcon } from 'lucide-react';

interface CommitteeProps {
  users: User[];
  isDarkMode: boolean;
}

const Committee: React.FC<CommitteeProps> = ({ users, isDarkMode }) => {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // Members who are NOT (সদস্য or সাধারণ সদস্য) are part of Executive Committee
  const committeeMembers = users
    .filter(u => u.designation !== "সদস্য" && u.designation !== "সাধারণ সদস্য")
    .sort((a, b) => DESIGNATION_RANK[a.designation] - DESIGNATION_RANK[b.designation]);

  const closeModal = () => setSelectedMember(null);

  return (
    <div className="animate-fadeIn pb-24 max-w-2xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h2 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>কার্যকরী কমিটি</h2>
        <div className="w-16 h-1.5 bg-indigo-600 rounded-full mx-auto mb-2"></div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>সদস্যদের পূর্ণাঙ্গ ডিজিটাল প্রোফাইল</p>
      </div>

      {committeeMembers.length > 0 ? (
        <div className="flex flex-col space-y-5">
          {committeeMembers.map((member, index) => (
            <div 
              key={member.id} 
              onClick={() => setSelectedMember(member)}
              className={`cursor-pointer rounded-[2.5rem] shadow-sm border p-5 flex items-center gap-6 transition-all duration-300 group relative overflow-hidden active:scale-95 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-xl'}`}
            >
              
              {/* Rank Label */}
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-tighter">
                 পদবী ক্রম #{index + 1}
              </div>

              {/* Profile Image Container */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center">
                    <img 
                      src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff&size=150`} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="flex-grow min-w-0 py-1">
                <div className="mb-2">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-tight inline-block shadow-sm">
                    {member.designation}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-black mb-3 leading-tight group-hover:text-indigo-600 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {member.name}
                </h3>
                <div className="flex items-center text-indigo-600 font-bold text-sm">
                  <Smartphone size={14} className="mr-2" />
                  <span>{member.mobile}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-[3rem] p-16 text-center border-4 border-dashed ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-700' : 'bg-white border-gray-100 text-gray-300'}`}>
          <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm font-black uppercase tracking-widest">বর্তমানে কোনো তথ্য সংরক্ষিত নেই</p>
        </div>
      )}

      {/* COMPACT & STATIC DIGITAL ID CARD - FIXED WITHIN THE RED BOX AREA */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fadeIn" 
          onClick={closeModal}
        >
          {/* Main Card - Perfectly Sized to match the visual box */}
          <div 
            className={`w-full max-w-[310px] rounded-[3rem] relative shadow-[0_25px_50px_rgba(0,0,0,0.5)] border-[5px] flex flex-col items-center p-5 pt-8 overflow-hidden transition-transform duration-300 scale-100 ${isDarkMode ? 'bg-slate-900 border-indigo-600/30 text-white' : 'bg-white border-white text-slate-900'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* COMPACT CLOSE BUTTON */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 bg-red-600 text-white rounded-xl shadow-lg z-[6000] flex items-center justify-center active:scale-90 transition-transform"
              aria-label="বন্ধ করুন"
            >
              <X size={18} strokeWidth={4} />
            </button>

            {/* Profile Photo - Compact & Visible below top border */}
            <div className="relative mb-4 mt-2">
              <div className={`w-32 h-32 rounded-[2.2rem] p-1.5 shadow-xl ${isDarkMode ? 'bg-indigo-600/10' : 'bg-indigo-50'}`}>
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-700">
                  <img 
                    src={selectedMember.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=6366f1&color=fff&size=250`} 
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-1 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-md"></div>
            </div>

            {/* Name & Designation - Closer together to save space */}
            <div className="text-center mb-6 w-full">
              <h2 className="text-2xl font-black mb-1.5 leading-tight tracking-tight px-2 truncate">
                {selectedMember.name}
              </h2>
              <div className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black shadow-md uppercase tracking-[0.15em]">
                {selectedMember.designation}
              </div>
            </div>

            {/* Info Rows - Compact & No Scrolling */}
            <div className="w-full space-y-3">
              <div className={`p-3.5 rounded-2xl flex items-center space-x-4 border shadow-sm ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-sm flex-shrink-0">
                  <Smartphone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase text-indigo-500 tracking-widest leading-none mb-1">মোবাইল নম্বর</p>
                  <p className="text-base font-black tracking-widest leading-none">{selectedMember.mobile}</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl flex items-center space-x-4 border shadow-sm ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-sm flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-[7px] font-black uppercase text-orange-500 tracking-widest leading-none mb-1">ঠিকানা</p>
                  <p className={`text-[11px] font-bold leading-tight truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedMember.address || 'তথ্য সংরক্ষিত নেই'}
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Bottom Decor */}
            <div className="mt-6 flex flex-col items-center opacity-40">
               <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-6 h-[1.5px] bg-gray-400"></div>
                  <UserIcon size={10} className="text-gray-400"/>
                  <div className="w-6 h-[1.5px] bg-gray-400"></div>
               </div>
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em]">ডিজিটাল আইডি কার্ড</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Committee;
