import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast for "Commands"
import { 
  Users, Shield, TrendingUp, DollarSign, 
  Activity, Zap, Megaphone, Server, FileText, CheckCircle, ArrowRight
} from 'lucide-react';

const Overview = ({ setActiveView }) => {
  const [data, setData] = useState({
    stats: { totalStudents: 0, totalFaculty: 0, pendingFaculty: 0, revenue: 0, growth: 0 },
    activities: [],
    loading: true
  });

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel data fetching for performance
      const [statsRes, activityRes] = await Promise.all([
        axios.get('http://localhost:8080/api/owner/stats', { headers }),
        axios.get('http://localhost:8080/api/owner/activity-logs', { headers })
      ]);

      setData({
        stats: statsRes.data,
        activities: activityRes.data,
        loading: false
      });
    } catch (err) {
      console.error("Dashboard Load Error", err);
      // Keep loading false so UI doesn't hang, maybe show error toast
      setData(prev => ({ ...prev, loading: false })); 
    }
  };

  // --- 2. COMMAND HANDLERS ---
  const handleCommand = (command) => {
    // In a real app, these would call backend endpoints
    if (command === 'broadcast') toast.success('Broadcast sent to all users!');
    if (command === 'reports') toast.success('Downloading system report...');
    if (command === 'maintenance') toast.error('Maintenance Mode requires confirmation.');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount || 0);
  };

  if (data.loading) return (
    <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>
      <Activity className="animate-spin" size={24} style={{marginRight:'10px'}}/> Initializing System...
    </div>
  );

  return (
    <div style={styles.container}>
      <Toaster position="bottom-right" />

      {/* --- METRICS GRID --- */}
      <div style={styles.grid}>
        <MetricCard 
          icon={<DollarSign size={22} />} label="Total Revenue" 
          value={formatCurrency(data.stats.revenue)} 
          trend={`+${data.stats.growth}% growth`} trendUp={true}
          color="#10b981" gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)"
        />
       {/* CLICKABLE STUDENT CARD */}
        <div onClick={() => setActiveView('All Users')} style={{cursor: 'pointer'}}>
            <MetricCard 
              icon={<Users size={22} />} 
              label="Total Students" 
              value={data.stats.totalStudents} 
              trend="+24 this week"
              trendUp={true}
              color="#3b82f6"
              gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)"
            />
        </div>

        {/* CLICKABLE FACULTY CARD */}
        <div onClick={() => setActiveView('All Users')} style={{cursor: 'pointer'}}>
            <MetricCard 
              icon={<Shield size={22} />} 
              label="Faculty Count" 
              value={data.stats.totalFaculty} 
              trend="Stable"
              trendUp={true}
              color="#8b5cf6"
              gradient="linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)"
            />
        </div>
        <MetricCard 
          icon={<Zap size={22} />} label="System Load" 
          value="12%" trend="Optimal" trendUp={true}
          color="#f59e0b" gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)"
        />
      </div>

      <div style={styles.splitSection}>
        
        {/* --- LEFT: ACTIONS & COMMANDS --- */}
        <div style={styles.leftColumn}>
            
            {/* 3. PENDING VERIFICATION ACTION */}
            <div style={styles.actionCard}>
                <div style={styles.actionHeader}>
                    <div style={styles.pulseDot}></div>
                    <h3 style={styles.cardTitle}>Action Required</h3>
                </div>
                
                {data.stats.pendingFaculty > 0 ? (
                    <div style={styles.alertContent}>
                        <div style={{flex:1}}>
                             <h2 style={styles.alertCount}>{data.stats.pendingFaculty}</h2>
                             <p style={styles.alertText}>Faculty members waiting for verification.</p>
                        </div>
                        {/* 4. NAVIGATE TO APPROVALS */}
                        <button onClick={() => setActiveView('Verify Faculty')} style={styles.reviewBtn}>
                            Review Now <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <CheckCircle size={32} color="#10b981" />
                        <span style={{color:'#cbd5e1', fontSize:'0.9rem'}}>All verifications complete.</span>
                    </div>
                )}
            </div>

            {/* 5. SYSTEM COMMANDS */}
            <div>
                <h3 style={styles.sectionLabel}>SYSTEM COMMANDS</h3>
                <div style={styles.commandGrid}>
                    <CommandBtn 
                        onClick={() => handleCommand('broadcast')} 
                        icon={<Megaphone size={18}/>} label="Broadcast" color="#3b82f6" 
                    />
                    <CommandBtn 
                        onClick={() => handleCommand('reports')} 
                        icon={<FileText size={18}/>} label="Reports" color="#8b5cf6" 
                    />
                    <CommandBtn 
                        onClick={() => handleCommand('maintenance')} 
                        icon={<Server size={18}/>} label="Maintenance" color="#ef4444" 
                    />
                </div>
            </div>
        </div>

        {/* --- RIGHT: LIVE ACTIVITY FEED --- */}
        <div style={styles.feedCard}>
            <div style={styles.feedHeader}>
                <h3 style={styles.cardTitle}><Activity size={18} color="#6366f1"/> Live Activity</h3>
                <span style={styles.liveBadge}>LIVE</span>
            </div>
            
            <div style={styles.feedList}>
                {data.activities.length === 0 ? (
                    <div style={styles.noData}>No recent activity.</div>
                ) : (
                    data.activities.map((log, idx) => (
                        <div key={idx} style={styles.feedItem}>
                            <div style={styles.timelineLine}></div>
                            <div style={styles.feedIcon}></div>
                            <div style={styles.feedContent}>
                                <p style={styles.feedMsg}>{log.message}</p>
                                <span style={styles.feedTime}>{new Date(log.time).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS (Same as before, simplified for brevity) ---
const MetricCard = ({ icon, label, value, trend, trendUp, color, gradient }) => (
    <div style={{...styles.metricCard, background: gradient, borderColor: `${color}30`}}>
        <div style={styles.metricHeader}>
            <div style={{...styles.iconBox, color: color, background: `${color}20`}}>{icon}</div>
            <span style={{...styles.trendBadge, color: trendUp ? '#10b981' : '#ef4444'}}>
                <TrendingUp size={12}/> {trend}
            </span>
        </div>
        <div style={styles.metricBody}>
            <h2 style={styles.metricValue}>{value}</h2>
            <p style={styles.metricLabel}>{label}</p>
        </div>
    </div>
);

const CommandBtn = ({ icon, label, color, onClick }) => (
    <button onClick={onClick} style={{...styles.cmdBtn, borderColor: `${color}40`}}>
        <div style={{color: color, marginBottom:'6px'}}>{icon}</div>
        <span style={{color: '#cbd5e1'}}>{label}</span>
    </button>
);

// Use the same styles object provided in the previous step
const styles = {
    container: { width:'100%', height:'100%', display:'flex', flexDirection:'column', gap:'24px', fontFamily:'"Inter", sans-serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
    splitSection: { display: 'flex', gap: '24px', flexWrap: 'wrap', flex: 1 },
    leftColumn: { flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' },
    metricCard: { padding: '20px', borderRadius: '16px', border: '1px solid', backdropFilter: 'blur(12px)', transition:'transform 0.2s', cursor:'default' },
    metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom:'16px' },
    iconBox: { padding: '10px', borderRadius: '10px' },
    trendBadge: { fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'20px' },
    metricBody: { display:'flex', flexDirection:'column' },
    metricValue: { fontSize: '1.8rem', fontWeight: '700', color: '#f8fafc', margin: 0, letterSpacing:'-0.5px' },
    metricLabel: { fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0', fontWeight:'500' },
    actionCard: { background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', border: '1px solid #334155', padding: '24px', position:'relative', overflow:'hidden' },
    actionHeader: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' },
    pulseDot: { width:'8px', height:'8px', background:'#f59e0b', borderRadius:'50%', boxShadow:'0 0 8px #f59e0b' },
    cardTitle: { fontSize:'1rem', fontWeight:'700', color:'#e2e8f0', margin:0, display:'flex', alignItems:'center', gap:'10px' },
    alertContent: { display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(245, 158, 11, 0.1)', padding:'16px', borderRadius:'12px', border:'1px solid rgba(245, 158, 11, 0.2)' },
    alertCount: { fontSize:'1.5rem', fontWeight:'800', color:'#f59e0b', margin:0 },
    alertText: { fontSize:'0.9rem', color:'#cbd5e1', margin:0 },
    reviewBtn: { display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#f59e0b', color:'#0f172a', border:'none', borderRadius:'8px', fontWeight:'700', cursor:'pointer', transition:'0.2s' },
    emptyState: { display:'flex', alignItems:'center', gap:'12px', padding:'20px', background:'rgba(255,255,255,0.02)', borderRadius:'12px', border:'1px dashed #334155' },
    sectionLabel: { fontSize:'0.75rem', color:'#64748b', fontWeight:'700', letterSpacing:'1px', marginBottom:'12px' },
    commandGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' },
    cmdBtn: { background:'#1e293b', border:'1px solid', borderRadius:'12px', padding:'16px', display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', transition:'0.2s hover', ':hover':{ background:'#334155' } },
    feedCard: { flex: 1.2, minWidth: '300px', background: '#111827', borderRadius: '16px', border: '1px solid #1f2937', padding: '24px', display:'flex', flexDirection:'column' },
    feedHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', borderBottom:'1px solid #1f2937', paddingBottom:'16px' },
    liveBadge: { fontSize:'0.65rem', fontWeight:'800', color:'#ef4444', border:'1px solid #ef4444', padding:'2px 6px', borderRadius:'4px', letterSpacing:'1px' },
    feedList: { display:'flex', flexDirection:'column', gap:'0', overflowY:'auto', maxHeight:'400px', paddingRight:'5px' },
    feedItem: { display:'flex', gap:'16px', position:'relative', paddingBottom:'24px' },
    timelineLine: { position:'absolute', left:'5px', top:'10px', bottom:'0', width:'2px', background:'#1f2937', zIndex:0 },
    feedIcon: { width:'12px', height:'12px', borderRadius:'50%', background:'#6366f1', border:'2px solid #111827', zIndex:1, flexShrink:0 },
    feedContent: { marginTop:'-4px' },
    feedMsg: { fontSize:'0.9rem', color:'#cbd5e1', margin:'0 0 4px 0', lineHeight:'1.4' },
    feedTime: { fontSize:'0.75rem', color:'#64748b' },
    noData: { textAlign:'center', color:'#475569', fontSize:'0.9rem', padding:'20px' }
};

export default Overview;





