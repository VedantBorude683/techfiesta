import React, { useEffect, useState } from 'react';
import { Download, PieChart, BarChart, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';

const AnalyticsView = () => {
  const [animate, setAnimate] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const chartData = [40, 70, 45, 90, 65, 80, 50];

  return (
    <div style={styles.container}>
      {/* 1. HERO CARD WITH AMBIENT GLOW */}
      <div style={styles.heroCard}>
        <div style={styles.heroContent}>
          <div style={styles.liveBadge}>
            <span style={styles.pulseDot}></span> LIVE ANALYTICS
          </div>
          <h2 style={styles.heroTitle}>Institution Performance</h2>
          <p style={styles.heroSubtitle}>Real-time placement tracking and engagement velocity metrics.</p>
        </div>
        <button style={styles.exportBtn}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div style={styles.grid}>
        {/* 2. ANIMATED BAR CHART */}
        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Application Trends</h3>
            <div style={styles.iconBox}><BarChart size={18} color="#4f46e5" /></div>
          </div>
          
          <div style={styles.barContainer}>
            {chartData.map((h, i) => (
              <div key={i} style={styles.barWrapper}>
                <div 
                  style={{ 
                    ...styles.bar, 
                    height: animate ? `${h}%` : '0%', // Grow Animation
                    transition: `height 1s cubic-bezier(0.17, 0.67, 0.83, 0.67) ${i * 0.1}s` 
                  }}
                >
                  <div style={styles.barGlow}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.labelRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <span key={i} style={styles.chartLabel}>{day}</span>
            ))}
          </div>
        </div>

        {/* 3. SMOOTH PROGRESS TRACKER */}
        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Placement Success</h3>
            <div style={styles.iconBox}><PieChart size={18} color="#059669" /></div>
          </div>
          
          <div style={styles.progressList}>
            {[
              { label: 'Engaged Students', val: 85, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Pending Placements', val: 15, color: '#f59e0b', bg: '#fffbeb' }
            ].map((item, i) => (
              <div key={i} style={styles.progressItem}>
                <div style={styles.progressInfo}>
                  <span style={styles.progressLabel}>{item.label}</span>
                  <span style={{ ...styles.progressValue, color: item.color }}>{animate ? item.val : 0}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ 
                    ...styles.progressBarFill, 
                    width: animate ? `${item.val}%` : '0%', 
                    backgroundColor: item.color,
                    transition: 'width 1.5s ease-out 0.5s'
                  }}></div>
                </div>
              </div>
            ))}

            <div style={styles.insightBox}>
              <div style={styles.zapCircle}><Zap size={14} color="white" fill="white" /></div>
              <span style={styles.insightText}>Growth velocity increased by 12.4% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* INJECTING ANIMATIONS */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .bar-hover:hover {
          filter: brightness(1.2);
          transform: scaleX(1.1);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease' },
  
  heroCard: { 
    padding: '35px', backgroundColor: 'white', borderRadius: '28px', border: '1px solid #f1f5f9', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden'
  },
  liveBadge: { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', 
    backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '20px', fontSize: '10px', fontWeight: '800', marginBottom: '12px' 
  },
  pulseDot: { width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  heroTitle: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' },
  heroSubtitle: { fontSize: '15px', color: '#64748b', marginTop: '6px', fontWeight: '500' },
  exportBtn: { padding: '12px 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' },
  
  chartCard: { backgroundColor: 'white', padding: '30px', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  cardTitle: { fontSize: '17px', fontWeight: '800', color: '#1e293b', margin: 0 },
  iconBox: { width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' },

  barContainer: { height: '200px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '0 10px' },
  barWrapper: { flex: 1, backgroundColor: '#f8fafc', borderRadius: '8px', height: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' },
  bar: { width: '100%', backgroundColor: '#4f46e5', borderRadius: '8px 8px 4px 4px', position: 'relative', overflow: 'hidden' },
  barGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' },
  
  labelRow: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '0 10px' },
  chartLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8' },
  
  progressList: { display: 'flex', flexDirection: 'column', gap: '30px' },
  progressItem: { display: 'flex', flexDirection: 'column', gap: '10px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: '14px', fontWeight: '700', color: '#475569' },
  progressValue: { fontSize: '14px', fontWeight: '900' },
  progressBarBg: { height: '10px', backgroundColor: '#f1f5f9', borderRadius: '20px', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '20px' },
  
  insightBox: { marginTop: '10px', padding: '18px', backgroundColor: '#4f46e5', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)' },
  zapCircle: { width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  insightText: { fontSize: '12px', fontWeight: '700', color: 'white' }
};

export default AnalyticsView;