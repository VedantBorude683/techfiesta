import React, { useState } from 'react';
import AiResumeAnalyzer from './AiResumeAnalyzer';
import AiMockInterviewer from './AiMockInterviewer';
import AiCareerChatbot from './AiCareerChatbot';
import { FileSearch, MessageSquare, Terminal, ArrowLeft, Sparkles } from 'lucide-react';

function Aitool() {
  const [activeTool, setActiveTool] = useState(null);
  
  // Token ko yahan se bhi pass kar sakte hain agar baki components me error aa raha ho
  const userToken = localStorage.getItem('token');

  const tools = [
    {
      id: 'resume',
      title: 'Resume Analyzer',
      desc: 'Get Gemini AI feedback on your ATS score and keywords.',
      icon: <FileSearch size={32} color="#4f46e5" />,
      component: <AiResumeAnalyzer token={userToken} />, 
      color: '#e0e7ff'
    },
    {
      id: 'interview',
      title: 'Mock Interview',
      desc: 'Practice technical rounds with real-time AI feedback.',
      icon: <Terminal size={32} color="#7c3aed" />,
      component: <AiMockInterviewer token={userToken} />,
      color: '#f3e8ff'
    },
    {
      id: 'chatbot',
      title: 'Career Assistant',
      desc: 'Chat about career paths, skills, and industry trends.',
      icon: <MessageSquare size={32} color="#0891b2" />,
      component: <AiCareerChatbot token={userToken} />,
      color: '#ecfeff'
    }
  ];

  if (activeTool) {
    const selected = tools.find(t => t.id === activeTool);
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button 
            onClick={() => setActiveTool(null)}
            style={styles.backBtn}
            onMouseOver={(e) => e.target.style.color = '#4f46e5'}
            onMouseOut={(e) => e.target.style.color = '#64748b'}
          >
            <ArrowLeft size={18} /> Back to AI Hub
          </button>
          
          <div style={styles.toolContainer} className="animate-fade-in">
            {selected.component}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.hubContainer}>
      <div style={styles.hubHeader}>
        <div style={styles.badge}>
            <Sparkles size={14} /> AI POWERED
        </div>
        <h1 style={styles.hubTitle}>AI Career Suite</h1>
        <p style={styles.hubSubtitle}>Select a tool to accelerate your professional growth</p>
      </div>

      <div style={styles.grid}>
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            style={styles.toolCard}
            onClick={() => setActiveTool(tool.id)}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ ...styles.iconWrapper, backgroundColor: tool.color }}>
              {tool.icon}
            </div>
            <h3 style={styles.cardTitle}>{tool.title}</h3>
            <p style={styles.cardDesc}>{tool.desc}</p>
            <div style={styles.launchTxt}>Launch Tool →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hubContainer: { maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' },
  hubHeader: { textAlign: 'center', marginBottom: '60px' },
  badge: { 
    display: 'inline-flex', alignItems: 'center', gap: '5px', 
    backgroundColor: '#f1f5f9', color: '#475569', padding: '5px 12px', 
    borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '15px' 
  },
  hubTitle: { fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '15px', letterSpacing: '-1px' },
  hubSubtitle: { color: '#64748b', fontSize: '1.2rem', fontWeight: '400' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '30px' 
  },
  toolCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  iconWrapper: {
    padding: '20px',
    borderRadius: '18px',
    marginBottom: '25px'
  },
  cardTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' },
  cardDesc: { color: '#64748b', lineHeight: '1.6', marginBottom: '25px', fontSize: '0.95rem' },
  launchTxt: { color: '#4f46e5', fontWeight: '700', fontSize: '0.9rem' },
  toolContainer: {
    background: 'white',
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '700',
    marginBottom: '30px',
    padding: '10px 0',
    transition: 'color 0.2s'
  }
};

export default Aitool;