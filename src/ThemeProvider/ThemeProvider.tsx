import { useEffect, useMemo, useState } from 'react';
import { ThemeContext, ThemeOptions } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function toggleTheme(themeDispatch: React.Dispatch<React.SetStateAction<ThemeOptions>>) {
  return () => {
    themeDispatch((theme) => (theme === 'light' ? 'dark' : 'light'));
  };
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, themeDispatch] = useState<ThemeOptions>(
    (localStorage.getItem('theme') ?? 'light') as ThemeOptions,
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const memoizedTheme = useMemo(
    () => ({ current: theme, toggle: toggleTheme(themeDispatch) }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={memoizedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
