# แบบทดสอบคัดเลือกนักศึกษาฝึกงาน
## ตำแหน่ง: Software Developer / Web Programmer

---

## รายละเอียดการทดสอบ
- **เวลาในการทำแบบทดสอบ:** 3 ชั่วโมง
- **คะแนนรวม:** 100 คะแนน
- **เครื่องมือ:** อนุญาตให้ใช้ AI (เช่น ChatGPT, Gemini, GitHub Copilot) ได้ในทุกขั้นตอน 100%
- **การส่งงาน:** ให้สร้าง Public Repository บน GitHub/GitLab พร้อมอัปโหลด Source Code ทั้งหมด และแนบลิงก์ส่งเมื่อหมดเวลา

> ⚠️ **หมายเหตุสำคัญ:** แม้จะใช้ AI ได้ 100% แต่คุณต้องเข้าใจสิ่งที่ตัวเองส่งมา เพราะจะมีการสัมภาษณ์เปิดโค้ดถามเชิงลึกในส่วนที่ 5

---

# ส่วนที่ 1: System Design & AI Prompting (20 คะแนน)

**ทักษะที่ประเมิน:** การคิดอย่างเป็นระบบ, การครอบคลุม Edge Case และทักษะการสั่งงาน AI (Prompt Engineering)

## โจทย์
ให้ออกแบบระบบ **"จัดการสิทธิ์การเข้าถึงข้อมูลโครงการ (Project Access Control)"** โดยมี Business Logic ดังนี้:
- **Admin:** สามารถสร้างโปรเจกต์ใหม่และมอบหมายงาน (Assign) ให้กับพนักงานทุกคนได้
- **Employee:** สามารถมองเห็นและแก้ไขสถานะได้เฉพาะงาน (Task) ที่ตนเองได้รับมอบหมายเท่านั้น

## สิ่งที่ต้องส่งมอบ
1. **Flowchart:** ไฟล์รูปภาพ (หรือลิงก์จากเครื่องมือเช่น Mermaid.js, Excalidraw, Draw.io) แสดง Flow การทำงานของระบบ
2. **AI Prompts:** คัดลอก Prompt (คำสั่ง) ที่คุณใช้สั่ง AI ในการช่วยคิดหรือออกแบบระบบในข้อนี้ พร้อมอธิบายสั้นๆ ว่าทำไมถึงสั่งแบบนั้น

> เก็บไฟล์ในโฟลเดอร์ `section-1/` ของ Repository

---

# ส่วนที่ 2: Tech Stack Justification & Database Design (15 คะแนน)

**ทักษะที่ประเมิน:** ความเข้าใจในเครื่องมือที่เลือกใช้ และหลักการออกแบบฐานข้อมูล (Normalization)

## โจทย์
ออกแบบโครงสร้างฐานข้อมูลเบื้องต้นที่สามารถรองรับระบบ Role-based (Admin / Employee) ตามโจทย์ในข้อที่ 1

## สิ่งที่ต้องส่งมอบ (ใส่ไว้ในไฟล์ `README.md` และไฟล์ schema database)
1. **Tech Stack:** อธิบายสั้นๆ ว่าในส่วนของ Web Implementation (ข้อ 3) คุณเลือกใช้ภาษา Framework หรือ Library อะไรบ้าง และ **เหตุผลที่เลือกใช้** เครื่องมือเหล่านั้นเหมาะสมกับงานนี้อย่างไร

2. **Database Schema:** ออกแบบโครงสร้าง Table อย่างน้อย **3 Table** (เช่น Users, Projects, Tasks) โดยสามารถเขียนเป็นข้อความธรรมดา (เช่น ชื่อฟิลด์ ชนิดข้อมูล) หรือวาดเป็น ER Diagram ก็ได้ พร้อมระบุความสัมพันธ์ (Relationship) ให้ชัดเจน

> เก็บไฟล์ในโฟลเดอร์ `section-2/` ของ Repository

---

# ส่วนที่ 3: Web Implementation (35 คะแนน)

**ทักษะที่ประเมิน:** Frontend Logic, การจัดการ State, การทำ Route Guard และทักษะการดึงข้อมูล

## โจทย์
สร้าง Web Application สำหรับจัดการ Task อย่างง่าย (Simple Task Tracking) **โดยไม่ต้องเชื่อมต่อ Database จริง** แต่ให้ใช้วิธีจำลองข้อมูล (Mock Data) แทน

### 3.1 การจัดการ Data & Mock API
- สร้าง Mock Data (เช่น ไฟล์ `db.json` หรือตัวแปร Array ในโค้ด) ที่มีข้อมูลผู้ใช้งาน (กำหนด Role เป็น **Admin** และ **Employee** อย่างน้อยอย่างละ 1 บัญชี) และข้อมูล Task
- สร้างหน้า Login สมมติ (กรอกเฉพาะ Username หรือใช้ Dropdown เลือกสวมรอย) โดยต้องมีการเขียนฟังก์ชัน **จำลองการเรียก API ที่มีการหน่วงเวลา** (เช่น `setTimeout` + `Promise`) เพื่อตรวจสอบสิทธิ์

### 3.2 ระบบ Role-based Routing (Route Guard)
- **Admin:** เมื่อ Login สำเร็จ ให้เข้าสู่หน้า `/admin` ได้ (หาก Employee พยายามเข้า URL นี้ ระบบต้อง Redirect หรือขึ้นเตือน)
- **Employee:** เมื่อ Login สำเร็จ ให้เข้าสู่หน้า `/employee` ได้ (หาก Admin พยายามเข้า URL นี้ ระบบต้อง Redirect หรือขึ้นเตือน)

