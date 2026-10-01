// Mock Data (ตรงกับโครงสร้าง schema ใน section-2)
// Role: 'admin' | 'employee'   Status: 'To Do' | 'Done'

export const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };
export const STATUS = { TODO: 'To Do', DONE: 'Done' };

// passwordHash = SHA-256(`${username}:${password}`) ไม่เก็บรหัสผ่านเป็น plain text
// (รหัสผ่านสำหรับทดสอบอยู่ใน README.md)
export const initialUsers = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Admin User',
    role: ROLES.ADMIN,
    passwordHash: 'c8aa900c8f62fddbdddfc8e273f954915587431e4cb8f81b68a4c0829ad5b608',
  },
  {
    id: 2,
    username: 'somchai',
    fullName: 'Somchai Jaidee',
    role: ROLES.EMPLOYEE,
    passwordHash: '8542341b206bd749c27621dd05fb2e0036944325ec0697b33d23df0cf7ff9ae8',
  },
  {
    id: 3,
    username: 'somying',
    fullName: 'Somying Rakngan',
    role: ROLES.EMPLOYEE,
    passwordHash: 'dd29179059d955a48ccd093a2ac49dd1d34a9ed34678f27e0a0b02f2971be135',
  },
];

export const initialProjects = [
  { id: 1, name: 'Website Redesign', description: 'ปรับปรุงเว็บไซต์บริษัท', createdBy: 1 },
  { id: 2, name: 'Mobile App', description: 'พัฒนาแอปมือถือเวอร์ชันแรก', createdBy: 1 },
];

export const initialTasks = [
  { id: 1, projectId: 1, title: 'ออกแบบหน้า Home', status: STATUS.TODO, assigned_to: 2, createdBy: 1 },
  { id: 2, projectId: 1, title: 'เขียน API Login', status: STATUS.DONE, assigned_to: 2, createdBy: 1 },
  { id: 3, projectId: 1, title: 'ทดสอบระบบ', status: STATUS.TODO, assigned_to: 3, createdBy: 1 },
  { id: 4, projectId: 2, title: 'ออกแบบ UI แอป', status: STATUS.TODO, assigned_to: 3, createdBy: 1 },
  { id: 5, projectId: 2, title: 'ตั้งค่า CI/CD', status: STATUS.TODO, assigned_to: null, createdBy: 1 },
];
