// src/pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import liff from '@line/liff';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID!;

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!LIFF_ID) {
          throw new Error('Missing NEXT_PUBLIC_LIFF_ID');
        }
        await liff.init({ liffId: LIFF_ID });
        // ถ้ายังไม่ล็อกอิน ให้กระโดดไปหน้า LINE Login
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        // ดึง profile ของผู้ใช้
        const profile = await liff.getProfile();
        const userId = profile.userId;

        // เช็ค role จาก API คุณ (go-backend)
        const res = await fetch(`/api/roles?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch role: ${res.status}`);
        }
        const data = await res.json() as { role: string };

        // เปลี่ยนหน้าไปตาม role
        switch (data.role) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'seer':
            router.replace('/seer');
            break;
          default:
            router.replace('/user');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initLiff();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>กำลังตรวจสอบสิทธิ์…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  // กรณีไฟล์นี้ยังไม่มี UI เฉพาะ ไม่ต้อง render อะไรเพิ่ม
  return null;
}
