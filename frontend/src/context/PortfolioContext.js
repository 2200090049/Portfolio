import React, { createContext, useState, useContext, useEffect } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedSound = localStorage.getItem('soundEnabled') === 'true';
    
    if (savedRole) setSelectedRole(savedRole);
    setTheme(savedTheme);
    setSoundEnabled(savedSound);
  }, []);

  // Save preferences
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [selectedRole, theme, soundEnabled]);

  // Apply theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
    } else {
      document.body.style.background = '#0a0e27';
      document.body.style.color = '#ffffff';
    }
  }, [theme]);

  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const getRoleTheme = () => {
    if (!selectedRole) return null;
    
    const themes = {
      developer: {
        primary: '#00ff41',
        secondary: '#00d4ff',
        background: '#0a0e27',
        text: '#00ff41',
        accent: '#ff006e',
        gradient: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      },
      datascience: {
        primary: '#00d4ff',
        secondary: '#7b2cbf',
        background: '#0d1b2a',
        text: '#e0f2fe',
        accent: '#f72585',
        gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
      },
      ux: {
        primary: '#0080ff',
        secondary: '#00d4ff',
        background: '#000000',
        text: '#ffffff',
        accent: '#0080ff',
        gradient: 'linear-gradient(135deg, #000000 0%, #0a1929 100%)',
      },
    };

    return themes[selectedRole] || themes.developer;
  };

  const value = {
    selectedRole,
    selectRole,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    isLoading,
    setIsLoading,
    getRoleTheme,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
