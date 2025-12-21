import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Briefcase, MapPin, Calendar, DollarSign, ExternalLink, 
  Search, X, Loader, Building, UploadCloud, 
  ShieldCheck, ShieldAlert, Clock, Send 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [filter, setFilter] = useState('');
  const [appliedIds, setAppliedIds] = useState([]); 
  const fileInputRef = useRef(null);

  // Use Vite Environment Variable for Backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

  const getAuth = () => ({ 
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
  });

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await Promise.all([fetchOpportunities(), fetchAppliedStatus()]);
        setLoading(false);
    };
    init();
  }, []);

  // 🟢 1. FETCH LIVE OPPORTUNITIES (Using JSearch API)
  const fetchOpportunities = async () => {
    try {
      // Fetch Live Jobs via RapidAPI
      const options = {
        method: 'GET',
        url: `https://${import.meta.env.VITE_RAPIDAPI_HOST}/search`,
        params: {
          query: 'Internship software engineer India', // Customize this query
          page: '1',
          num_pages: '1'
        },
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST
        }
      };

      const response = await axios.request(options);
      
      // Map external data to our UI schema
      const liveJobs = response.data.data.map((job) => ({
        _id: job.job_id, // Unique ID from API
        title: job.job_title,
        company: job.employer_name,
        type: job.job_employment_type || 'Internship',
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : 'Remote',
        stipend: 'Not Disclosed', 
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Mock deadline +15 days
        applyLink: job.job_apply_link,
        source: 'EXTERNAL', 
        verificationStatus: 'UNVERIFIED', // Default state for students to request check
        eligibility: { branches: ['All'] }
      }));

      setOpportunities(liveJobs);

    } catch (err) {
      console.error("API Error:", err);
      // Fallback: If API fails, you could load local DB jobs here if needed
      // const localRes = await axios.get(`${BACKEND_URL}/api/opportunities`, getAuth());
      // setOpportunities(localRes.data);
      toast.error("Could not fetch live jobs. Check API Key.");
    }
  };

  const fetchAppliedStatus = async () => {
      try {
          const res = await axios.get(`${BACKEND_URL}/api/applications/my-applications`, getAuth());
          setAppliedIds(res.data.map(app => (app.opportunity?._id || app.jobId?._id)));
      } catch(err) { console.error(err); }
  };

  // 🟢 2. WORKFLOW: Student Requests -> Faculty/TNP Verifies
  const handleRequestVerification = (id) => {
      // Optimistic Update: Set status to PENDING
      setOpportunities(prev => prev.map(op => 
          op._id === id ? { ...op, verificationStatus: 'PENDING' } : op
      ));
      
      toast.success("Request sent to Faculty & TNP Cell...");

      // Simulate Faculty Verification Process (3 Seconds Delay)
      setTimeout(() => {
          setOpportunities(prev => prev.map(op => 
              op._id === id ? { ...op, verificationStatus: 'VERIFIED' } : op
          ));

          toast.success("✅ TNP Cell verified this opportunity! You can now apply.");
      }, 3000); 
  };

  const handleApplyClick = (op) => {
      // If external link exists, open it directly
      if (op.applyLink && op.applyLink.startsWith('http')) {
          window.open(op.applyLink, '_blank');
          return;
      }
      // Otherwise use internal modal
      setSelectedOpp(op);
      setResumeFile(null);
      setShowApplyModal(true);
  };

  const submitApplication = async (e) => {
      e.preventDefault();
      if (!resumeFile) return toast.error("Resume is mandatory!");

      try {
          const formData = new FormData();
          formData.append('resume', resumeFile);
          
          await axios.post(`${BACKEND_URL}/api/applications/apply/${selectedOpp._id}`, formData, {
              headers: { 
                  'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                  'Content-Type': 'multipart/form-data' 
              }
          });
          
          toast.success("Applied Successfully!");
          setAppliedIds(prev => [...prev, selectedOpp._id]); 
          setShowApplyModal(false);
      } catch (err) {
          toast.error(err.response?.data?.msg || "Application failed");
      }
  };

  const filteredOpps = opportunities.filter(op => {
      const matchesSearch = op.title.toLowerCase().includes(filter.toLowerCase()) || op.company.toLowerCase().includes(filter.toLowerCase());
      const isAlreadyApplied = appliedIds.includes(op._id);
      return matchesSearch && !isAlreadyApplied; 
  });

  if(loading) return <div style={{padding:'50px',textAlign:'center'}}><Loader className="spin"/></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
            <h1 style={styles.title}>Live Opportunities</h1>
            <p style={styles.subtitle}>Curated & Verified jobs for your college.</p>
        </div>
      </div>

      <div style={styles.searchBar}>
          <Search size={20} color="#64748b"/>
          <input style={styles.searchInput} placeholder="Search companies or roles..." value={filter} onChange={(e) => setFilter(e.target.value)}/>
      </div>

      <div style={styles.grid}>
          {filteredOpps.length === 0 ? (
              <div style={styles.emptyState}>
                  <Briefcase size={40} style={{marginBottom:'10px', opacity:0.5}}/>
                  <p>No new opportunities found.</p>
              </div>
          ) : filteredOpps.map((op) => {
              const status = op.verificationStatus || 'UNVERIFIED'; 
              const isExternal = op.source === 'EXTERNAL' || (op.applyLink && op.applyLink.startsWith('http'));

              return (
              <div key={op._id} style={{...styles.card, opacity: status === 'REJECTED' ? 0.6 : 1}}>
                  
                  {/* HEADER */}
                  <div style={styles.cardHeader}>
                      <div style={styles.iconBox}><Building size={24} color="#4f46e5"/></div>
                      <div style={{flex:1}}>
                          <h3 style={styles.cardTitle}>{op.title}</h3>
                          <p style={styles.cardCompany}>{op.company}</p>
                      </div>
                      {isExternal && <span style={styles.liveBadge}>LIVE FEED</span>}
                  </div>
                  
                  {/* BODY */}
                  <div style={styles.cardBody}>
                      <div style={styles.row}><MapPin size={16}/> {op.location}</div>
                      <div style={styles.row}><DollarSign size={16}/> {op.stipend || 'Unpaid'}</div>
                      <div style={styles.row}><Calendar size={16}/> {new Date(op.deadline).toLocaleDateString()}</div>
                      
                      {/* STATUS BANNER */}
                      <div style={{...styles.statusBanner, ...getStatusStyle(status)}}>
                          {status === 'VERIFIED' && <><ShieldCheck size={16}/> Verified by TNP Cell</>}
                          {status === 'PENDING' && <><Clock size={16}/> Faculty checking with TNP...</>}
                          {status === 'UNVERIFIED' && <><ShieldAlert size={16}/> Unverified Source</>}
                          {status === 'REJECTED' && <><X size={16}/> Marked as Fake</>}
                      </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={styles.cardFooter}>
                      {status === 'VERIFIED' ? (
                          // ✅ VERIFIED -> Enable Apply
                          <button onClick={() => handleApplyClick(op)} style={styles.applyBtn}>
                              Apply Now <ExternalLink size={14}/>
                          </button>
                      ) : status === 'PENDING' ? (
                          // ⏳ PENDING -> Disable Button
                          <button disabled style={{...styles.applyBtn, background:'#f1f5f9', color:'#94a3b8', cursor:'not-allowed'}}>
                              Verification in Progress...
                          </button>
                      ) : status === 'REJECTED' ? (
                          // ❌ REJECTED -> Disable Button
                          <button disabled style={{...styles.applyBtn, background:'#fee2e2', color:'#ef4444', cursor:'not-allowed'}}>
                              Flagged as Fake
                          </button>
                      ) : (
                          // ❓ UNVERIFIED -> Request Button
                          <button onClick={() => handleRequestVerification(op._id)} style={styles.verifyBtn}>
                              <Send size={14}/> Request Verification
                          </button>
                      )}
                  </div>
              </div>
          )})}
      </div>

      {/* APPLY MODAL (Internal Jobs Only) */}
      {showApplyModal && selectedOpp && (
          <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                  <div style={styles.modalHeader}>
                      <div><h3 style={{margin:0}}>Apply to {selectedOpp.company}</h3><p style={{margin:0, color:'#64748b'}}>{selectedOpp.title}</p></div>
                      <X style={{cursor:'pointer'}} onClick={() => setShowApplyModal(false)}/>
                  </div>
                  <form onSubmit={submitApplication}>
                      <div style={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
                          <input type="file" ref={fileInputRef} style={{display:'none'}} accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])}/>
                          <UploadCloud size={30} color={resumeFile ? '#10b981' : '#64748b'}/>
                          <p>{resumeFile ? resumeFile.name : "Upload Resume (Required)"}</p>
                      </div>
                      <button type="submit" style={styles.submitBtn}>Confirm Application</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

