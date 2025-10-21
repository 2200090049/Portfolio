import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useSite } from '../context/SiteContext';
import { FaBars, FaTimes, FaMoon, FaSun, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { selectedRole, getRoleTheme, theme, toggleTheme, soundEnabled, toggleSound } = usePortfolio();
  const { siteSettings } = useSite();
  const roleTheme = getRoleTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Filter nav links based on feature flags
  const allNavLinks = [
    { path: '/home', label: 'Home', feature: null },
    { path: '/projects', label: 'Projects', feature: 'showProjects' },
    { path: '/about', label: 'About', feature: null },
    { path: '/blog', label: 'Blog', feature: 'showBlog' },
    { path: '/contact', label: 'Contact', feature: 'showContact' },
  ];

  const navLinks = allNavLinks.filter(link => {
    if (!link.feature) return true;
    return siteSettings.features?.[link.feature] !== false;
  });

  const roleLabels = {
    developer: 'DEV',
    datascience: 'DATA',
    ux: 'UX'
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: scrolled 
          ? 'rgba(10, 14, 39, 0.95)' 
          : 'transparent',
        borderBottom: scrolled ? `1px solid ${roleTheme?.primary}20` : 'none',
      }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.span
            className="logo-text"
            whileHover={{ scale: 1.05 }}
            style={{ color: roleTheme?.primary }}
          >
            KDR
          </motion.span>
          <span className="logo-role" style={{ color: roleTheme?.secondary }}>
            /{roleLabels[selectedRole]}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              style={{
                color: location.pathname === link.path ? roleTheme?.primary : 'white',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <motion.button
            className="icon-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <FaSun color={roleTheme?.primary} /> : <FaMoon color={roleTheme?.primary} />}
          </motion.button>

          <motion.button
            className="icon-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSound}
            title="Toggle Sound"
          >
            {soundEnabled ? <FaVolumeUp color={roleTheme?.primary} /> : <FaVolumeMute color={roleTheme?.primary} />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes color={roleTheme?.primary} /> : <FaBars color={roleTheme?.primary} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: roleTheme?.background }}
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  style={{
                    color: location.pathname === link.path ? roleTheme?.primary : 'white',
                    borderLeft: location.pathname === link.path ? `4px solid ${roleTheme?.primary}` : '4px solid transparent',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
