import { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'midnight';

export const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'midnight', label: 'Midnight' },
];

const STORAGE_KEY = 'theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// index.html sets data-theme before React loads (avoids a flash of the wrong theme)
const getInitialTheme = (): Theme => {
  const current = document.documentElement.dataset.theme;
  return THEMES.some((t) => t.value === current) ? (current as Theme) : 'light';
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (next: Theme) => {
    // Apply synchronously so components reading CSS variables during render see the new values
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode); theme still applies for this visit
    }
    setThemeState(next);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

/** Reads a theme color as a CSS color string, for libraries that need real values (e.g. Recharts). */
export const themeColor = (name: string, alpha = 1) => {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  return `rgb(${rgb} / ${alpha})`;
};
