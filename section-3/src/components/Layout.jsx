import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ title, children }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          <span className="muted">
            {session.fullName} · Role: <span className={`badge badge-${session.role}`}>{session.role}</span> · User ID: {session.userId}
          </span>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}
