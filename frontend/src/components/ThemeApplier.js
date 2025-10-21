import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

const ThemeApplier = () => {
  const { siteSettings, loading } = useSite();

  useEffect(() => {
    // Skip if still loading
    if (loading) return;

    // Apply custom theme colors to CSS variables
    if (siteSettings.theme) {
      const root = document.documentElement;
      
      console.log('Applying theme:', siteSettings.theme);
      
      if (siteSettings.theme.primaryColor) {
        root.style.setProperty('--theme-primary', siteSettings.theme.primaryColor);
        root.style.setProperty('--primary-color', siteSettings.theme.primaryColor);
      }
      
      if (siteSettings.theme.secondaryColor) {
        root.style.setProperty('--theme-secondary', siteSettings.theme.secondaryColor);
        root.style.setProperty('--secondary-color', siteSettings.theme.secondaryColor);
      }
      
      if (siteSettings.theme.font) {
        root.style.setProperty('--theme-font', siteSettings.theme.font);
        root.style.setProperty('--font-family', siteSettings.theme.font);
      }
      
      // Apply dark mode class
      if (siteSettings.theme.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, [siteSettings.theme, loading]);

  // Apply custom favicon if set
  useEffect(() => {
    if (loading) return;
    
    if (siteSettings.seo?.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = siteSettings.seo.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [siteSettings.seo?.favicon, loading]);

  return null; // This component doesn't render anything
};

export default ThemeApplier;