// Styles & Helpers
const getStatusStyle = (status) => {
    switch(status) {
        case 'VERIFIED': return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
        case 'PENDING': return { background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' };
        case 'REJECTED': return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' };
        default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
    }
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: '30px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' },
  subtitle: { color: '#64748b', fontSize: '1rem' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  emptyState: { gridColumn:'1/-1', textAlign:'center', color:'#64748b', padding:'60px', background:'#f8fafc', borderRadius:'16px', border:'1px dashed #cbd5e1' },
  
  card: { background: 'white', borderRadius: '16px', padding: '24px', border:'1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', gap: '15px', alignItems: 'flex-start' },
  iconBox: { width: '48px', height: '48px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.3 },
  cardCompany: { fontSize: '0.9rem', color: '#64748b', margin: 0 },
  liveBadge: { fontSize: '0.65rem', background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.5px' },
  
  cardBody: { display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#334155' },
  row: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusBanner: { padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' },
  
  cardFooter: { marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9' },
  applyBtn: { width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'none', borderRadius:'10px', fontWeight:'600', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', transition: '0.2s' },
  verifyBtn: { width: '100%', padding:'12px', background:'#e0f2fe', color:'#0369a1', border:'1px solid #bae6fd', borderRadius:'10px', fontWeight:'600', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', transition: '0.2s' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
  modal: { background: 'white', padding: '30px', borderRadius: '20px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  submitBtn: { background: '#0f172a', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width:'100%', marginTop:'20px', fontSize: '1rem' },
  uploadBox: { border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#f8fafc', textAlign:'center', transition: '0.2s' }
};

export default Opportunities;