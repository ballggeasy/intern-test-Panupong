-- Project Access Control : Database Schema (PostgreSQL)
-- ออกแบบตาม flowchart ใน section-1 (Admin / Employee, RBAC, assigned_to)
-- หมายเหตุ: Web App ใน section-3 ใช้ Mock Data เท่านั้น ไฟล์นี้เป็นแบบร่างฐานข้อมูลจริง

-- 1) roles : เก็บ Role แยกออกจาก users (ลด data ซ้ำ / เพิ่ม Role ใหม่ได้โดยไม่ต้องแก้ schema)
CREATE TABLE roles (
    id    SMALLINT    PRIMARY KEY,
    name  VARCHAR(20) NOT NULL UNIQUE          -- 'admin' | 'employee'
);

-- 2) users : ผู้ใช้งาน (Login ด้วย username ตาม flowchart)
CREATE TABLE users (
    id          SERIAL       PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    full_name   VARCHAR(100) NOT NULL,
    role_id     SMALLINT     NOT NULL REFERENCES roles(id),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3) projects : โปรเจกต์ (Admin เป็นผู้สร้าง)
CREATE TABLE projects (
    id           SERIAL       PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    description  TEXT,
    created_by   INTEGER      NOT NULL REFERENCES users(id),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 4) tasks : งานใน Project, assigned_to คือคอลัมน์ที่ใช้ตรวจสิทธิ์
--    (Task.assigned_to === CurrentUser.id)
CREATE TABLE tasks (
    id           SERIAL       PRIMARY KEY,
    project_id   INTEGER      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    status       VARCHAR(10)  NOT NULL DEFAULT 'To Do'
                 CHECK (status IN ('To Do', 'Done')),
    assigned_to  INTEGER      REFERENCES users(id) ON DELETE SET NULL,  -- NULL = ยังไม่มอบหมาย
    created_by   INTEGER      NOT NULL REFERENCES users(id),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Index รองรับ query หลักของ flowchart
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);  -- Employee: กรอง assigned_to = :userId
CREATE INDEX idx_tasks_project_id  ON tasks(project_id);   -- Admin: ดู Task แยกตาม Project

-- ---------------------------------------------------------------
-- Seed data (ตรงกับ Mock Data ที่ใช้ใน section-3)
-- ---------------------------------------------------------------
INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'employee');

INSERT INTO users (username, full_name, role_id) VALUES
    ('admin',  'Admin User',     1),
    ('somchai', 'Somchai Jaidee', 2),
    ('somying', 'Somying Rakngan', 2);

INSERT INTO projects (name, description, created_by) VALUES
    ('Website Redesign', 'ปรับปรุงเว็บไซต์บริษัท', 1);

INSERT INTO tasks (project_id, title, status, assigned_to, created_by) VALUES
    (1, 'ออกแบบหน้า Home',  'To Do', 2, 1),
    (1, 'เขียน API Login',   'Done',  2, 1),
    (1, 'ทดสอบระบบ',         'To Do', 3, 1);

-- ---------------------------------------------------------------
-- Query ตามจุดตัดสินใจใน flowchart
-- ---------------------------------------------------------------
-- Admin: ดู Task ทั้งหมด
--   SELECT * FROM tasks;
-- Employee: ดูเฉพาะ Task ของตนเอง (assigned_to === userId)
--   SELECT * FROM tasks WHERE assigned_to = :userId;
-- Employee: เปลี่ยนสถานะ (ตรวจ Task.assigned_to === CurrentUser.id ใน WHERE เลย)
--   UPDATE tasks SET status = 'Done', updated_at = now()
--   WHERE id = :taskId AND assigned_to = :userId;   -- 0 row = ปฏิเสธ (403)
-- Admin: เปลี่ยนสถานะ Task ใดก็ได้
--   UPDATE tasks SET status = :newStatus, updated_at = now() WHERE id = :taskId;
