import { ReactElement } from 'react';
import { THEMES, Theme, useTheme } from '../context/ThemeContext';

const icons: Record<Theme, ReactElement> = {
  light: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  ),
  dark: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  ),
  midnight: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  ),
};

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Color theme" className="inline-flex rounded-lg border border-line bg-surface p-1">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded-md transition ${
            theme === value ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {icons[value]}
          </svg>
        </button>
      ))}
    </div>
  );
};
