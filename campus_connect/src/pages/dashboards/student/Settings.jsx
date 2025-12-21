import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Bell, Moon, LogOut, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [notifications, setNotifications] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirm) return toast.error("New passwords do not match");
    if (passData.newPass.length < 6) return toast.error("Password must be at least 6 chars");

    try {
        const token = localStorage.getItem('token');
        await axios.put('http://127.0.0.1:8080/api/auth/change-password', 
            { currentPassword: passData.current, newPassword: passData.newPass },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success("Password Updated!");
        setPassData({ current: '', newPass: '', confirm: '' });
    } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to update password");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Settings & Preferences</h2>

      <div style={styles.grid}>
        {/* Security Section */}
        <div style={styles.card}>
            <div style={styles.header}>
                <Shield size={20} color="#4f46e5"/> 
                <h3>Security</h3>
            </div>
            <form onSubmit={handlePasswordChange} style={styles.form}>
                <label style={styles.label}>Current Password</label>
                <input type="password" style={styles.input} value={passData.current} onChange={e=>setPassData({...passData, current:e.target.value})} required />
                
                <label style={styles.label}>New Password</label>
                <input type="password" style={styles.input} value={passData.newPass} onChange={e=>setPassData({...passData, newPass:e.target.value})} required />
                
                <label style={styles.label}>Confirm Password</label>
                <input type="password" style={styles.input} value={passData.confirm} onChange={e=>setPassData({...passData, confirm:e.target.value})} required />

                <button type="submit" style={styles.btn}><Lock size={16}/> Update Password</button>
            </form>
        </div>

        {/* Preferences Section */}
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            <div style={styles.card}>
                <div style={styles.header}><Bell size={20} color="#f59e0b"/> <h3>Notifications</h3></div>
                <div style={styles.row}>
                    <span>Email Alerts</span>
                    <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={styles.checkbox}/>
                </div>
                <p style={{fontSize:'0.85rem', color:'#64748b', marginTop:'10px'}}>Receive updates about job applications and deadlines.</p>
            </div>

            <div style={styles.card}>
                <div style={styles.header}><Moon size={20} color="#64748b"/> <h3>Appearance</h3></div>
                <div style={styles.row}>
                    <span>Dark Mode</span>
                    <span style={styles.badge}>Coming Soon</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#1e293b' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
  btn: { background: '#0f172a', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  badge: { background: '#f1f5f9', color: '#94a3b8', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }
};

export default Settings;