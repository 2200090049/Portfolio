import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CONTACT, GET_SOCIAL_LINKS } from '../graphql/queries';
import { usePortfolio } from '../context/PortfolioContext';
import { toast } from 'react-toastify';
import { 
  FaPaperPlane, 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaMedium,
  FaDev,
  FaStackOverflow,
  FaLink
} from 'react-icons/fa';
import { SiKaggle, SiBehance, SiDribbble, SiLeetcode, SiHackerrank } from 'react-icons/si';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
  const { selectedRole, getRoleTheme } = usePortfolio();
  const theme = getRoleTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: selectedRole
  });

  const [createContact, { loading }] = useMutation(CREATE_CONTACT);
  const { data: socialData } = useQuery(GET_SOCIAL_LINKS);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact({ variables: { input: formData } });
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '', category: selectedRole });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <SEO 
        title="Contact"
        description="Get in touch with me for collaborations, projects, or just to say hi!"
      />
      <div className="contact-page" style={{ background: theme?.gradient }}>
        <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ color: theme?.primary }}>Get In Touch</h1>
          <p>Let's create something amazing together</p>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ borderColor: theme?.primary }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ borderColor: theme?.primary }}
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ borderColor: theme?.primary }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            style={{ borderColor: theme?.primary }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: theme?.gradient }}
          >
            {loading ? 'Sending...' : 'Send Message'} <FaPaperPlane />
          </button>
        </motion.form>

        {/* Social Links Section */}
        {socialData?.socialLinks && (
          <motion.div
            className="contact-social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 style={{ color: theme?.primary }}>Connect With Me</h3>
            
            {/* Contact Information */}
            <div className="contact-info-cards">
              {socialData.socialLinks.email && (
                <div className="contact-info-card">
                  <FaEnvelope size={24} style={{ color: theme?.primary }} />
                  <div>
                    <h4>Email</h4>
                    <a href={`mailto:${socialData.socialLinks.email}`}>
                      {socialData.socialLinks.email}
                    </a>
                  </div>
                </div>
              )}
              {socialData.socialLinks.phone && (
                <div className="contact-info-card">
                  <FaPhone size={24} style={{ color: theme?.primary }} />
                  <div>
                    <h4>Phone</h4>
                    <a href={`tel:${socialData.socialLinks.phone}`}>
                      {socialData.socialLinks.phone}
                    </a>
                  </div>
                </div>
              )}
              {socialData.socialLinks.location && (
                <div className="contact-info-card">
                  <FaMapMarkerAlt size={24} style={{ color: theme?.primary }} />
                  <div>
                    <h4>Location</h4>
                    <p>{socialData.socialLinks.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="social-icons">
              {socialData.socialLinks.github && (
                <a
                  href={socialData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <FaGithub size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.linkedin && (
                <a
                  href={socialData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedin size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.leetcode && (
                <a
                  href={socialData.socialLinks.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                  title="LeetCode"
                >
                  <SiLeetcode size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.hackerrank && (
                <a
                  href={socialData.socialLinks.hackerrank}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HackerRank"
                  title="HackerRank"
                >
                  <SiHackerrank size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.medium && (
                <a
                  href={socialData.socialLinks.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium"
                  title="Medium"
                >
                  <FaMedium size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.devto && (
                <a
                  href={socialData.socialLinks.devto}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dev.to"
                  title="Dev.to"
                >
                  <FaDev size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.stackoverflow && (
                <a
                  href={socialData.socialLinks.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Stack Overflow"
                  title="Stack Overflow"
                >
                  <FaStackOverflow size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.kaggle && (
                <a
                  href={socialData.socialLinks.kaggle}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kaggle"
                  title="Kaggle"
                >
                  <SiKaggle size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.behance && (
                <a
                  href={socialData.socialLinks.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Behance"
                  title="Behance"
                >
                  <SiBehance size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.dribbble && (
                <a
                  href={socialData.socialLinks.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  title="Dribbble"
                >
                  <SiDribbble size={28} style={{ color: theme?.primary }} />
                </a>
              )}
              {socialData.socialLinks.personalWebsite && (
                <a
                  href={socialData.socialLinks.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  title="Personal Website"
                >
                  <FaLink size={28} style={{ color: theme?.primary }} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
      </div>
    </>
  );
};

export default Contact;
