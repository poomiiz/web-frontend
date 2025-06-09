// src/pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import liff from "@line/liff";

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    async function initLiff() {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const profile = await liff.getProfile();
        const userId = profile.userId;

        // เรียก API ของเราเช็ก role (ตัวอย่าง /api/roles)
        const res = await fetch(`/api/roles?userId=${userId}`);
        if (!res.ok) throw new Error("Role fetch failed");
        const { role } = await res.json();

        // เลือกหน้าให้ตรงกับ role
        if (role === "admin") {
          router.replace("/admin");
        } else if (role === "seer") {
          router.replace("/seer");
        } else {
          router.replace("/user");
        }
      } catch (err) {
        console.error("LIFF init error:", err);
      }
    }
    initLiff();
  }, [router]);

  return <div className="p-8 text-center">กำลังตรวจสอบสิทธิ์…</div>;
}
