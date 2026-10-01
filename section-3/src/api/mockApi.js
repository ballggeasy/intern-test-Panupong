// Mock API: จำลองการเรียก API ด้วย Promise + setTimeout
//
// RBAC ฝั่ง "Server":
//  - Login ด้วย username + password แล้วได้ token (เก็บ token -> userId ในฝั่ง "Server")
//  - ทุก API รับเฉพาะ token แล้วค้นหาผู้เรียกและ Role จาก "ฐานข้อมูล" เอง
//    ไม่เชื่อ userId/Role ที่ Client ส่งมา จึงปลอมตัวเป็นคนอื่นไม่ได้
//  - ตรวจสิทธิ์ซ้ำทุกครั้ง (Admin ทำได้ทุกอย่าง, Employee ได้เฉพาะ assigned_to === userId)
import {
  ROLES,
  STATUS,
  initialUsers,
  initialProjects,
  initialTasks,
} from '../data/mockData';

const DB_KEY = 'pac_mock_db_v2';
const DEFAULT_DELAY = 600;
const LOGIN_DELAY = 900;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const delay = (ms = DEFAULT_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- "Database" (เก็บใน sessionStorage เพื่อให้ Refresh แล้วข้อมูลไม่หาย) ----------
function loadDb() {
  try {
    const raw = sessionStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ใช้ค่าเริ่มต้น */
  }
  return {
    users: structuredClone(initialUsers),
    projects: structuredClone(initialProjects),
    tasks: structuredClone(initialTasks),
    sessions: {}, // token -> userId
  };
}

let db = loadDb();

function saveDb() {
  try {
    sessionStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* ไม่เป็นไร ข้อมูลยังอยู่ในหน่วยความจำ */
  }
}

const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
const copy = (value) => structuredClone(value);

// ไม่ส่ง passwordHash กลับไปให้ Client
const publicUser = ({ id, username, fullName, role }) => ({ id, username, fullName, role });

async function hashPassword(username, password) {
  const data = new TextEncoder().encode(`${username}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------- RBAC helpers ----------
function getActor(token) {
  const userId = token ? db.sessions[token] : undefined;
  const actor = db.users.find((u) => u.id === userId);
  if (!actor) throw new ApiError(401, 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
  return actor;
}

function requireAdmin(token) {
  const actor = getActor(token);
  if (actor.role !== ROLES.ADMIN) throw new ApiError(403, 'เฉพาะ Admin เท่านั้น');
  return actor;
}

function assertEmployee(userId) {
  const target = db.users.find((u) => u.id === userId);
  if (!target || target.role !== ROLES.EMPLOYEE) {
    throw new ApiError(400, 'มอบหมายงานได้เฉพาะ Employee');
  }
}

// ---------- Auth ----------
export async function login(username, password) {
  await delay(LOGIN_DELAY);
  const name = String(username ?? '').trim().toLowerCase();
  const user = db.users.find((u) => u.username === name);
  const hash = await hashPassword(name, String(password ?? ''));
  // ข้อความ error เดียวกันทั้ง "ไม่พบผู้ใช้" และ "รหัสผ่านผิด" (ไม่บอกใบ้ว่า username มีอยู่จริงไหม)
  if (!user || user.passwordHash !== hash) throw new ApiError(401, 'เข้าสู่ระบบไม่สำเร็จ');

  const token = newToken();
  db.sessions[token] = user.id;
  saveDb();
  return { token, user: publicUser(user) };
}

export async function logout(token) {
  if (token && db.sessions[token] !== undefined) {
    delete db.sessions[token];
    saveDb();
  }
}

// ตรวจว่า token ยังใช้ได้ไหม (ใช้ตอน Refresh หน้า)
export function isTokenValid(token) {
  return Boolean(token && db.sessions[token] !== undefined);
}

// ---------- Queries ----------
export async function getTasks(token) {
  await delay();
  const actor = getActor(token);
  if (actor.role === ROLES.ADMIN) return copy(db.tasks); // Admin: ดูทั้งหมด
  return copy(db.tasks.filter((t) => t.assigned_to === actor.id)); // Employee: assigned_to === userId
}

export async function getProjects(token) {
  await delay(300);
  getActor(token);
  return copy(db.projects);
}

export async function getEmployees(token) {
  await delay(300);
  requireAdmin(token);
  return db.users.filter((u) => u.role === ROLES.EMPLOYEE).map(publicUser);
}

// ---------- Commands ----------
export async function createProject(token, { name, description }) {
  await delay();
  const actor = requireAdmin(token);
  if (!name?.trim()) throw new ApiError(400, 'กรุณากรอกชื่อ Project');
  const project = {
    id: nextId(db.projects),
    name: name.trim(),
    description: description?.trim() ?? '',
    createdBy: actor.id,
  };
  db.projects.push(project);
  saveDb();
  return copy(project);
}

export async function createTask(token, { projectId, title, assignedTo }) {
  await delay();
  const actor = requireAdmin(token);
  if (!title?.trim()) throw new ApiError(400, 'กรุณากรอกชื่อ Task');
  if (!db.projects.some((p) => p.id === projectId)) throw new ApiError(400, 'ไม่พบ Project');
  if (assignedTo != null) assertEmployee(assignedTo);
  const task = {
    id: nextId(db.tasks),
    projectId,
    title: title.trim(),
    status: STATUS.TODO,
    assigned_to: assignedTo ?? null,
    createdBy: actor.id,
  };
  db.tasks.push(task);
  saveDb();
  return copy(task);
}

export async function assignTask(token, taskId, assignedTo) {
  await delay();
  requireAdmin(token);
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) throw new ApiError(404, 'ไม่พบ Task');
  if (assignedTo != null) assertEmployee(assignedTo);
  task.assigned_to = assignedTo ?? null;
  saveDb();
  return copy(task);
}

export async function updateTaskStatus(token, taskId, newStatus) {
  await delay();
  const actor = getActor(token);
  if (!Object.values(STATUS).includes(newStatus)) throw new ApiError(400, 'สถานะไม่ถูกต้อง');

  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) throw new ApiError(404, 'ไม่พบ Task');

  if (actor.role === ROLES.EMPLOYEE) {
    // RBAC: Task.assigned_to === CurrentUser.id
    if (task.assigned_to !== actor.id) {
      throw new ApiError(403, 'ไม่มีสิทธิ์เข้าถึงหรือแก้ไข Task ของ Employee คนอื่น');
    }
    // Employee เปลี่ยนได้เฉพาะ To Do -> Done
    if (!(task.status === STATUS.TODO && newStatus === STATUS.DONE)) {
      throw new ApiError(400, 'Employee เปลี่ยนสถานะได้เฉพาะจาก To Do เป็น Done');
    }
  }
  // Admin แก้สถานะของ Task ใดก็ได้

  task.status = newStatus;
  saveDb();
  return copy(task);
}
