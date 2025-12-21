import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Server, Shield, Users, Save, RefreshCw, 
  ToggleLeft, ToggleRight, Mail 
} from 'lucide-react';

const PlatformSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Default State
  const [config, setConfig] = useState({
    maintenanceMode: false,
    allowStudentRegistration: true,
    allowFacultyRegistration: true,
    systemEmail: ''
  });

  // 1. Fetch Settings on Load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      // Ensure Port 8080 (or whatever your backend runs on)
      const res = await axios.get('http://localhost:8080/api/owner/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConfig(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Settings Error:", err);
      toast.error("Failed to load configuration");
      setLoading(false);
    }
  };

  // 2. Toggle Handler
  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 3. Input Handler
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  // 4. Save Changes to Backend
  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/owner/settings', config, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("System configuration updated!");
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading system configs...</div>;

  return (
    <div style={styles.container}>
      <Toaster position="bottom-right" />
      
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Global Settings</h2>
          <p style={styles.subtitle}>Manage system-wide protocols and access.</p>
        </div>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          style={saving ? styles.saveBtnDisabled : styles.saveBtn}
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={styles.grid}>
        
        {/* System Status Card */}
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <Server size={20} color="#6366f1" />
                <h3 style={styles.cardTitle}>System Status</h3>
            </div>
            <div style={styles.cardBody}>
                <div style={styles.settingRow}>
                    <div>
                        <h4 style={styles.label}>Maintenance Mode</h4>
                        <p style={styles.desc}>Lock the platform for all non-owner users.</p>
                    </div>
                    <button onClick={() => handleToggle('maintenanceMode')} style={styles.toggleBtn}>
                        {config.maintenanceMode 
                            ? <ToggleRight size={32} color="#ef4444"/> 
                            : <ToggleLeft size={32} color="#64748b"/>
                        }
                    </button>
                </div>
            </div>
        </div>

        {/* Registration Card */}
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <Users size={20} color="#10b981" />
                <h3 style={styles.cardTitle}>Registration Controls</h3>
            </div>
            <div style={styles.cardBody}>
                <div style={styles.settingRow}>
                    <div>
                        <h4 style={styles.label}>Student Registration</h4>
                        <p style={styles.desc}>Allow new student sign-ups.</p>
                    </div>
                    <button onClick={() => handleToggle('allowStudentRegistration')} style={styles.toggleBtn}>
                        {config.allowStudentRegistration 
                            ? <ToggleRight size={32} color="#10b981"/> 
                            : <ToggleLeft size={32} color="#64748b"/>
                        }
                    </button>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.settingRow}>
                    <div>
                        <h4 style={styles.label}>Faculty Registration</h4>
                        <p style={styles.desc}>Allow new faculty applications.</p>
                    </div>
                    <button onClick={() => handleToggle('allowFacultyRegistration')} style={styles.toggleBtn}>
                        {config.allowFacultyRegistration 
                            ? <ToggleRight size={32} color="#10b981"/> 
                            : <ToggleLeft size={32} color="#64748b"/>
                        }
                    </button>
                </div>
            </div>
        </div>

        {/* Support Card */}
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <Mail size={20} color="#f59e0b" />
                <h3 style={styles.cardTitle}>Support Contact</h3>
            </div>
            <div style={styles.cardBody}>
                <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>System Email</label>
                    <input 
                        name="systemEmail"
                        type="email"
                        value={config.systemEmail}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="support@example.com"
                    />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' },
  loading: { color: '#94a3b8', textAlign: 'center', marginTop: '50px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #1f2937' },
  title: { fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', margin: 0 },
  subtitle: { color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
  saveBtnDisabled: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#1e293b', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'not-allowed' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
  card: { background: '#111827', borderRadius: '16px', border: '1px solid #1f2937', overflow: 'hidden' },
  cardHeader: { padding: '20px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #334155' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: 0 },
  cardBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0', margin: '0 0 4px 0' },
  desc: { fontSize: '0.8rem', color: '#94a3b8', margin: 0 },
  toggleBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 },
  divider: { height: '1px', background: '#1f2937', width: '100%' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inputLabel: { fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' },
  input: { background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '8px', outline: 'none' }
};

export default PlatformSettings;
