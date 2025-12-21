import React, { useState } from 'react';
import { Megaphone, Send, Users, Shield, Sparkles, Bell, History } from 'lucide-react';

const AnnouncementManager = () => {
  const [target, setTarget] = useState('all');

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* 1. LEFT FORM SECTION */}
        <div style={styles.formSection}>
          <div style={styles.header}>
            <div style={styles.iconCircle}><Megaphone size={20} color="#4f46e5" /></div>
            <div>
              <h2 style={styles.title}>Broadcast Intelligence</h2>
              <p style={styles.subtitle}>Send real-time alerts to your institutional network.</p>
            </div>
          </div>

          <div style={styles.formBody}>
            {/* TARGET AUDIENCE SELECTION */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target Audience</label>
              <div style={styles.radioGrid}>
                <div 
                  onClick={() => setTarget('all')}
                  style={{ ...styles.radioCard, borderColor: target === 'all' ? '#4f46e5' : '#e2e8f0', backgroundColor: target === 'all' ? '#f5f3ff' : 'white' }}
                >
                  <Users size={18} color={target === 'all' ? '#4f46e5' : '#64748b'} />
                  <span style={{ ...styles.radioLabel, color: target === 'all' ? '#4f46e5' : '#475569' }}>All Students</span>
                  {target === 'all' && <div style={styles.activeDot}></div>}
                </div>
                
                <div 
                  onClick={() => setTarget('faculty')}
                  style={{ ...styles.radioCard, borderColor: target === 'faculty' ? '#4f46e5' : '#e2e8f0', backgroundColor: target === 'faculty' ? '#f5f3ff' : 'white' }}
                >
                  <Shield size={18} color={target === 'faculty' ? '#4f46e5' : '#64748b'} />
                  <span style={{ ...styles.radioLabel, color: target === 'faculty' ? '#4f46e5' : '#475569' }}>Faculty Only</span>
                  {target === 'faculty' && <div style={styles.activeDot}></div>}
                </div>
              </div>
            </div>

            {/* SUBJECT INPUT */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Announcement Subject</label>
              <input style={styles.input} placeholder="e.g. Winter Internship Deadline Extended" />
            </div>

            {/* MESSAGE AREA */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Message Content</label>
              <textarea style={styles.textarea} placeholder="Write your announcement here..."></textarea>
            </div>

            <button style={styles.broadcastBtn}>
              <Send size={18} /> Broadcast to Network
            </button>
          </div>
        </div>

        {/* 2. RIGHT PREVIEW/TIPS SECTION */}
        <div style={styles.previewSection}>
          <div style={styles.previewCard}>
            <h4 style={styles.previewTitle}><Sparkles size={16} /> Pro Tips</h4>
            <ul style={styles.tipsList}>
              <li>Keep it concise for mobile notifications.</li>
              <li>Include links if there's an external resource.</li>
              <li>Schedule during peak active hours.</li>
            </ul>
          </div>
          
          <div style={styles.historyCard}>
            <h4 style={styles.previewTitle}><History size={16} /> Recent Activity</h4>
            <div style={styles.historyItem}>
              <div style={styles.dot}></div>
              <div>
                <p style={styles.historyText}>Exam portal maintenance...</p>
                <span style={styles.historyDate}>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.4s ease' },
  container: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' },
  
  // FORM STYLES
  formSection: { backgroundColor: 'white', padding: '40px', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' },
  iconCircle: { width: '45px', height: '45px', backgroundColor: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  
  formBody: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  
  radioGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  radioCard: { 
    padding: '15px', border: '2px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', transition: 'all 0.2s ease'
  },
  radioLabel: { fontSize: '13px', fontWeight: '700' },
  activeDot: { width: '6px', height: '6px', backgroundColor: '#4f46e5', borderRadius: '50%', position: 'absolute', top: '10px', right: '10px' },
  
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', transition: 'border 0.2s', backgroundColor: '#fcfcfd' },
  textarea: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', height: '120px', resize: 'none', backgroundColor: '#fcfcfd' },
  
  broadcastBtn: { 
    marginTop: '10px', padding: '16px', backgroundColor: '#0f172a', color: 'white', 
    border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '14px', 
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
  },

  // SIDEBAR STYLES
  previewSection: { display: 'flex', flexDirection: 'column', gap: '20px' },
  previewCard: { padding: '25px', backgroundColor: '#f5f3ff', borderRadius: '24px', border: '1px solid #e0e7ff' },
  historyCard: { padding: '25px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f1f5f9' },
  previewTitle: { fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' },
  tipsList: { margin: 0, paddingLeft: '20px', color: '#4f46e5', fontSize: '12px', lineHeight: '2', fontWeight: '600' },
  
  historyItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '15px' },
  dot: { width: '8px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '50%', marginTop: '5px' },
  historyText: { fontSize: '12px', color: '#475569', margin: 0, fontWeight: '500' },
  historyDate: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }
};

export default AnnouncementManager;