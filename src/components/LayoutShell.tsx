"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

/** Public routes where the dashboard shell (Navbar + Sidebar) should be hidden */
const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ROUTES.includes(pathname);

  if (isPublicPage) {
    // Public pages render full-screen with no dashboard chrome
    return <>{children}</>;
  }

  // Dashboard pages get the full Navbar + Sidebar layout
  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden bg-slate-100">
          {children}
        </main>
      </div>
    </>
  );
}
