import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react'; // Added Logo Icon

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '16px 0', transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
               <div style={{  width: '48px', height: '48px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'}}>
                 {/* RELEVANT LOGO ADDED HERE */}
                 <GraduationCap size={28} color="white" strokeWidth={2.5} />
               </div>
            </div>
          <span style={{ color: 'white', fontWeight: '800', justifyContent: 'center',fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            CampusConnect
          </span>
        </Link>

        {/* CENTER LINKS */}
        <div style={{
          display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)',
          padding: '5px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* AI Tools Link (Highlighted) */}
          <button onClick={() => scrollToSection('ai-tools')}
             style={{
               background: 'transparent', border: 'none', color: '#a5b4fc',
               fontSize: '14px', fontWeight: '700', padding: '8px 20px', cursor: 'pointer',
             }}>
             ✨ AI Tools
          </button>
          
          {['Features', 'Stories'].map((item) => (
            <button key={item} onClick={() => scrollToSection(item.toLowerCase())}
              style={{
                background: 'transparent', border: 'none', color: '#94a3b8',
                fontSize: '14px', fontWeight: '600', padding: '8px 20px', cursor: 'pointer', transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = 'white'}
              onMouseOut={(e) => e.target.style.color = '#94a3b8'}
            >
              {item}
            </button>
          ))}
        </div>

        {/* AUTH BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            Login
          </Link>
          <Link to="/register" style={{
            background: 'white', color: '#0f172a', padding: '10px 24px', borderRadius: '100px',
            textDecoration: 'none', fontSize: '14px', fontWeight: '800',
            boxShadow: '0 0 20px rgba(255,255,255,0.2)', transition: 'transform 0.2s'
          }}>
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;