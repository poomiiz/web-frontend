// File: src/pages/admin/index.tsx
import Link from 'next/link';

export default function AdminMonitorPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Monitor Dashboard</h1>
      <p className="text-gray-100">สรุปภาพรวมระบบ, Logs, Config ฯลฯ</p>
    </div>
  );
}