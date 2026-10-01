const express = require('express');
const router = express.Router();
const db = require('../db');
// สมมติว่ามี middleware ที่ตรวจ JWT/Session แล้วใส่ req.user = { id, role } ให้
// (ข้อมูลมาจาก token ที่ Server ตรวจแล้ว ไม่ใช่จาก body ที่ Client ส่งมา)
const { authenticate } = require('../middleware/auth');

// PATCH /api/tasks/:id/status
// Body: { newStatus: "Done" }
// ไม่รับ userId / userRole จาก body อีกต่อไป
router.patch('/api/tasks/:id/status', authenticate, async (req, res) => {
  // [แก้ข้อ 1] ตัวตนและ Role มาจาก token ที่ผ่าน authenticate เท่านั้น
  // เดิมอ่านจาก req.body ซึ่ง Client ปลอมได้ เช่น ส่ง userRole: "admin"
  const { id: userId, role: userRole } = req.user;
  const { newStatus } = req.body;

  // [แก้ข้อ 2] ตรวจว่า id เป็นตัวเลขก่อนใช้ใน query
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  const taskId = Number(req.params.id);

  try {
    // [แก้ข้อ 2] ใช้ Parameterized Query ($1) แทนการต่อสตริง ป้องกัน SQL Injection
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = result.rows[0];

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // [แก้ข้อ 4] ตรวจสิทธิ์ด้วย === (strict) แทน ==
    // เดิม null == undefined เป็น true: Task ที่ยังไม่ถูกมอบหมาย (assigned_to = NULL)
    // ถ้า Client ไม่ส่ง userId จะผ่านการตรวจ และ '5' == 5 ก็ถูกแปลงชนิดให้เท่ากัน
    const isAdmin = userRole === 'admin';
    const isOwner = task.assigned_to !== null && task.assigned_to === userId;

    if (isAdmin || isOwner) {
      // 3) อัปเดตสถานะ
      // [ยังไม่แก้ข้อ 3] newStatus ยังถูกต่อเข้า SQL ตรงๆ (SQL Injection)
      // [ยังไม่แก้ข้อ 7] ยังไม่ตรวจค่า newStatus และ flow To Do -> Done
      // [ยังไม่แก้ข้อ 9] SELECT กับ UPDATE ยังแยกกัน (race condition)
      await db.query(
        `UPDATE tasks SET status = '${newStatus}' WHERE id = ${taskId}`
      );

      // [ยังไม่แก้ข้อ 8] task ที่ส่งกลับยังเป็นข้อมูลก่อนอัปเดต (status เก่า)
      return res.status(200).json({
        message: 'Status updated successfully',
        task: task,
        // [แก้ข้อ 5] ไม่สะท้อน password ที่ Client ส่งมาอีก
        updatedBy: { id: userId, role: userRole },
      });
    } else {
      return res.status(403).json({ message: 'No permission to edit this task' });
    }
  } catch (err) {
    // [แก้ข้อ 6] log รายละเอียดฝั่ง Server และตอบ Client แบบทั่วไป
    // เดิมส่ง err.message กลับไป เปิดเผยโครงสร้าง DB / SQL
    console.error('PATCH /api/tasks/:id/status failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
