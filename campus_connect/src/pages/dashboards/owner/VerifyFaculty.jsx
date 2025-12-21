import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  CheckCircle, XCircle, FileText, User, 
  ShieldAlert, Clock, Search, ExternalLink, AlertTriangle 
} from 'lucide-react';

// --- CUSTOM MODAL COMPONENT ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, userName }) => {
  if (!isOpen) return null;

  const isApprove = action === 'approve';
  
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.card}>
        <div style={{...modalStyles.iconBox, background: isApprove ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}}>
          {isApprove ? <CheckCircle size={32} color="#10b981" /> : <AlertTriangle size={32} color="#ef4444" />}
        </div>
        
        <h3 style={modalStyles.title}>
          {isApprove ? 'Approve Faculty Access?' : 'Reject Application?'}
        </h3>
        
        <p style={modalStyles.message}>
          Are you sure you want to <strong>{isApprove ? 'approve' : 'reject'}</strong> <span style={{color: '#f8fafc'}}>{userName}</span>? 
          {isApprove 
            ? ' They will be granted full access to the faculty dashboard.' 
            : ' This action cannot be undone and the user will be removed.'}
        </p>

        <div style={modalStyles.footer}>
          <button onClick={onClose} style={modalStyles.cancelBtn}>Cancel</button>
          <button 
            onClick={onConfirm} 
            style={{...modalStyles.confirmBtn, background: isApprove ? '#10b981' : '#ef4444', color: isApprove ? '#022c22' : 'white'}}
          >
            {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    id: null,
    action: null,
    name: ''
  });

  useEffect(() => {
    fetchPendingFaculty();
  }, []);

  const fetchPendingFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIXED: Headers for backend compatibility
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await axios.get('http://localhost:8080/api/owner/pending-faculty', { headers });
      setFaculty(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending approvals");
      setLoading(false);
    }
  };

  // 1. Open Modal instead of window.confirm
  const initiateAction = (id, action, name) => {
    setModalConfig({ isOpen: true, id, action, name });
  };

  // 2. Execute Action on Modal Confirm
  const executeAction = async () => {
    const { id, action } = modalConfig;
    
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      await axios.put(`http://localhost:8080/api/owner/verify-faculty/${id}`, 
        { action }, 
        { headers }
      );
      
      toast.success(`Faculty ${action === 'approve' ? 'Approved' : 'Rejected'} Successfully`);
      setFaculty(prev => prev.filter(user => user._id !== id));
      setModalConfig({ isOpen: false, id: null, action: null, name: '' }); // Close Modal
      
    } catch (err) {
      toast.error("Action failed. Please try again.");
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  const getDocUrl = (path) => {
    if (!path) return '#';
    return `http://localhost:8080/${path.replace(/\\/g, '/')}`;
  };

  const filteredList = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={styles.loadingState}>
      <Clock className="animate-spin" size={32} color="#6366f1" />
      <p>Loading Verification Queue...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <Toaster position="bottom-right" />

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={executeAction}
        action={modalConfig.action}
        userName={modalConfig.name}
      />
      
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Faculty Verification Queue</h2>
          <p style={styles.subtitle}>Review ID documents and grant system access.</p>
        </div>
        <div style={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input 
            style={styles.searchInput} 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Section */}
      <div style={styles.listContainer}>
        {filteredList.length === 0 ? (
          <div style={styles.emptyState}>
            <CheckCircle size={48} color="#10b981" />
            <h3>All Caught Up!</h3>
            <p>No pending faculty verifications at this moment.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredList.map(user => (
              <div key={user._id} style={styles.card}>
                
                {/* User Info Header */}
                <div style={styles.cardHeader}>
                   <div style={styles.avatar}>
                      {user.name.charAt(0)}
                   </div>
                   <div style={{flex:1, overflow:'hidden'}}>
                      <h3 style={styles.userName}>{user.name}</h3>
                      <p style={styles.userEmail}>{user.email}</p>
                   </div>
                   <div style={styles.roleBadge}>FACULTY</div>
                </div>

                {/* Details Body */}
                <div style={styles.cardBody}>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>College:</span>
                        <span style={styles.value}>{user.collegeName || 'Not Provided'}</span>
                    </div>
                    <div style={styles.detailRow}>
                        <span style={styles.label}>Registered:</span>
                        <span style={styles.value}>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Document Preview Link */}
                    <div style={styles.docSection}>
                        {user.verificationDoc ? (
                            <a href={getDocUrl(user.verificationDoc)} target="_blank" rel="noreferrer" style={styles.docLink}>
                                <FileText size={16} /> View ID Proof <ExternalLink size={12}/>
                            </a>
                        ) : (
                            <span style={styles.noDoc}>
                                <ShieldAlert size={16}/> No Document Uploaded
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actionFooter}>
                    <button 
                        onClick={() => initiateAction(user._id, 'reject', user.name)}
                        style={styles.rejectBtn}
                    >
                        <XCircle size={18} /> Reject
                    </button>
                    <button 
                        onClick={() => initiateAction(user._id, 'approve', user.name)}
                        style={styles.approveBtn}
                    >
                        <CheckCircle size={18} /> Approve
                    </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' },
  loadingState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '16px' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  title: { fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', margin: 0 },
  subtitle: { color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' },
  
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', padding: '10px 16px', borderRadius: '12px', border: '1px solid #334155', width: '300px' },
  searchInput: { background: 'transparent', border: 'none', color: '#e2e8f0', outline: 'none', width: '100%', fontSize: '0.9rem' },

  listContainer: { flex: 1, overflowY: 'auto', paddingRight: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  
  card: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' },
  
  cardHeader: { padding: '20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '16px', background: '#18202f' },
  avatar: { width: '48px', height: '48px', borderRadius: '12px', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' },
  userName: { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { margin: 0, fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  roleBadge: { fontSize: '0.65rem', fontWeight: '800', color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 8px', borderRadius: '6px', letterSpacing: '1px' },

  cardBody: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' },
  label: { color: '#64748b' },
  value: { color: '#cbd5e1', fontWeight: '500' },

  docSection: { marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #334155' },
  docLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', transition: '0.2s', border: '1px solid rgba(99, 102, 241, 0.2)' },
  noDoc: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: '8px', fontSize: '0.85rem' },

  actionFooter: { padding: '16px 20px', display: 'flex', gap: '12px', background: '#0f172a', borderTop: '1px solid #334155' },
  rejectBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  approveBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#10b981', border: 'none', color: '#064e3b', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' },

  emptyState: { textAlign: 'center', padding: '60px', color: '#64748b', background: '#1e293b', borderRadius: '16px', border: '1px dashed #334155' }
};

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  card: { background: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', width: '400px', maxWidth: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' },
  iconBox: { width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' },
  title: { color: '#f8fafc', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' },
  message: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 24px 0' },
  footer: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '10px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  confirmBtn: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }
};

export default VerifyFaculty;


