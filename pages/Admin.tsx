
import React, { useState, useEffect } from 'react';
import { Update, School, User as AppUser, GalleryImage, Transaction, Student } from '../types';
import { supabase } from '../lib/supabase';
import { 
  Plus, Trash2, Save, School as SchoolIcon, 
  Image as ImageIcon, Lock, Loader2, 
  ChevronRight, Edit, Phone, MapPin, Facebook, Globe, Camera, ArrowLeft, RefreshCcw, DollarSign,
  User, Calendar, Layout, PlayCircle, Settings
} from 'lucide-react';

interface AdminProps {
  updates: Update[];
  schools: School[];
  users: AppUser[];
  gallery: GalleryImage[];
  transactions: Transaction[];
  contactInfo: any;
  onUpdateUpdates: () => Promise<void> | void;
  onUpdateSchools: () => Promise<void> | void;
  onUpdateGallery: () => Promise<void> | void;
  onUpdateTransactions: () => Promise<void> | void;
  onUpdateSettings: () => Promise<void> | void;
  onUpdateUsers: () => Promise<void> | void;
  isDarkMode: boolean;
}

const Admin: React.FC<AdminProps> = ({ 
  updates, schools, users, gallery, transactions, contactInfo,
  onUpdateUpdates, onUpdateSchools, onUpdateGallery, onUpdateTransactions, onUpdateSettings, onUpdateUsers,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'users' | 'schools' | 'updates' | 'gallery' | 'contact'>('accounts');
  const [loading, setLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  const [selectedMember, setSelectedMember] = useState<AppUser | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'fee' | 'school' | 'student' | 'update' | 'gallery' | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Forms State
  const [feeForm, setFeeForm] = useState({ amount: '', month: '' });
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', image: '', media_type: 'image' as 'image' | 'video', aspect_ratio: 'landscape' as 'landscape' | 'portrait' });
  const [schoolForm, setSchoolForm] = useState({ name: '', teacherName: '', teacherPhone: '', established: '', teacherImage: '' });
  const [studentForm, setStudentForm] = useState({ name: '', fatherName: '', motherName: '', mobile: '', className: '', roll: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', url: '' });
  const [contactForm, setContactForm] = useState({ phone1: '', phone2: '', email: '', address: '', facebook: '', website: '' });

  useEffect(() => {
    if (selectedSchool) fetchStudents(selectedSchool.id);
  }, [selectedSchool]);

  useEffect(() => {
    if (contactInfo) setContactForm({ ...contactInfo });
  }, [contactInfo]);

  const fetchStudents = async (schoolId: string) => {
    const { data, error } = await supabase.from('students').select('*').eq('school_id', schoolId).order('roll', { ascending: true });
    if (!error && data) {
      setSchoolStudents(data.map((st: any) => ({
        id: st.id,
        schoolId: st.school_id,
        name: st.name,
        fatherName: st.father_name,
        motherName: st.mother_name,
        mobile: st.mobile,
        className: st.class_name,
        roll: st.roll,
        image: st.image
      })));
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1234') setIsAdminAuthenticated(true);
    else alert('ভুল পিন!');
  };

  const handleSave = async (table: string, rawData: any, refreshCallback: () => Promise<void> | void) => {
    if (loading) return;
    setLoading(true);

    try {
      let payload: any = {};
      
      // SQL DB কলামের সাথে ১০০% ম্যাপিং নিশ্চিত করা হয়েছে
      if (table === 'transactions') {
        payload = { 
          user_id: selectedMember?.id, 
          amount: parseFloat(rawData.amount), 
          month: rawData.month,
          date: new Date().toISOString()
        };
      } 
      else if (table === 'students') {
        payload = { 
          school_id: selectedSchool?.id, 
          name: rawData.name, 
          father_name: rawData.fatherName, 
          mother_name: rawData.motherName, 
          mobile: rawData.mobile, 
          class_name: rawData.className, 
          roll: rawData.roll, 
          image: rawData.image 
        };
      } 
      else if (table === 'schools') {
        payload = { 
          name: rawData.name, 
          teacher_name: rawData.teacherName, 
          teacher_phone: rawData.teacherPhone, 
          teacher_image: rawData.teacherImage, 
          established: rawData.established 
        };
      }
      else if (table === 'updates') {
        payload = { 
          title: rawData.title,
          description: rawData.description,
          image: rawData.image,
          media_type: rawData.media_type,
          aspect_ratio: rawData.aspect_ratio,
          date: new Date().toLocaleDateString('bn-BD') 
        };
      }
      else if (table === 'gallery') {
        payload = { 
          title: rawData.title,
          description: rawData.description,
          url: rawData.url 
        };
      }
      else if (table === 'site_settings') {
        payload = { 
          id: 'contact_info', 
          phone1: rawData.phone1,
          phone2: rawData.phone2,
          email: rawData.email,
          address: rawData.address,
          facebook: rawData.facebook,
          website: rawData.website
        };
      }

      if (editingId && table !== 'site_settings') payload.id = editingId;

      const { error } = await supabase.from(table).upsert([payload]);
      if (error) throw error;

      await refreshCallback();
      if (table === 'students' && selectedSchool) await fetchStudents(selectedSchool.id);
      
      setShowModal(false);
      setEditingId(null);
      alert('সফলভাবে সংরক্ষিত!');
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`এরর: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (table: string, id: any) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এটি ডিলিট করতে চান?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
       alert('সফলভাবে ডিলিট করা হয়েছে!');
       if (table === 'profiles') onUpdateUsers();
       else window.location.reload();
    } else {
      alert('ডিলিট করতে সমস্যা হয়েছে: ' + error.message);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center border-2 border-indigo-600 animate-fadeIn">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black mb-6 dark:text-white uppercase tracking-wider">অ্যাডমিন প্রবেশ</h2>
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <input 
              type="password" 
              placeholder="পিন কোড লিখুন" 
              className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl text-center font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
              value={adminPass} 
              onChange={(e) => setAdminPass(e.target.value)} 
            />
            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">লগইন করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-8 max-w-4xl mx-auto px-2 animate-fadeIn">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-2 p-2 bg-white dark:bg-slate-800 rounded-[2rem] sticky top-20 z-40 border shadow-md scrollbar-hide">
        {(['accounts', 'users', 'schools', 'updates', 'gallery', 'contact'] as const).map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            {tab === 'accounts' ? 'হিসাব' : tab === 'users' ? 'সদস্য তালিকা' : tab === 'schools' ? 'স্কুল' : tab === 'updates' ? 'আপডেট' : tab === 'gallery' ? 'গ্যালারি' : 'যোগাযোগ'}
          </button>
        ))}
      </div>

      <div className="px-1">
        {/* USERS LIST SECTION */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-xl font-black dark:text-white">নিবন্ধিত সদস্য ({users.length})</h3>
               <button onClick={onUpdateUsers} className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"><RefreshCcw size={20}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border flex items-center justify-between shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-4">
                    <img src={u.profilePic} className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-50" />
                    <div className="min-w-0">
                      <h4 className="font-black text-sm dark:text-white truncate">{u.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{u.designation}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('profiles', u.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={20}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACCOUNTS (FEES) SECTION */}
        {activeTab === 'accounts' && !selectedMember && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map(u => (
              <div key={u.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border flex items-center justify-between shadow-sm hover:shadow-lg transition-all border-l-8 border-l-indigo-600">
                <div className="flex items-center space-x-4">
                  <img src={u.profilePic} className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-50" />
                  <div>
                    <h4 className="font-black text-sm dark:text-white leading-tight">{u.name}</h4>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{u.designation}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(u)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md active:scale-90 transition-all">ফি জমা</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'accounts' && selectedMember && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border shadow-2xl space-y-8 animate-fadeIn">
             <button onClick={() => setSelectedMember(null)} className="text-indigo-600 font-black flex items-center text-xs uppercase hover:-translate-x-1 transition-transform"><ArrowLeft size={16} className="mr-2" /> ফিরে যান</button>
             
             <div className="flex items-center space-x-6 p-4 bg-indigo-50 dark:bg-slate-900 rounded-[2rem]">
                <img src={selectedMember.profilePic} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-lg" />
                <div>
                   <h3 className="text-2xl font-black dark:text-white leading-tight">{selectedMember.name}</h3>
                   <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{selectedMember.designation}</span>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="font-black text-xs uppercase text-gray-400 ml-2">নতুন ফি জমা দিন</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={20} />
                    <input type="number" placeholder="টাকার পরিমাণ (৳)" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} />
                  </div>
                  <input type="text" placeholder="মাসের নাম (উদা: জানুয়ারি)" className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={feeForm.month} onChange={e => setFeeForm({...feeForm, month: e.target.value})} />
                </div>
                <button onClick={() => handleSave('transactions', feeForm, onUpdateTransactions)} disabled={loading} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black shadow-xl hover:bg-green-700 transition-all flex items-center justify-center space-x-3">
                   {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                   <span>ফি জমা করুন</span>
                </button>
             </div>

             <div className="space-y-3">
                <h4 className="font-black text-xs uppercase text-gray-400 ml-2">লেনদেনের ইতিহাস</h4>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {transactions.filter(t => t.userId === selectedMember.id).map(t => (
                    <div key={t.id} className="p-4 bg-white dark:bg-slate-800 border-2 rounded-2xl flex justify-between items-center group hover:border-indigo-200 transition-all">
                       <div className="flex items-center space-x-4">
                          <div className="bg-indigo-50 dark:bg-slate-900 p-3 rounded-xl text-indigo-600"><RefreshCcw size={16}/></div>
                          <div>
                            <p className="font-black text-sm dark:text-white">{t.month}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(t.date).toLocaleDateString('bn-BD')}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-4">
                          <span className="font-black text-xl text-green-600">{t.amount} ৳</span>
                          <button onClick={() => deleteItem('transactions', t.id)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* SCHOOLS SECTION */}
        {activeTab === 'schools' && !selectedSchool && (
          <div className="space-y-6">
            <button onClick={() => { setEditingId(null); setModalType('school'); setShowModal(true); }} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all"><Plus size={24}/> <span>নতুন গীতা স্কুল যোগ করুন</span></button>
            <div className="grid gap-4">
              {schools.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border flex items-center justify-between hover:border-indigo-600 transition-all shadow-sm">
                  <div className="flex items-center space-x-5">
                     <div className="bg-indigo-100 dark:bg-slate-900 p-4 rounded-2xl text-indigo-600 shadow-inner"><SchoolIcon size={28}/></div>
                     <div className="min-w-0">
                        <h4 className="font-black text-xl dark:text-white leading-tight truncate">{s.name}</h4>
                        <p className="text-xs text-indigo-500 font-black uppercase tracking-widest mt-1 truncate">শিক্ষক: {s.teacherName}</p>
                     </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => setSelectedSchool(s)} className="p-3.5 bg-indigo-50 dark:bg-slate-900 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><ChevronRight size={20}/></button>
                    <button onClick={() => deleteItem('schools', s.id)} className="p-3.5 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schools' && selectedSchool && (
          <div className="space-y-8 animate-fadeIn">
             <button onClick={() => setSelectedSchool(null)} className="text-indigo-600 font-black flex items-center text-xs uppercase hover:-translate-x-1 transition-transform"><ArrowLeft size={16} className="mr-2" /> স্কুল লিস্টে ফিরুন</button>
             
             <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-3xl font-black mb-4 leading-tight">{selectedSchool.name}</h3>
                   <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-widest opacity-80">
                      <div className="flex items-center"><User size={14} className="mr-2"/> শিক্ষক: {selectedSchool.teacherName}</div>
                      <div className="flex items-center"><Calendar size={14} className="mr-2"/> স্থাপিত: {selectedSchool.established}</div>
                   </div>
                </div>
                <button onClick={() => { setEditingId(null); setModalType('student'); setShowModal(true); }} className="mt-8 relative z-10 bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 transition-all">নতুন শিক্ষার্থী যোগ করুন</button>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schoolStudents.map(st => (
                  <div key={st.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.2rem] border-2 flex items-center justify-between shadow-sm group hover:border-indigo-600 transition-all">
                     <div className="flex items-center space-x-4">
                        <img src={st.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-50" />
                        <div>
                           <h5 className="font-black text-sm dark:text-white leading-tight">{st.name}</h5>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">রোল: {st.roll} | শ্রেণী: {st.className}</p>
                        </div>
                     </div>
                     <button onClick={() => deleteItem('students', st.id)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* UPDATES SECTION */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <button onClick={() => { setEditingId(null); setModalType('update'); setShowModal(true); }} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all"><Plus size={24}/> <span>নতুন আপডেট পোস্ট করুন</span></button>
            <div className="grid gap-4">
              {updates.map(up => (
                <div key={up.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-5">
                     <div className="relative">
                       <img src={up.image} className={`w-20 h-16 object-cover rounded-2xl border-2 border-indigo-50 ${up.aspect_ratio === 'portrait' ? 'h-24 w-16' : ''}`} />
                       {up.media_type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl"><PlayCircle className="text-white" size={24}/></div>}
                     </div>
                     <div>
                        <h4 className="font-black text-base dark:text-white leading-tight">{up.title}</h4>
                        <div className="flex space-x-2 mt-1">
                          <span className="text-[8px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-black uppercase tracking-widest">{up.media_type}</span>
                          <span className="text-[8px] px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full font-black uppercase tracking-widest">{up.aspect_ratio}</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => deleteItem('updates', up.id)} className="p-3.5 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY SECTION */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fadeIn">
            <button onClick={() => { setEditingId(null); setModalType('gallery'); setShowModal(true); }} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all"><Camera size={24}/> <span>গ্যালারিতে নতুন ছবি যোগ করুন</span></button>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {gallery.map(img => (
                <div key={img.id} className="relative group rounded-[2rem] overflow-hidden border-2 shadow-sm transition-all hover:scale-105">
                  <img src={img.url} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                     <button onClick={() => deleteItem('gallery', img.id)} className="p-4 bg-white text-red-500 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border shadow-2xl space-y-8 animate-fadeIn">
            <div className="flex items-center space-x-4">
               <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg"><Settings size={32}/></div>
               <h3 className="text-2xl font-black text-indigo-900 dark:text-white uppercase tracking-widest">সাইট সেটিংস ও যোগাযোগ</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">ফোন নম্বর ১</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.phone1} onChange={e=>setContactForm({...contactForm, phone1: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">ফোন নম্বর ২</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.phone2} onChange={e=>setContactForm({...contactForm, phone2: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">অফিস ঠিকানা</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.address} onChange={e=>setContactForm({...contactForm, address: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">ইমেইল ঠিকানা</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.email} onChange={e=>setContactForm({...contactForm, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">ফেসবুক লিংক</label>
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.facebook} onChange={e=>setContactForm({...contactForm, facebook: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-3 tracking-widest">ওয়েবসাইট লিংক</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                  <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none focus:border-indigo-600" value={contactForm.website} onChange={e=>setContactForm({...contactForm, website: e.target.value})} />
                </div>
              </div>
            </div>
            
            <button onClick={() => handleSave('site_settings', contactForm, onUpdateSettings)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={24}/>}
              <span>সেটিংস আপডেট করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto border-4 border-indigo-600 shadow-2xl relative">
            <h3 className="text-3xl font-black mb-8 text-indigo-900 dark:text-white flex items-center uppercase tracking-tighter">
               {modalType === 'gallery' ? <ImageIcon className="mr-3 text-indigo-600"/> : <Plus className="mr-3 text-indigo-600"/>}
               তথ্য প্রদান করুন
            </h3>
            
            <div className="space-y-5">
              {modalType === 'update' && (
                <>
                  <input type="text" placeholder="শিরোনাম" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={updateForm.title} onChange={e => setUpdateForm({...updateForm, title: e.target.value})} />
                  <textarea placeholder="বিস্তারিত বর্ণনা" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none h-32" value={updateForm.description} onChange={e => setUpdateForm({...updateForm, description: e.target.value})} />
                  <input type="text" placeholder="মিডিয়া (ইমেজ/ভিডিও) ডাইরেক্ট ইউআরএল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={updateForm.image} onChange={e => setUpdateForm({...updateForm, image: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 ml-2">মিডিয়া টাইপ</label>
                       <select className="w-full p-4 bg-gray-50 dark:bg-slate-900 border rounded-xl font-bold dark:text-white" value={updateForm.media_type} onChange={e => setUpdateForm({...updateForm, media_type: e.target.value as any})}>
                          <option value="image">ছবি (Image)</option>
                          <option value="video">ভিডিও (Video)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 ml-2">সাইজ রেশিও</label>
                       <select className="w-full p-4 bg-gray-50 dark:bg-slate-900 border rounded-xl font-bold dark:text-white" value={updateForm.aspect_ratio} onChange={e => setUpdateForm({...updateForm, aspect_ratio: e.target.value as any})}>
                          <option value="landscape">ল্যান্ডস্কেপ (Landscape)</option>
                          <option value="portrait">পোর্ট্রেট (Portrait)</option>
                       </select>
                    </div>
                  </div>
                  <button onClick={() => handleSave('updates', updateForm, onUpdateUpdates)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center space-x-2">
                     {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                     <span>আপডেট পোস্ট করুন</span>
                  </button>
                </>
              )}

              {modalType === 'gallery' && (
                <>
                  <input type="text" placeholder="ছবির শিরোনাম" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} />
                  <input type="text" placeholder="ছোট বর্ণনা" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} />
                  <input type="text" placeholder="ইমেজ ডাইরেক্ট ইউআরএল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={galleryForm.url} onChange={e => setGalleryForm({...galleryForm, url: e.target.value})} />
                  <button onClick={() => handleSave('gallery', galleryForm, onUpdateGallery)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center space-x-2">
                     {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                     <span>গ্যালারিতে যোগ করুন</span>
                  </button>
                </>
              )}

              {modalType === 'school' && (
                <>
                  <input type="text" placeholder="স্কুলের নাম" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} />
                  <input type="text" placeholder="শিক্ষকের নাম" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={schoolForm.teacherName} onChange={e => setSchoolForm({...schoolForm, teacherName: e.target.value})} />
                  <input type="text" placeholder="মোবাইল নম্বর" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={schoolForm.teacherPhone} onChange={e => setSchoolForm({...schoolForm, teacherPhone: e.target.value})} />
                  <input type="text" placeholder="স্থাপিত সাল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={schoolForm.established} onChange={e => setSchoolForm({...schoolForm, established: e.target.value})} />
                  <input type="text" placeholder="শিক্ষকের ছবি ইউআরএল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={schoolForm.teacherImage} onChange={e => setSchoolForm({...schoolForm, teacherImage: e.target.value})} />
                  <button onClick={() => handleSave('schools', schoolForm, onUpdateSchools)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center space-x-2">
                     {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                     <span>স্কুল সেভ করুন</span>
                  </button>
                </>
              )}

              {modalType === 'student' && (
                <>
                  <input type="text" placeholder="শিক্ষার্থীর নাম" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="পিতা" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.fatherName} onChange={e => setStudentForm({...studentForm, fatherName: e.target.value})} />
                    <input type="text" placeholder="মাতা" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.motherName} onChange={e => setStudentForm({...studentForm, motherName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="রোল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.roll} onChange={e => setStudentForm({...studentForm, roll: e.target.value})} />
                    <input type="text" placeholder="শ্রেণী" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.className} onChange={e => setStudentForm({...studentForm, className: e.target.value})} />
                  </div>
                  <input type="text" placeholder="শিক্ষার্থীর ছবি ইউআরএল" className="w-full p-5 bg-gray-50 dark:bg-slate-900 border-2 rounded-2xl font-bold dark:text-white outline-none" value={studentForm.image} onChange={e => setStudentForm({...studentForm, image: e.target.value})} />
                  <button onClick={() => handleSave('students', studentForm, onUpdateSchools)} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center space-x-2">
                     {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                     <span>শিক্ষার্থী সেভ করুন</span>
                  </button>
                </>
              )}

              <button onClick={() => setShowModal(false)} className="w-full py-5 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs">বাতিল করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
