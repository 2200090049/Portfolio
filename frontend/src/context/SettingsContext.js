import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SITE_SETTINGS, GET_SOCIAL_LINKS } from '../graphql/queries';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_SITE_SETTINGS, {
    fetchPolicy: 'network-only', // Always fetch fresh data from server
    pollInterval: 30000 // Refetch every 30 seconds
  });
  const { data: socialData, loading: socialLoading } = useQuery(GET_SOCIAL_LINKS, {
    fetchPolicy: 'network-only', // Always fetch fresh data from server  
    pollInterval: 30000 // Refetch every 30 seconds
  });

  const settings = settingsData?.siteSettings;
  const socialLinks = socialData?.socialLinks;

  // Apply theme colors to CSS custom properties
  useEffect(() => {
    if (settings?.theme) {
      const { primaryColor, secondaryColor, font } = settings.theme;
      
      if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
      }
      if (secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      }
      if (font) {
        document.documentElement.style.setProperty('--font-family', font);
      }
    }
  }, [settings]);

  // Update document title
  useEffect(() => {
    if (settings?.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings?.siteTitle]);

  // Update meta tags and SEO
  useEffect(() => {
    if (settings) {
      // Description
      if (settings.siteDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = settings.siteDescription;
      }

      // Keywords
      if (settings.siteKeywords && settings.siteKeywords.length > 0) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = settings.siteKeywords.join(', ');
      }

      // SEO - Open Graph Image
      if (settings.seo?.ogImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.content = settings.seo.ogImage;
      }

      // SEO - Twitter Card
      if (settings.seo?.twitterHandle) {
        let twitterSite = document.querySelector('meta[name="twitter:site"]');
        if (!twitterSite) {
          twitterSite = document.createElement('meta');
          twitterSite.name = 'twitter:site';
          document.head.appendChild(twitterSite);
        }
        twitterSite.content = `@${settings.seo.twitterHandle.replace('@', '')}`;
      }

      // Favicon
      if (settings.seo?.favicon) {
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = settings.seo.favicon;
      }
    }
  }, [settings]);

  // Analytics - Google Analytics
  useEffect(() => {
    if (settings?.features?.enableAnalytics && settings?.analytics?.googleAnalyticsId) {
      const gaId = settings.analytics.googleAnalyticsId;
      
      // Check if GA script already exists
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
        // Add GA script
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        // Add GA config
        const gaConfig = document.createElement('script');
        gaConfig.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(gaConfig);
      }
    }
  }, [settings?.features?.enableAnalytics, settings?.analytics?.googleAnalyticsId]);

  // Analytics - Facebook Pixel
  useEffect(() => {
    if (settings?.features?.enableAnalytics && settings?.analytics?.facebookPixelId) {
      const pixelId = settings.analytics.facebookPixelId;
      
      // Check if pixel script already exists
      if (!window.fbq) {
        const fbScript = document.createElement('script');
        fbScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
      }
    }
  }, [settings?.features?.enableAnalytics, settings?.analytics?.facebookPixelId]);

  const value = {
    settings,
    socialLinks,
    loading: settingsLoading || socialLoading,
    // Quick access properties
    siteName: settings?.siteName || 'Portfolio',
    siteTitle: settings?.siteTitle || 'My Portfolio',
    siteDescription: settings?.siteDescription || '',
    isAvailableForWork: settings?.availableForWork || false,
    availabilityMessage: settings?.availabilityMessage || '',
    features: settings?.features || {},
    theme: settings?.theme || {},
    emailConfig: settings?.emailConfig || {},
    analytics: settings?.analytics || {},
    seo: settings?.seo || {},
    maintenanceMode: settings?.maintenanceMode || false,
    maintenanceMessage: settings?.maintenanceMessage || 'Site under maintenance'
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
