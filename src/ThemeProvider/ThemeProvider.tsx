import { useEffect, useMemo, useState } from 'react';
import { ThemeContext, ThemeOptions, toggleTheme } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, themeDispatch] = useState<ThemeOptions>('light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const memoizedTheme = useMemo(
    () => ({ theme, toggleTheme: toggleTheme(themeDispatch) }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={memoizedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
