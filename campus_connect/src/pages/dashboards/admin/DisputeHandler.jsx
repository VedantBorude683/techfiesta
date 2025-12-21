import React, { useState } from 'react';
import { 
  MessageSquare, AlertTriangle, Scale, Search, 
  User, Send, CheckCircle, Info, MoreVertical, ShieldAlert
} from 'lucide-react';

const DisputeHandler = () => {
  const [disputes] = useState([
    { id: 1024, student: 'Rahul V.', mentor: 'TechCorp', subject: 'Attendance Conflict', status: 'High', lastMessage: 'I have medical certificates...' },
    { id: 1025, student: 'Sneha R.', mentor: 'DataSoft', subject: 'Stipend Delay', status: 'Medium', lastMessage: 'Monthly payment not received.' },
    { id: 1026, student: 'Amit P.', mentor: 'WebSol', subject: 'Role Mismatch', status: 'Low', lastMessage: 'Assigned data entry instead of dev.' },
  ]);

  const [activeDispute, setActiveDispute] = useState(disputes[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'student', name: 'Rahul V.', text: 'I have medical certificates for the missing 3 days.', time: '10:05 AM' },
    { id: 2, sender: 'mentor', name: 'TechCorp', text: 'Documents were not submitted on the portal in time.', time: '11:20 AM' },
    { id: 3, sender: 'admin', name: 'Admin', text: 'Please upload the scanned copies here for verification.', time: '11:45 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: 'admin',
      name: 'Admin',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div style={styles.wrapper}>
      {/* 1. SIDEBAR: CASE LIST */}
      <aside style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <div style={styles.sideTitleRow}>
            <ShieldAlert size={18} color="#ef4444" />
            <h3 style={styles.sideTitle}>Active Cases</h3>
          </div>
          <div style={styles.searchBox}>
            <Search size={14} color="#94a3b8" />
            <input type="text" placeholder="Search ID..." style={styles.searchInput} />
          </div>
        </div>

        <div style={styles.caseList}>
          {disputes.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveDispute(item)}
              style={{
                ...styles.caseItem,
                borderLeft: activeDispute.id === item.id ? '4px solid #4f46e5' : '4px solid transparent',
                backgroundColor: activeDispute.id === item.id ? '#f5f3ff' : 'transparent'
              }}
            >
              <div style={styles.caseTop}>
                <span style={styles.caseId}>Case #{item.id}</span>
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: item.status === 'High' ? '#fef2f2' : '#fffbeb',
                  color: item.status === 'High' ? '#ef4444' : '#d97706'
                }}>{item.status}</span>
              </div>
              <p style={styles.caseSubject}>{item.subject}</p>
              <p style={styles.caseParties}>{item.student} vs {item.mentor}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. MAIN CHAT AREA */}
      <main style={styles.chatArea}>
        <header style={styles.chatHeader}>
          <div style={styles.headerInfo}>
            <div style={styles.scaleIcon}><Scale size={20} color="#4f46e5" /></div>
            <div>
              <h3 style={styles.headerTitle}>Resolution Panel: #{activeDispute.id}</h3>
              <p style={styles.headerSubtitle}>Arbitrating between <b>{activeDispute.student}</b> and <b>{activeDispute.mentor}</b></p>
            </div>
          </div>
          <button style={styles.resolveBtn}><CheckCircle size={16} /> Mark Resolved</button>
        </header>

        <div style={styles.messagesContainer}>
          <div style={styles.auditStamp}>Investigation Session Started • {new Date().toLocaleDateString()}</div>
          
          {messages.map((msg) => (
            <div key={msg.id} style={{
              ...styles.msgWrapper,
              alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
            }}>
              <div style={styles.msgMeta}>
                <span style={styles.msgName}>{msg.name}</span>
                <span style={styles.msgTime}>{msg.time}</span>
              </div>
              <div style={{
                ...styles.msgBubble,
                backgroundColor: msg.sender === 'admin' ? '#1e293b' : msg.sender === 'mentor' ? '#f8fafc' : '#ffffff',
                color: msg.sender === 'admin' ? '#ffffff' : '#475569',
                borderRadius: msg.sender === 'admin' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                border: msg.sender === 'admin' ? 'none' : '1px solid #e2e8f0'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <footer style={styles.footer}>
          <form onSubmit={handleSendMessage} style={styles.inputForm}>
            <div style={styles.infoTrigger}><Info size={18} /></div>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Post a resolution decree or message parties..." 
              style={styles.chatInput}
            />
            <button type="submit" style={styles.sendBtn}><Send size={18} /></button>
          </form>
        </footer>
      </main>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', height: '600px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' },
  
  // SIDEBAR
  sidebar: { width: '300px', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfd' },
  sideHeader: { padding: '24px', borderBottom: '1px solid #f1f5f9' },
  sideTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' },
  sideTitle: { fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 },
  searchBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', outline: 'none', fontSize: '12px', width: '100%', fontWeight: '500' },
  
  caseList: { flex: 1, overflowY: 'auto' },
  caseItem: { padding: '20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: '0.2s' },
  caseTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  caseId: { fontSize: '10px', fontWeight: '800', color: '#94a3b8' },
  priorityBadge: { fontSize: '9px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' },
  caseSubject: { fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  caseParties: { fontSize: '11px', color: '#64748b', margin: 0 },

  // CHAT AREA
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white' },
  chatHeader: { padding: '20px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  scaleIcon: { padding: '10px', backgroundColor: '#f5f3ff', borderRadius: '12px' },
  headerTitle: { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 },
  headerSubtitle: { fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' },
  resolveBtn: { padding: '10px 18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },

  messagesContainer: { flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fcfcfd' },
  auditStamp: { alignSelf: 'center', fontSize: '10px', fontWeight: '800', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '5px 15px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' },
  msgWrapper: { display: 'flex', flexDirection: 'column', maxWidth: '75%' },
  msgMeta: { display: 'flex', gap: '8px', marginBottom: '4px', padding: '0 5px' },
  msgName: { fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
  msgTime: { fontSize: '10px', color: '#cbd5e1' },
  msgBubble: { padding: '12px 16px', fontSize: '14px', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },

  footer: { padding: '24px 30px', borderTop: '1px solid #f1f5f9' },
  inputForm: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f8fafc', padding: '6px 6px 6px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  infoTrigger: { color: '#94a3b8', cursor: 'pointer' },
  chatInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: '500' },
  sendBtn: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)' }
};

export default DisputeHandler;