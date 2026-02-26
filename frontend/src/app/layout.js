import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { PrefetchRoutes } from '@/components/PrefetchRoutes';

const heading = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });
const sans = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'SoulSupport - Online Therapy Platform',
  description: 'Professional online therapy and mental wellness support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${sans.variable} bg-white text-gray-900 transition-colors`}>
        <Providers>
          <AuthProvider>
            <NotificationProvider>
              <PrefetchRoutes />
              <Header />
              <main>{children}</main>
              <Toaster position="top-right" />
            </NotificationProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
