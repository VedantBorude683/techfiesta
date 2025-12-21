import React from 'react';
import { History, Terminal, User, Clock, Download, ShieldCheck, Activity } from 'lucide-react';

const AuditLogs = () => {
  const logs = [
    { id: 1, action: 'MODIFIED_ROLE', user: 'Admin_1', target: 'Faculty_Dr_Smith', time: 'Oct 25, 10:30 AM', status: 'Security' },
    { id: 2, action: 'APPROVED_PROJECT', user: 'Admin_1', target: 'Blockchain Research', time: 'Oct 25, 09:15 AM', status: 'Approval' },
    { id: 3, action: 'CONFIG_CHANGE', user: 'Admin_Super', target: 'Application Deadlines', time: 'Oct 24, 04:45 PM', status: 'System' },
    { id: 4, action: 'USER_SUSPENDED', user: 'Admin_1', target: 'Sneha Rao', time: 'Oct 24, 02:20 PM', status: 'Moderation' },
  ];

  return (
    <div style={styles.container}>
      {/* 1. TOP HEADER & FILTER AREA */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBox}><Activity size={20} color="#4f46e5" /></div>
          <div>
            <h2 style={styles.title}>System Audit Trail</h2>
            <p style={styles.subtitle}>Immutable record of all administrative actions and system events.</p>
          </div>
        </div>
        <button style={styles.downloadBtn}>
          <Download size={16} /> Export Raw JSON
        </button>
      </div>

      {/* 2. AUDIT LOGS TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={styles.terminalLabel}>
            <Terminal size={14} /> 
            <span>auth_logs --live_stream</span>
          </div>
          <span style={styles.statusPulse}>System Monitoring Active</span>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Administrator</th>
              <th style={styles.th}>Action Event</th>
              <th style={styles.th}>Target Entity</th>
              <th style={{...styles.th, textAlign: 'right'}}>Category</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.timeWrapper}>
                    <Clock size={12} color="#94a3b8" />
                    {log.time}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.userWrapper}>
                    <div style={styles.userAvatar}><User size={12} color="#4f46e5" /></div>
                    {log.user}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.actionCode}>{log.action}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.targetName}>{log.target}</span>
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <span style={{
                    ...styles.categoryBadge,
                    backgroundColor: log.status === 'Security' ? '#fef2f2' : log.status === 'System' ? '#f0f9ff' : '#f5f3ff',
                    color: log.status === 'Security' ? '#ef4444' : log.status === 'System' ? '#0ea5e9' : '#6366f1'
                  }}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={styles.footerNote}>
        <ShieldCheck size={14} /> 
        All logs are cryptographically hashed and stored for institutional compliance.
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.4s ease' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconBox: { width: '44px', height: '44px', backgroundColor: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  downloadBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#475569' },

  tableCard: { backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  tableHeader: { padding: '15px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  terminalLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: '#64748b', fontFamily: 'monospace' },
  statusPulse: { fontSize: '10px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' },

  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { borderBottom: '1px solid #f1f5f9' },
  th: { padding: '18px 24px', textAlign: 'left', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  tr: { borderBottom: '1px solid #fcfcfd', transition: 'background 0.2s' },
  td: { padding: '18px 24px', fontSize: '13px', color: '#475569' },

  timeWrapper: { display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontWeight: '500' },
  userWrapper: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', color: '#1e293b' },
  userAvatar: { width: '24px', height: '24px', backgroundColor: '#f5f3ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  actionCode: { fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: '#4f46e5', backgroundColor: '#f5f3ff', padding: '4px 8px', borderRadius: '6px' },
  targetName: { fontWeight: '600', color: '#64748b' },
  categoryBadge: { fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' },

  footerNote: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: '500', padding: '0 10px' }
};

export default AuditLogs;