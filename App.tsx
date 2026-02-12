
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Committee from './pages/Committee';
import Schools from './pages/Schools';
import SchoolDetail from './pages/SchoolDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Messenger from './pages/Messenger';
import Gallery from './pages/Gallery';
import Accounts from './pages/Accounts';
import MemberTransactions from './pages/MemberTransactions';

// Utils & Types
import { User, School, Update, Message, GalleryImage, Transaction, Student } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('cm_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  const [contactInfo, setContactInfo] = useState({
    phone1: 'যোগাযোগ করুন',
    phone2: '',
    email: '',
    address: '',
    facebook: '#',
    website: '#'
  });

  const fetchData = async () => {
    try {
      // 1. Fetch profiles
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles) {
        setUsers(profiles.map((p: any) => ({
          id: p.id,
          name: p.name,
          designation: p.designation,
          mobile: p.mobile,
          bloodGroup: p.blood_group,
          address: p.address,
          email: p.email,
          profilePic: p.profile_pic
        })));
      }

      // 2. Fetch schools & students
      const { data: schoolsRaw } = await supabase.from('schools').select('*');
      const { data: studentsRaw } = await supabase.from('students').select('*');
      
      const processedStudents: Student[] = studentsRaw ? studentsRaw.map((st: any) => ({
        id: st.id,
        schoolId: st.school_id,
        name: st.name,
        fatherName: st.father_name,
        motherName: st.mother_name,
        mobile: st.mobile,
        className: st.class_name,
        roll: st.roll,
        image: st.image
      })) : [];

      if (schoolsRaw) {
        const processedSchools = schoolsRaw.map((s: any) => ({
          id: s.id,
          name: s.name,
          teacherName: s.teacher_name,
          teacherPhone: s.teacher_phone,
          teacherImage: s.teacher_image,
          established: s.established,
          students: processedStudents.filter((st: any) => st.schoolId === s.id),
          studentCount: processedStudents.filter((st: any) => st.schoolId === s.id).length
        }));
        setSchools(processedSchools);
      }

      // 3. Transactions
      const { data: trans } = await supabase.from('transactions').select('*');
      if (trans) {
        setTransactions(trans.map((t: any) => ({
          id: t.id,
          userId: t.user_id,
          amount: t.amount,
          month: t.month,
          date: t.date
        })));
      }

      // 4. Updates & Gallery
      const { data: upds } = await supabase.from('updates').select('*').order('id', { ascending: false });
      if (upds) setUpdates(upds);

      const { data: galls } = await supabase.from('gallery').select('*');
      if (galls) setGalleryImages(galls);

      // 5. Messages
      const { data: msgs } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
      if (msgs) setMessages(msgs);

      // 6. Settings
      const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'contact_info').single();
      if (settings) {
        setContactInfo({
          phone1: settings.phone1,
          phone2: settings.phone2,
          email: settings.email,
          address: settings.address,
          facebook: settings.facebook,
          website: settings.website
        });
      }

    } catch (error) {
      console.warn("Data fetch warning:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cm_logged_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {}
    
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem('cm_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('cm_logged_user', JSON.stringify(user));
    else localStorage.removeItem('cm_logged_user');
  };

  // Improved loading screen: Don't block navigation to Login/Signup
  const isAuthRoute = window.location.hash.includes('/login') || window.location.hash.includes('/signup');

  if (isLoading && !currentUser && !isAuthRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-950 text-white">
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-white rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-black animate-pulse tracking-widest uppercase">সিস্টেম লোড হচ্ছে...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f0f2f5] text-gray-900'}`}>
        {currentUser && <Header toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} currentUser={currentUser} />}
        
        <main className={`flex-grow container mx-auto ${currentUser ? 'px-4 py-6 max-w-lg pb-24' : ''}`}>
          <Routes>
            <Route path="/login" element={!currentUser ? <Login users={users} onLogin={handleSetCurrentUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!currentUser ? <Signup users={users} onSignup={() => fetchData()} /> : <Navigate to="/" />} />
            
            {/* Protected Routes */}
            <Route path="/" element={currentUser ? <Home visitorCount={users.length * 5 + 10} updates={updates} isDarkMode={isDarkMode} currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/messenger" element={currentUser ? <Messenger users={users} messages={messages} currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/committee" element={<Committee users={users} isDarkMode={isDarkMode} />} />
            <Route path="/schools" element={<Schools schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} />} />
            <Route path="/schools/:id" element={<SchoolDetail schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={currentUser ? <Profile user={currentUser} onUpdate={(u) => { handleSetCurrentUser(u); fetchData(); }} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/gallery" element={<Gallery images={galleryImages} isDarkMode={isDarkMode} />} />
            <Route path="/accounts" element={<Accounts users={users} transactions={transactions} isDarkMode={isDarkMode} />} />
            <Route path="/accounts/:userId" element={<MemberTransactions users={users} transactions={transactions} isDarkMode={isDarkMode} />} />
            <Route path="/contact" element={<Contact contactInfo={contactInfo} />} />
            <Route path="/admin" element={
              currentUser && (currentUser.designation === "অর্থ সম্পাদক" || currentUser.designation === "সহ অর্থ সম্পাদক") ? (
                <Admin 
                  updates={updates} 
                  schools={schools} 
                  users={users} 
                  gallery={galleryImages} 
                  transactions={transactions} 
                  contactInfo={contactInfo}
                  onUpdateUpdates={() => fetchData()}
                  onUpdateSchools={() => fetchData()}
                  onUpdateGallery={() => fetchData()}
                  onUpdateTransactions={() => fetchData()}
                  onUpdateSettings={() => fetchData()}
                  onUpdateUsers={() => fetchData()}
                  isDarkMode={isDarkMode}
                />
              ) : <Navigate to="/" />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {currentUser && <Navbar isDarkMode={isDarkMode} />}
      </div>
    </Router>
  );
};

export default App;
