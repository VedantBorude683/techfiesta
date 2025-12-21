import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [step, setStep] = useState(1);
  const [tempUserId, setTempUserId] = useState(null);
  const [otp, setOtp] = useState('');
  
  // Files
  const [verificationFile, setVerificationFile] = useState(null); // Faculty Doc
  const [idCardFile, setIdCardFile] = useState(null);           // Student ID Card
  const [idPreview, setIdPreview] = useState(null);             // Student ID Preview

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student',
    state: '', district: '', taluka: '', collegeName: '',
    collegeCode: '', branch: '', year: '', cgpa: ''
  });

  const [statesList, setStatesList] = useState([]);      
  const [districtsList, setDistrictsList] = useState([]); 
  const [collegesList, setCollegesList] = useState([]);   
  const [isLoading, setIsLoading] = useState(false);
  const [isManualCollege, setIsManualCollege] = useState(false);

  useEffect(() => {
    // ... (Existing useEffect code) ...
    const params = new URLSearchParams(location.search);
    if (params.get('role')) setFormData(prev => ({ ...prev, role: params.get('role') }));
    axios.get('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => setStatesList(res.data.states))
      .catch(() => {});
  }, [location]);

  // ... (Existing handlers: handleStateChange, handleDistrictChange) ...
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateObj = statesList.find(s => s.state === selectedState);
    setFormData({ ...formData, state: selectedState, district: '', collegeName: '' });
    setDistrictsList(stateObj ? stateObj.districts : []);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData({ ...formData, district: selectedDistrict, collegeName: '' });
    setIsManualCollege(false);
    if (selectedDistrict) {
       setIsLoading(true);
       axios.get(`http://universities.hipolabs.com/search?country=India`)
        .then(res => setCollegesList(res.data.map(c => c.name).sort()))
        .catch(() => setCollegesList([]))
        .finally(() => setIsLoading(false));
    }
  };

  const handleFacultyFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setVerificationFile(f);
  };

  // 🆕 STUDENT ID CARD HANDLER
  const handleIdCardChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) { toast.error("File > 5MB"); return; }
      setIdCardFile(f);
      setIdPreview(URL.createObjectURL(f)); // Create local preview URL
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating Account...');
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (formData.role === 'faculty') {
        if (!verificationFile) { toast.dismiss(loadingToast); toast.error("Document required"); return; }
        data.append('verificationDoc', verificationFile);
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', data, {headers: { "Content-Type": "multipart/form-data" }});
      setTempUserId(res.data.userId);
      setStep(2);
      toast.dismiss(loadingToast);
      toast.success('OTP Sent to Email!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.msg || 'Registration Failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/verify-otp', { userId: tempUserId, otp });
      if (formData.role === 'faculty') {
          // Faculty is done here, but needs Owner approval
          toast.success("Account Created! Pending Admin Approval.", { duration: 5000 });
          navigate('/login');
      } else {
          // Student goes to Step 3
          toast.success('Email Verified! Complete your profile.');
          setStep(3);
      }
    } catch (err) {
      toast.error('Invalid OTP');
    }
  };

  // 🆕 FINAL SUBMIT WITH ID CARD
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!idCardFile) { toast.error("Please upload your College ID Card"); return; }

    const loadingToast = toast.loading('Finalizing Registration...');
    
    const data = new FormData();
    data.append('userId', tempUserId);
    data.append('collegeCode', formData.collegeCode);
    data.append('branch', formData.branch);
    data.append('year', formData.year);
    data.append('cgpa', formData.cgpa);
    data.append('idCard', idCardFile);

    try {
        await axios.post('http://localhost:8080/api/auth/complete-profile', data, {
             headers: { "Content-Type": "multipart/form-data" }
        });
        
        toast.dismiss(loadingToast);
        
        // 🆕 CLEAR SUCCESS CONFIRMATION
        toast.custom((t) => (
          <div style={{
            background: 'white', color: '#0f172a', padding: '16px', borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderLeft: '6px solid #4f46e5'
          }}>
            <h4 style={{margin:0, fontWeight:800}}>Registration Successful! 🎉</h4>
            <p style={{margin:'4px 0 0 0', fontSize:'0.9rem', color:'#64748b'}}>
              Your account is pending verification by your Faculty.
              <br/>You will be able to login once approved.
            </p>
          </div>
        ), { duration: 6000 });

        setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(err.response?.data?.msg || "Profile Update Failed");
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: '#0f172a', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif",
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`
    }}>
      <Toaster position="top-center" />
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px',
        padding: '40px', width: '100%', maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <Link to="/" style={{textDecoration:'none', color:'#94a3b8', fontSize:'14px', fontWeight:'600'}}>← Back to Home</Link>
            <h2 style={{fontSize:'1.8rem', fontWeight:'800', marginTop:'15px', marginBottom:'5px'}}>
              {step === 1 ? "Join the Elite" : step === 2 ? "Verify Identity" : "Setup Profile"}
            </h2>
        </div>

        {/* STEP DOTS */}
        <div style={{display:'flex', justifyContent:'center', gap:'8px', marginBottom:'30px'}}>
            {[1,2,3].map(s => (
                <div key={s} style={{
                    width: step === s ? '24px' : '8px', height: '8px', borderRadius: '10px',
                    background: step >= s ? '#6366f1' : 'rgba(255,255,255,0.1)', transition: '0.3s'
                }} />
            ))}
        </div>

        {/* --- STEP 1: REGISTER --- */}
        {step === 1 && (
            <form onSubmit={handleRegisterSubmit}>
                <div style={{display:'flex', background:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px', marginBottom:'24px'}}>
                    {['student', 'faculty'].map(r => (
                        <div key={r} onClick={() => setFormData({...formData, role: r})} 
                             style={{
                                flex:1, textAlign:'center', padding:'10px', cursor:'pointer', borderRadius:'8px',
                                textTransform:'capitalize', fontWeight:'700', fontSize:'14px',
                                background: formData.role === r ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
                                color: formData.role === r ? '#818cf8' : '#64748b', transition: '0.3s'
                             }}>
                            {r}
                        </div>
                    ))}
                </div>
                <input className="dark-input" type="text" placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
                <input className="dark-input" type="email" placeholder="Email Address" required onChange={e => setFormData({...formData, email: e.target.value})} />
                <input className="dark-input" type="password" placeholder="Create Password" required onChange={e => setFormData({...formData, password: e.target.value})} />

                {formData.role === 'faculty' && (
                    <div style={{padding:'20px', background:'rgba(255,255,255,0.02)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.05)', marginTop:'20px'}}>
                        <p style={{fontSize:'12px', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'15px'}}>Institution Verification</p>
                        <select className="dark-input" onChange={handleStateChange} required><option value="">Select State</option>{statesList.map((s,i)=><option key={i} value={s.state}>{s.state}</option>)}</select>
                        <select className="dark-input" onChange={handleDistrictChange} disabled={!formData.state} required><option value="">Select District</option>{districtsList.map((d,i)=><option key={i} value={d}>{d}</option>)}</select>
                        {!isManualCollege ? (
                            <select className="dark-input" onChange={e=>setFormData({...formData, collegeName: e.target.value})} required><option>Select College</option>{collegesList.map((c,i)=><option key={i} value={c}>{c}</option>)}</select>
                        ) : (
                            <input className="dark-input" type="text" placeholder="Type College Name" onChange={e=>setFormData({...formData, collegeName: e.target.value})}/>
                        )}
                        <div style={{marginBottom:'15px', fontSize:'0.85rem', color:'#94a3b8'}}>
                            <input type="checkbox" onChange={e=>setIsManualCollege(e.target.checked)} style={{marginRight:'8px'}}/> College not listed?
                        </div>
                        <p style={{fontSize:'0.8rem', color:'#f43f5e', marginBottom:'8px'}}>Upload Proof of Employment (PDF)</p>
                        <input type="file" required className="dark-input" onChange={handleFacultyFileChange} />
                    </div>
                )}
                <button className="dark-btn" style={{marginTop:'24px'}}>Next Step →</button>
            </form>
        )}

        {/* --- STEP 2: OTP --- */}
        {step === 2 && (
            <form onSubmit={handleOtpSubmit} style={{textAlign:'center'}}>
                <input className="dark-input" style={{textAlign:'center', fontSize:'2rem', letterSpacing:'8px', fontWeight:'700'}} maxLength="6" placeholder="000000" autoFocus onChange={e => setOtp(e.target.value)} />
                <button className="dark-btn" style={{marginTop:'24px'}}>Verify Email</button>
            </form>
        )}

        {/* --- STEP 3: STUDENT PROFILE & ID UPLOAD --- */}
        {step === 3 && (
            <form onSubmit={handleProfileSubmit}>
                <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', fontSize:'0.85rem', color:'#94a3b8', marginBottom:'8px'}}>College Code (Ask Faculty)</label>
                    <input className="dark-input" type="text" placeholder="e.g. FAC-2024" required onChange={e => setFormData({...formData, collegeCode: e.target.value})} />
                </div>
                
                {/* ID CARD UPLOAD */}
                <div style={{marginBottom:'20px', padding:'15px', background:'rgba(255,255,255,0.02)', borderRadius:'12px', border:'1px dashed #6366f1'}}>
                    <label style={{display:'block', fontSize:'0.85rem', color:'#818cf8', fontWeight:'700', marginBottom:'8px'}}>
                        Upload College ID Card (Mandatory)
                    </label>
                    <input type="file" accept="image/*" required className="dark-input" style={{padding:'8px'}} onChange={handleIdCardChange} />
                    
                    {/* PREVIEW */}
                    {idPreview && (
                        <div style={{marginTop:'10px', textAlign:'center'}}>
                            <img src={idPreview} alt="ID Preview" style={{maxWidth:'100%', height:'150px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)'}} />
                            <p style={{fontSize:'12px', color:'#22c55e', marginTop:'4px'}}>✓ Preview Loaded</p>
                        </div>
                    )}
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                    <select className="dark-input" required onChange={e => setFormData({...formData, branch: e.target.value})}>
                        <option value="">Branch</option><option value="CS">Comp Sci</option><option value="IT">IT</option><option value="EnTC">EnTC</option>
                    </select>
                    <select className="dark-input" required onChange={e => setFormData({...formData, year: e.target.value})}>
                        <option value="">Year</option><option value="FE">FE</option><option value="SE">SE</option><option value="TE">TE</option><option value="BE">BE</option>
                    </select>
                </div>
                <input className="dark-input" type="number" step="0.01" placeholder="Current CGPA" required style={{marginTop:'16px'}} onChange={e => setFormData({...formData, cgpa: e.target.value})} />
                
                <button className="dark-btn" style={{marginTop:'24px'}}>Submit for Approval</button>
            </form>
        )}

      </div>
      <style>{`
        .dark-input { width: 100%; box-sizing: border-box; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 14px; border-radius: 12px; margin-bottom: 12px; outline: none; transition: 0.3s; font-family: inherit; font-size: 0.95rem; }
        .dark-input:focus { border-color: #6366f1; background: rgba(0,0,0,0.5); }
        option { background: #1e293b; color: white; }
        .dark-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .dark-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
      `}</style>
    </div>
  );
}