import { ReactNode } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-black text-white px-6 py-8 transition-all duration-300 ease-in-out">{children}</main>
    </div>
  );
};

export default DashboardLayout;
