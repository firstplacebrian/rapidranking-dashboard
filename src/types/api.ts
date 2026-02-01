// ============================================
// Common Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

export interface AuthResponse {
  user: User;
  organization: Organization;
  organizations: Organization[];
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Organization Types
// ============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: 'free' | 'starter' | 'growth' | 'agency' | 'enterprise';
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  user: User;
  joinedAt: string;
}

// ============================================
// Site Types
// ============================================

export interface Site {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  licenseKey?: string;
  status: 'active' | 'inactive' | 'pending';
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteRequest {
  name: string;
  url: string;
}

export interface UpdateSiteRequest {
  name?: string;
  url?: string;
  status?: 'active' | 'inactive';
}

// ============================================
// Business Types
// ============================================

export interface Business {
  id: string;
  siteId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  website?: string;
  category?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// License Types
// ============================================

export interface License {
  id: string;
  organizationId: string;
  key: string;
  plugin: 'rapidscan' | 'rapidbuild' | 'rapidreport' | 'rapidgbp';
  status: 'active' | 'inactive' | 'expired';
  activatedAt?: string;
  expiresAt?: string;
  siteId?: string;
  site?: Site;
  createdAt: string;
}

export interface CreateLicenseRequest {
  plugin: 'rapidscan' | 'rapidbuild' | 'rapidreport' | 'rapidgbp';
}

// ============================================
// Credits Types
// ============================================

export interface CreditsBalance {
  balance: number;
  monthlyUsage: number;
  monthlyLimit: number;
}

export interface CreditTransaction {
  id: string;
  organizationId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  description: string;
  action?: string;
  createdAt: string;
}

// ============================================
// Billing Types
// ============================================

export interface Subscription {
  id: string;
  organizationId: string;
  tier: 'free' | 'starter' | 'growth' | 'agency' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'open' | 'void';
  pdfUrl?: string;
  createdAt: string;
}