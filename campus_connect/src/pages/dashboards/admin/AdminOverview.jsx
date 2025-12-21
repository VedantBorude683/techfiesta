import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, CheckCircle, TrendingUp, 
  Zap, ArrowUpRight, FileText, Shield, Clock, 
  Calendar, BarChart3
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    completedInternships: 0,
    placementRate: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activityRes = await axios.get('/api/admin/audit-logs?limit=4', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const metrics = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users size={20} />, color: '#4f46e5', bg: '#f5f3ff' },
    { label: 'Active Projects', value: stats.activeProjects, icon: <Briefcase size={20} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Pending Reviews', value: stats.pendingApprovals, icon: <Clock size={20} />, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Completions', value: stats.completedInternships, icon: <CheckCircle size={20} />, color: '#059669', bg: '#f0fdf4' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading Analytics...</div>;

  return (
    <div style={styles.container}>
      {/* 1. Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Institutional Command</h1>
          <p style={styles.subtitle}>Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div style={styles.btnGroup}>
          <button style={styles.secondaryBtn}><Calendar size={16} /> Schedule</button>
          <button style={styles.primaryBtn}>Generate Report <ArrowUpRight size={16} /></button>
        </div>
      </div>

      {/* 2. Metrics Grid (Fixed Layout) */}
      <div style={styles.grid}>
        {metrics.map((stat, i) => (
          <div key={i} style={styles.card}>
            <div style={{ ...styles.iconBox, backgroundColor: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={styles.cardLabel}>{stat.label}</p>
              <h3 style={styles.cardValue}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainLayout}>
        {/* 3. Analytics Chart Area */}
        <div style={styles.chartSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Project Completion</h3>
            <span style={styles.efficiencyBadge}>Efficiency: {stats.placementRate}%</span>
          </div>
          <div style={styles.visualBox}>
            <BarChart3 size={48} color="#e2e8f0" />
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px', fontWeight: 'bold' }}>ANALYTICS VISUALIZATION</p>
          </div>
        </div>

        {/* 4. Activity Feed */}
        <div style={styles.feedSection}>
          <h3 style={styles.sectionTitle}>Live Feed <Zap size={16} color="#fbbf24" fill="#fbbf24" /></h3>
          <div style={styles.feedList}>
            {activities.map((item, idx) => (
              <div key={idx} style={styles.feedItem}>
                <div style={styles.feedIcon}><FileText size={14} color="#64748b" /></div>
                <div>
                  <p style={styles.feedText}><b>{item.userName}</b> {item.action} <span style={{color: '#4f46e5'}}>{item.targetName}</span></p>
                  <span style={styles.feedTime}>{item.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
  btnGroup: { display: 'flex', gap: '10px' },
  primaryBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#475569', padding: '10px 18px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' },
  iconBox: { padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
  cardValue: { fontSize: '22px', fontWeight: '900', color: '#1e293b', margin: '2px 0 0 0' },

  mainLayout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' },
  chartSection: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' },
  efficiencyBadge: { fontSize: '11px', fontWeight: '800', color: '#4f46e5', backgroundColor: '#f5f3ff', padding: '4px 10px', borderRadius: '20px' },
  visualBox: { height: '200px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },

  feedSection: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' },
  feedList: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
  feedItem: { display: 'flex', gap: '12px' },
  feedIcon: { width: '32px', height: '32px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' },
  feedText: { fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' },
  feedTime: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }
};

export default AdminOverview;