'use client';
import { LayoutDashboard, Sparkles, Save, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`bg-[#0d1512] text-white transition-all duration-300 ease-in-out min-h-screen ${collapsed ? 'w-16' : 'w-60'} flex flex-col`}>
      <button onClick={() => setCollapsed(!collapsed)} className="p-4 hover:bg-[#1a2a21] transition">
        <Menu className="w-5 h-5" />
      </button>

      {/* Profile */}
      <div className="flex flex-col items-center px-2 mb-4">
        <img alt="Profile" className="w-20 h-20 rounded-full mb-2" />
        <div className="border-t border-white/20 w-full" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col space-y-2 px-2 mt-2">
        <SidebarItem icon={<LayoutDashboard className="w-7 h-7" />} label="Dashboard" href="/dashboard" collapsed={collapsed} />
        <SidebarItem icon={<Sparkles className="w-7 h-7" />} label="Recommendations" href="/recommendations" collapsed={collapsed} />
        <SidebarItem icon={<Save className="w-7 h-7" />} label="Saved" href="/saved" collapsed={collapsed} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, href, collapsed }: { icon: React.ReactNode; label: string; href: string; collapsed: boolean }) => (
  <Link href={href} className="flex items-center gap-3 p-3 rounded hover:bg-[#1a2a21] transition text-[17px]">
    {icon}
    {!collapsed && <span className="whitespace-nowrap">{label}</span>}
  </Link>
);

export default Sidebar;
