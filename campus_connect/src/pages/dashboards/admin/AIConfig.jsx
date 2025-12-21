import React, { useRef, useState } from 'react';
import { 
  Upload, FileText, Settings, ShieldAlert, Sparkles, 
  Database, Trash2, Save, RefreshCw, Cpu
} from 'lucide-react';

const AIConfig = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([
    { name: 'Placement_Policy_2024.pdf', size: '1.2 MB', status: 'Indexed' },
    { name: 'Internship_Guidelines_v2.docx', size: '0.8 MB', status: 'Indexed' }
  ]);
  const [restrictedTopics, setRestrictedTopics] = useState('Political debates, External commercial links, Religious discussions');
  const [autoModeration, setAutoModeration] = useState(true);
  const [persona, setPersona] = useState('Professional Mentor');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('GenAI Knowledge Base successfully updated.');
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const formatted = selectedFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'Ready to Sync'
    }));
    setFiles((prev) => [...prev, ...formatted]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      {/* 1. TOP HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconCircle}><Sparkles size={24} color="#4f46e5" /></div>
          <div>
            <h2 style={styles.title}>GenAI Intelligence Config</h2>
            <p style={styles.subtitle}>Calibrate knowledge grounding and behavioral constraints.</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          style={{
            ...styles.syncBtn,
            backgroundColor: isSyncing ? '#f1f5f9' : '#4f46e5',
            color: isSyncing ? '#94a3b8' : 'white'
          }}
        >
          <RefreshCw size={18} style={{ animation: isSyncing ? 'spin 2s linear infinite' : 'none' }} />
          {isSyncing ? 'Indexing...' : 'Sync Knowledge Base'}
        </button>
      </div>

      <div style={styles.mainGrid}>
        
        {/* 2. LEFT: KNOWLEDGE BASE (RAG) */}
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}><Database size={18} color="#4f46e5" /> Knowledge Sources</h3>
              <span style={styles.countBadge}>{files.length} Docs</span>
            </div>
            
            <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileSelect} />

            <div onClick={() => fileInputRef.current.click()} style={styles.uploadBox}>
              <Upload size={32} color="#cbd5e1" />
              <p style={styles.uploadText}>Upload Institutional Policies</p>
              <p style={styles.uploadSub}>PDF or DOCX used for RAG grounding</p>
            </div>

            <div style={styles.fileList}>
              {files.map((file, index) => (
                <div key={index} style={styles.fileItem}>
                  <div style={styles.fileInfo}>
                    <div style={styles.fileIcon}><FileText size={16} color="#6366f1" /></div>
                    <div>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileMeta}>{file.size} • {file.status}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} style={styles.deleteBtn}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. RIGHT: PERSONA & SAFETY */}
        <div style={styles.rightCol}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><Settings size={18} color="#64748b" /> AI Personality</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>System Persona</label>
              <select 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                style={styles.select}
              >
                <option>Professional Mentor</option>
                <option>Friendly Assistant</option>
                <option>Strict Compliance Officer</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.inputLabel}>Restricted Topics</label>
              <textarea
                value={restrictedTopics}
                onChange={(e) => setRestrictedTopics(e.target.value)}
                style={styles.textarea}
                placeholder="Comma separated topics..."
              />
            </div>

            <div style={styles.moderationRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={18} color="#ef4444" />
                <span style={styles.moderationLabel}>Auto-Moderation</span>
              </div>
              <div 
                onClick={() => setAutoModeration(!autoModeration)}
                style={{
                  ...styles.toggle,
                  backgroundColor: autoModeration ? '#10b981' : '#e2e8f0'
                }}
              >
                <div style={{ ...styles.toggleDot, transform: autoModeration ? 'translateX(18px)' : 'translateX(0)' }}></div>
              </div>
            </div>

            <button style={styles.saveBtn}><Save size={18} /> Save Configurations</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '25px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconCircle: { width: '48px', height: '48px', backgroundColor: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' },
  syncBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },

  mainGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '25px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #f1f5f9' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardTitle: { fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
  countBadge: { fontSize: '10px', fontWeight: '800', color: '#4f46e5', backgroundColor: '#f5f3ff', padding: '4px 10px', borderRadius: '20px' },
  
  uploadBox: { border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '40px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' },
  uploadText: { fontSize: '14px', fontWeight: '700', color: '#475569', margin: '10px 0 0 0' },
  uploadSub: { fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' },

  fileList: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  fileItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' },
  fileInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  fileIcon: { width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' },
  fileName: { fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 },
  fileMeta: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  deleteBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' },

  formGroup: { marginBottom: '20px' },
  inputLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
  select: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', fontWeight: '500' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', minHeight: '100px', resize: 'none' },
  
  moderationRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2', marginBottom: '20px' },
  moderationLabel: { fontSize: '12px', fontWeight: '700', color: '#ef4444' },
  toggle: { width: '40px', height: '22px', borderRadius: '20px', padding: '2px', cursor: 'pointer', transition: '0.3s' },
  toggleDot: { width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
};

export default AIConfig;