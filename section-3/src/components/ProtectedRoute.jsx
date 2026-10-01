import { Navigate, useLocation } from 'react-router-dom';
import { homePathForRole, useAuth } from '../context/AuthContext';

// RBAC Guard: ตรวจ Role ก่อนอนุญาตให้เข้าหน้า /admin หรือ /employee
export default function ProtectedRoute({ allowedRole, children }) {
  const { session } = useAuth();
  const location = useLocation();

  // ยังไม่ได้ Login -> กลับหน้า Login
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  // Role ไม่ตรง -> ปฏิเสธ (Unauthorized) และ Redirect ไปหน้าของ Role ตนเอง
  if (session.role !== allowedRole) {
    return (
      <Navigate
        to={homePathForRole(session.role)}
        replace
        state={{ denied: `ไม่มีสิทธิ์เข้าถึง ${location.pathname} (Unauthorized)` }}
      />
    );
  }

  return children;
}
