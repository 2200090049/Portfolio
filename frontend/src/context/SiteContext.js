import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext();

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within SiteProvider');
  }
  return context;
};

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Portfolio',
    siteTitle: 'Kuruguntla Deepak Reddy - Portfolio',
    siteDescription: 'Full Stack Developer, Data Scientist & UX Designer',
    siteKeywords: [],
    availableForWork: true,
    availabilityMessage: 'Available for freelance work',
    theme: {
      primaryColor: '#00d4ff',
      secondaryColor: '#0077ff',
      darkMode: true,
      font: 'Inter'
    },
    features: {
      showBlog: true,
      showProjects: true,
      showTestimonials: true,
      showNewsletter: false,
      showContact: true,
      enableComments: false,
      enableAnalytics: false
    },
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: ''
    },
    seo: {
      ogImage: '',
      twitterHandle: '',
      favicon: ''
    },
    maintenanceMode: false,
    maintenanceMessage: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSiteSettings();
    
    // Poll for settings updates every 5 minutes (reduced from 10 seconds to prevent rate limiting)
    const pollInterval = setInterval(() => {
      fetchSiteSettings();
    }, 300000); // 5 minutes
    
    // Listen for custom event when settings are updated
    const handleSettingsUpdate = () => {
      console.log('Settings update event received, refetching...');
      fetchSiteSettings();
    };
    
    window.addEventListener('siteSettingsUpdated', handleSettingsUpdate);
    
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('siteSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              siteSettings {
                siteName
                siteTitle
                siteDescription
                siteKeywords
                availableForWork
                availabilityMessage
                theme {
                  primaryColor
                  secondaryColor
                  darkMode
                  font
                }
                features {
                  showBlog
                  showProjects
                  showTestimonials
                  showNewsletter
                  showContact
                  enableComments
                  enableAnalytics
                }
                analytics {
                  googleAnalyticsId
                  facebookPixelId
                }
                seo {
                  ogImage
                  twitterHandle
                  favicon
                }
                maintenanceMode
                maintenanceMessage
              }
            }
          `
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        console.error('Error fetching site settings:', errors);
        setError(errors[0].message);
        return;
      }

      if (data && data.siteSettings) {
        setSiteSettings(data.siteSettings);
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    setLoading(true);
    fetchSiteSettings();
  };

  const value = {
    siteSettings,
    loading,
    error,
    refreshSettings
  };

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
};

export default SiteContext;
