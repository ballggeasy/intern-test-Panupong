import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../api/mockApi';
import { STATUS } from '../data/mockData';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function EmployeePage() {
  const { session } = useAuth();
  const { userId, token } = session;
  const location = useLocation();
  const denied = location.state?.denied;

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      // "Server" กรอง assigned_to === userId ให้ (ดู mockApi.getTasks)
      const [t, p] = await Promise.all([api.getTasks(token), api.getProjects(token)]);
      setTasks(t);
      setProjects(p);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDone = async (task) => {
    // ตรวจที่ UI อีกชั้น: Task.assigned_to === CurrentUser.id (Server ตรวจซ้ำเสมอ)
    if (task.assigned_to !== userId) {
      setMessage({ type: 'error', text: 'ไม่มีสิทธิ์แก้ไข Task ของ Employee คนอื่น' });
      return;
    }
    setBusyId(task.id);
    setMessage(null);
    try {
      await api.updateTaskStatus(token, task.id, STATUS.DONE);
      await load();
      setMessage({ type: 'success', text: `เปลี่ยนสถานะ Task #${task.id} เป็น Done แล้ว` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? '-';

  return (
    <Layout title="หน้า Employee (/employee)">
      {denied && <div className="alert alert-error">{denied}</div>}
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <section className="card">
        <h2>Task ที่ได้รับมอบหมาย ({tasks.length})</h2>
        {loading ? (
          <p className="muted">กำลังโหลด...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">ยังไม่มี Task ที่ได้รับมอบหมาย</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ชื่อ Task</th>
                  <th>Project</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{projectName(t.projectId)}</td>
                    <td>
                      <span className={`status status-${t.status === STATUS.DONE ? 'done' : 'todo'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={t.status === STATUS.DONE || busyId === t.id}
                        onClick={() => handleDone(t)}
                      >
                        {busyId === t.id ? 'กำลังบันทึก...' : 'เปลี่ยนสถานะเป็น Done'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
