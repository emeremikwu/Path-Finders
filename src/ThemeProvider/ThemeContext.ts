import { createContext, useContext } from 'react';

export type ThemeOptions = 'light' | 'dark';
export const ThemeContext = createContext({} as { theme: ThemeOptions; toggleTheme: () => void });
export const useTheme = () => useContext(ThemeContext);
export function toggleTheme(themeDispatch: React.Dispatch<React.SetStateAction<ThemeOptions>>) {
  return () => {
    themeDispatch((theme) => (theme === 'light' ? 'dark' : 'light'));
  };
}
