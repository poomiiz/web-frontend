# web-frontend (Next.js)

## ภาพรวม
เว็บแอปสำหรับฝั่งผู้ดูแล (Admin) และ Dashboard ของระบบ MooMoon เขียนด้วย Next.js + React + Tailwind CSS ใช้เชื่อมกับ go-backend และ ai-service

## โครงสร้างโฟลเดอร์

- **public/**  
  ไฟล์ static เช่น รูปภาพ, favicon, robots.txt ฯลฯ  

- **src/components/**  
  เก็บ React components ทั่วไป (เช่น Navbar, Footer, Layout) ให้ทุกหน้าสามารถ import ไปใช้ได้  

- **src/pages/**  
  ตามโครงสร้าง Next.js:  
  - `/admin`: จัดการผู้ใช้, หมอดู, ตั้งค่าระบบ  
  - `/dashboard`: แสดงกราฟ, KPI  
  - `/package`: จัดการแพ็กเกจ  
  - `/review`: ดูและอนุมัติ รีวิว  
  - `/booking`: ตรวจสอบคิว, สถานะการจอง  
  - `/cards`: แก้ไขสำรับไพ่, ดูความหมาย AI  

- **src/styles/**  
  - `globals.css`: CSS หลัก  
  - `tailwind.config.js`: ตั้งค่า Tailwind  

- **src/utils/api.ts**  
  ฟังก์ชันช่วยเรียก API ไปยัง go-backend (ใช้ axios หรือ fetch)

- **src/hooks/**  
  Custom hooks ถ้ามี เช่น `useAuth.ts` ตรวจสอบ token, สิทธิ์ admin/seer

## วิธีติดตั้งและรัน

1. ติดตั้ง dependencies  
   ```bash
   npm install
   ```  
2. ตั้งค่า `.env.local`  
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```  
3. รัน dev server  
   ```bash
   npm run dev
   ```  
4. สร้าง production build  
   ```bash
   npm run build
   npm run start
   ```  
