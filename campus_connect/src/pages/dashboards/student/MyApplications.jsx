import React, { useState } from 'react';
import { 
  Briefcase, MapPin, Calendar, CheckCircle, XCircle, Clock, 
  FileText, ChevronRight, X, Loader 
} from 'lucide-react';

const MyApplications = () => {
  // 🟢 MOCK DATA FOR PROTOTYPE
  const mockApplications = [
    {
      _id: 'app-001',
      status: 'Accepted',
      appliedAt: '2023-10-15T10:00:00Z',
      resumeLink: '#',
      jobId: {
        title: 'Frontend Developer Intern',
        company: 'TechCorp Solutions',
        type: 'Internship',
        location: 'Bangalore, India',
        stipend: '₹25,000/mo',
        description: 'We are looking for a React.js enthusiast to join our frontend team. You will work on building responsive UI components and integrating APIs.',
        eligibility: {
          minCgpa: 7.5,
          maxBacklogs: 0,
          branches: ['CSE', 'IT']
        }
      }
    },
    {
      _id: 'app-002',
      status: 'Shortlisted',
      appliedAt: '2023-10-20T14:30:00Z',
      resumeLink: '#',
      jobId: {
        title: 'Data Analyst Trainee',
        company: 'FinData Analytics',
        type: 'Full Time',
        location: 'Mumbai, India',
        stipend: '₹6.5 LPA',
        description: 'Join our data team to analyze financial trends. Proficiency in Python and SQL is required. Great opportunity for freshers.',
        eligibility: {
          minCgpa: 6.0,
          maxBacklogs: 1,
          branches: ['All Branches']
        }
      }
    },
    {
      _id: 'app-003',
      status: 'Pending',
      appliedAt: '2023-11-01T09:15:00Z',
      resumeLink: '#',
      jobId: {
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        type: 'Internship',
        location: 'Remote',
        stipend: 'Unpaid',
        description: 'Design intuitive user interfaces for our mobile apps. Experience with Figma is a plus.',
        eligibility: {
          minCgpa: 0,
          maxBacklogs: 2,
          branches: ['Design', 'CSE']
        }
      }
    },
    {
      _id: 'app-004',
      status: 'Rejected',
      appliedAt: '2023-09-10T11:00:00Z',
      resumeLink: '#',
      jobId: {
        title: 'Backend Engineer',
        company: 'CloudSystems Inc.',
        type: 'Full Time',
        location: 'Hyderabad, India',
        stipend: '₹12 LPA',
        description: 'Robust backend development using Node.js and AWS. High performance computing tasks.',
        eligibility: {
          minCgpa: 8.0,
          maxBacklogs: 0,
          branches: ['CSE']
        }
      }
    }
  ];

  // Initialize state directly with mock data
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState(null); 

  const getStatusColor = (status) => {
      switch(status) {
          case 'Accepted': return '#10b981'; // Green
          case 'Rejected': return '#ef4444'; // Red
          case 'Shortlisted': return '#f59e0b'; // Orange
          default: return '#6366f1'; // Indigo (Pending)
      }
  };

  const getStatusIcon = (status) => {
      switch(status) {
          case 'Accepted': return <CheckCircle size={16}/>;
          case 'Rejected': return <XCircle size={16}/>;
          default: return <Clock size={16}/>;
      }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
          <h1 style={styles.title}>My Applications</h1>
          <p style={styles.subtitle}>Track the status of your job applications.</p>
      </div>

      {applications.length === 0 ? (
          <div style={styles.emptyState}>
              <Briefcase size={40} color="#cbd5e1"/>
              <h3>No applications yet.</h3>
              <p>Head over to Opportunities to start applying!</p>
          </div>
      ) : (
          <div style={styles.grid}>
              {applications.map((app) => {
                  const job = app.jobId || {};
                  return (
                      <div key={app._id} style={styles.card}>
                          <div style={styles.cardHeader}>
                              <div>
                                  <h3 style={styles.jobTitle}>{job.title || 'Unknown Job'}</h3>
                                  <p style={styles.companyName}>{job.company || 'Unknown Company'}</p>
                              </div>
                              <span style={{...styles.statusBadge, color: getStatusColor(app.status), borderColor: getStatusColor(app.status)}}>
                                  {getStatusIcon(app.status)} {app.status}
                              </span>
                          </div>
                          
                          <div style={styles.metaInfo}>
                              <span><MapPin size={14}/> {job.location || 'Remote'}</span>
                              <span><Calendar size={14}/> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                          </div>

                          <button onClick={() => setSelectedApp(app)} style={styles.detailsBtn}>
                              View Details <ChevronRight size={16}/>
                          </button>
                      </div>
                  );
              })}
          </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selectedApp && selectedApp.jobId && (
          <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                  <div style={styles.modalHeader}>
                      <h2 style={{margin:0, fontSize:'1.5rem', color: '#1e293b'}}>{selectedApp.jobId.title}</h2>
                      <button onClick={() => setSelectedApp(null)} style={styles.closeBtn}><X size={20}/></button>
                  </div>
                  
                  <div style={styles.modalScroll}>
                      <div style={styles.tagRow}>
                          <span style={styles.modalBadge}>{selectedApp.jobId.type}</span>
                          <span style={styles.modalBadge}>{selectedApp.jobId.stipend || 'Unpaid'}</span>
                          <span style={{...styles.modalBadge, background: getStatusColor(selectedApp.status) + '20', color: getStatusColor(selectedApp.status)}}>
                              Status: {selectedApp.status}
                          </span>
                      </div>

                      <div style={styles.section}>
                          <h4 style={styles.sectionTitle}>About the Role</h4>
                          <p style={styles.descText}>{selectedApp.jobId.description || "No description provided."}</p>
                      </div>

                      {/* Eligibility Display */}
                      {selectedApp.jobId.eligibility && (
                          <div style={styles.criteriaBox}>
                              <h4 style={{margin:'0 0 10px 0', fontSize:'0.9rem', color:'#ea580c', fontWeight: 'bold'}}>Eligibility Criteria</h4>
                              <div style={styles.criteriaGrid}>
                                  <span>Min CGPA: <b>{selectedApp.jobId.eligibility.minCgpa || 'N/A'}</b></span>
                                  <span>Backlogs: <b>{selectedApp.jobId.eligibility.maxBacklogs ?? 'N/A'}</b></span>
                                  <span>Branches: <b>{selectedApp.jobId.eligibility.branches?.join(', ') || 'All'}</b></span>
                              </div>
                          </div>
                      )}

                      <div style={styles.section}>
                          <h4 style={styles.sectionTitle}>My Submission</h4>
                          <a href={selectedApp.resumeLink} target="_blank" rel="noreferrer" style={styles.resumeLink}>
                              <FileText size={16}/> View Submitted Resume (Mock)
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Inter", sans-serif' },
  header: { marginBottom: '40px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px', fontSize: '1rem' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  card: { background: 'white', borderRadius: '16px', padding: '24px', border:'1px solid #e2e8f0', display:'flex', flexDirection:'column', gap:'15px', transition:'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
  companyName: { fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: '500' },
  
  statusBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', border:'1px solid', background:'white' },
  metaInfo: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#64748b' },
  
  detailsBtn: { marginTop: 'auto', width: '100%', padding: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition:'background 0.2s' },
  
  emptyState: { textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0', color: '#94a3b8' },

  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter:'blur(4px)' },
  modal: { background: 'white', borderRadius: '20px', width: '90%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  modalHeader: { padding: '25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '5px' },
  modalScroll: { padding: '25px', overflowY: 'auto' },
  
  tagRow: { display: 'flex', gap: '10px', marginBottom: '25px' },
  modalBadge: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' },
  
  section: { marginBottom: '25px' },
  sectionTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' },
  descText: { fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' },
  
  criteriaBox: { background: '#fff7ed', padding: '20px', borderRadius: '12px', border: '1px solid #ffedd5', marginBottom: '25px' },
  criteriaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.9rem', color: '#c2410c' },
  
  resumeLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#eff6ff', borderRadius: '12px', textDecoration: 'none', color: '#2563eb', fontWeight: '600', border: '1px solid #dbeafe', transition: 'background 0.2s' }
};

export default MyApplications;