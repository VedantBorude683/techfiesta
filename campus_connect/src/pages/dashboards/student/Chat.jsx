import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  
  const myId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id;

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8080/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Simple de-duplication could go here if needed
      setMessages(res.data);
    } catch (err) { console.error("Chat Error", err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !recipientEmail.trim()) return toast.error("Enter email and message");
    
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://127.0.0.1:8080/api/messages/send', 
            { content: input, recipientEmail }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMessages([...messages, res.data]);
        setInput('');
    } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to send");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar / Recipient Selector (Simplified) */}
      <div style={styles.sidebar}>
          <h3 style={styles.headerTitle}>Messages</h3>
          <div style={{padding:'20px'}}>
             <label style={{fontSize:'0.85rem', fontWeight:'bold', color:'#64748b'}}>To (Email):</label>
             <input 
                style={styles.emailInput} 
                placeholder="faculty@college.edu" 
                value={recipientEmail} 
                onChange={e => setRecipientEmail(e.target.value)} 
             />
             <div style={{marginTop:'20px', fontSize:'0.8rem', color:'#94a3b8'}}>
                 Start a conversation with your faculty or peers by entering their registered email.
             </div>
          </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
          <div style={styles.messageList}>
              {messages.length === 0 ? (
                  <div style={styles.emptyState}>
                      <MessageSquare size={40} color="#cbd5e1"/>
                      <p>No messages yet. Start chatting!</p>
                  </div>
              ) : (
                  messages.map(msg => {
                      const isMe = msg.sender._id === myId;
                      return (
                          <div key={msg._id} style={{...styles.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start'}}>
                              <div style={{...styles.bubble, background: isMe ? '#4f46e5' : 'white', color: isMe ? 'white' : '#1e293b', border: isMe ? 'none' : '1px solid #e2e8f0'}}>
                                  <div style={styles.senderName}>{isMe ? 'You' : msg.sender.name}</div>
                                  {msg.content}
                                  <div style={{fontSize:'0.65rem', opacity:0.7, marginTop:'4px', textAlign:'right'}}>
                                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                              </div>
                          </div>
                      );
                  })
              )}
              <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} style={styles.inputBar}>
              <input 
                 style={styles.chatInput} 
                 placeholder="Type your message..." 
                 value={input} 
                 onChange={e => setInput(e.target.value)}
              />
              <button type="submit" disabled={loading} style={styles.sendBtn}>
                  <Send size={18} />
              </button>
          </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '80vh', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  sidebar: { width: '300px', borderRight: '1px solid #f1f5f9', background: '#f8fafc' },
  headerTitle: { padding: '20px', borderBottom: '1px solid #e2e8f0', margin: 0, fontSize: '1.2rem' },
  emailInput: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1' },
  
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  messageList: { flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display:'flex', flexDirection:'column', gap:'15px' },
  
  msgRow: { display: 'flex' },
  bubble: { maxWidth: '60%', padding: '12px 16px', borderRadius: '12px', fontSize: '0.95rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  senderName: { fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px', opacity: 0.9 },
  
  inputBar: { padding: '15px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' },
  chatInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' },
  sendBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer' },
  
  emptyState: { height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#94a3b8' }
};

export default Chat;