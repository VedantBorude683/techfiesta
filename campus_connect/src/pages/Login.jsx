import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react'; // Added Logo Icon

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Accessing Secure Portal...");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "User");
      
      if (res.data.collegeCode) {
        localStorage.setItem("collegeCode", res.data.collegeCode); 
      }
      
      if (res.data.collegeName) {
        localStorage.setItem("userCollege", res.data.collegeName);
      } else {
        localStorage.removeItem("userCollege");
      }

      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${res.data.name || 'User'}!`);
      
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.msg || "Invalid Credentials");
    }
  };

  return (
    <div className="login-elite-root">
      <Toaster position="top-center" toastOptions={{style: {background: '#1e293b', color: 'white'}}}/>
      
      <div className="login-card">
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '28px'}}>
            <Link to="/" className="back-link">
              ← Return to Home
            </Link>
            
            <div className="logo-box">
               <div className="logo-icon">
                 {/* RELEVANT LOGO ADDED HERE */}
                 <GraduationCap size={28} color="white" strokeWidth={2.5} />
               </div>
            </div>
            
            <h2 style={{fontSize:'1.75rem', fontWeight:'800', marginBottom:'6px', letterSpacing:'-0.5px'}}>
              Welcome Back
            </h2>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4'}}>
              Enter your credentials to access the dashboard.
            </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div style={{marginBottom: '16px'}}>
             <label className="input-label">Email Address</label>
             <input 
                type="email" 
                required 
                placeholder="student@college.edu" 
                className="elite-input"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
             />
          </div>

          <div style={{marginBottom: '24px'}}>
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                <label className="input-label" style={{marginBottom:0}}>Password</label>
                <span style={{fontSize:'0.8rem', color:'#6366f1', cursor:'pointer', fontWeight:'600'}}>Forgot?</span>
             </div>
             <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="elite-input"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
             />
          </div>

          <button type="submit" className="elite-btn">
            Sign In to Portal
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0'}}>
            New to CampusConnect? <Link to="/register" className="highlight-link">Apply for Access</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .login-elite-root {
          min-height: 100vh;
          display: flex; justify-content: center; align-items: center;
          background-color: #0f172a;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
          padding: 20px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px;
          width: 100%; 
          max-width: 380px;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-box {
          display: flex; justify-content: center; margin-bottom: 20px;
        }
        
        .logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 12px;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-link {
          text-decoration: none; color: #64748b; font-size: 0.8rem; 
          font-weight: 600; display: inline-block; margin-bottom: 20px;
          transition: 0.2s;
        }
        .back-link:hover { color: white; transform: translateX(-4px); }

        .input-label {
          display: block; color: #cbd5e1; font-size: 0.85rem; 
          font-weight: 600; margin-bottom: 6px;
        }

        .elite-input {
          width: 100%; box-sizing: border-box;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white; padding: 12px 16px; border-radius: 10px;
          outline: none; transition: all 0.3s ease;
          font-family: inherit; font-size: 0.95rem;
        }
        .elite-input:focus {
          border-color: #6366f1;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
        }
        .elite-input::placeholder { color: #475569; }

        .elite-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border: none; border-radius: 10px;
          font-weight: 700; font-size: 0.95rem; cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        .elite-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.5);
        }
        .elite-btn:active { transform: translateY(0); }

        .highlight-link {
          color: #818cf8; text-decoration: none; font-weight: 700; transition: 0.2s;
        }
        .highlight-link:hover { color: #a5b4fc; text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Login;