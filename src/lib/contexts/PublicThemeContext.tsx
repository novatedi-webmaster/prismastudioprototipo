import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PublicTheme } from '../types';
import { mockApi } from '../mock-api';

interface PublicThemeContextType {
  activeTheme: PublicTheme | null;
  themes: PublicTheme[];
  loading: boolean;
  changeTheme: (id: string) => Promise<PublicTheme>;
  refreshThemes: () => Promise<void>;
}

const PublicThemeContext = createContext<PublicThemeContextType | undefined>(undefined);

export function PublicThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<PublicTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<PublicTheme | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshThemes = async () => {
    setLoading(true);
    try {
      const list = await mockApi.themes.list();
      setThemes(list);
      const active = await mockApi.themes.getActive();
      setActiveTheme(active);
    } catch (err) {
      console.error('Failed to load public themes', err);
    } finally {
      setLoading(false);
    }
  };

  const changeTheme = async (id: string): Promise<PublicTheme> => {
    setLoading(true);
    try {
      const updatedActive = await mockApi.themes.setActive(id);
      setActiveTheme(updatedActive);
      const list = await mockApi.themes.list();
      setThemes(list);
      return updatedActive;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshThemes();
  }, []);

  return (
    <PublicThemeContext.Provider value={{
      activeTheme,
      themes,
      loading,
      changeTheme,
      refreshThemes
    }}>
      {children}
    </PublicThemeContext.Provider>
  );
}

export function usePublicTheme() {
  const context = useContext(PublicThemeContext);
  if (!context) {
    throw new Error('usePublicTheme must be used within a PublicThemeProvider');
  }
  return context;
}
