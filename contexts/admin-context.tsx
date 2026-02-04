'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret keybind: Ctrl+Alt+Shift+A (or Cmd+Alt+Shift+A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdminMode, toggleAdminMode: () => setIsAdminMode((prev) => !prev) }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminMode must be used within AdminProvider');
  }
  return context;
}
