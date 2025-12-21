
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, Trash2, BookOpen, GraduationCap, 
  Mail, AlertTriangle, X 
} from 'lucide-react';

// --- 1. DELETE CONFIRMATION MODAL ---
const DeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.card}>
        <button onClick={onClose} style={modalStyles.closeBtn}><X size={20}/></button>
        
        <div style={modalStyles.iconBox}>
          <AlertTriangle size={32} color="#ef4444" />
        </div>
        
        <h3 style={modalStyles.title}>Delete User Account?</h3>
        
        <p style={modalStyles.message}>
          You are about to permanently delete <strong>{userName}</strong>. 
          <br/>
          <span style={{fontSize:'0.85rem', color:'#f87171', marginTop:'8px', display:'block'}}>
            This action cannot be undone. All data associated with this user will be removed.
          </span>
        </p>

        <div style={modalStyles.footer}>
          <button onClick={onClose} style={modalStyles.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={modalStyles.deleteBtn}>
            Yes, Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIX: Use correct Authorization header
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await axios.get('http://localhost:8080/api/owner/all-users', { headers });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  // --- 2. OPEN MODAL ---
  const promptDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  // --- 3. EXECUTE DELETE ---
  const executeDelete = async () => {
    const { id } = deleteModal;
    
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      await axios.delete(`http://localhost:8080/api/owner/delete-user/${id}`, { headers });
      
      toast.success("User deleted successfully");
      setUsers(prev => prev.filter(u => u._id !== id));
      setDeleteModal({ isOpen: false, id: null, name: '' }); // Close modal
      
    } catch (err) {
      toast.error("Delete failed. Please try again.");
      setDeleteModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesTab = user.role === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <Toaster position="bottom-right" />
      
      {/* DELETE MODAL RENDER */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={executeDelete}
        userName={deleteModal.name}
      />

      {/* Header & Tabs */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Global User Database</h2>
          <p style={styles.subtitle}>Manage all registered accounts across the platform.</p>
        </div>
        
        <div style={styles.tabContainer}>
            <button 
                style={activeTab === 'student' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('student')}
            >
                <GraduationCap size={18} /> Students
            </button>
            <button 
                style={activeTab === 'faculty' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('faculty')}
            >
                <BookOpen size={18} /> Faculty
            </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
                style={styles.searchInput} 
                placeholder={`Search ${activeTab}s...`}
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div style={styles.countBadge}>
            Showing {filteredUsers.length} {activeTab}s
        </div>
      </div>

      {/* Users Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>User Profile</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Academic Details</th>
                    <th style={styles.th}>Status</th>
                    <th style={{...styles.th, textAlign:'right'}}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan="5" style={styles.loadingCell}>Loading database...</td></tr>
                ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" style={styles.emptyCell}>No users found.</td></tr>
                ) : (
                    filteredUsers.map(user => (
                        <tr key={user._id} style={styles.tr}>
                            <td style={styles.td}>
                                <div style={styles.profileCell}>
                                    <div style={styles.avatar}>{user.name.charAt(0)}</div>
                                    <div>
                                        <div style={styles.name}>{user.name}</div>
                                        <div style={styles.role}>{user.role.toUpperCase()}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={styles.td}>
                                <div style={styles.contactCell}>
                                    <Mail size={12} /> {user.email}
                                </div>
                            </td>
                            <td style={styles.td}>
                                <div style={styles.collegeInfo}>
                                    {user.collegeName || 'N/A'}
                                    {user.branch && <span style={styles.branchTag}>{user.branch}</span>}
                                </div>
                            </td>
                            <td style={styles.td}>
                                {user.role === 'faculty' && !user.isApproved ? (
                                    <span style={styles.pendingBadge}>Pending Approval</span>
                                ) : (
                                    <span style={styles.activeBadge}>Active</span>
                                )}
                            </td>
                            <td style={{...styles.td, textAlign:'right'}}>
                                <button 
                                    onClick={() => promptDelete(user._id, user.name)}
                                    style={styles.deleteBtn}
                                    title="Delete User"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1f2937', paddingBottom: '20px' },
  title: { fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', margin: 0 },
  subtitle: { color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' },
  
  tabContainer: { display: 'flex', background: '#111827', padding: '4px', borderRadius: '12px', border: '1px solid #1f2937' },
  tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: '0.2s' },
  activeTab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' },

  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', padding: '10px 16px', borderRadius: '12px', border: '1px solid #334155', width: '320px' },
  searchInput: { background: 'transparent', border: 'none', color: '#e2e8f0', outline: 'none', width: '100%', fontSize: '0.9rem' },
  countBadge: { color: '#64748b', fontSize: '0.85rem', fontWeight: '600' },

  tableWrapper: { flex: 1, overflowY: 'auto', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px 24px', background: '#111827', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #334155', position: 'sticky', top: 0 },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '16px 24px', verticalAlign: 'middle', color: '#cbd5e1' },
  
  profileCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '10px', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  name: { fontWeight: '600', color: '#f8fafc' },
  role: { fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' },
  
  contactCell: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#94a3b8' },
  collegeInfo: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem' },
  branchTag: { fontSize: '0.7rem', background: '#334155', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' },
  
  activeBadge: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
  pendingBadge: { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
  
  deleteBtn: { padding: '8px', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer', transition: '0.2s', ':hover': { background: '#ef4444', color: 'white' } },
  
  loadingCell: { padding: '40px', textAlign: 'center', color: '#64748b' },
  emptyCell: { padding: '40px', textAlign: 'center', color: '#64748b' }
};

// --- MODAL STYLES ---
const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  card: { background: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #ef4444', width: '400px', maxWidth: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', position: 'relative' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' },
  iconBox: { width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' },
  title: { color: '#f8fafc', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' },
  message: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 24px 0' },
  footer: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  deleteBtn: { flex: 1, padding: '12px', border: 'none', background: '#ef4444', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', transition: '0.2s' }
};

export default AllUsers;