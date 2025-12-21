import React from 'react';
import { Save, Calendar, ShieldCheck, ToggleRight, Layout, Zap, Globe } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div style={styles.container}>
      {/* 1. HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.iconCircle}><Layout size={20} color="#4f46e5" /></div>
        <div>
          <h2 style={styles.title}>System Configuration</h2>
          <p style={styles.subtitle}>Manage global application cycles, feature flags, and institutional security.</p>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* 2. ACADEMIC TIMELINE CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}><Calendar size={18} color="#4f46e5" /> Academic Timeline</h3>
          <p style={styles.cardDesc}>Set the window for student applications and enrollment.</p>
          
          <div style={styles.dateGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Application Start</label>
              <input type="date" style={styles.input} defaultValue="2025-11-01" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Submission Deadline</label>
              <input type="date" style={styles.input} defaultValue="2025-12-15" />
            </div>
          </div>
        </div>

        {/* 3. FEATURE TOGGLES CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}><Zap size={18} color="#f59e0b" /> Modular Features</h3>
          <p style={styles.cardDesc}>Enable or disable advanced platform functionalities.</p>
          
          <div style={styles.toggleList}>
            {[
              { label: 'Blockchain Verification', desc: 'Public ledger for credential security', icon: <Globe size={14} />, active: true },
              { label: 'AI Assistance', desc: 'Proposal generation for students', icon: <Sparkles size={14} />, active: true },
              { label: 'Direct Company Postings', desc: 'Bypass faculty approval for verified firms', icon: <ShieldCheck size={14} />, active: false }
            ].map((f, i) => (
              <div key={i} style={styles.toggleRow}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                   <div style={styles.miniIcon}>{f.icon}</div>
                   <div>
                      <p style={styles.toggleLabel}>{f.label}</p>
                      <p style={styles.toggleDesc}>{f.desc}</p>
                   </div>
                </div>
                <div style={{
                  ...styles.toggleSwitch,
                  backgroundColor: f.active ? '#10b981' : '#e2e8f0'
                }}>
                  <div style={{ ...styles.toggleDot, transform: f.active ? 'translateX(18px)' : 'translateX(0)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTION BAR */}
      <div style={styles.footer}>
        <div style={styles.warningNote}>
          <ShieldCheck size={14} /> Changes take effect immediately across all user nodes.
        </div>
        <button style={styles.saveBtn}>
          <Save size={18} /> Apply Global Changes
        </button>
      </div>
    </div>
  );
};

// Simple Sparkles icon helper
const Sparkles = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s ease' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '25px' },
  iconCircle: { width: '48px', height: '48px', backgroundColor: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' },

  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  cardTitle: { fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' },
  cardDesc: { fontSize: '13px', color: '#94a3b8', marginBottom: '25px' },

  dateGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: '600' },

  toggleList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
  miniIcon: { padding: '8px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', border: '1px solid #e2e8f0' },
  toggleLabel: { fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 },
  toggleDesc: { fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' },
  
  toggleSwitch: { width: '40px', height: '22px', borderRadius: '20px', padding: '2px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center' },
  toggleDot: { width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },

  footer: { marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', backgroundColor: '#fcfcfd', borderRadius: '20px', border: '1px solid #f1f5f9' },
  warningNote: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
  saveBtn: { padding: '14px 28px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }
};

export default SystemSettings;