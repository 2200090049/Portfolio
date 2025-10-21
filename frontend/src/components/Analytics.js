import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

const Analytics = () => {
  const { siteSettings } = useSite();

  // Google Analytics
  useEffect(() => {
    const gaId = siteSettings.analytics?.googleAnalyticsId;
    
    if (gaId && siteSettings.features?.enableAnalytics) {
      // Remove existing GA scripts if any
      const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Add GA initialization script
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inlineScript);

      console.log('✅ Google Analytics initialized:', gaId);
    }
  }, [siteSettings.analytics?.googleAnalyticsId, siteSettings.features?.enableAnalytics]);

  // Facebook Pixel
  useEffect(() => {
    const fbPixelId = siteSettings.analytics?.facebookPixelId;
    
    if (fbPixelId && siteSettings.features?.enableAnalytics) {
      // Add Facebook Pixel script
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);

      console.log('✅ Facebook Pixel initialized:', fbPixelId);
    }
  }, [siteSettings.analytics?.facebookPixelId, siteSettings.features?.enableAnalytics]);

  return null; // This component doesn't render anything
};

export default Analytics;
