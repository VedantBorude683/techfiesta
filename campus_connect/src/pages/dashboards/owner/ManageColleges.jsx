
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Building2, MapPin, Copy, Search, UserCheck } from 'lucide-react';

const ManageColleges = ({ onViewDetails }) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      // Ensure backend port is correct (8080)
      const res = await axios.get('http://localhost:8080/api/owner/colleges', {
        headers: { 'Authorization': `Bearer ${token}`}
      });
      setColleges(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load colleges");
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied!`);
  };

  const filtered = colleges.filter(c => 
    (c.collegeName && c.collegeName.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (c.collegeCode && c.collegeCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <Toaster position="bottom-right" />
      
      {/* Header Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
                style={styles.searchInput} 
                placeholder="Search institute or code..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div style={styles.countBadge}>
            <Building2 size={16} /> 
            <span>{colleges.length} Institutes</span>
        </div>
      </div>

      {/* College Grid */}
      <div style={styles.grid}>
        {loading ? (
            <div style={{color:'#64748b', gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                Loading directory...
            </div>
        ) : filtered.length === 0 ? (
            <div style={{color:'#64748b', gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                No colleges found matching your search.
            </div>
        ) : (
            filtered.map((college) => (
                <div 
                    key={college._id} 
                    style={styles.card}
                    onClick={() => onViewDetails(college.collegeCode)} // Handle Card Click
                >
                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                        <div style={styles.iconBox}>
                            <Building2 size={24} color="white" />
                        </div>
                        <div style={{flex:1, overflow:'hidden'}}>
                            <h3 style={styles.collegeName} title={college.collegeName}>
                                {college.collegeName || 'Unnamed Institute'}
                            </h3>
                            <div style={styles.location}>
                                <MapPin size={12} /> {college.district || 'Unknown'}, {college.state || 'India'}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div style={styles.cardBody}>
                        <div style={styles.infoRow}>
                            <span style={styles.label}>Admin</span>
                            <span style={styles.value}>
                                <UserCheck size={14}/> {college.name}
                            </span>
                        </div>
                        
                        {/* Copy Code Section */}
                        <div 
                            style={styles.codeBox}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering card click
                        >
                            <span style={{fontSize:'0.7rem', color:'#64748b'}}>JOIN CODE</span>
                            <div style={styles.codeRow}>
                                <code style={styles.code}>{college.collegeCode}</code>
                                <button 
                                    onClick={() => copyCode(college.collegeCode)}
                                    style={styles.copyBtn}
                                    title="Copy Code"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
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
  container: { height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' },
  
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155', width: '350px' },
  searchInput: { background: 'transparent', border: 'none', color: '#e2e8f0', outline: 'none', width: '100%', fontSize: '0.9rem' },
  countBadge: { background: '#1e293b', padding: '8px 16px', borderRadius: '20px', border: '1px solid #334155', color: '#cbd5e1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', overflowY: 'auto', paddingRight: '5px' },
  
  card: { background: '#111827', borderRadius: '16px', border: '1px solid #1f2937', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', ':hover': { borderColor: '#6366f1', transform: 'translateY(-2px)' } },
  
  cardHeader: { padding: '20px', background: 'linear-gradient(180deg, #1e293b 0%, #111827 100%)', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid #1f2937' },
  iconBox: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' },
  collegeName: { color: '#f8fafc', fontSize: '1rem', fontWeight: '700', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  location: { color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' },

  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#cbd5e1' },
  label: { color: '#64748b' },
  value: { fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' },

  codeBox: { background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px dashed #334155', marginTop: '5px' },
  codeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  code: { fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '700', color: '#3b82f6', letterSpacing: '1px' },
  copyBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: '0.2s' }
};

export default ManageColleges;