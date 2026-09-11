import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
