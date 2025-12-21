import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, User, GraduationCap, Mail, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegeDetails = ({ collegeCode, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [collegeCode]);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/owner/college-details/${collegeCode}`, {
        headers: {'Authorization': `Bearer ${token}` }
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load college details");
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding:'40px', color:'#94a3b8'}}>Loading college data...</div>;
  if (!data) return <div style={{padding:'40px', color:'#ef4444'}}>Data not found.</div>;

  return (
    <div style={styles.container}>
      
      {/* Back Button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} /> Back to Directory
      </button>

      {/* 1. FACULTY HEADER */}
      <div style={styles.facultyCard}>
        <div style={styles.headerContent}>
            <div style={styles.avatar}>{data.faculty.name.charAt(0)}</div>
            <div>
                <h1 style={styles.collegeName}>{data.faculty.collegeName}</h1>
                <div style={styles.facultyInfo}>
                    <User size={16} /> 
                    <span style={{fontWeight:'700', color:'#f8fafc'}}>Faculty Admin: {data.faculty.name}</span>
                    <span style={styles.badge}>CODE: {data.faculty.collegeCode}</span>
                </div>
                <div style={{display:'flex', gap:'8px', alignItems:'center', marginTop:'4px', color:'#94a3b8', fontSize:'0.9rem'}}>
                    <Mail size={14}/> {data.faculty.email}
                </div>
            </div>
        </div>
        <div style={styles.statBox}>
            <span style={{fontSize:'2rem', fontWeight:'800', color:'#3b82f6'}}>{data.totalStudents}</span>
            <span style={{fontSize:'0.8rem', color:'#cbd5e1'}}>Total Students</span>
        </div>
      </div>

      {/* 2. STUDENTS SEGREGATED BY YEAR */}
      <div style={styles.yearContainer}>
        {Object.keys(data.studentsByYear).length === 0 ? (
            <div style={styles.emptyState}>No students enrolled yet.</div>
        ) : (
            Object.keys(data.studentsByYear).sort().map((year) => (
                <div key={year} style={styles.yearGroup}>
                    <h3 style={styles.yearTitle}>
                        <Layers size={20} color="#8b5cf6"/> 
                        {year} Students 
                        <span style={styles.countBadge}>{data.studentsByYear[year].length}</span>
                    </h3>
                    
                    <div style={styles.studentGrid}>
                        {data.studentsByYear[year].map((student) => (
                            <div key={student._id} style={styles.studentCard}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                                    <div style={{fontWeight:'700', color:'#f8fafc'}}>{student.name}</div>
                                    <GraduationCap size={16} color="#6366f1"/>
                                </div>
                                <div style={{fontSize:'0.85rem', color:'#94a3b8'}}>{student.email}</div>
                                <div style={{marginTop:'8px', fontSize:'0.8rem', display:'flex', gap:'10px'}}>
                                    <span style={styles.tag}>{student.branch || 'N/A'}</span>
                                    <span style={styles.tag}>CGPA: {student.cgpa || '-'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { height:'100%', display:'flex', flexDirection:'column', gap:'24px' },
  backBtn: { display:'flex', alignItems:'center', gap:'8px', background:'transparent', border:'none', color:'#94a3b8', cursor:'pointer', width:'fit-content', fontSize:'0.9rem', marginBottom:'10px' },
  
  facultyCard: { background:'linear-gradient(145deg, #1e293b, #0f172a)', padding:'30px', borderRadius:'16px', border:'1px solid #334155', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.2)' },
  headerContent: { display:'flex', alignItems:'center', gap:'20px' },
  avatar: { width:'64px', height:'64px', borderRadius:'16px', background:'#6366f1', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:'700' },
  collegeName: { margin:'0 0 8px 0', fontSize:'1.5rem', fontWeight:'800', color:'#f8fafc' },
  facultyInfo: { display:'flex', alignItems:'center', gap:'12px', color:'#cbd5e1' },
  badge: { background:'#334155', padding:'2px 8px', borderRadius:'6px', fontSize:'0.75rem', fontWeight:'700', color:'#e2e8f0', letterSpacing:'1px' },
  statBox: { textAlign:'center', background:'rgba(59, 130, 246, 0.1)', padding:'15px 25px', borderRadius:'12px', border:'1px solid rgba(59, 130, 246, 0.2)' },

  yearContainer: { display:'flex', flexDirection:'column', gap:'30px', overflowY:'auto', paddingRight:'5px' },
  yearGroup: { background:'#111827', borderRadius:'16px', padding:'24px', border:'1px solid #1f2937' },
  yearTitle: { margin:'0 0 20px 0', fontSize:'1.2rem', fontWeight:'700', color:'#e2e8f0', display:'flex', alignItems:'center', gap:'12px', borderBottom:'1px solid #1f2937', paddingBottom:'12px' },
  countBadge: { background:'#374151', padding:'2px 8px', borderRadius:'12px', fontSize:'0.8rem', color:'#cbd5e1' },
  
  studentGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'16px' },
  studentCard: { background:'#1f293b', padding:'16px', borderRadius:'12px', border:'1px solid #334155' },
  tag: { background:'#0f172a', padding:'2px 8px', borderRadius:'4px', color:'#94a3b8' },
  emptyState: { textAlign:'center', padding:'40px', color:'#64748b' }
};

export default CollegeDetails;