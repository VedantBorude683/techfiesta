import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#020617', // Darker shade than body for contrast
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '80px 0 40px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{maxWidth: '1280px', margin: '0 auto', padding: '0 24px'}}>
        
        {/* TOP SECTION */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px'}}>
          
          {/* BRAND */}
          <div style={{gridColumn: 'span 2'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <div style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px'}}></div>
                <span style={{color: 'white', fontWeight: '800', fontSize: '1.4rem'}}>CampusConnect</span>
             </div>
             <p style={{color: '#94a3b8', lineHeight: '1.6', maxWidth: '350px'}}>
               The world's first AI-powered academic bridge. We connect student potential with industry opportunity through verified project portfolios.
             </p>
          </div>

          {/* COLUMN 1 */}
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '20px'}}>Platform</h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <li><Link to="/" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '14px'}}>Home</Link></li>
              <li><Link to="/register" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '14px'}}>Join as Student</Link></li>
              <li><Link to="/register?role=faculty" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '14px'}}>Join as Faculty</Link></li>
              <li><Link to="/login" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '14px'}}>Sign In</Link></li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '20px'}}>AI Tools</h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <li style={{color: '#94a3b8', fontSize: '14px', cursor: 'pointer'}}>Resume Analyzer</li>
              <li style={{color: '#94a3b8', fontSize: '14px', cursor: 'pointer'}}>Mock Interviewer</li>
              <li style={{color: '#94a3b8', fontSize: '14px', cursor: 'pointer'}}>Career Chatbot</li>
              <li style={{color: '#94a3b8', fontSize: '14px', cursor: 'pointer'}}>Project Matcher</li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h4 style={{color: 'white', fontWeight: '700', marginBottom: '20px'}}>Contact</h4>
            <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '10px'}}>support@campusconnect.edu</p>
            {/* <p style={{color: '#94a3b8', fontSize: '14px'}}>+91 1234567890</p> */}
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
               {/* Social Placeholders */}
               <div style={{width:'36px', height:'36px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>𝕏</div>
               <div style={{width:'36px', height:'36px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>In</div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '30px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
        }}>
          <p style={{color: '#64748b', fontSize: '13px'}}>© 2025 CampusConnect Inc. All rights reserved.</p>
          <div style={{display: 'flex', gap: '24px'}}>
             <span style={{color: '#64748b', fontSize: '13px', cursor: 'pointer'}}>Privacy Policy</span>
             <span style={{color: '#64748b', fontSize: '13px', cursor: 'pointer'}}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}