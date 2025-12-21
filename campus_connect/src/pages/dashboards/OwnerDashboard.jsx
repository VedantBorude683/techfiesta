
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, FileCheck, 
  Settings, LogOut, Lock 
} from 'lucide-react';

// Import Sub-Components
// Make sure these files exist in src/pages/dashboards/owner/
import Overview from './owner/Overview';
import VerifyFaculty from './owner/VerifyFaculty';
import ManageColleges from './owner/ManageColleges';
import AllUsers from './owner/AllUsers';
import PlatformSettings from './owner/PlatformSettings';
import CollegeDetails from './owner/CollegeDetails'; // Drill-down view

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('Overview');
  const [selectedCollegeCode, setSelectedCollegeCode] = useState(null);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Navigation Logic
  const handleViewCollege = (code) => {
    setSelectedCollegeCode(code);
    setActiveView('CollegeDetails');
  };

  const handleBackToColleges = () => {
    setSelectedCollegeCode(null);
    setActiveView('Manage Colleges');
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'Overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'Verify Faculty', label: 'Verify Faculty', icon: <FileCheck size={20} /> },
    { id: 'Manage Colleges', label: 'Manage Colleges', icon: <Building2 size={20} /> },
    { id: 'All Users', label: 'All Users', icon: <Users size={20} /> },
    { id: 'Global Settings', label: 'Global Settings', icon: <Settings size={20} /> },
  ];

  // Render Content Based on Active View
  const renderContent = () => {
    switch (activeView) {
      case 'Overview': 
        return <Overview setActiveView={setActiveView} />;
      case 'Verify Faculty': 
        return <VerifyFaculty />;
      case 'Manage Colleges': 
        return <ManageColleges onViewDetails={handleViewCollege} />;
      case 'CollegeDetails': 
        return <CollegeDetails collegeCode={selectedCollegeCode} onBack={handleBackToColleges} />;
      case 'All Users': 
        return <AllUsers />;
      case 'Global Settings': 
        return <PlatformSettings />;
      default: 
        return <Overview setActiveView={setActiveView} />;
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- SIDEBAR --- */}
      <aside style={styles.sidebar}>
        <div style={styles.brandContainer}>
            <div style={styles.logoBox}><Lock color="white" size={20} /></div>
            <div>
                <h2 style={styles.brandTitle}>SUPER ADMIN</h2>
                <span style={styles.brandSubtitle}>OWNER CONSOLE</span>
            </div>
        </div>

        <nav style={styles.navContainer}>
          <div style={styles.sectionLabel}>MAIN MENU</div>
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                ...styles.navItem,
                ...(activeView === item.id ? styles.navItemActive : {})
              }}
            >
              <span style={styles.iconWrapper}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} /> Logout
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={styles.mainContent}>
        
        {/* Header */}
        <header style={styles.header}>
            <div>
                <span style={styles.breadCrumb}>TECHFIESTA / OWNER</span>
                <h1 style={styles.pageTitle}>{activeView}</h1>
            </div>
            <div style={styles.userInfo}>
                <div style={styles.avatar}>OW</div>
                <span>Platform Owner</span>
            </div>
        </header>

        {/* Dynamic Viewport */}
        <div style={styles.contentViewport}>
            <div style={styles.contentCard}>
                {renderContent()}
            </div>
        </div>

      </main>
    </div>
  );
};

// --- ELITE DARK STYLES ---
const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden', fontFamily: '"Inter", sans-serif' },
  
  sidebar: { width: '280px', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1f2937', flexShrink: 0 },
  brandContainer: { padding: '30px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #1f2937' },
  logoBox: { height: '40px', width: '40px', background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: '1rem', fontWeight: '800', letterSpacing: '1px', color: '#f8fafc', margin: 0 },
  brandSubtitle: { fontSize: '0.7rem', fontWeight: '600', color: '#64748b', letterSpacing: '2px' },
  
  navContainer: { flex: 1, padding: '24px 16px', overflowY: 'auto' },
  sectionLabel: { fontSize: '0.7rem', fontWeight: '700', color: '#475569', padding: '0 12px 12px 12px', letterSpacing: '1px' },
  navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: '6px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease', color: '#94a3b8' },
  navItemActive: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' },
  iconWrapper: { marginRight: '14px', display: 'flex' },
  navLabel: { fontSize: '0.9rem', fontWeight: '500' },
  
  sidebarFooter: { padding: '20px', borderTop: '1px solid #1f2937', backgroundColor: '#0b0f19' },
  logoutBtn: { width: '100%', padding: '12px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', transition: '0.2s' },

  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#0b0e14' },
  header: { height: '80px', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', backgroundColor: '#111827' },
  breadCrumb: { color: '#6366f1', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  pageTitle: { margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' },
  
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500' },
  avatar: { width: '36px', height: '36px', borderRadius: '10px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' },

  contentViewport: { flex: 1, overflowY: 'auto', padding: '32px' },
  contentCard: { backgroundColor: '#111827', borderRadius: '20px', border: '1px solid #1f2937', minHeight: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', padding: '24px' }
};

export default OwnerDashboard;