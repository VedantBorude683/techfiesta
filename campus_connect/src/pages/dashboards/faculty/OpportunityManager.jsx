import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, Plus, Trash2, Users, ChevronRight, X, Filter, Download, ExternalLink, Loader, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

const OpportunityManager = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); 
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filterCgpa, setFilterCgpa] = useState(0);

  const [formData, setFormData] = useState({
    title: '', company: '', type: 'Internship', location: 'Remote', stipend: '', deadline: '', applyLink: '', description: '',
    branches: '', years: '', minCgpa: '', maxBacklogs: ''
  });

  const getAuth = () => ({ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8080/api/opportunities/my-posts', getAuth());
      setMyPosts(res.data);
    } catch (err) { toast.error("Failed to load posts"); } 
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://127.0.0.1:8080/api/opportunities', formData, getAuth());
        toast.success("Opportunity Posted!");
        setViewMode('list');
        setFormData({ title: '', company: '', type: 'Internship', location: 'Remote', stipend: '', deadline: '', applyLink: '', description: '', branches: '', years: '', minCgpa: '', maxBacklogs: '' });
        fetchMyPosts(); 
    } catch (err) { toast.error("Failed to post"); }
  };

  const handleViewApplicants = async (job) => {
      setSelectedJob(job);
      setViewMode('applicants');
      try {
          const res = await axios.get(`http://127.0.0.1:8080/api/opportunities/${job._id}/applicants`, getAuth());
          setApplicants(res.data);
      } catch (err) { toast.error("Failed to fetch applicants"); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete this opportunity?")) return;
      try {
          await axios.delete(`http://127.0.0.1:8080/api/opportunities/${id}`, getAuth());
          toast.success("Deleted");
          fetchMyPosts();
      } catch (err) { toast.error("Delete failed"); }
  };

  const filteredApplicants = applicants.filter(app => {
      const student = app.studentId || {};
      return (Number(student.cgpa) || 0) >= filterCgpa;
  });

  if(loading) return <div style={{padding:'40px', textAlign:'center'}}><Loader className="spin"/></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color:'white' }}>
      
      {/* HEADER */}
      {viewMode === 'list' && (
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Opportunity Manager</h1>
              <p style={styles.subtitle}>Manage campus placements.</p>
            </div>
            <button onClick={() => setViewMode('create')} style={styles.primaryBtn}><Plus size={18}/> Post Opportunity</button>
          </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
          <div style={styles.grid}>
              {myPosts.length === 0 ? <p style={{color:'#94a3b8'}}>No active posts.</p> : myPosts.map(post => (
                  <div key={post._id} style={styles.card}>
                      <div style={{flex:1}}>
                          <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                              <h3 style={styles.cardTitle}>{post.title}</h3>
                              <span style={styles.badge}>{post.type}</span>
                          </div>
                          <p style={{color:'#94a3b8', margin:'5px 0'}}>{post.company} • {post.location}</p>
                          <div style={styles.tags}>
                              <span>Drafted for: {post.eligibility?.branches?.length > 0 ? post.eligibility.branches.join(', ') : 'All Branches'}</span>
                              <span>Min CGPA: {post.eligibility?.minCgpa || 'N/A'}</span>
                          </div>
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:'10px', alignItems:'flex-end'}}>
                          <button onClick={() => handleViewApplicants(post)} style={styles.outlineBtn}>
                              <Users size={16}/> View Applicants
                          </button>
                          <button onClick={() => handleDelete(post._id)} style={styles.deleteIcon}><Trash2 size={16}/></button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* CREATE FORM */}
      {viewMode === 'create' && (
          <div style={styles.formCard}>
              <div style={styles.formHeader}><h3>Post New Job</h3><button onClick={()=>setViewMode('list')} style={styles.closeBtn}><X/></button></div>
              <form onSubmit={handleCreate} style={styles.formGrid}>
                  <input style={styles.input} placeholder="Job Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required />
                  <input style={styles.input} placeholder="Company" value={formData.company} onChange={e=>setFormData({...formData, company:e.target.value})} required />
                  <div style={{display:'flex', gap:'10px'}}>
                      <select style={styles.input} value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})}>
                          <option>Internship</option><option>Job</option><option>Hackathon</option>
                      </select>
                      <input style={styles.input} placeholder="Location" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} />
                  </div>
                  <input style={styles.input} placeholder="Stipend (e.g. 20k/mo)" value={formData.stipend} onChange={e=>setFormData({...formData, stipend:e.target.value})} />
                  
                  {/* CRITERIA SECTION */}
                  <div style={{gridColumn:'1/-1', padding:'15px', background:'#0f172a', borderRadius:'8px', marginTop:'10px'}}>
                      <h4 style={{margin:'0 0 10px 0', color:'#818cf8'}}>Eligibility Criteria</h4>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                          <input style={styles.input} placeholder="Branches (e.g. CSE, IT)" value={formData.branches} onChange={e=>setFormData({...formData, branches:e.target.value})} />
                          <input style={styles.input} placeholder="Years (e.g. 3rd Year, 4th Year)" value={formData.years} onChange={e=>setFormData({...formData, years:e.target.value})} />
                          <input style={styles.input} type="number" placeholder="Min CGPA" value={formData.minCgpa} onChange={e=>setFormData({...formData, minCgpa:e.target.value})} />
                          <input style={styles.input} type="number" placeholder="Max Backlogs" value={formData.maxBacklogs} onChange={e=>setFormData({...formData, maxBacklogs:e.target.value})} />
                      </div>
                  </div>

                  <textarea style={{...styles.input, gridColumn:'1/-1', minHeight:'100px'}} placeholder="Job Description (Detailed)" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
                  <input style={styles.input} placeholder="Apply Link (Leave empty for Internal Apply)" value={formData.applyLink} onChange={e=>setFormData({...formData, applyLink:e.target.value})} />
                  <input style={styles.input} type="date" title="Deadline" value={formData.deadline} onChange={e=>setFormData({...formData, deadline:e.target.value})} required />
                  <button type="submit" style={styles.submitBtn}>🚀 Launch Opportunity</button>
              </form>
          </div>
      )}

      {/* APPLICANTS VIEW */}
      {viewMode === 'applicants' && selectedJob && (
          <div>
              <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
                  <button onClick={()=>setViewMode('list')} style={styles.backBtn}><ChevronRight transform="rotate(180)"/></button>
                  <div>
                      <h2 style={{margin:0}}>{selectedJob.title} - Applicants</h2>
                      <p style={{color:'#94a3b8', margin:0}}>{filteredApplicants.length} Students Applied</p>
                  </div>
              </div>

              {/* JOB DESCRIPTION DISPLAY */}
              <div style={{background:'#1e293b', padding:'20px', borderRadius:'12px', marginBottom:'20px', border:'1px solid #334155'}}>
                  <h4 style={{margin:'0 0 10px 0', color:'#818cf8', display:'flex', alignItems:'center', gap:'8px'}}>
                      <FileText size={16}/> Job Description
                  </h4>
                  <p style={{whiteSpace:'pre-wrap', color:'#e2e8f0', lineHeight:'1.5', fontSize:'0.95rem'}}>
                      {selectedJob.description || "No description provided."}
                  </p>
              </div>

              {/* FILTERS */}
              <div style={styles.filterBar}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <Filter size={16} color="#94a3b8"/>
                      <input style={styles.filterInput} placeholder="Min CGPA" type="number" value={filterCgpa} onChange={e=>setFilterCgpa(e.target.value)}/>
                  </div>
              </div>

              {/* TABLE */}
              <div style={styles.tableContainer}>
                  <table style={styles.table}>
                      <thead>
                          <tr>
                              <th style={styles.th}>Student Name</th>
                              <th style={styles.th}>Branch</th>
                              <th style={styles.th}>Year</th>
                              <th style={styles.th}>CGPA</th>
                              <th style={styles.th}>Status</th>
                              <th style={styles.th}>Resume</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredApplicants.length > 0 ? filteredApplicants.map((app) => (
                              <tr key={app._id} style={styles.tr}>
                                  <td style={styles.td}>{app.studentId?.name || 'Unknown'}</td>
                                  <td style={styles.td}>{app.studentId?.branch || '-'}</td>
                                  <td style={styles.td}>{app.studentId?.year || '-'}</td>
                                  <td style={{...styles.td, color:'#4ade80', fontWeight:'bold'}}>{app.studentId?.cgpa || '0.0'}</td>
                                  <td style={styles.td}><span style={styles.statusBadge}>{app.status}</span></td>
                                  <td style={styles.td}>
                                      {/* View Resume */}
                                      {app.resumeLink ? (
                                          <a href={app.resumeLink} target="_blank" rel="noreferrer" style={styles.link}><ExternalLink size={14}/> View PDF</a>
                                      ) : <span style={{color:'#64748b'}}>No Resume</span>}
                                  </td>
                              </tr>
                          )) : (
                              <tr><td colSpan="6" style={{padding:'30px', textAlign:'center', color:'#64748b'}}>No applicants match criteria.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

    </div>
  );
};

const styles = {
    header: { display:'flex', justifyContent:'space-between', marginBottom:'30px' },
    title: { margin:0, fontSize:'1.8rem' },
    subtitle: { color:'#94a3b8', margin:'5px 0 0' },
    primaryBtn: { background:'#4f46e5', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', display:'flex', gap:'8px', fontWeight:'600' },
    grid: { display:'grid', gap:'15px' },
    card: { background:'#1e293b', padding:'20px', borderRadius:'12px', border:'1px solid #334155', display:'flex', justifyContent:'space-between' },
    cardTitle: { margin:0, fontSize:'1.2rem', color:'white' },
    badge: { background:'rgba(99,102,241,0.2)', color:'#818cf8', padding:'2px 8px', borderRadius:'12px', fontSize:'0.75rem' },
    tags: { display:'flex', gap:'15px', fontSize:'0.85rem', color:'#64748b', marginTop:'8px' },
    outlineBtn: { background:'transparent', border:'1px solid #475569', color:'#cbd5e1', padding:'6px 12px', borderRadius:'6px', cursor:'pointer', display:'flex', gap:'6px', fontSize:'0.85rem' },
    deleteIcon: { background:'none', border:'none', color:'#ef4444', cursor:'pointer' },
    formCard: { background:'#1e293b', padding:'25px', borderRadius:'16px', border:'1px solid #334155' },
    formHeader: { display:'flex', justifyContent:'space-between', marginBottom:'20px', color:'white' },
    closeBtn: { background:'none', border:'none', color:'#94a3b8', cursor:'pointer' },
    formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
    input: { background:'#0f172a', border:'1px solid #334155', padding:'12px', borderRadius:'8px', color:'white', outline:'none' },
    submitBtn: { gridColumn:'1/-1', background:'#4f46e5', color:'white', padding:'12px', borderRadius:'8px', border:'none', fontWeight:'bold', cursor:'pointer', marginTop:'10px' },
    filterBar: { background:'#1e293b', padding:'15px', borderRadius:'12px', display:'flex', justifyContent:'space-between', marginBottom:'15px' },
    filterInput: { background:'#0f172a', border:'1px solid #334155', padding:'8px', borderRadius:'6px', color:'white', width:'120px' },
    tableContainer: { background:'#1e293b', borderRadius:'12px', overflow:'hidden', border:'1px solid #334155' },
    table: { width:'100%', borderCollapse:'collapse', color:'#e2e8f0' },
    th: { textAlign:'left', padding:'15px', borderBottom:'1px solid #334155', color:'#94a3b8', fontSize:'0.9rem' },
    td: { padding:'15px', borderBottom:'1px solid #334155' },
    tr: { transition:'background 0.2s', ':hover':{background:'#334155'} },
    link: { color:'#38bdf8', textDecoration:'none', display:'flex', alignItems:'center', gap:'5px' },
    statusBadge: { background:'rgba(251, 191, 36, 0.2)', color:'#fbbf24', padding:'2px 8px', borderRadius:'12px', fontSize:'0.75rem' },
    backBtn: { background:'#334155', border:'none', color:'white', padding:'8px', borderRadius:'50%', cursor:'pointer', display:'flex' }
};

export default OpportunityManager;