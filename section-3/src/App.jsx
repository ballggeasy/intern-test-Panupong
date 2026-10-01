import { Navigate, Route, Routes } from 'react-router-dom';
import { homePathForRole, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EmployeePage from './pages/EmployeePage';

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={session ? homePathForRole(session.role) : '/login'} replace />}
      />
    </Routes>
  );
}
