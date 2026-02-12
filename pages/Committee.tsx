
import React from 'react';
import { User } from '../types';
import { DESIGNATION_RANK } from '../constants';
import { Phone, MapPin, Award, ShieldAlert } from 'lucide-react';

interface CommitteeProps {
  users: User[];
  isDarkMode: boolean;
}

const Committee: React.FC<CommitteeProps> = ({ users, isDarkMode }) => {
  // Members who are NOT (সদস্য or সাধারণ সদস্য) are part of Executive Committee
  const committeeMembers = users
    .filter(u => u.designation !== "সদস্য" && u.designation !== "সাধারণ সদস্য")
    .sort((a, b) => DESIGNATION_RANK[a.designation] - DESIGNATION_RANK[b.designation]);

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
            <div key={member.id} className={`rounded-[2.5rem] shadow-sm border p-5 flex items-center gap-6 transition-all duration-300 group relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-xl'}`}>
              
              {/* Rank Label - Top Right Corner */}
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-tighter">
                 পদবী ক্রম #{index + 1}
              </div>

              {/* Profile Image - Large and Clear */}
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
                <div className="absolute -bottom-2 -right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-md text-indigo-600 border border-slate-100 dark:border-slate-700">
                   <Award size={14} />
                </div>
              </div>
              
              {/* Information Section */}
              <div className="flex-grow min-w-0 py-1">
                {/* Designation Badge */}
                <div className="mb-2">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-tight inline-block shadow-sm">
                    {member.designation}
                  </span>
                </div>
                
                {/* Name */}
                <h3 className={`text-lg sm:text-xl font-black mb-3 leading-tight group-hover:text-indigo-600 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {member.name}
                </h3>
                
                {/* Contact & Address Details */}
                <div className="flex flex-col">
                  {/* Phone Number Box */}
                  <a 
                    href={`tel:${member.mobile}`}
                    className={`flex items-center w-full sm:w-fit px-4 py-2.5 rounded-xl border shadow-sm transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900 border-slate-600 text-indigo-400' : 'bg-indigo-50/50 border-indigo-100 text-indigo-700'}`}
                  >
                    <Phone size={14} className="mr-3 flex-shrink-0" />
                    <span className="text-sm font-black tracking-[0.05em]">{member.mobile}</span>
                  </a>
                  
                  {/* Address Section - Moved down with mt-4 for clarity */}
                  <div className="flex items-start mt-4 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <MapPin size={14} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={`text-[11px] font-bold leading-relaxed break-words ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {member.address || 'ঠিকানা পাওয়া যায়নি'}
                    </span>
                  </div>
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
    </div>
  );
};

export default Committee;
