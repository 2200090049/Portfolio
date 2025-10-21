import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useSettings } from '../context/SettingsContext';
import { useSite } from '../context/SiteContext';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_PROJECTS, GET_STATS, GET_PROFILE } from '../graphql/queries';
import { FaGithub, FaArrowRight, FaFileDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SEO from '../components/SEO';
import './Home.css';

const Home = () => {
  const { selectedRole, getRoleTheme } = usePortfolio();
  const { isAvailableForWork, availabilityMessage } = useSettings();
  const { siteSettings } = useSite();
  const theme = getRoleTheme();

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_FEATURED_PROJECTS, {
    variables: { category: selectedRole }
  });

  const { data: statsData } = useQuery(GET_STATS);

  const { data: profileData } = useQuery(GET_PROFILE, {
    variables: { portfolioType: selectedRole }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fallback content if no profile exists
  const roleContent = {
    developer: {
      tagline: "Building the future, one line of code at a time",
      description: "Full-stack architect crafting scalable web & mobile applications",
      stats: [
        { label: "Projects", value: statsData?.stats?.projectsByCategory?.developer || 0 },
        { label: "Years Experience", value: profileData?.profile?.stats?.yearsExperience || 0 }
      ]
    },
    datascience: {
      tagline: "Transforming raw data into actionable intelligence",
      description: "ML engineer & analytics expert driving data-driven decisions",
      stats: [
        { label: "Projects", value: statsData?.stats?.projectsByCategory?.datascience || 0 },
        { label: "Years Experience", value: profileData?.profile?.stats?.yearsExperience || 0 }
      ]
    },
    ux: {
      tagline: "Designing experiences that resonate with humans",
      description: "Human-centered design strategist creating emotional digital journeys",
      stats: [
        { label: "Projects", value: statsData?.stats?.projectsByCategory?.ux || 0 },
        { label: "Years Experience", value: profileData?.profile?.stats?.yearsExperience || 0 }
      ]
    }
  };

  const profile = profileData?.profile;
  const content = roleContent[selectedRole] || roleContent.developer;
  
  // Use profile data if available, otherwise use fallback
  const displayName = profile?.name || 'Deepak Reddy';
  const displayTitle = profile?.title || content.description;
  const displayTagline = profile?.tagline || content.tagline;
  
  // Use profile stats if available, otherwise use fallback
  const displayStats = profile?.showStats && profile?.stats ? [
    { label: "Projects Completed", value: profile.stats.projectsCompleted || 0 },
    { label: "Years Experience", value: profile.stats.yearsExperience || 0 }
  ] : content.stats;

  return (
    <>
      <SEO 
        title={`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portfolio`}
        description={profile?.bio || siteSettings.siteDescription}
      />
      <div className="home-container" style={{
        background: theme?.gradient
      }}>
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          {isAvailableForWork && (
            <motion.div
              className="hero-badge availability-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{ borderColor: theme?.primary }}
              title={availabilityMessage || 'Available for work'}
            >
              <span style={{ color: '#10b981' }}>●</span> {availabilityMessage || 'Available for opportunities'}
            </motion.div>
          )}
          
          {!isAvailableForWork && (
            <motion.div
              className="hero-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{ borderColor: theme?.primary }}
            >
              <span style={{ color: theme?.primary }}>●</span> Portfolio
            </motion.div>
          )}

          <motion.h1
            className="hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ color: theme?.text }}
          >
            Hi, I'm <span style={{ color: theme?.primary }}>{displayName}</span>
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ color: theme?.text }}
          >
            {displayTagline}
          </motion.p>

          <motion.p
            className="hero-description"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ color: theme?.textSecondary }}
          >
            {displayTitle}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link to="/projects">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: theme?.gradient }}
              >
                View Projects <FaArrowRight />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: theme?.primary, color: theme?.primary }}
              >
                Get in Touch
              </motion.button>
            </Link>
            {profile?.resumeUrl && (
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: theme?.primary, color: theme?.primary }}
                onClick={() => window.open(profile.resumeUrl, '_blank')}
              >
                <FaFileDownload /> View Resume
              </motion.button>
            )}
          </motion.div>

        </div>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              whileHover={{ scale: 1.1 }}
              style={{ borderColor: theme?.primary }}
            >
              <h3 style={{ color: theme?.primary }}>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Featured Projects - Only show if feature is enabled */}
      {siteSettings.features?.showProjects !== false && (
        <section className="featured-section">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: theme?.text }}
          >
            Featured Projects
          </motion.h2>

        <div className="projects-grid">
          {projectsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="project-card-skeleton">
                <Skeleton height={200} />
                <Skeleton count={3} style={{ marginTop: 10 }} />
              </div>
            ))
          ) : (
            projectsData?.featuredProjects?.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                style={{ borderColor: theme?.primary }}
              >
                {project.image && (
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="project-content">
                  <h3 style={{ color: theme?.primary }}>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.techStack?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="tech-tag" style={{ borderColor: theme?.primary }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub /> Code
                      </a>
                    )}
                    {project.liveDemo && (
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          className="view-all-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/projects">
            <motion.button
              className="btn-view-all"
              whileHover={{ scale: 1.05 }}
              style={{ borderColor: theme?.primary, color: theme?.primary }}
            >
              View All Projects <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ background: theme?.gradient }}
      >
        <h2>Let's Build Something Amazing Together</h2>
        <p>I'm always open to discussing new projects, creative ideas, or opportunities.</p>
        <Link to="/contact">
          <motion.button
            className="btn-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Conversation
          </motion.button>
        </Link>
      </motion.section>
      </div>
    </>
  );
};

export default Home;
