import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Components
import Sidebar from './student/Sidebar';
import Header from './student/Header';
import Overview from './student/Overview';
import Announcements from './student/Announcements';
import MyProfile from './student/MyProfile'; // 👈 Import this
import Opportunities from './student/Opportunities';
import MyApplications from './student/MyApplications';
import Aitool from './student/Aitool';
import Progress from './student/Progress'; // 👈 ADD THIS

import Chat from './student/Chat';
import Settings from './student/Settings';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const userName = localStorage.getItem('name') || 'Student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={userName} 
        handleLogout={handleLogout} 
      />

      {/* 2. Main Content */}
      <main style={styles.mainContent}>
        
        {/* Pass setActiveTab to Header for notifications logic */}
        <Header activeTab={activeTab} userName={userName} setActiveTab={setActiveTab} />

        {/* 3. Dynamic Content */}
        {activeTab === 'Overview' && <Overview setActiveTab={setActiveTab} />}
        
        {/* ✅ Pass setActiveTab so Back button works */}
        {activeTab === 'Announcements' && <Announcements onBack={() => setActiveTab('Overview')} />}
        
        {/* Placeholders */}
        {activeTab === 'My Profile' && <MyProfile />} {/* 👈 Add this line */}
        {activeTab === 'Opportunities' && <Opportunities />}
        {activeTab === 'Applications' && <MyApplications/>  }
        {activeTab === 'AI Tools' && <Aitool/>}
        {activeTab === 'Progress Tracker' && <Progress />}
        {activeTab === 'Chat' && <Chat />}
       
        {activeTab === 'Settings' && <Settings />}

      </main>
    </div>
  );
};

   

    


const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
  mainContent: { flex: 1, marginLeft: '260px', padding: '24px', maxWidth: '1600px' },
};

export default StudentDashboard;