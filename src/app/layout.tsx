import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tatkal Ticket Booking - Lightning Fast 99% Confirm Rate',
  description:
    'Book Tatkal tickets with 99% confirmation rate. Pre-store credentials for instant booking when the 11 AM window opens.',
  keywords: ['Tatkal', 'Ticket Booking', 'IRCTC', 'Railway', 'Fast Booking'],
  openGraph: {
    title: 'Tatkal Ticket Booking - 99% Confirm Rate',
    description: 'Lightning-fast Tatkal ticket booking app',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
