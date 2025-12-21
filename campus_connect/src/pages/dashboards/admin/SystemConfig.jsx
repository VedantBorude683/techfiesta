import React, { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Info, Briefcase, Code, Filter, Search } from 'lucide-react';

const ApprovalSystem = () => {
  const [activeTab, setActiveTab] = useState('Internships');

  const pendingItems = [
    { id: '1', title: 'Full Stack Intern', company: 'Google', type: 'Internship', postedBy: 'HR Dept', date: 'Oct 24', logo: 'G' },
    { id: '2', title: 'Blockchain Research', company: 'Academic', type: 'Project', postedBy: 'Dr. Khanna', date: 'Oct 23', logo: 'B' },
  ];

  return (
    <div style={styles.container}>
      {/* 1. HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.tabGroup}>
          {['Internships', 'Projects'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabBtn,
                color: activeTab === tab ? '#4f46e5' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
                backgroundColor: activeTab === tab ? '#f5f3ff' : 'transparent',
              }}
            >
              {tab === 'Internships' ? <Briefcase size={16} /> : <Code size={16} />}
              {tab}
            </button>
          ))}
        </div>
        <div style={styles.actionHeader}>
          <div style={styles.searchBox}>
            <Search size={14} color="#94a3b8" />
            <input type="text" placeholder="Quick search..." style={styles.searchInput} />
          </div>
        </div>
      </div>

      {/* 2. TABLE AREA */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Opportunity Details</th>
              <th style={styles.th}>Posted By</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action Terminal</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map(item => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.titleRow}>
                    <div style={styles.avatar}>{item.logo}</div>
                    <div>
                      <div style={styles.itemTitle}>{item.title}</div>
                      <div style={styles.itemCompany}>{item.company} • {item.date}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.postedBy}>
                    <Info size={14} color="#94a3b8" />
                    {item.postedBy}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.pendingBadge}>Waiting for Review</span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.btnStack}>
                    <button style={{ ...styles.actionBtn, color: '#10b981', backgroundColor: '#ecfdf5' }} title="Approve">
                      <CheckCircle size={18} />
                    </button>
                    <button style={{ ...styles.actionBtn, color: '#ef4444', backgroundColor: '#fef2f2' }} title="Reject">
                      <XCircle size={18} />
                    </button>
                    <button style={{ ...styles.actionBtn, color: '#6366f1', backgroundColor: '#f5f3ff' }} title="View Details">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' 
  },
  tabGroup: { display: 'flex', gap: '5px' },
  tabBtn: { 
    padding: '12px 24px', fontSize: '14px', fontWeight: '700', border: 'none', 
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
    borderRadius: '10px 10px 0 0', transition: 'all 0.2s' 
  },
  searchBox: { 
    display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', 
    padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' 
  },
  searchInput: { background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: '#1e293b', fontWeight: '500' },

  tableWrapper: { backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { backgroundColor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' },
  th: { padding: '18px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr: { borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' },
  td: { padding: '20px 24px' },

  titleRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { 
    width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '12px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#4f46e5', fontSize: '16px' 
  },
  itemTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
  itemCompany: { fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px' },
  
  postedBy: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', fontWeight: '600' },
  pendingBadge: { fontSize: '10px', fontWeight: '800', color: '#d97706', backgroundColor: '#fffbeb', padding: '5px 12px', borderRadius: '20px', textTransform: 'uppercase' },

  btnStack: { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  actionBtn: { 
    padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' 
  },
};

export default ApprovalSystem;