import { createContext, useContext } from 'react';

export type ThemeOptions = 'light' | 'dark';

export const ThemeContext = createContext({} as { current: ThemeOptions; toggle: () => void });

export const useTheme = () => useContext(ThemeContext);
