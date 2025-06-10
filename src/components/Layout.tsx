// File: src/components/Layout.tsx
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Layers, Users, Cpu, MessageCircle, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}
interface MenuItem { href: string; label: string; icon: React.ReactNode; }

const menuItems: MenuItem[] = [
  { href: '/admin/decks', label: 'จัดการ Deck', icon: <Layers size={25} /> },
  { href: '/admin/users', label: 'จัดการผู้ใช้', icon: <Users size={25} /> },
  { href: '/admin/models', label: 'ตั้งค่า AI Model', icon: <Cpu size={25} /> },
  { href: '/admin/prompts', label: 'Prompt Templates', icon: <MessageCircle size={25} /> },
  { href: '/admin/config', label: 'Dynamic Config', icon: <Settings size={25} /> },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100 gap-12">
      <nav className="w-[200px] bg-gray-800 p-6 shadow-lg ">
        <h2 className="text-xl font-bold mb-6 text-white ">Admin Menu</h2>
        <ul className="flex flex-col ">
          {menuItems.map(({ href, label, icon }) => {
            const isActive = currentPath.startsWith(href);
            return (
              <li key={href}>
                <button
                  onClick={() => router.push(href)}
                  className={
                    `w-full flex items-center gap-3 my-[5px] px-5 py-3 rounded-lg transition-colors ` +
                    (isActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600')
                  }
                >
                  {icon}
                  <span className="flex-1 text-left">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="flex-1 p-8 ml-[20px]">
        {children}
      </main>
    </div>
  );
}
