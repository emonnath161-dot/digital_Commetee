
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
    <div className="animate-fadeIn pb-20 max-w-2xl mx-auto px-2">
      <div className="mb-6 text-center">
        <h2 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>কার্যকরী কমিটি</h2>
        <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto mb-2"></div>
        <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>নিবেদিতপ্রাণ সকল সদস্যদের পূর্ণাঙ্গ তালিকা</p>
      </div>

      {committeeMembers.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {committeeMembers.map((member, index) => (
            <div key={member.id} className={`rounded-2xl shadow-sm border p-2.5 sm:p-3 flex items-center space-x-3 transition-all duration-300 group relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
              
              {/* Rank Badge */}
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-bl-xl text-[7px] font-black uppercase tracking-tighter">
                 ক্রম #{index + 1}
              </div>

              {/* Profile Image - Slightly smaller for compact look */}
              <div className="flex-shrink-0 relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                  <img 
                    src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=fff&color=6366f1&size=100`} 
                    alt={member.name}
                    className="w-full h-full rounded-[0.6rem] object-cover border border-white dark:border-slate-800"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full shadow-sm text-indigo-600">
                   <Award size={12} />
                </div>
              </div>
              
              {/* Information Section */}
              <div className="flex-grow min-w-0 pr-6">
                <div className="mb-1">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[7px] font-black rounded-md uppercase tracking-tighter inline-block">
                    {member.designation}
                  </span>
                </div>
                
                {/* Name - No truncate, wraps if long */}
                <h3 className={`text-sm sm:text-base font-black group-hover:text-indigo-600 transition-colors leading-tight mb-1.5 ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>
                  {member.name}
                </h3>
                
                <div className="flex flex-col gap-1.5">
                  {/* Phone Box - More visible and neat */}
                  <a 
                    href={`tel:${member.mobile}`}
                    className={`flex items-center w-fit px-2.5 py-1 rounded-lg border shadow-sm transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/80 border-slate-600 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}
                  >
                    <Phone size={10} className="mr-2 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black tracking-widest">{member.mobile}</span>
                  </a>
                  
                  <div className="flex items-center opacity-70">
                    <MapPin size={9} className="text-red-500 mr-1 flex-shrink-0" />
                    <span className={`text-[9px] font-bold truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{member.address || 'ঠিকানা পাওয়া যায়নি'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-3xl p-12 text-center border-2 border-dashed ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-white border-gray-100 text-gray-400'}`}>
          <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest">বর্তমানে কোনো তথ্য নেই</p>
        </div>
      )}
    </div>
  );
};

export default Committee;
