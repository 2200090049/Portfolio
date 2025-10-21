import React from 'react';
import { Helmet } from 'react-helmet';
import { useSite } from '../context/SiteContext';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage, 
  ogType = 'website',
  noindex = false 
}) => {
  const { siteSettings } = useSite();
  
  const pageTitle = title 
    ? `${title} | ${siteSettings.siteName}` 
    : siteSettings.siteTitle;
  
  const pageDescription = description || siteSettings.siteDescription;
  const pageKeywords = keywords.length > 0 
    ? keywords.join(', ') 
    : siteSettings.siteKeywords.join(', ');
  
  const pageOgImage = ogImage || siteSettings.seo?.ogImage || '';
  const favicon = siteSettings.seo?.favicon || '/favicon.ico';
  const twitterHandle = siteSettings.seo?.twitterHandle || '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Favicon */}
      <link rel="icon" href={favicon} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {pageOgImage && <meta property="og:image" content={pageOgImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {pageOgImage && <meta name="twitter:image" content={pageOgImage} />}
      
      {/* Theme Color */}
      <meta name="theme-color" content={siteSettings.theme?.primaryColor || '#00d4ff'} />
    </Helmet>
  );
};

export default SEO;
