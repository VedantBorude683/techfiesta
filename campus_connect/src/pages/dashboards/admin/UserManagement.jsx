import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserCheck, Clock, Check, X, Eye, Filter, Search, GraduationCap 
} from 'lucide-react';

const UserManagement = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for Active Students
  const [selectedYear, setSelectedYear] = useState('All'); // 'All', 'FE', 'SE', 'TE', 'BE'
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/pending-students', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/admin/approved-students', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setPendingStudents(pendingRes.data);
      setApprovedStudents(approvedRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleVerification = async (studentId, action) => {
    try {
      await axios.post('http://localhost:8080/api/admin/verify-student', 
        { studentId, action }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update Local State
      if (action === 'approve') {
        const student = pendingStudents.find(s => s._id === studentId);
        setPendingStudents(prev => prev.filter(s => s._id !== studentId));
        setApprovedStudents(prev => [...prev, { ...student, isApproved: true }]); // Move to active
        alert("Student Approved Successfully");
      } else {
        setPendingStudents(prev => prev.filter(s => s._id !== studentId));
        alert("Student Rejected");
      }
    } catch (err) { alert("Action Failed"); }
  };

  // --- FILTER LOGIC ---
  const filteredActiveStudents = approvedStudents.filter(student => {
    const matchesYear = selectedYear === 'All' || student.year === selectedYear;
    const matchesBranch = selectedBranch === 'All' || student.branch === selectedBranch;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesBranch && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. HEADER STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.iconBox, background: '#f0fdf4', color:'#16a34a'}}><UserCheck size={22}/></div>
          <div><p style={styles.statLabel}>Active Students</p><h3 style={styles.statValue}>{approvedStudents.length}</h3></div>
        </div>
        
        {/* PENDING CARD (Clickable to switch view) */}
        <div 
          onClick={() => setActiveTab('pending')}
          style={{...styles.statCard, cursor:'pointer', border: activeTab === 'pending' ? '2px solid #f59e0b' : '1px solid #f1f5f9'}}
        >
          <div style={{...styles.iconBox, background: '#fffbeb', color:'#d97706'}}><Clock size={22}/></div>
          <div><p style={styles.statLabel}>Pending Approvals</p><h3 style={styles.statValue}>{pendingStudents.length}</h3></div>
          {pendingStudents.length > 0 && <div style={styles.pulseDot}></div>}
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div style={styles.tabContainer}>
         <button 
            onClick={() => setActiveTab('active')} 
            style={activeTab === 'active' ? styles.activeTab : styles.tab}
         >
            <Users size={16} /> All Students
         </button>
         <button 
            onClick={() => setActiveTab('pending')} 
            style={activeTab === 'pending' ? styles.activeTab : styles.tab}
         >
            <Clock size={16} /> Pending Approval 
            {pendingStudents.length > 0 && <span style={styles.countBadge}>{pendingStudents.length}</span>}
         </button>
      </div>

      {/* 3. CONTENT AREA */}
      {activeTab === 'pending' ? (
        // --- PENDING APPROVALS VIEW ---
        <div style={styles.tableCard}>
            <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Verification Queue</h3>
                <p style={styles.cardSubtitle}>Review student ID cards before approving.</p>
            </div>
            {pendingStudents.length === 0 ? (
                <div style={styles.emptyState}>🎉 All caught up! No pending approvals.</div>
            ) : (
                <table style={styles.table}>
                <thead style={styles.thead}>
                    <tr>
                    <th style={styles.th}>Student Profile</th>
                    <th style={styles.th}>Academic Info</th>
                    <th style={styles.th}>Identity Proof</th>
                    <th style={{...styles.th, textAlign:'right'}}>Decision</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingStudents.map((s) => (
                    <tr key={s._id} style={styles.tr}>
                        <td style={styles.td}>
                            <div style={{fontWeight:'700', color:'#0f172a'}}>{s.name}</div>
                            <div style={{fontSize:'12px', color:'#64748b'}}>{s.email}</div>
                        </td>
                        <td style={styles.td}>
                            <span style={styles.tag}>{s.branch}</span> <span style={styles.tag}>{s.year}</span>
                            <div style={{fontSize:'11px', marginTop:'4px', color:'#64748b'}}>CGPA: {s.cgpa}</div>
                        </td>
                        <td style={styles.td}>
                            {s.verificationDoc ? (
                                <a href={s.verificationDoc} target="_blank" rel="noreferrer" style={styles.viewIdBtn}>
                                    <Eye size={14} /> View ID Card
                                </a>
                            ) : <span style={{color:'#ef4444', fontSize:'12px'}}>Not Uploaded</span>}
                        </td>
                        <td style={{...styles.td, textAlign:'right'}}>
                            <div style={{display:'flex', gap:'8px', justifyContent:'flex-end'}}>
                                <button onClick={() => handleVerification(s._id, 'approve')} style={styles.approveBtn}>
                                    <Check size={16} /> Approve
                                </button>
                                <button onClick={() => handleVerification(s._id, 'reject')} style={styles.rejectBtn}>
                                    <X size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
      ) : (
        // --- ACTIVE STUDENTS VIEW (Segregated by Year) ---
        <div style={styles.tableCard}>
            {/* Filters Toolbar */}
            <div style={styles.toolbar}>
                {/* Year Tabs */}
                <div style={styles.yearTabs}>
                    {['All', 'FE', 'SE', 'TE', 'BE'].map(year => (
                        <div 
                           key={year} 
                           onClick={() => setSelectedYear(year)}
                           style={selectedYear === year ? styles.activeYearTab : styles.yearTab}
                        >
                           {year === 'All' ? 'All Years' : year}
                        </div>
                    ))}
                </div>

                {/* Right Side: Search & Branch Filter */}
                <div style={{display:'flex', gap:'10px'}}>
                    <div style={styles.searchBox}>
                        <Search size={14} color="#94a3b8"/>
                        <input 
                          placeholder="Search..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={styles.searchInput}
                        />
                    </div>
                    <select 
                        style={styles.select}
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="All">All Branches</option>
                        <option value="CS">Computer Science</option>
                        <option value="IT">Info Tech</option>
                        <option value="EnTC">EnTC</option>
                        <option value="Mech">Mechanical</option>
                    </select>
                </div>
            </div>

            {/* Students List */}
            {filteredActiveStudents.length === 0 ? (
                <div style={styles.emptyState}>No students found in this category.</div>
            ) : (
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={styles.th}>Student Name</th>
                            <th style={styles.th}>Branch</th>
                            <th style={styles.th}>Year</th>
                            <th style={styles.th}>CGPA</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActiveStudents.map((s) => (
                            <tr key={s._id} style={styles.tr}>
                                <td style={styles.td}>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={styles.avatar}>{s.name.charAt(0)}</div>
                                        <div>
                                            <div style={{fontWeight:'600', color:'#0f172a'}}>{s.name}</div>
                                            <div style={{fontSize:'11px', color:'#64748b'}}>{s.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}><span style={styles.branchTag}>{s.branch}</span></td>
                                <td style={styles.td}>{s.year}</td>
                                <td style={styles.td}>{s.cgpa}</td>
                                <td style={styles.td}>
                                    <span style={styles.activeBadge}>● Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      )}

    </div>
  );
};

// --- STYLES ---
const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
  statCard: { position:'relative', backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px', transition:'0.2s' },
  iconBox: { padding: '12px', borderRadius: '12px' },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#64748b', margin: 0 },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' },
  pulseDot: { position:'absolute', top:'15px', right:'15px', width:'8px', height:'8px', borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 0 4px #fee2e2' },

  tabContainer: { display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' },
  tab: { display:'flex', alignItems:'center', gap:'8px', padding: '10px 20px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer', borderBottom: '2px solid transparent' },
  activeTab: { display:'flex', alignItems:'center', gap:'8px', padding: '10px 20px', border: 'none', background: 'transparent', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', borderBottom: '2px solid #4f46e5' },
  countBadge: { background:'#ef4444', color:'white', fontSize:'10px', padding:'2px 6px', borderRadius:'10px' },

  tableCard: { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', minHeight:'400px' },
  cardHeader: { padding: '20px', borderBottom: '1px solid #f1f5f9' },
  cardTitle: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' },
  
  toolbar: { padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap:'wrap', gap:'10px' },
  yearTabs: { display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' },
  yearTab: { padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer', borderRadius: '6px' },
  activeYearTab: { padding: '6px 12px', fontSize: '13px', fontWeight: '700', color: '#0f172a', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', borderRadius: '6px' },
  
  searchBox: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '150px' },
  select: { padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline:'none', color:'#475569' },

  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '16px 20px', fontSize: '14px', color: '#475569' },
  
  emptyState: { padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' },
  tag: { background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#475569' },
  branchTag: { background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  activeBadge: { color: '#16a34a', fontSize: '12px', fontWeight: '600' },
  
  viewIdBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: '600', fontSize: '13px', textDecoration: 'none', background: '#eff6ff', padding: '6px 12px', borderRadius: '6px' },
  approveBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  rejectBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'white' }
};

export default UserManagement;