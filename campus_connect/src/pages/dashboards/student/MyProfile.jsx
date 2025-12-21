import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  User, Mail, Book, Award, Link as LinkIcon, Edit3, Save, 
  Github, Linkedin, FileText, Camera, MapPin, Image as ImageIcon,
  X, Loader, UploadCloud, Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  
  // Refs
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', headline: '', email: '', branch: '', year: '', cgpa: '',
    about: '', skills: [], linkedin: '', github: '', 
    resumeLink: '', profilePic: '', coverPic: ''
  });

  const getAuthConfig = () => {
      const token = localStorage.getItem('token');
      return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  // --- 1. FETCH PROFILE ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8080/api/auth/me', getAuthConfig());
        const u = res.data;

        // ✅ Auto-Generate Default Headline if empty
        let defaultHeadline = u.headline || '';
        if (!defaultHeadline && u.branch && u.year) {
            defaultHeadline = `${u.branch} ${u.year} Student`;
        } else if (!defaultHeadline) {
            defaultHeadline = "Student";
        }

        setFormData({
            name: u.name || '', 
            headline: defaultHeadline, // Set default here
            email: u.email || '',
            branch: u.branch || '', year: u.year || '', cgpa: u.cgpa || '',
            about: u.about || '', 
            skills: u.skills || [], 
            linkedin: u.linkedin || '', github: u.github || '', 
            resumeLink: u.resumeLink || '',
            profilePic: u.profilePic || '',
            coverPic: u.coverPic || ''
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
  };

  // --- 2. UPLOAD HANDLERS ---
  const uploadFile = async (file, endpoint, stateKey, successMsg) => {
      if(!file) return;
      const data = new FormData();
      
      let fieldName = 'file';
      if(endpoint.includes('avatar')) fieldName = 'avatar';
      if(endpoint.includes('cover')) fieldName = 'cover';
      if(endpoint.includes('resume')) fieldName = 'resume';
      
      data.append(fieldName, file);

      try {
          const toastId = toast.loading("Uploading...");
          const config = getAuthConfig();
          config.headers['Content-Type'] = 'multipart/form-data';

          const res = await axios.post(`http://127.0.0.1:8080/api/auth/${endpoint}`, data, config);
          
          setFormData(prev => ({ ...prev, [stateKey]: res.data.url }));
          toast.dismiss(toastId);
          toast.success(successMsg);
      } catch (err) {
          toast.dismiss();
          console.error(err);
          toast.error("Upload failed.");
      }
  };

  const handleAvatarUpload = (e) => uploadFile(e.target.files[0], 'upload-avatar', 'profilePic', "Profile Picture Updated!");
  const handleCoverUpload = (e) => uploadFile(e.target.files[0], 'upload-cover', 'coverPic', "Cover Photo Updated!");
  const handleResumeUpload = (e) => uploadFile(e.target.files[0], 'upload-resume', 'resumeLink', "Resume Uploaded!");

  // --- 3. DELETE ASSET HANDLER ---
  const handleDeleteAsset = (type) => {
      if(type === 'profilePic') {
          setFormData(prev => ({ ...prev, profilePic: '' }));
          toast.success("Profile photo removed (Click Save to apply)");
      } else if (type === 'coverPic') {
          setFormData(prev => ({ ...prev, coverPic: '' }));
          toast.success("Cover photo removed (Click Save to apply)");
      } else if (type === 'resumeLink') {
          setFormData(prev => ({ ...prev, resumeLink: '' }));
          toast.success("Resume removed (Click Save to apply)");
      }
  };

  // --- 4. SAVE DATA ---
  const handleSave = async () => {
    const safeSkills = Array.isArray(formData.skills) ? formData.skills : [];
    
    const payload = {
        ...formData,
        skills: safeSkills,
        profilePic: formData.profilePic, 
        coverPic: formData.coverPic,
        resumeLink: formData.resumeLink // Empty string deletes it on backend
    };

    try {
        await axios.put('http://127.0.0.1:8080/api/auth/profile', payload, getAuthConfig());
        toast.success("Profile Saved!");
        setIsEditing(false); 
    } catch (err) {
        console.error("Save Error:", err);
        toast.error("Save failed.");
    }
  };

  // --- HELPERS ---
  const calculateStrength = () => {
    let score = 0;
    if(formData.about) score += 20;
    if(formData.skills.length > 0) score += 20;
    if(formData.linkedin) score += 15;
    if(formData.github) score += 15;
    if(formData.resumeLink) score += 20;
    if(formData.cgpa) score += 10;
    return score > 100 ? 100 : score;
  };
  const strength = calculateStrength();

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({...formData, skills: [...formData.skills, skillInput.trim()]});
      }
      setSkillInput('');
    }
  };

  if(loading) return <div style={{padding:'50px',textAlign:'center'}}><Loader className="spin"/> Loading...</div>;

  return (
    <div style={styles.container}>
      
      {/* Hidden Inputs */}
      <input type="file" ref={avatarInputRef} style={{display:'none'}} accept="image/*" onChange={handleAvatarUpload} />
      <input type="file" ref={coverInputRef} style={{display:'none'}} accept="image/*" onChange={handleCoverUpload} />
      <input type="file" ref={resumeInputRef} style={{display:'none'}} accept="application/pdf" onChange={handleResumeUpload} />

      {/* HEADER BANNER (Cover Photo) */}
      <div 
        style={{
            ...styles.banner, 
            backgroundImage: formData.coverPic ? `url(${formData.coverPic})` : 'linear-gradient(120deg, #4f46e5, #8b5cf6)',
        }}
      >
        {isEditing && (
            <div style={styles.coverControls}>
                <button 
                    style={styles.coverUploadBtn} 
                    onClick={(e) => { e.stopPropagation(); coverInputRef.current.click(); }}
                >
                    <ImageIcon size={16} /> Change Cover
                </button>
                {formData.coverPic && (
                    <button 
                        style={styles.deleteBtn}
                        onClick={(e) => { e.stopPropagation(); handleDeleteAsset('coverPic'); }}
                        title="Remove Cover Photo"
                    >
                        <Trash2 size={16} color="white"/>
                    </button>
                )}
            </div>
        )}
      </div>

      {/* PROFILE CARD */}
      <div style={styles.headerCard}>
        <div style={styles.headerContent}>
            
            {/* Avatar Section */}
            <div style={styles.avatarWrapper}>
                {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile" style={styles.avatarImg} />
                ) : (
                    <div style={styles.avatarPlaceholder}>{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</div>
                )}
                
                {isEditing && (
                    <div style={styles.avatarControls}>
                        <div style={styles.cameraIcon} onClick={() => avatarInputRef.current.click()} title="Change Photo">
                            <Camera size={16} color="white" />
                        </div>
                        {formData.profilePic && (
                            <div style={styles.trashIcon} onClick={() => handleDeleteAsset('profilePic')} title="Remove Photo">
                                <Trash2 size={14} color="white" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Section (Name & Headline) */}
            <div style={{flex: 1, paddingTop: '10px', position:'relative', zIndex: 5}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px'}}>
                    <div style={{flex: 1}}>
                        {isEditing ? (
                            <>
                                <input 
                                    style={styles.nameInput} 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Your Name"
                                />
                                <input 
                                    style={styles.headlineInput} 
                                    value={formData.headline} 
                                    onChange={e => setFormData({...formData, headline: e.target.value})}
                                    placeholder="Headline (e.g. CS Student)"
                                />
                            </>
                        ) : (
                            <>
                                <h1 style={styles.name}>{formData.name}</h1>
                                <p style={styles.headline}>{formData.headline}</p>
                            </>
                        )}
                        
                        <div style={styles.metaRow}>
                            <span style={styles.metaItem}><Mail size={14}/> {formData.email}</span>
                            <span style={styles.metaItem}><Award size={14}/> CGPA: {formData.cgpa || '-'}</span>
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px'}}>
                        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} style={isEditing ? styles.saveBtn : styles.editBtn}>
                            {isEditing ? <><Save size={16}/> Save Changes</> : <><Edit3 size={16}/> Edit Profile</>}
                        </button>
                        
                        <div style={styles.strengthBox}>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:'4px', fontWeight:'600', color:'#475569'}}>
                                <span>Profile Strength</span><span>{strength}%</span>
                            </div>
                            <div style={{width:'140px', height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden'}}>
                                <div style={{width:`${strength}%`, height:'100%', background: strength > 80 ? '#10b981' : strength > 50 ? '#f59e0b' : '#ef4444', borderRadius:'3px', transition:'width 0.5s'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
          
          {/* LEFT COL */}
          <div style={styles.leftCol}>
              <div style={styles.card}>
                  <div style={styles.cardHeader}><Book size={18} color="#4f46e5"/> Skills</div>
                  <div style={styles.skillContainer}>
                      {formData.skills.map((skill, i) => (
                          <span key={i} style={styles.skillBadge}>
                              {skill}
                              {isEditing && <X size={12} style={{cursor:'pointer'}} onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} />}
                          </span>
                      ))}
                      {!formData.skills.length && <p style={{color:'#94a3b8', fontStyle:'italic', fontSize:'0.9rem'}}>Add skills to stand out.</p>}
                  </div>
                  {isEditing && (
                      <input style={styles.input} placeholder="Type skill & Hit Enter..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                  )}
              </div>

              <div style={styles.card}>
                  <div style={styles.cardHeader}><LinkIcon size={18} color="#4f46e5"/> Socials & Resume</div>
                  <div style={styles.linkList}>
                      {isEditing ? (
                        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                            <div style={styles.inputGroup}><Linkedin size={16}/><input style={styles.inlineInput} placeholder="LinkedIn URL" value={formData.linkedin} onChange={e=>setFormData({...formData, linkedin: e.target.value})}/></div>
                            <div style={styles.inputGroup}><Github size={16}/><input style={styles.inlineInput} placeholder="GitHub URL" value={formData.github} onChange={e=>setFormData({...formData, github: e.target.value})}/></div>
                            
                            {/* --- RESUME SECTION (EDIT) --- */}
                            <div style={{marginTop:'10px', display:'flex', flexDirection:'column', gap:'8px'}}>
                                <div style={styles.uploadBox} onClick={() => resumeInputRef.current.click()}>
                                    <UploadCloud size={20} color="#64748b"/>
                                    <span>{formData.resumeLink ? "Replace Resume PDF" : "Upload Resume PDF"}</span>
                                </div>
                                
                                {/* 🔴 DELETE RESUME BUTTON */}
                                {formData.resumeLink && (
                                    <button 
                                        type="button"
                                        style={styles.removeResumeBtn}
                                        onClick={() => handleDeleteAsset('resumeLink')}
                                    >
                                        <Trash2 size={16} /> Remove Resume
                                    </button>
                                )}
                            </div>
                        </div>
                      ) : (
                        <>
                           {formData.linkedin ? <a href={formData.linkedin} target="_blank" rel="noreferrer" style={styles.linkItem}><Linkedin size={18} color="#0077b5"/> LinkedIn</a> : <span style={styles.disabledLink}><Linkedin size={18} color="#cbd5e1"/> No LinkedIn</span>}
                           {formData.github ? <a href={formData.github} target="_blank" rel="noreferrer" style={styles.linkItem}><Github size={18} color="#333"/> GitHub</a> : <span style={styles.disabledLink}><Github size={18} color="#cbd5e1"/> No GitHub</span>}
                           
                           {/* --- RESUME SECTION (VIEW) --- */}
                           {formData.resumeLink ? (
                               <a href={formData.resumeLink} target="_blank" rel="noreferrer" style={styles.resumeCard}>
                                   <div style={{padding:'8px', background:'#fee2e2', borderRadius:'8px'}}><FileText size={20} color="#dc2626"/></div>
                                   <div><div style={{fontWeight:'bold', fontSize:'0.9rem'}}>Resume.pdf</div><div style={{fontSize:'0.75rem', color:'#64748b'}}>Click to view</div></div>
                               </a>
                           ) : <span style={{color:'#94a3b8', fontStyle:'italic', fontSize:'0.9rem'}}>No resume uploaded.</span>}
                        </>
                      )}
                  </div>
              </div>
          </div>

          {/* RIGHT COL */}
          <div style={styles.rightCol}>
              <div style={styles.card}>
                  <div style={styles.cardHeader}><User size={18} color="#4f46e5"/> About Me</div>
                  {isEditing ? (
                      <textarea style={styles.textArea} placeholder="Write a short bio..." value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
                  ) : <p style={styles.bioText}>{formData.about || "No bio added yet."}</p>}
              </div>

              <div style={styles.card}>
                  <div style={styles.cardHeader}><Award size={18} color="#4f46e5"/> Academic Details</div>
                  <div style={styles.academicGrid}>
                      <div style={styles.statBox}>
                          <span style={styles.statLabel}>Branch</span>
                          {isEditing ? <input style={styles.miniInput} value={formData.branch} onChange={e=>setFormData({...formData, branch:e.target.value})}/> : <span style={styles.statValue}>{formData.branch}</span>}
                      </div>
                      <div style={styles.statBox}>
                          <span style={styles.statLabel}>Year</span>
                          {isEditing ? <input style={styles.miniInput} value={formData.year} onChange={e=>setFormData({...formData, year:e.target.value})}/> : <span style={styles.statValue}>{formData.year}</span>}
                      </div>
                      <div style={styles.statBox}>
                          <span style={styles.statLabel}>CGPA</span>
                          {isEditing ? <input style={styles.miniInput} value={formData.cgpa} onChange={e=>setFormData({...formData, cgpa:e.target.value})}/> : <span style={{...styles.statValue, color:'#16a34a'}}>{formData.cgpa}</span>}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', paddingBottom:'40px' },
  banner: { height: '180px', borderRadius: '16px 16px 0 0', position:'relative', backgroundColor: '#e2e8f0', backgroundSize: 'cover', backgroundPosition: 'center' },
  
  coverControls: { position: 'absolute', top: '15px', right: '15px', display:'flex', gap:'10px', zIndex: 100 },
  coverUploadBtn: { background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight:'600', backdropFilter: 'blur(4px)', border:'1px solid rgba(255,255,255,0.3)' },
  deleteBtn: { background: 'rgba(239, 68, 68, 0.8)', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', border:'none', display:'flex', alignItems:'center', justifyContent:'center' },

  headerCard: { background: 'white', borderRadius: '0 0 16px 16px', border: '1px solid #e2e8f0', borderTop: 'none', padding: '0 30px 30px 30px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', zIndex: 10 },
  headerContent: { display: 'flex', gap: '25px', position: 'relative', top: '-50px' },
  
  avatarWrapper: { position: 'relative', zIndex: 20 },
  avatarPlaceholder: { width: '130px', height: '130px', borderRadius: '50%', background: 'white', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '800', color: '#4f46e5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  avatarImg: { width: '130px', height: '130px', borderRadius: '50%', border: '4px solid white', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background:'white' },
  
  avatarControls: { position: 'absolute', bottom: '5px', right: '0', display:'flex', gap:'5px', zIndex:30 },
  cameraIcon: { background: '#0f172a', padding: '8px', borderRadius: '50%', cursor: 'pointer', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center' },
  trashIcon: { background: '#ef4444', padding: '8px', borderRadius: '50%', cursor: 'pointer', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center' },

  name: { fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '50px 0 5px 0' },
  nameInput: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '50px 0 5px 0', width:'100%', border:'1px solid #cbd5e1', padding:'5px', borderRadius:'6px' },
  
  headline: { fontSize: '1rem', color: '#64748b', fontWeight: '500', marginBottom: '15px' },
  headlineInput: { fontSize: '0.95rem', color: '#334155', width:'100%', border:'1px solid #cbd5e1', padding:'8px', borderRadius:'6px', marginBottom:'15px' },

  metaRow: { display: 'flex', gap: '20px', flexWrap:'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569', background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px' },

  editBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#334155', cursor: 'pointer', fontWeight: '600', transition:'all 0.2s' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', cursor: 'pointer', fontWeight: '600', boxShadow:'0 4px 12px rgba(15, 23, 42, 0.2)' },
  strengthBox: { background:'white', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', marginTop:'10px' },

  grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px', alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '25px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '25px' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  cardHeader: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom:'1px solid #f1f5f9', paddingBottom:'15px' },
  
  skillContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  skillBadge: { background: '#eff6ff', color: '#4f46e5', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', display:'flex', alignItems:'center', gap:'6px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline:'none' },
  
  linkList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  linkItem: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#334155', fontSize: '0.95rem', padding: '12px', borderRadius: '8px', border:'1px solid #f1f5f9', background:'#f8fafc', transition:'background 0.2s', ':hover': {background:'#f1f5f9'} },
  disabledLink: { display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.95rem', padding: '12px', background:'#f8fafc', borderRadius:'8px' },
  inputGroup: { display:'flex', alignItems:'center', gap:'10px', padding:'10px', border:'1px solid #e2e8f0', borderRadius:'8px' },
  inlineInput: { border:'none', outline:'none', width:'100%', fontSize:'0.9rem' },
  resumeCard: { textDecoration:'none', border:'1px dashed #cbd5e1', padding:'15px', borderRadius:'10px', background:'#fef2f2', display:'flex', alignItems:'center', gap:'10px', transition:'background 0.2s', ':hover': {background:'#fee2e2'} },
  uploadBox: { display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'15px', border:'2px dashed #cbd5e1', borderRadius:'8px', cursor:'pointer', color:'#64748b', fontSize:'0.9rem', background:'#f8fafc', transition:'all 0.2s', ':hover': {borderColor:'#94a3b8', background:'#f1f5f9'} },
  
  removeResumeBtn: { width:'100%', padding:'10px', background:'#fee2e2', color:'#b91c1c', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'background 0.2s', ':hover': {background:'#fecaca'} },

  textArea: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', minHeight: '120px', fontFamily: 'inherit', lineHeight:'1.5', outline:'none' },
  bioText: { lineHeight: '1.7', color: '#334155', fontSize: '1rem' },
  
  academicGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  statBox: { background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border:'1px solid #f1f5f9' },
  statLabel: { fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight:'600' },
  statValue: { fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' },
  miniInput: { width:'80%', padding:'5px', textAlign:'center', borderRadius:'6px', border:'1px solid #cbd5e1', fontWeight:'bold', outline:'none' }
};

export default MyProfile;