// src/pages/dashboards/owner/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const UserManagement = ({ mode, onActionComplete }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Styles
  const styles = {
    wrapper: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    toolbar: { padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:'#fcfcfc' },
    input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '320px', outline: 'none', fontSize:'14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px 24px', background: '#f8fafc', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
    td: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', verticalAlign:'middle' },
    badge: (role) => ({ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textTransform:'uppercase', background: role === 'faculty' ? '#f3e8ff' : '#dbeafe', color: role === 'faculty' ? '#7e22ce' : '#1d4ed8' }),
    btn: (type) => ({ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', background: type === 'approve' ? '#dcfce7' : type === 'reject' ? '#fee2e2' : 'transparent', color: type === 'approve' ? '#15803d' : type === 'reject' ? '#b91c1c' : '#64748b' })
  };

  useEffect(() => {
    fetchUsers();
  }, [mode]);

  const fetchUsers = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/owner/users', { headers: {'Authorization': `Bearer ${token}` } });
        
        let data = res.data;
        if (mode === 'pending') {
            // SHOW: Faculty who are NOT approved
            data = data.filter(u => u.role === 'faculty' && !u.isApproved);
        } else {
            // SHOW: Everyone else (Approved Faculty + All Students)
            data = data.filter(u => u.isApproved !== false);
        }
        setUsers(data);
    } catch (err) { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if(!window.confirm(`Confirm ${action}?`)) return;
    try {
        const token = localStorage.getItem('token');
        if (action === 'delete') {
            await axios.delete(`http://localhost:8080/api/owner/user/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        } else {
            await axios.put(`http://localhost:8080/api/owner/verify-faculty/${id}`, { action }, { headers: { 'Authorization': `Bearer ${token}` } });
        }
        toast.success("Success!");
        fetchUsers();
        if(onActionComplete) onActionComplete();
    } catch (err) { toast.error("Action Failed"); }
  };

  const getDocUrl = (path) => path ? `http://localhost:8080/${path.replace(/\\/g, '/')}` : '#';
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.wrapper}>
      <Toaster />
      <div style={styles.toolbar}>
        <h3 style={{fontSize:'18px', fontWeight:'700', margin:0, color:'#1e293b'}}>{mode === 'pending' ? 'Verification Queue' : 'All Users'}</h3>
        <input style={styles.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <table style={styles.table}>
        <thead>
            <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Role</th>
                {mode === 'pending' && <th style={styles.th}>Document</th>}
                <th style={styles.th}>College</th>
                <th style={{...styles.th, textAlign:'right'}}>Actions</th>
            </tr>
        </thead>
        <tbody>
            {loading ? <tr><td colSpan="5" style={{padding:'40px', textAlign:'center'}}>Loading...</td></tr> : 
             filtered.length === 0 ? <tr><td colSpan="5" style={{padding:'40px', textAlign:'center'}}>No users found.</td></tr> :
             filtered.map(user => (
                <tr key={user._id}>
                    <td style={styles.td}>
                        <div style={{fontWeight:'700', color:'#0f172a'}}>{user.name}</div>
                        <div style={{fontSize:'12px', color:'#64748b'}}>{user.email}</div>
                    </td>
                    <td style={styles.td}><span style={styles.badge(user.role)}>{user.role}</span></td>
                    
                    {mode === 'pending' && (
                        <td style={styles.td}>
                            {user.verificationDoc ? (
                                <a href={getDocUrl(user.verificationDoc)} target="_blank" rel="noreferrer" 
                                   style={{display:'inline-flex', alignItems:'center', gap:'6px', color:'#4f46e5', fontWeight:'600', textDecoration:'none'}}>
                                   <FileText size={16}/> View Doc
                                </a>
                            ) : <span style={{color:'red'}}>Missing</span>}
                        </td>
                    )}

                    <td style={styles.td}>{user.collegeName || 'N/A'}</td>
                    
                    <td style={{...styles.td, textAlign:'right'}}>
                        <div style={{display:'flex', justifyContent:'flex-end', gap:'8px'}}>
                            {mode === 'pending' ? (
                                <>
                                    <button onClick={() => handleAction(user._id, 'approve')} style={styles.btn('approve')}><CheckCircle size={16}/> Approve</button>
                                    <button onClick={() => handleAction(user._id, 'reject')} style={styles.btn('reject')}><XCircle size={16}/> Reject</button>
                                </>
                            ) : (
                                <button onClick={() => handleAction(user._id, 'delete')} style={styles.btn('delete')}><Trash2 size={16}/></button>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;