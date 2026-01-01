import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';

const heading = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });
const sans = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'SoulSupport - Online Therapy Platform',
  description: 'Professional online therapy and mental wellness support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${sans.variable} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors`}>
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <Header />
                <main>{children}</main>
                <Toaster position="top-right" />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
