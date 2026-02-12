
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
      <div className="mb-8 text-center">
        <h2 className={`text-3xl font-black mb-1 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>কার্যকরী কমিটি</h2>
        <div className="w-16 h-1 bg-indigo-600 rounded-full mx-auto mb-3"></div>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>নিবেদিতপ্রাণ সকল সদস্যদের পূর্ণাঙ্গ তালিকা</p>
      </div>

      {committeeMembers.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {committeeMembers.map((member, index) => (
            <div key={member.id} className={`rounded-[1.5rem] shadow-sm border p-3 sm:p-4 flex items-center space-x-4 transition-all duration-300 group relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
              
              {/* Rank Badge */}
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-bl-2xl text-[8px] font-black uppercase tracking-tight">
                 # {index + 1}
              </div>

              {/* Profile Image */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                  <img 
                    src={member.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=fff&color=6366f1&size=100`} 
                    alt={member.name}
                    className="w-full h-full rounded-[0.9rem] object-cover border-2 border-white dark:border-slate-800"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm text-indigo-600">
                   <Award size={14} />
                </div>
              </div>
              
              {/* Information Section */}
              <div className="flex-grow min-w-0">
                <div className="mb-0.5 px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-md inline-block uppercase tracking-tighter">
                  {member.designation}
                </div>
                
                <h3 className={`text-base sm:text-xl font-black group-hover:text-indigo-600 transition-colors tracking-tight leading-tight mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  {member.name}
                </h3>
                
                <div className="flex flex-col gap-1.5">
                  <a 
                    href={`tel:${member.mobile}`}
                    className={`flex items-center w-fit px-3 py-1 rounded-lg border transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'}`}
                  >
                    <Phone size={12} className="mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-black tracking-widest">{member.mobile}</span>
                  </a>
                  
                  <div className="flex items-center px-1">
                    <MapPin size={10} className="text-red-500 mr-1.5 flex-shrink-0" />
                    <span className={`text-[10px] font-bold truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{member.address || 'ঠিকানা নেই'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-[2rem] p-16 text-center border-2 border-dashed ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-white border-gray-100 text-gray-400'}`}>
          <ShieldAlert size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-black uppercase tracking-widest">কোনো সদস্য নেই</p>
        </div>
      )}
    </div>
  );
};

export default Committee;
