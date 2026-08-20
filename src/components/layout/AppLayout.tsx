import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { QuickSearchModal } from '../ui/QuickSearchModal';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentRoute } = useApp();

  if (currentRoute === 'landing') {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
        <Topbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickSearchModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex selection:bg-cyan-500 selection:text-black font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <Topbar />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto">{children}</main>
        <Footer />
      </div>
      <QuickSearchModal />
    </div>
  );
};
