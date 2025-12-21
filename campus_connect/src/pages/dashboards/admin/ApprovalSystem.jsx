import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle, XCircle, Clock, ExternalLink, 
  Send, FileText, Info, User, Megaphone
} from 'lucide-react';

const ApprovalSystem = () => {
  // State Management
  const [pendingLogs, setPendingLogs] = useState([]);
  const [allStudents, setAllStudents] = useState([]); 
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAll, setIsAll] = useState(false);
  
  // Task Assignment State
  const [newTask, setNewTask] = useState({ 
    weekNumber: '', deliverables: '', engagementId: '', studentId: '', studentName: '' 
  });
  
  const token = localStorage.getItem('token');
  
  // 🟢 IMPORTANT: Backend Base URL (Ensure this matches your backend port)
  const API_URL = "http://localhost:8080/api"; 

  // Initial Data Fetch
  useEffect(() => {
    fetchPendingData();
    fetchAllStudents();
  }, []);

  // 1. Fetch Pending Approvals (Review Queue)
  const fetchPendingData = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending-approvals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLogs(res.data);
    } catch (err) { 
      console.error("Error fetching approvals", err); 
    }
  };

  // 2. Fetch All Registered Students (Sidebar List)
  const fetchAllStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/all-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllStudents(res.data);
    } catch (err) { 
      console.error("Error fetching all students", err); 
    }
  };

  // 3. Handle Review (Approve/Reject)
  const handleReview = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/admin/review-log/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Log ${status} successfully!`);
      setSelectedLog(null); // Clear selection
      fetchPendingData(); // Refresh queue
    } catch (err) { 
      alert("Action failed. Please try again."); 
    }
  };

  // 4. Handle Task Assignment (Individual or Broadcast)
  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/progress/assign-task`, {
        studentId: newTask.studentId, 
        weekNumber: newTask.weekNumber, 
        tasks: newTask.deliverables, // Sends string directly (backend handles split)
        isAll: isAll
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert(isAll ? "Task broadcasted to all students!" : "Milestone assigned successfully!");
      setShowAssignModal(false);
      // Reset Form
      setNewTask({ weekNumber: '', deliverables: '', engagementId: '', studentId: '', studentName: '' });
    } catch (err) { 
      alert("Assignment failed. Ensure all fields are valid."); 
    }
  };

  // Helper: Open Modal for Individual Student
  const openAssignModal = (student) => {
    setIsAll(false);
    setNewTask({ ...newTask, studentId: student._id, studentName: student.name, weekNumber: '1', deliverables: '' });
    setShowAssignModal(true);
  };

  // Helper: Open Modal for Broadcast
  const openBroadcastModal = () => {
    setIsAll(true);
    setNewTask({ ...newTask, studentName: 'ALL ACTIVE STUDENTS', weekNumber: '1', deliverables: '' });
    setShowAssignModal(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainGrid}>
        
        {/* LEFT SIDEBAR */}
        <div style={styles.sidebar}>
          {/* Broadcast Button */}
          <button onClick={openBroadcastModal} style={styles.broadcastBtn}>
            <Megaphone size={16} /> Broadcast to All
          </button>

          {/* Review Queue Card */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}><Clock size={16} color="#f59e0b" /> Review Queue ({pendingLogs.length})</h3>
            <div style={styles.listContainer}>
              {pendingLogs.length === 0 ? (
                <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px'}}>All caught up!</p>
              ) : (
                pendingLogs.map((log) => (
                  <div key={log._id} onClick={() => setSelectedLog(log)} style={{...styles.listItem, backgroundColor: selectedLog?._id === log._id ? '#f5f3ff' : 'white', borderColor: selectedLog?._id === log._id ? '#6366f1' : '#f1f5f9'}}>
                    <span style={styles.weekTag}>Week {log.weekNumber}</span>
                    <p style={styles.listName}>{log.studentName}</p>
                    <p style={{fontSize: '10px', color: '#64748b', margin: 0}}>{log.projectTitle}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Registered Students Card */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}><User size={16} color="#64748b" /> Registered Students</h3>
            <div style={styles.listContainer}>
              {allStudents.map((student) => (
                <div key={student._id} style={styles.studentItem}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <p style={styles.listName}>{student.name}</p>
                    <p style={styles.listProject}>{student.branch} - {student.year}</p>
                  </div>
                  <button onClick={() => openAssignModal(student)} style={styles.miniAssignBtn}>
                    <Send size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT DETAIL VIEW */}
        <div style={styles.detailContainer}>
          {selectedLog ? (
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div>
                  <h2 style={styles.detailTitle}>Reviewing Week {selectedLog.weekNumber}</h2>
                  <p style={styles.detailSubtitle}>{selectedLog.studentName}</p>
                </div>
                {selectedLog.evidenceLinks && selectedLog.evidenceLinks.length > 0 && (
                  <a href={selectedLog.evidenceLinks[0]} target="_blank" rel="noreferrer" style={styles.iconLink}>
                    <ExternalLink size={18} /> Open Evidence
                  </a>
                )}
              </div>
              
              <div style={styles.detailBody}>
                <div style={styles.summaryBox}>
                   <h4 style={styles.boxLabel}><Info size={14} /> Submission Summary</h4>
                   <p style={styles.summaryText}>"{selectedLog.summary}"</p>
                </div>
                
                <div style={{marginTop: '20px'}}>
                  <h4 style={styles.boxLabel}>Assigned Tasks</h4>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {selectedLog.tasks.map((task, i) => (
                      <span key={i} style={{background: 'white', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569'}}>{task}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.detailFooter}>
                <button onClick={() => handleReview(selectedLog._id, 'APPROVED')} style={styles.approveBtn}>
                  <CheckCircle size={18} /> Approve Submission
                </button>
                <button onClick={() => handleReview(selectedLog._id, 'REJECTED')} style={styles.rejectBtn}>
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.emptyDetail}>
              <FileText size={48} color="#e2e8f0" />
              <p style={{marginTop: '15px', fontWeight: 600, color: '#94a3b8'}}>Select a log from the queue to review</p>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {showAssignModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>{isAll ? "Broadcast Milestone" : "Assign Milestone"}</h3>
            <p style={{fontSize: '13px', color: '#6366f1', fontWeight: 'bold', marginBottom: '20px'}}>Target: {newTask.studentName}</p>
            <form onSubmit={handleAssignTask} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#64748b'}}>Week Number</label>
                <input type="number" value={newTask.weekNumber} onChange={(e) => setNewTask({...newTask, weekNumber: e.target.value})} style={styles.input} required placeholder="e.g. 1" />
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#64748b'}}>Deliverables (Comma Separated)</label>
                <textarea rows="4" value={newTask.deliverables} placeholder="e.g. Frontend Setup, API Integration" onChange={(e) => setNewTask({...newTask, deliverables: e.target.value})} style={styles.input} required />
              </div>

              <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button type="button" onClick={() => setShowAssignModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>{isAll ? "Broadcast Task" : "Assign Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles Object
const styles = {
  container: { display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' },
  mainGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
  broadcastBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' },
  sideCard: { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', display: 'flex', flexDirection: 'column', maxHeight: '450px' },
  sideTitle: { fontSize: '13px', fontWeight: '800', color: '#0f172a', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
  listItem: { padding: '12px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #f1f5f9', transition: 'all 0.2s' },
  weekTag: { fontSize: '9px', fontWeight: '900', color: '#4f46e5', backgroundColor: '#f5f3ff', padding: '2px 6px', borderRadius: '4px' },
  listName: { fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' },
  listProject: { fontSize: '11px', color: '#94a3b8', margin: 0 },
  studentItem: { display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
  miniAssignBtn: { padding: '8px', backgroundColor: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' },
  
  detailContainer: { backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', minHeight: '600px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  detailCard: { display: 'flex', flexDirection: 'column', height: '100%' },
  detailHeader: { padding: '30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  detailSubtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  iconLink: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: '#475569', fontWeight: '600', border: '1px solid #e2e8f0', fontSize: '13px' },
  
  detailBody: { padding: '30px', flex: 1 },
  summaryBox: { backgroundColor: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9' },
  boxLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' },
  summaryText: { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: 0 },
  
  detailFooter: { padding: '30px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '15px' },
  approveBtn: { flex: 1, backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  rejectBtn: { flex: 0.4, backgroundColor: 'white', color: '#dc2626', border: '2px solid #fee2e2', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  
  emptyDetail: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modalContent: { backgroundColor: 'white', width: '450px', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 5px 0' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '14px' },
  confirmBtn: { flex: 1, backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { flex: 1, backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#64748b', padding: '12px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }
};

export default ApprovalSystem;