import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { usePortfolio } from '../context/PortfolioContext';
import { GET_SOCIAL_LINKS, GET_SITE_SETTINGS } from '../graphql/queries';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaHeart,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaMedium,
  FaDev,
  FaStackOverflow,
  FaPhone,
  FaMapMarkerAlt,
  FaLink
} from 'react-icons/fa';
import { SiKaggle, SiBehance, SiDribbble } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  const { getRoleTheme } = usePortfolio();
  const theme = getRoleTheme();

  const { data: socialData } = useQuery(GET_SOCIAL_LINKS);
  const { data: settingsData } = useQuery(GET_SITE_SETTINGS);

  const socialLinks = socialData?.socialLinks;
  const settings = settingsData?.siteSettings;

  const footerLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Projects', path: '/projects', show: settings?.features?.showProjects !== false },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog', show: settings?.features?.showBlog !== false },
    { label: 'Contact', path: '/contact', show: settings?.features?.showContact !== false },
  ].filter(link => link.show !== false);

  // Icon mapping for social platforms
  const getIcon = (platform) => {
    const iconMap = {
      github: FaGithub,
      linkedin: FaLinkedin,
      twitter: FaTwitter,
      instagram: FaInstagram,
      facebook: FaFacebook,
      youtube: FaYoutube,
      medium: FaMedium,
      devto: FaDev,
      stackoverflow: FaStackOverflow,
      kaggle: SiKaggle,
      behance: SiBehance,
      dribbble: SiDribbble,
      email: FaEnvelope,
      phone: FaPhone,
      location: FaMapMarkerAlt,
      personalWebsite: FaLink
    };
    return iconMap[platform] || FaLink;
  };

  // Build social links array from socialLinks data
  const buildSocialLinks = () => {
    if (!socialLinks) return [];
    
    const links = [];
    const platforms = ['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'medium', 'devto', 'stackoverflow', 'kaggle', 'behance', 'dribbble'];
    
    platforms.forEach(platform => {
      if (socialLinks[platform]) {
        links.push({
          icon: getIcon(platform),
          url: socialLinks[platform],
          label: platform.charAt(0).toUpperCase() + platform.slice(1)
        });
      }
    });

    // Add email
    if (socialLinks.email) {
      links.push({
        icon: FaEnvelope,
        url: `mailto:${socialLinks.email}`,
        label: 'Email'
      });
    }

    // Add custom links
    if (socialLinks.customLinks && socialLinks.customLinks.length > 0) {
      socialLinks.customLinks.forEach(link => {
        links.push({
          icon: FaLink,
          url: link.url,
          label: link.name
        });
      });
    }

    return links;
  };

  const activeSocialLinks = buildSocialLinks();

  const siteName = settings?.siteName || 'Portfolio';
  const siteTagline = settings?.siteDescription || 'Creating digital experiences that matter';

  return (
    <footer className="footer" style={{ borderTop: `2px solid ${theme?.primary}20` }}>
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h3 style={{ color: theme?.primary }}>{siteName}</h3>
            <p>{siteTagline}</p>
          </div>

          <div className="footer-links">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="footer-link"
                style={{ color: theme?.text }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-social">
            {activeSocialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                <social.icon size={24} color={theme?.primary} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteName}. Made with{' '}
            <FaHeart color={theme?.accent} style={{ display: 'inline' }} /> in India
          </p>
          <p className="footer-tech">
            Built with React, GraphQL, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
