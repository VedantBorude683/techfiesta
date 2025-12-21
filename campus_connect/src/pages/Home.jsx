import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Rocket, Users, ChevronRight, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer'; // Import Footer

export default function Home() {
  const [activeTicker, setActiveTicker] = useState(0);
  const tickers = [
    "🔥 New Internship: Machine Learning Intern at Google just posted",
    "🚀 Project Update: 'EcoTrack' reached 500+ stars",
    "🎓 12 Students verified for 'Blockchain Summit' certificates today",
    "💼 Hired: Rahul S. joined Microsoft via CampusConnect"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTicker((prev) => (prev + 1) % tickers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-elite-root">
      <style>{`
        /* --- GLOBAL --- */
        .home-elite-root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --bg: #0f172a;
          --glass: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
          background-color: var(--bg);
          overflow-x: hidden;
          background-image: 
            radial-gradient(circle at 10% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
        }

        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        
        /* ANIMATIONS */
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); } 50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5); } }
        @keyframes ticker-slide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* HERO */
        .hero { padding: 160px 0 100px; text-align: center; position: relative; }
        .hero h1 { font-size: clamp(3rem, 7vw, 5rem); font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.03em; }
        .gradient-text {
          background: linear-gradient(135deg, white 0%, #a5b4fc 50%, #6366f1 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-desc { color: #94a3b8; font-size: 1.25rem; max-width: 650px; margin: 0 auto 40px; line-height: 1.6; }

        /* BUTTONS */
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
          padding: 18px 40px; border-radius: 16px; font-weight: 700; font-size: 1.1rem;
          text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.5); transition: 0.3s;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 30px 60px -12px rgba(99, 102, 241, 0.7); }

        /* TICKER */
        .live-ticker {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 24px; border-radius: 100px; display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 40px; backdrop-filter: blur(10px);
        }

        /* FEATURES GRID */
        .bento-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-top: 80px; }
        .feature-card {
          background: linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px;
          transition: 0.3s; position: relative; overflow: hidden;
        }
        .feature-card:hover { border-color: rgba(99, 102, 241, 0.4); transform: translateY(-5px); background: rgba(255,255,255,0.04); }
        
        .icon-box { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; font-size: 24px; }
        .icon-purple { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; }
        .icon-blue { background: rgba(56, 189, 248, 0.2); color: #7dd3fc; }
        .icon-green { background: rgba(74, 222, 128, 0.2); color: #86efac; }

        /* AI DEMO SECTION */
        .ai-section {
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 70%);
          border-radius: 40px; padding: 80px 40px; margin-top: 120px; border: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }
        .ai-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
        .ai-card {
          background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1);
          padding: 30px; border-radius: 20px; text-align: left;
        }
        @media (max-width: 1024px) { .ai-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="hero container">
        <div className="live-ticker">
          <span style={{width:'8px', height:'8px', background:'#22c55e', borderRadius:'50%', boxShadow:'0 0 10px #22c55e'}}></span>
          <span key={activeTicker} style={{fontSize:'14px', color:'#cbd5e1', animation:'ticker-slide 0.5s ease'}}>
            {tickers[activeTicker]}
          </span>
        </div>

        <h1>
          Don't Just Study Engineering. <br />
          <span className="gradient-text">Launch Your Career.</span>
        </h1>
        
        <p className="hero-desc">
          The only platform that connects your college projects directly with industry recruiters. 
          Use AI tools to perfect your resume, find mentors, and get hired.
        </p>
        
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/register" className="btn-primary">
            <Rocket size={20} /> Build Your Profile - It's Free
          </Link>
          <button onClick={() => document.getElementById('ai-tools').scrollIntoView({behavior:'smooth'})} 
            style={{
              background: 'rgba(255,255,255,0.05)', color: 'white', padding: '18px 40px', borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem'
            }}>
            See AI Tools
          </button>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="container" id="features">
        <div className="bento-grid">
          <div className="feature-card">
            <div className="icon-box icon-purple"><Brain /></div>
            <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px'}}>AI-Powered Careers</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6'}}>
              Stop guessing. Our <b>AI Resume Analyzer</b> and <b>Mock Interviewer</b> give you instant feedback to crack top tech companies.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-box icon-blue"><Users /></div>
            <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px'}}>Elite Mentorship</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6'}}>
              Connect with <b>Verified Faculty</b> and <b>Industry Alumni</b> for real-time guidance on your projects.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-box icon-green"><TrendingUp /></div>
            <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px'}}>Project Portfolio</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6'}}>
              Your GitHub is messy. We turn your projects into a <b>Verified Portfolio</b> that recruiters actually look at.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI TOOLS SHOWCASE */}
      <section id="ai-tools" className="container">
        <div className="ai-section">
          <div style={{display:'inline-block', padding:'6px 16px', borderRadius:'100px', background:'rgba(99, 102, 241, 0.2)', color:'#a5b4fc', fontSize:'12px', fontWeight:'700', marginBottom:'20px'}}>
            ✨ AVAILABLE IN STUDENT DASHBOARD
          </div>
          <h2 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px'}}>Supercharge Your Prep with AI</h2>
          <p style={{color:'#94a3b8', maxWidth:'600px', margin:'0 auto'}}>
            Unlock exclusive access to these tools immediately after registration.
          </p>

          <div className="ai-grid">
            <div className="ai-card">
              <h4 style={{fontSize:'1.2rem', marginBottom:'10px'}}>📄 AI Resume Scorer</h4>
              <p style={{fontSize:'0.9rem', color:'#94a3b8'}}>Upload your PDF and get a score out of 100 with actionable fixes.</p>
              <div style={{marginTop:'20px', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'8px', fontSize:'12px', fontFamily:'monospace', color:'#4ade80'}}>
                Analysis: Strong Technical Skills detected...
              </div>
            </div>
            <div className="ai-card">
              <h4 style={{fontSize:'1.2rem', marginBottom:'10px'}}>💬 Mock Interview Bot</h4>
              <p style={{fontSize:'0.9rem', color:'#94a3b8'}}>Practice technical interviews with our AI that adapts to your answers.</p>
              <div style={{marginTop:'20px', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'8px', fontSize:'12px', fontFamily:'monospace', color:'#fff'}}>
                Bot: "Explain React Hooks?" <br/><span style={{color:'#6366f1'}}>You: "They allow state in functional..."</span>
              </div>
            </div>
            <div className="ai-card">
              <h4 style={{fontSize:'1.2rem', marginBottom:'10px'}}>🧭 Career Pathfinder</h4>
              <p style={{fontSize:'0.9rem', color:'#94a3b8'}}>Not sure what to learn next? Get a personalized roadmap.</p>
              <div style={{marginTop:'20px', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'8px', fontSize:'12px', fontFamily:'monospace', color:'#fbbf24'}}>
                Suggestion: Learn Docker next.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUCCESS STORIES */}
      <section id="stories" className="container" style={{padding: '120px 0'}}>
        <h2 style={{fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '60px'}}>
          They Built It. They Got Hired.
        </h2>
        <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap:'30px'}}>
           <div className="feature-card">
              <p style={{fontSize:'1.1rem', fontStyle:'italic', color:'#e2e8f0', marginBottom:'20px'}}>
                "I used the AI Resume Analyzer to fix my CV, and within a week I got an interview call from Amazon. This platform is a cheat code."
              </p>
              <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <div style={{width:'40px', height:'40px', background:'#6366f1', borderRadius:'50%'}}></div>
                <div>
                  <div style={{fontWeight:'700'}}>Priya M.</div>
                  <div style={{fontSize:'12px', color:'#94a3b8'}}>SDE Intern @ Amazon</div>
                </div>
              </div>
           </div>
           <div className="feature-card">
              <p style={{fontSize:'1.1rem', fontStyle:'italic', color:'#e2e8f0', marginBottom:'20px'}}>
                "Finding a mentor for my Final Year Project was impossible until I joined CampusConnect."
              </p>
              <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <div style={{width:'40px', height:'40px', background:'#a855f7', borderRadius:'50%'}}></div>
                <div>
                  <div style={{fontWeight:'700'}}>Rohan K.</div>
                  <div style={{fontSize:'12px', color:'#94a3b8'}}>CS Student, COEP</div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section style={{background: '#6366f1', padding: '80px 0', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px'}}>Ready to Level Up?</h2>
          <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px', opacity: 0.9}}>
            Join 5,000+ students and faculty members building the future of technology.
          </p>
          <Link to="/register" style={{
            background: 'white', color: '#6366f1', padding: '18px 48px', borderRadius: '100px',
            fontSize: '1.2rem', fontWeight: '800', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}