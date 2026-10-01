import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { homePathForRole, useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login อยู่แล้ว -> ไปหน้าตาม Role
  if (session) return <Navigate to={homePathForRole(session.role)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const next = await login(username, password); // จำลองเรียก API ตรวจสอบผู้ใช้
      // RBAC: ตรวจ Role แล้วส่งไปหน้าที่ถูกต้อง
      navigate(homePathForRole(next.role), { replace: true });
    } catch {
      setError('เข้าสู่ระบบไม่สำเร็จ'); // กลับมาที่หน้า Login
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>เข้าสู่ระบบ</h1>
        <p className="muted">Project Access Control</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !username.trim() || !password}
        >
          {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}
