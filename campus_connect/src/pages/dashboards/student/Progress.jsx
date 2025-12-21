import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProgress() {
  const [engagements, setEngagements] = useState([]);
  const [selectedEng, setSelectedEng] = useState(null);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const token = localStorage.getItem("token");

  // Load engagements when the component mounts
  useEffect(() => { 
    fetchEngagements(); 
  }, []);

  const fetchEngagements = async () => {
    try {
      // Fetch all projects/internships for the logged-in student
      const res = await axios.get("/api/engagements/my", { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // 🟢 FILTER: Only show "Active" projects
      // This hides the auto-created "Semester Project" until the Admin assigns a task.
      // (Internships will always have hasTasks=true based on our backend logic)
      const activeProjects = res.data.filter(e => e.hasTasks === true);
      
      setEngagements(activeProjects);
    } catch (err) { 
      console.error("Error fetching engagements", err); 
    }
  };

  const loadTasks = async (eng) => {
    setSelectedEng(eng);
    try {
      // Fetch the weekly log/tasks for the specific selected project
      const res = await axios.get(`/api/progress/${eng._id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setWeeklyTasks(res.data);
    } catch (err) { 
      console.error("Error fetching tasks", err);
      setWeeklyTasks([]); 
    }
  };

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit summary and link for the selected week
      await axios.patch(`/api/progress/submit-work/${activeTask._id}`, {
        summary: e.target.summary.value,
        evidenceLinks: [e.target.link.value]
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Submitted! Waiting for Admin approval.");
      setActiveTask(null); // Close modal
      loadTasks(selectedEng); // Refresh the task list to show updated status
    } catch (err) { 
      alert("Submission failed. Please try again."); 
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={{ fontWeight: 800, fontSize: '28px', color: '#1e293b' }}>Progress Tracker</h2>

      <div style={styles.grid}>
        {engagements.length === 0 ? (
          <div style={{color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
            <h3>No Active Projects</h3>
            <p>Wait for your Faculty Admin to assign the first weekly task.</p>
          </div>
        ) : (
          engagements.map(eng => (
            <div key={eng._id} style={{ ...styles.card, border: selectedEng?._id === eng._id ? '2px solid #6366f1' : '1px solid #e2e8f0' }}>
              <div style={styles.cardHeader}>
                 <span style={styles.typeBadge}>{eng.type}</span>
                 <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{eng.status}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '10px 0 5px 0' }}>{eng.title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{eng.organization}</p>

              {eng.type === "PROJECT" ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Verified Progress</span>
                    <span style={{ fontWeight: 800 }}>{eng.progress || 0}%</span>
                  </div>
                  <div style={styles.progressBarBg}>
                    <div style={{ ...styles.progressBarFill, width: `${eng.progress || 0}%` }} />
                  </div>
                  <button onClick={() => loadTasks(eng)} style={styles.btnPrimary}>Manage Weekly Logs</button>
                </div>
              ) : (
                // Simple View for Internships (if needed)
                <button style={{...styles.btnPrimary, background: '#f1f5f9', color: '#475569'}}>Internship Tracking Active</button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Task Table Section (Visible only when a project is selected) */}
      {selectedEng && (
        <div style={styles.tableSection}>
          <h3 style={{ margin: 0 }}>Milestones: {selectedEng.title}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={styles.th}>WEEK</th>
                <th style={styles.th}>REQUIREMENTS</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTasks.map(w => (
                <tr key={w._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 800 }}>Week {w.weekNumber}</td>
                  <td style={{ padding: '15px' }}>{w.tasks?.join(", ")}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      ...styles.pill, 
                      background: w.reviewStatus === 'APPROVED' ? '#dcfce7' : w.reviewStatus === 'PENDING_REVIEW' ? '#fef3c7' : '#e0f2fe', 
                      color: w.reviewStatus === 'APPROVED' ? '#166534' : w.reviewStatus === 'PENDING_REVIEW' ? '#92400e' : '#0369a1'
                    }}>
                      {w.reviewStatus || "ASSIGNED"}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {/* Only show Submit button if not approved yet */}
                    {w.reviewStatus !== "APPROVED" && w.reviewStatus !== "PENDING_REVIEW" && (
                      <button onClick={() => setActiveTask(w)} style={styles.submitBtn}>Submit Work</button>
                    )}
                    {w.reviewStatus === "PENDING_REVIEW" && (
                      <span style={{fontSize: '12px', color: '#94a3b8'}}>In Review...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Modal */}
      {activeTask && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleWorkSubmit} style={styles.modal}>
            <h3>Submit Week {activeTask.weekNumber}</h3>
            <textarea name="summary" placeholder="Describe your work..." rows="4" style={styles.input} required />
            <input name="link" type="url" placeholder="Evidence Link (GitHub/Drive)" style={styles.input} required />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setActiveTask(null)} style={styles.cancelBtn}>Cancel</button>
              <button type="submit" style={styles.confirmBtn}>Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: '"Inter", sans-serif' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '30px' },
  card: { background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { fontSize: '10px', fontWeight: 800, color: '#6366f1', background: '#eef2ff', padding: '4px 8px', borderRadius: '6px' },
  progressBarBg: { width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: '#6366f1', transition: 'width 0.6s ease' },
  btnPrimary: { background: '#0f172a', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, width: '100%', marginTop: '15px' },
  tableSection: { marginTop: '40px', background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' },
  th: { padding: '15px', fontSize: '12px', color: '#64748b' },
  pill: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' },
  submitBtn: { padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: 'white', padding: '30px', borderRadius: '24px', width: '400px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' },
  cancelBtn: { flex: 1, padding: '10px', border:'1px solid #ccc', background:'white', borderRadius: '8px', cursor:'pointer' },
  confirmBtn: { flex: 1, padding: '10px', background: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700, cursor:'pointer' }
};