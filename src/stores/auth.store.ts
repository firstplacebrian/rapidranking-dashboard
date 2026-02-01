import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  emailVerified: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: 'free' | 'starter' | 'growth' | 'agency' | 'enterprise';
  logo?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  organization: Organization | null;
  organizations: Organization[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, org: Organization, orgs: Organization[]) => void;
  logout: () => void;
  switchOrganization: (org: Organization) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  organizations: [],
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setOrganization: (organization) => set({ organization }),
  
  setOrganizations: (organizations) => set({ organizations }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  login: (user, organization, organizations) => set({
    user,
    organization,
    organizations,
    isAuthenticated: true,
    isLoading: false,
  }),
  
  logout: () => {
    // Clear tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Clear cookie
      document.cookie = 'access_token=; path=/; max-age=0';
    }
    
    set({
      user: null,
      organization: null,
      organizations: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },
  
  switchOrganization: (organization) => set({ organization }),
}));