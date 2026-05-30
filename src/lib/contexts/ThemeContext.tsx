import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type PanelTheme = 'light' | 'dark';
export type PanelPalette = 'blue' | 'black' | 'jade';

interface ThemeContextType {
  theme: PanelTheme;
  palette: PanelPalette;
  toggleTheme: () => void;
  setPalette: (palette: PanelPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PanelTheme>(() => {
    const stored = localStorage.getItem('prisma_panel_theme');
    return (stored as PanelTheme) || 'light';
  });

  const [palette, setPaletteState] = useState<PanelPalette>(() => {
    const stored = localStorage.getItem('prisma_panel_palette');
    return (stored as PanelPalette) || 'blue';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setPalette = (p: PanelPalette) => {
    setPaletteState(p);
  };

  useEffect(() => {
    localStorage.setItem('prisma_panel_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('prisma_panel_palette', palette);
    const root = window.document.documentElement;
    
    // Remove previous palette classes
    root.classList.remove('palette-blue', 'palette-black', 'palette-jade');
    root.classList.add(`palette-${palette}`);

    // Set custom primary variable based on palette and theme
    if (palette === 'blue') {
      root.style.setProperty('--primary', theme === 'light' ? '221.2 83.2% 53.3%' : '217.2 91.2% 59.8%');
      root.style.setProperty('--primary-foreground', theme === 'light' ? '210 40% 98%' : '222.2 47.4% 11.2%');
    } else if (palette === 'black') {
      root.style.setProperty('--primary', theme === 'light' ? '240 5.9% 10%' : '0 0% 98%');
      root.style.setProperty('--primary-foreground', theme === 'light' ? '0 0% 98%' : '240 5.9% 10%');
    } else if (palette === 'jade') {
      root.style.setProperty('--primary', theme === 'light' ? '142.1 76.2% 36.3%' : '142.1 70.6% 45.3%');
      root.style.setProperty('--primary-foreground', theme === 'light' ? '355.7 100% 97.3%' : '144.9 80.4% 10%');
    }
  }, [palette, theme]);

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
