import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as api from '../api/mockApi';

const SESSION_KEY = 'pac_session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    // token ต้องยังใช้ได้ฝั่ง "Server" ไม่งั้นถือว่าไม่ได้ Login
    return api.isTokenValid(stored?.token) ? stored : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Session เก็บ token + userId + Role ตาม flowchart
  // (Role ใช้ตัดสิน UI/Route เท่านั้น; Server ตรวจสิทธิ์จาก token ทุกครั้ง)
  const [session, setSession] = useState(readSession);

  const login = useCallback(async (username, password) => {
    const { token, user } = await api.login(username, password); // จำลองเรียก API (หน่วงเวลา)
    const next = { token, userId: user.id, role: user.role, fullName: user.fullName };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(async () => {
    // ล้างข้อมูล Session/Login ทั้งฝั่ง Client และยกเลิก token ฝั่ง "Server"
    const token = session?.token;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
    await api.logout(token);
  }, [session]);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth ต้องใช้ภายใน AuthProvider');
  return ctx;
}

export const homePathForRole = (role) => (role === 'admin' ? '/admin' : '/employee');
