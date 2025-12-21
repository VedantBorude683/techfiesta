import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldX, Bot, AlertCircle, Eye, 
  Trash2, CheckCircle, MessageSquare, FileText, 
  User, BarChart, Sparkles, Activity
} from 'lucide-react';

const AIModeration = () => {
  const [flags, setFlags] = useState([
    { 
      id: 1, 
      type: 'Internship Post', 
      author: 'Global Tech Inc', 
      content: 'Easy $8080/week! No experience needed. Click this link: bit.ly/scam-link', 
      reason: 'Suspicious Link / Phishing',
      confidence: 98,
      status: 'Flagged'
    },
    { 
      id: 2, 
      type: 'Comment', 
      author: 'Student_99', 
      content: 'This mentor is absolutely terrible and should be fired immediately!', 
      reason: 'Aggressive Language',
      confidence: 82,
      status: 'Flagged'
    },
    { 
      id: 3, 
      type: 'Profile Bio', 
      author: 'Aniket S.', 
      content: 'Looking for crypto trading partners only. Dm for signals.', 
      reason: 'Off-platform Solicitation',
      confidence: 74,
      status: 'Flagged'
    }
  ]);

  const handleModeration = (id, action) => {
    setFlags(flags.filter(f => f.id !== id));
  };

  return (
    <div style={styles.container}>
      {/* 1. AI STATUS HEADER CARD */}
      <div style={styles.headerCard}>
        <div style={styles.headerLeft}>
          <div style={styles.botCircle}><Bot size={28} color="#4f46e5" /></div>
          <div>
            <div style={styles.liveBadge}><Activity size={12} /> AI SENTINEL ACTIVE</div>
            <h2 style={styles.title}>Content Safety Shield</h2>
            <p style={styles.subtitle}>Analyzing institutional interactions in real-time.</p>
          </div>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{flags.length}</span>
            <span style={styles.statLabel}>Pending Flags</span>
          </div>
          <div style={{ ...styles.statBox, borderLeft: '1px solid #f1f5f9' }}>
            <span style={{ ...styles.statVal, color: '#10b981' }}>99.2%</span>
            <span style={styles.statLabel}>AI Accuracy</span>
          </div>
        </div>
      </div>

      {/* 2. MODERATION QUEUE */}
      <div style={styles.queueContainer}>
        {flags.map((flag) => (
          <div key={flag.id} style={styles.flagCard}>
            <div style={styles.flagSide}>
              <div style={styles.typeRow}>
                {flag.type === 'Internship Post' ? <FileText size={16} color="#6366f1" /> : <MessageSquare size={16} color="#a855f7" />}
                <span style={styles.typeTxt}>{flag.type}</span>
              </div>
              <div style={styles.authorRow}>
                <User size={14} color="#94a3b8" />
                <span style={styles.authorName}>{flag.author}</span>
              </div>
              
              <div style={styles.confidenceSection}>
                <div style={styles.confHeader}>
                  <span>AI Confidence</span>
                  <span style={{ color: flag.confidence > 80 ? '#ef4444' : '#f59e0b' }}>{flag.confidence}%</span>
                </div>
                <div style={styles.progressBg}>
                  <div style={{ ...styles.progressFill, width: `${flag.confidence}%`, backgroundColor: flag.confidence > 80 ? '#ef4444' : '#f59e0b' }}></div>
                </div>
              </div>
            </div>

            <div style={styles.flagBody}>
              <div style={styles.alertBox}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <div>
                  <p style={styles.reasonTxt}>FLAGGED: {flag.reason}</p>
                  <p style={styles.contentTxt}>"{flag.content}"</p>
                </div>
              </div>

              <div style={styles.actionRow}>
                <button onClick={() => handleModeration(flag.id, 'Approve')} style={styles.ignoreBtn}>
                  <ShieldCheck size={16} /> Mark Safe
                </button>
                <button onClick={() => handleModeration(flag.id, 'Remove')} style={styles.deleteBtn}>
                  <ShieldX size={16} /> Purge Content
                </button>
              </div>
            </div>
          </div>
        ))}

        {flags.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyCircle}><CheckCircle size={40} color="#10b981" /></div>
            <h3 style={styles.emptyTitle}>Environment Secured</h3>
            <p style={styles.emptySubtitle}>No malicious content or behavioral flags detected in the current stream.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s ease' },
  headerCard: { 
    padding: '30px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  botCircle: { width: '56px', height: '56px', backgroundColor: '#f5f3ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  liveBadge: { 
    display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fdf2f2', 
    color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' 
  },
  title: { fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '8px 0 0 0', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' },
  
  statsRow: { display: 'flex', gap: '30px' },
  statBox: { textAlign: 'center', paddingLeft: '20px' },
  statVal: { display: 'block', fontSize: '28px', fontWeight: '900', color: '#ef4444', lineHeight: 1 },
  statLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '1px' },

  queueContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  flagCard: { display: 'flex', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' },
  flagSide: { width: '240px', padding: '24px', backgroundColor: '#fcfcfd', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  typeRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  typeTxt: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
  authorRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  authorName: { fontSize: '13px', fontWeight: '700', color: '#1e293b' },
  confidenceSection: { marginTop: '20px' },
  confHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' },
  progressBg: { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '10px' },
  progressFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },

  flagBody: { flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  alertBox: { display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2' },
  reasonTxt: { fontSize: '11px', fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', marginBottom: '8px' },
  contentTxt: { fontSize: '14px', color: '#475569', fontStyle: 'italic', lineHeight: '1.5', margin: 0 },

  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' },
  ignoreBtn: { 
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
    backgroundColor: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '10px', 
    fontSize: '12px', fontWeight: '700', cursor: 'pointer' 
  },
  deleteBtn: { 
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
    backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', 
    fontSize: '12px', fontWeight: '700', cursor: 'pointer' 
  },

  emptyState: { 
    padding: '60px', backgroundColor: 'white', borderRadius: '24px', 
    border: '2px dashed #f1f5f9', textAlign: 'center' 
  },
  emptyCircle: { width: '80px', height: '80px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' },
  emptyTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  emptySubtitle: { fontSize: '14px', color: '#64748b', marginTop: '8px', maxWidth: '300px', margin: '8px auto 0 auto' }
};

export default AIModeration;