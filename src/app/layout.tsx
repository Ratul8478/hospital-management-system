import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { LayoutShell } from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'Medix ERP — Multi-Branch Hospital Management System',
  description: 'Enterprise Healthcare ERP with multi-branch isolation, Super Admin controls, bed management, pharmacy inventory, and lab diagnostics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-800 min-h-screen flex flex-col antialiased">
        <AppProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AppProvider>
      </body>
    </html>
  );
}

