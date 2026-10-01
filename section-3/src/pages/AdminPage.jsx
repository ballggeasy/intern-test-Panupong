import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../api/mockApi';
import { STATUS } from '../data/mockData';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { session } = useAuth();
  const actorId = session.token; // ส่ง token ให้ "Server" ระบุตัวตน (ไม่ส่ง userId/Role)
  const location = useLocation();
  const denied = location.state?.denied;

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', assignedTo: '' });

  const loadAll = useCallback(async () => {
    try {
      const [t, p, e] = await Promise.all([
        api.getTasks(actorId), // Admin: ดู Task ทั้งหมด
        api.getProjects(actorId),
        api.getEmployees(actorId),
      ]);
      setTasks(t);
      setProjects(p);
      setEmployees(e);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, [actorId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const run = async (action, successText) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      await loadAll();
      setMessage({ type: 'success', text: successText });
      return true;
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const ok = await run(() => api.createProject(actorId, projectForm), 'สร้าง Project สำเร็จ');
    if (ok) setProjectForm({ name: '', description: '' });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const ok = await run(
      () =>
        api.createTask(actorId, {
          title: taskForm.title,
          projectId: Number(taskForm.projectId),
          assignedTo: taskForm.assignedTo ? Number(taskForm.assignedTo) : null,
        }),
      'สร้าง Task สำเร็จ'
    );
    if (ok) setTaskForm((f) => ({ ...f, title: '', assignedTo: '' }));
  };

  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? '-';

  return (
    <Layout title="หน้า Admin (/admin)">
      {denied && <div className="alert alert-error">{denied}</div>}
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="grid-2">
        <form className="card" onSubmit={handleCreateProject}>
          <h2>สร้าง Project ใหม่</h2>
          <label htmlFor="pname">ชื่อ Project</label>
          <input
            id="pname"
            value={projectForm.name}
            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
            disabled={busy}
          />
          <label htmlFor="pdesc">รายละเอียด</label>
          <input
            id="pdesc"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            disabled={busy}
          />
          <button className="btn btn-primary" disabled={busy || !projectForm.name.trim()}>
            สร้าง Project
          </button>
        </form>

        <form className="card" onSubmit={handleCreateTask}>
          <h2>สร้าง Task ใหม่</h2>
          <label htmlFor="ttitle">ชื่อ Task</label>
          <input
            id="ttitle"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            disabled={busy}
          />
          <label htmlFor="tproject">Project</label>
          <select
            id="tproject"
            value={taskForm.projectId}
            onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
            disabled={busy}
          >
            <option value="">-- เลือก Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <label htmlFor="tassign">มอบหมายให้ (assigned_to)</label>
          <select
            id="tassign"
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            disabled={busy}
          >
            <option value="">-- ยังไม่มอบหมาย --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            disabled={busy || !taskForm.title.trim() || !taskForm.projectId}
          >
            สร้าง Task
          </button>
        </form>
      </div>

      <section className="card">
        <h2>Task ทั้งหมดในระบบ ({tasks.length})</h2>
        {loading ? (
          <p className="muted">กำลังโหลด...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ชื่อ Task</th>
                  <th>Project</th>
                  <th>ผู้รับผิดชอบ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{projectName(t.projectId)}</td>
                    <td>
                      <select
                        aria-label={`มอบหมาย Task ${t.id}`}
                        value={t.assigned_to ?? ''}
                        disabled={busy}
                        onChange={(e) =>
                          run(
                            () =>
                              api.assignTask(
                                actorId,
                                t.id,
                                e.target.value ? Number(e.target.value) : null
                              ),
                            `มอบหมาย Task #${t.id} สำเร็จ`
                          )
                        }
                      >
                        <option value="">-- ยังไม่มอบหมาย --</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.fullName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        aria-label={`สถานะ Task ${t.id}`}
                        value={t.status}
                        disabled={busy}
                        onChange={(e) =>
                          run(
                            () => api.updateTaskStatus(actorId, t.id, e.target.value),
                            `แก้ไขสถานะ Task #${t.id} สำเร็จ`
                          )
                        }
                      >
                        {Object.values(STATUS).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
