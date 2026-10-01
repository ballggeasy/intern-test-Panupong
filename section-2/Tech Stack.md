JavaScript (ภาษา)
- ใช้ภาษาเดียวทั้ง Frontend และ Backend
- มี Promise / async-await ตรงกับโจทย์ "จำลอง API หน่วงเวลา"

React (Library)
- สร้าง Task แล้วแสดงผลเลย React อัปเดตหน้าจออัตโนมัติเมื่อ State เปลี่ยน ไม่ต้องสั่งแก้ DOM เอง
- แยกหน้าเป็น Component (Login, Admin, Employee) ได้ชัด

React Router (Library)
- ต้องมี Route Guard /admin กับ /employee ตัวนี้ทำให้เขียน <ProtectedRoute> ครอบหน้า แล้ว Redirect เมื่อ Role ไม่ตรงได้ในที่เดียว ตรงกับกล่อง RBAC Guard ใน flowchart

Vite (Build tool)
- เริ่มโปรเจกต์และ Hot Reload เร็ว ตั้งค่าน้อย เหมาะกับเวลาจำกัด

Context API
- State ที่ต้องแชร์ข้ามหน้ามีอย่างเดียวคือ Session (token, userId, Role) ใช้ของที่ React มีให้ก็พอ ไม่ต้องเพิ่ม Redux ที่ซับซ้อนเกินจำเป็น

Mock API (Promise + setTimeout)
- จำลองเรียก API ใน flowchart และได้ Loading state เหมือนระบบจริง
- ตรวจสิทธิ์จาก token ทุกครั้ง จำลองหลักการ RBAC ที่ Backend จริงต้องทำ

Web Crypto (SHA-256)
- เบราว์เซอร์มีให้อยู่แล้ว hash รหัสผ่านใน Mock Data ได้โดยไม่ต้องลง library และไม่เก็บ plain text
sessionStorage
- Refresh แล้ว Session ไม่หลุด ปิดแท็บแล้วหาย ตรงกับขั้น "ล้างข้อมูล Session" ตอน Logout

CSS ธรรมดา
-มีแค่ 3 หน้า ไม่คุ้มที่จะเพิ่ม Tailwind หรือ UI library