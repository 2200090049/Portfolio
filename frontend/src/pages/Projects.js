import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../graphql/queries';
import { usePortfolio } from '../context/PortfolioContext';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import SEO from '../components/SEO';
import './Projects.css';

const Projects = () => {
  const { selectedRole, getRoleTheme } = usePortfolio();
  const theme = getRoleTheme();

  // Always filter by the selected portfolio role (no "all" option)
  const { data, loading } = useQuery(GET_PROJECTS, {
    variables: { category: selectedRole }
  });

  return (
    <>
      <SEO 
        title="Projects"
        description={`Explore my ${selectedRole} projects and work`}
      />
      <div className="projects-page" style={{ background: theme?.gradient }}>
        <div className="container">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ color: theme?.primary }}>My Projects</h1>
          <p>Explore my work across different domains</p>
        </motion.div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="project-card-skeleton">
                <Skeleton height={200} />
                <Skeleton count={3} style={{ marginTop: 10 }} />
              </div>
            ))
          ) : data?.projects?.length > 0 ? (
            data.projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{ borderColor: theme?.primary }}
              >
                {project.image && (
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                    <div className="project-overlay">
                      <div className="project-actions">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <FaGithub size={24} />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                            <FaExternalLinkAlt size={24} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="project-content">
                  <div className="project-header">
                    <h3 style={{ color: theme?.primary }}>{project.title}</h3>
                    {project.featured && <span className="featured-badge">⭐ Featured</span>}
                  </div>
                  
                  {(project.role || project.duration) && (
                    <div className="project-meta">
                      {project.role && <span className="meta-item">🎯 {project.role}</span>}
                      {project.duration && <span className="meta-item">⏱️ {project.duration}</span>}
                    </div>
                  )}
                  
                  <p className="project-description">{project.description}</p>
                  
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="project-tech">
                      {project.techStack.slice(0, 6).map((tech, i) => (
                        <span key={i} className="tech-tag" style={{ borderColor: theme?.secondary, color: theme?.secondary }}>
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 6 && (
                        <span className="tech-tag" style={{ borderColor: theme?.secondary }}>
                          +{project.techStack.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {(project.github || project.liveDemo) && (
                    <div className="project-links-footer">
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="project-link-btn"
                          style={{ borderColor: theme?.primary, color: theme?.primary }}
                        >
                          <FaGithub /> View Code
                        </a>
                      )}
                      {project.liveDemo && (
                        <a 
                          href={project.liveDemo} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="project-link-btn primary"
                          style={{ background: theme?.primary, borderColor: theme?.primary }}
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-projects">
              <p>No projects found. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Projects;
