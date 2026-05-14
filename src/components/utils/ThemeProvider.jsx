import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/api/entities/User';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const user = await User.me();
      const savedTheme = user.theme || 'light';
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
      applyTheme('light');
      setThemeState('light');
    }
    setIsLoading(false);
  };

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');

    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (newTheme === 'light') {
      root.classList.add('light');
      root.style.colorScheme = 'light';
    } else if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
      root.style.colorScheme = prefersDark ? 'dark' : 'light';
    }

    void document.body.offsetHeight;
  };

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      await User.updateMe({ theme: newTheme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
