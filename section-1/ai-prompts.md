# AI Prompts (ส่วนที่ 1)

# AI Prompts ที่ 1
สร้าง Flowchart ภาษาไทยสำหรับระบบ “จัดการสิทธิ์การเข้าถึงข้อมูลโครงการ (Project Access Control)” โดยออกแบบให้เหมาะสำหรับระบบมีผู้ใช้งาน 2 Role คือ Admin และ Employee โดยใช้เพียง mock up data
Business Logic
Admin

* สามารถเข้าสู่ระบบได้
* สามารถสร้าง Project ใหม่ได้
* สามารถดู Task ทั้งหมดในระบบ
* สามารถสร้าง Task ใหม่ได้
* สามารถมอบหมาย Task ให้ Employee คนใดก็ได้
* สามารถแก้ไขสถานะ Task ของทุกคนได้

Employee

* สามารถเข้าสู่ระบบได้
* สามารถดูเฉพาะ Task ที่ถูกมอบหมายให้ตนเอง
* สามารถแก้ไขสถานะเฉพาะ Task ที่ตนเองได้รับมอบหมาย
* ไม่สามารถเข้าถึงหรือแก้ไข Task ของ Employee คนอื่นได้
* ไม่สามารถเข้าถึงหน้า Admin ได้

Flowchart ที่ต้องแสดง

1. เริ่มต้นระบบ
2. ผู้ใช้เข้าสู่หน้า Login
3. ผู้ใช้กรอก Username
4. ระบบจำลองการเรียก API เพื่อตรวจสอบข้อมูลผู้ใช้
5. ตรวจสอบว่า Login สำเร็จหรือไม่
   * ถ้าไม่สำเร็จ → แสดงข้อความ “เข้าสู่ระบบไม่สำเร็จ” → กลับไปหน้า Login
   * ถ้าสำเร็จ → ตรวจสอบ Role
6. ตรวจสอบว่าเป็น Admin หรือ Employee
7. ถ้าเป็น Admin
   * เข้าสู่หน้า Admin
   * ดู Task ทั้งหมด
   * สร้าง Project
   * สร้าง Task
   * มอบหมาย Task ให้ Employee
   * แก้ไขสถานะ Task ได้
8. ถ้าเป็น Employee
   * เข้าสู่หน้า Employee
   * ระบบกรอง Task โดยตรวจสอบ `assigned_to === userId`
   * แสดงเฉพาะ Task ที่ได้รับมอบหมาย
   * Employee สามารถเปลี่ยนสถานะ Task ของตนเองจาก “To Do” เป็น “Done”
9. ถ้า Employee พยายามเข้าหน้า `/admin`
   * ระบบตรวจสอบ Role
   * ไม่ใช่ Admin → ปฏิเสธการเข้าถึงและ Redirect ไป `/employee`
10. ถ้า Admin พยายามเข้าหน้า `/employee`

* ระบบตรวจสอบ Role
* ไม่ใช่ Employee → ปฏิเสธการเข้าถึงและ Redirect ไป `/admin`

11. เมื่อผู้ใช้ Logout

* ล้างข้อมูล Session/Login
* กลับไปหน้า Login

12. จบการทำงาน

ข้อกำหนดด้านความปลอดภัย
ให้แสดงแนวคิด Role-Based Access Control (RBAC) ใน Flowchart อย่างชัดเจน โดยเฉพาะจุดที่ระบบตรวจสอบ Role ก่อนอนุญาตให้เข้าถึงหน้า Admin หรือ Employee
สำหรับ Employee ให้แสดงการตรวจสอบเพิ่มเติมว่า:
`Task.assigned_to === CurrentUser.id`
ก่อนอนุญาตให้ดูหรือแก้ไข Task
รูปแบบ Flowchart
ใช้สัญลักษณ์มาตรฐาน:

* วงรี = Start / End
* สี่เหลี่ยม = Process
* รูปสี่เหลี่ยมข้าวหลามตัด = Decision
* ลูกศร = ลำดับการทำงาน

ให้ใช้ข้อความภาษาไทยเป็นหลัก และใช้คำศัพท์ Programming ที่จำเป็น เช่น `Role`, `User ID`, `assigned_to`, `RBAC`, `/admin`, `/employee`
จัด Flowchart ให้มีลำดับอ่านง่ายจากบนลงล่าง และแยกเส้นทาง Admin กับ Employee ให้เห็นชัดเจน
ต้องครอบคลุมทั้งกรณี Success, Login Failed, Unauthorized Access และ Logout

# ใช้ prompt นี้ต้องการให้ Ai เข้าใจในการออกแบบระบบ เพื่อ ที่จะต่อ mcp ของ draw.io แล้ววาด flowchart ออกมาได้อย่างถูกต้อง

# AI Prompts ที่ 2
ทำส่วนที่ 2 tech-stack and Tech Stack Justification & Database Design โดยยึดจาก flowchart
# ใช้ prompt นี้ต้องการให้ Ai เข้าใจในภาพรวมของระบบโดยการยึดจาก flowchart เพื่อที่จะทำให้ ใช้ tech stack เท่าที่จำเป็นไม่เกิดการ over engineering และทำใหใช้ทรัพยากรระบบอย่างคุ้มค่า