### 3.3 ฟีเจอร์หลัก (UI & CRUD Logic)
- **หน้า Admin:** แสดงรายการ Task ทั้งหมดในระบบ และมีปุ่ม **"สร้าง Task ใหม่"** (อัปเดตข้อมูลลง Mock Data และแสดงผลทันที)
- **หน้า Employee:** แสดงรายการ Task เฉพาะที่มอบหมายให้ตนเอง และมีปุ่ม **"เปลี่ยนสถานะ"** (จาก To Do เป็น Done ได้)

---

# ส่วนที่ 4: Debugging & Code Review (10 คะแนน)

**ทักษะที่ประเมิน:** การอ่านโค้ด, การหาจุดบกพร่องทาง Logic หรือ Security ที่อาจเกิดจากการให้ AI ช่วยเขียนโค้ด

## บริบทของโค้ด
โค้ดด้านล่างเป็น **Backend API Endpoint** (Node.js + Express) สำหรับ **อัปเดตสถานะ Task** ของระบบจัดการโครงการ (ตามธีมในข้อ 1-3)

- **Endpoint:** `PATCH /api/tasks/:id/status`
- **หน้าที่:** เปลี่ยนสถานะของ Task จาก `To Do` → `Done`
- **กฎสิทธิ์:**
  - `Admin` แก้ไขสถานะของ Task ใดก็ได้
  - `Employee` แก้ไขได้เฉพาะ Task ที่มอบหมายให้ตนเอง (`assigned_to === userId`)

โค้ดชุดนี้ **"รันได้"** และ **"ทำงานในเคสปกติได้"** แต่มี **บั๊กหรือช่องโหว่ซ่อนอยู่**

## โจทย์
1. ค้นหาให้เจอว่าจุดผิดพลาดของโค้ดอยู่ตรงไหน (ระบุ **เลขบรรทัด** และอธิบายปัญหา)
2. แก้ไขโค้ดให้สามารถทำงานได้อย่างถูกต้องและ **ปลอดภัย**
3. เขียนคอมเมนต์ (Comment) อธิบายสั้นๆ ถึงสาเหตุของปัญหาและเหตุผลในการแก้ไขของคุณ

## Source Code (ไฟล์: `routes/tasks.js`)

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db');

// PATCH /api/tasks/:id/status
// Body: { newStatus: "Done", userId: 5, userRole: "employee" }
router.patch('/api/tasks/:id/status', async (req, res) => {
  const taskId = req.params.id;
  const { newStatus, userId, userRole } = req.body;

  try {
    // 1) ดึงข้อมูล task จาก DB
    const result = await db.query(
      `SELECT * FROM tasks WHERE id = ${taskId}`
    );
    const task = result.rows[0];

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2) ตรวจสอบสิทธิ์
    if (userRole == 'admin' || task.assigned_to == userId) {

      // 3) อัปเดตสถานะ
      await db.query(
        `UPDATE tasks SET status = '${newStatus}' WHERE id = ${taskId}`
      );

      return res.status(200).json({
        message: 'Status updated successfully',
        task: task,
        updatedBy: { id: userId, role: userRole, password: req.body.password }
      });
    } else {
      return res.status(403).json({ message: 'No permission to edit this task' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

## สิ่งที่ต้องส่งมอบ
1. ไฟล์ `routes/tasks.js` ที่แก้ไขแล้ว (commit ลง Repository ในโฟลเดอร์ `section-4/`)
2. ไฟล์ `section-4/BUGS.md` ที่อธิบายบั๊กแต่ละจุดและเหตุผลที่แก้

---

# ส่วนที่ 5: Code Explanation & Interview (20 คะแนน)

**ทักษะที่ประเมิน:** ความเข้าใจในโค้ดของตนเองอย่างแท้จริง และไหวพริบในการแก้ปัญหา
(ประเมิน ณ วันสัมภาษณ์)

## รูปแบบการให้คะแนน
ผู้สัมภาษณ์จะเปิด Source Code ข้อ 3 ที่ผู้สมัครส่งมา และทำการสอบถามเชิงลึก เช่น:
- "อธิบายการทำงานของฟังก์ชันนี้ให้ฟังหน่อย"
- "ทำไมถึงเลือกเก็บ State หรือใช้ Hook ตัวนี้ในการจัดการข้อมูล"
- "ถ้าบริษัทต้องการเพิ่มระบบ 'การลาหยุด' เข้าไปในแอปนี้ น้องจะวางโครงสร้างเพิ่มตรงจุดไหนของโค้ด?"

> 💡 **คำแนะนำ:** จดบันทึกการตัดสินใจที่สำคัญของคุณไว้ตอนทำข้อ 3 — เช่น "ทำไมเลือกใช้ Context API แทน Redux" หรือ "ทำไมแยก Component แบบนี้" — จะช่วยให้ตอบสัมภาษณ์ได้ลื่นไหลขึ้น

---

# 📦 รูปแบบการส่งงาน

โครงสร้างของ Public Repository ที่แนะนำ:

```
intern-test-[YOUR_NAME]/
├── README.md                  # Tech Stack + DB Schema (ส่วนที่ 2)
├── section-1/
│   ├── flowchart.png          # หรือลิงก์ใน flowchart.md
│   └── ai-prompts.md
├── section-3/                 # Source Code ของ Web App
│   ├── src/
│   ├── package.json
│   └── ...
└── section-4/
    ├── tasks.js               # โค้ดที่แก้แล้ว
    └── BUGS.md                # อธิบายบั๊ก
```

**ขอให้โชคดี! 🚀**
