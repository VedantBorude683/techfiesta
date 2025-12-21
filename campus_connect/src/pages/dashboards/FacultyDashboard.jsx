import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CheckCircle, BarChart3, Cpu, 
  Award, Megaphone, AlertTriangle, Database, ScrollText, 
  Settings, LogOut, Search, UserCircle, Activity, Zap, Briefcase, ChevronRight
} from 'lucide-react';

// components import (paths intact)
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement';
import ApprovalSystem from './admin/ApprovalSystem';
import AnalyticsView from './admin/AnalyticsView';
import AIModeration from './admin/AIModeration';
import CertificateControl from './admin/CertificateControl';
import AnnouncementManager from './admin/AnnouncementManager';
import DisputeHandler from './admin/DisputeHandler';
import AIConfig from './admin/AIConfig';
import AuditLogs from './admin/AuditLogs';
import SystemSettings from './admin/SystemSettings';
import OpportunityManager from './faculty/OpportunityManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('Overview');

  const navItems = [
    { name: 'Overview', icon: <LayoutDashboard size={18} />, component: AdminOverview },
    { name: 'Opportunities', icon: <Briefcase size={18} />, component: OpportunityManager },
    { name: 'Users', icon: <Users size={18} />, component: UserManagement },
    { name: 'Approvals', icon: <CheckCircle size={18} />, component: ApprovalSystem },
    { name: 'Analytics', icon: <BarChart3 size={18} />, component: AnalyticsView },
    { name: 'AI Shield', icon: <Cpu size={18} />, component: AIModeration },
    { name: 'Credentials', icon: <Award size={18} />, component: CertificateControl },
    { name: 'Broadcast', icon: <Megaphone size={18} />, component: AnnouncementManager },
    { name: 'Disputes', icon: <AlertTriangle size={18} />, component: DisputeHandler },
    { name: 'AI Models', icon: <Database size={18} />, component: AIConfig },
    { name: 'Activity', icon: <ScrollText size={18} />, component: AuditLogs },
    { name: 'Settings', icon: <Settings size={18} />, component: SystemSettings },
  ];

  const ActiveComponent = navItems.find(i => i.name === activeView)?.component || AdminOverview;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', color: '#1e293b', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      
      {/* MINIMALIST WHITE SIDEBAR */}
      <aside style={{ width: '280px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', flexShrink: 0 }}>
        
        {/* Brand Section */}
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ height: '32px', width: '32px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
            <Activity color="white" size={18} />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', margin: 0 }}>CORE ADMIN</h2>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }} className="custom-scrollbar">
          <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px 12px 12px' }}>Main Menu</p>
          {navItems.map((item) => (
            <div 
              key={item.name}
              onClick={() => setActiveView(item.name)}
              style={{
                display: 'flex', alignItems: 'center', padding: '12px 14px', marginBottom: '4px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
                backgroundColor: activeView === item.name ? '#f1f5f9' : 'transparent',
                color: activeView === item.name ? '#4f46e5' : '#64748b',
              }}
              onMouseEnter={(e) => { if(activeView !== item.name) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
              onMouseLeave={(e) => { if(activeView !== item.name) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span style={{ marginRight: '12px', display: 'flex', opacity: activeView === item.name ? 1 : 0.7 }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: activeView === item.name ? '700' : '500', flex: 1 }}>{item.name}</span>
              {activeView === item.name && <ChevronRight size={14} />}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }} 
            style={{ width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#ef4444', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* CLEAN MAIN VIEWPORT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Header */}
        <header style={{ height: '72px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Dashboard</span>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '700' }}>{activeView}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
               <div style={{ height: '6px', width: '6px', background: '#22c55e', borderRadius: '50%' }}></div>
               <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Optimal Health</span>
            </div>
            <div style={{ height: '36px', width: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <UserCircle size={22} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', backgroundColor: '#f8fafc' }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '20px', 
            border: '1px solid #e2e8f0', 
            padding: '40px', 
            minHeight: '100%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
          }}>
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;