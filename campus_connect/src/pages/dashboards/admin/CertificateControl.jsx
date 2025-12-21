import React, { useState } from 'react';
import { 
  Award, CheckCircle, Search, Download, Eye, 
  Send, ShieldCheck, Clock, User, FileText, Verified
} from 'lucide-react';

const CertificateControl = () => {
  const [certificates, setCertificates] = useState([
    { id: "CERT-8821", student: 'Rahul Verma', internship: 'Full Stack Dev', provider: 'TechCorp', status: 'Pending', date: '2023-11-01' },
    { id: "CERT-8822", student: 'Sneha Rao', internship: 'UI/UX Design', provider: 'CreativeMinds', status: 'Issued', date: '2023-10-28' },
    { id: "CERT-8823", student: 'Amit Patel', internship: 'Data Science', provider: 'DataSoft', status: 'Pending', date: '2023-11-02' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const issueCertificate = (id) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, status: 'Issued' } : cert
    ));
  };

  const filteredCerts = certificates.filter(cert =>
    cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* 1. ANALYTICS CARDS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#fff7ed', color: '#ea580c' }}><Award size={22} /></div>
          <div>
            <p style={styles.statLabel}>Pending Review</p>
            <h3 style={styles.statValue}>{certificates.filter(c => c.status === 'Pending').length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#f0fdf4', color: '#16a34a' }}><ShieldCheck size={22} /></div>
          <div>
            <p style={styles.statLabel}>Verified & Issued</p>
            <h3 style={styles.statValue}>{certificates.filter(c => c.status === 'Issued').length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: '#f0f9ff', color: '#0ea5e9' }}><Clock size={22} /></div>
          <div>
            <p style={styles.statLabel}>Generation Rate</p>
            <h3 style={styles.statValue}>12/Day</h3>
          </div>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search style={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search by student name or ID..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button style={styles.bulkBtn}><Send size={16} /> Bulk Validation</button>
      </div>

      {/* 3. CREDENTIAL TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Identifier</th>
              <th style={styles.th}>Candidate & Engagement</th>
              <th style={styles.th}>Authority</th>
              <th style={styles.th}>Verification</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCerts.map((cert) => (
              <tr key={cert.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.certIdBox}>{cert.id}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.studentInfo}>
                    <p style={styles.studentName}>{cert.student}</p>
                    <p style={styles.courseName}>{cert.internship}</p>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.providerBadge}>{cert.provider}</span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: cert.status === 'Issued' ? '#f0fdf4' : '#fff7ed',
                    color: cert.status === 'Issued' ? '#16a34a' : '#c2410c'
                  }}>
                    {cert.status === 'Issued' ? <Verified size={12} style={{marginRight: '4px'}} /> : null}
                    {cert.status}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.actionSet}>
                    <button style={styles.viewBtn} title="Preview"><Eye size={18} /></button>
                    {cert.status === 'Pending' ? (
                      <button 
                        onClick={() => issueCertificate(cert.id)}
                        style={styles.issueBtn}
                        title="Authorize & Issue"
                      >
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button style={styles.downloadBtn} title="Download PDF"><Download size={18} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s ease' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '18px' },
  iconBox: { padding: '14px', borderRadius: '12px', display: 'flex' },
  statLabel: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', margin: 0 },
  statValue: { fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '2px 0 0 0' },

  filterBar: { display: 'flex', gap: '15px', backgroundColor: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9' },
  searchWrapper: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
  searchInput: { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', fontWeight: '500' },
  bulkBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' },

  tableWrapper: { backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' },
  th: { padding: '18px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' },
  tr: { borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' },
  td: { padding: '20px 24px' },

  certIdBox: { fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: '#4f46e5', backgroundColor: '#f5f3ff', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' },
  studentName: { fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: 0 },
  courseName: { fontSize: '12px', color: '#64748b', margin: '2px 0 0 0', fontWeight: '500' },
  providerBadge: { fontSize: '11px', fontWeight: '700', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' },
  statusBadge: { fontSize: '10px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' },

  actionSet: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  viewBtn: { padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'pointer', backgroundColor: 'white' },
  issueBtn: { padding: '8px', borderRadius: '10px', border: 'none', color: 'white', backgroundColor: '#16a34a', cursor: 'pointer', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)' },
  downloadBtn: { padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', cursor: 'pointer', backgroundColor: '#f8fafc' }
};

export default CertificateControl;