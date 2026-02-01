import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeModal: null,
      modalData: null,
      theme: 'system',
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      
      openModal: (activeModal, modalData = undefined) => set({ activeModal, modalData }),
      
      closeModal: () => set({ activeModal: null, modalData: null }),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'rapidranking-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);