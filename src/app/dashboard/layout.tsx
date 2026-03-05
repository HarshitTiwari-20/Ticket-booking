import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Tatkal Booking',
  description: 'Search and book Tatkal tickets',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
