
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
    phone1: '০১৭০০-০০০০০০',
    phone2: '',
    email: '',
    address: 'মাদার্শা, হাটহাজারী, চট্টগ্রাম',
    facebook: '#',
    website: '#'
  });

  const fetchData = async () => {
    try {
      // Profiles
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

      // Schools & Students
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
        setSchools(schoolsRaw.map((s: any) => ({
          id: s.id,
          name: s.name,
          teacherName: s.teacher_name,
          teacherPhone: s.teacher_phone,
          teacherImage: s.teacher_image,
          established: s.established,
          students: processedStudents.filter(st => st.schoolId === s.id),
          studentCount: processedStudents.filter(st => st.schoolId === s.id).length
        })));
      }

      // Others
      const { data: trans } = await supabase.from('transactions').select('*');
      if (trans) setTransactions(trans.map((t: any) => ({ id: t.id, userId: t.user_id, amount: t.amount, month: t.month, date: t.date })));
      const { data: upds } = await supabase.from('updates').select('*').order('id', { ascending: false });
      if (upds) setUpdates(upds);
      const { data: galls } = await supabase.from('gallery').select('*');
      if (galls) setGalleryImages(galls);
      const { data: msgs } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
      if (msgs) setMessages(msgs);

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('cm_logged_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('cm_logged_user');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('cm_logged_user', JSON.stringify(user));
    else localStorage.removeItem('cm_logged_user');
  };

  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        {currentUser && <Header toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} currentUser={currentUser} />}
        
        <main className={`flex-grow ${currentUser ? 'container mx-auto px-4 py-6 max-w-lg pb-24' : 'w-full'}`}>
          <Routes>
            <Route path="/login" element={!currentUser ? <Login users={users} onLogin={handleSetCurrentUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!currentUser ? <Signup users={users} onSignup={() => fetchData()} /> : <Navigate to="/" />} />
            
            <Route path="/" element={currentUser ? <Home visitorCount={users.length * 12 + 15} updates={updates} isDarkMode={isDarkMode} currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/committee" element={currentUser ? <Committee users={users} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/schools" element={currentUser ? <Schools schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/schools/:id" element={currentUser ? <SchoolDetail schools={schools} currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={currentUser ? <Profile user={currentUser} onUpdate={(u) => { handleSetCurrentUser(u); fetchData(); }} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/gallery" element={currentUser ? <Gallery images={galleryImages} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/accounts" element={currentUser ? <Accounts users={users} transactions={transactions} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/accounts/:userId" element={currentUser ? <MemberTransactions users={users} transactions={transactions} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/messenger" element={currentUser ? <Messenger users={users} messages={messages} currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/contact" element={currentUser ? <Contact contactInfo={contactInfo} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={
              currentUser && (currentUser.designation === "অর্থ সম্পাদক" || currentUser.designation === "সহ অর্থ সম্পাদক") ? (
                <Admin 
                  updates={updates} schools={schools} users={users} gallery={galleryImages} 
                  transactions={transactions} contactInfo={contactInfo}
                  onUpdateUpdates={fetchData} onUpdateSchools={fetchData} 
                  onUpdateGallery={fetchData} onUpdateTransactions={fetchData} 
                  onUpdateSettings={fetchData} onUpdateUsers={fetchData}
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
