'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Temporary mock data for testing
const mockUser = {
  id: '1',
  email: 'brian@rapidranking.io',
  name: 'Brian',
  role: 'owner' as const,
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

const mockOrganization = {
  id: '1',
  name: 'High Ground Jiu Jitsu',
  slug: 'high-ground-jiu-jitsu',
  tier: 'agency' as const,
  createdAt: new Date().toISOString(),
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, setLoading, login } = useAuthStore();

  useEffect(() => {
    // Temporary: Auto-login with mock data for testing
    if (!isAuthenticated) {
      login(mockUser, mockOrganization, [mockOrganization]);
    }
    setLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}