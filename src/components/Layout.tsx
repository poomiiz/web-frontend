// src/components/Layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r">
        <div className="p-4 text-xl font-bold">MooMoon Admin</div>
        <nav className="flex flex-col p-2 space-y-1">
          <Link href="/admin/decks" className="px-3 py-2 rounded hover:bg-gray-200">
            Decks
          </Link>
          <Link href="/admin/users" className="px-3 py-2 rounded hover:bg-gray-200">
            Users
          </Link>
          <Link href="/admin/config" className="px-3 py-2 rounded hover:bg-gray-200">
            Config
          </Link>
          {/* เพิ่มลิงก์เมนูอื่น ๆ ตามต้องการ */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  );
}
