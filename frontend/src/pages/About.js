import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useQuery } from '@apollo/client';
import { GET_PROFILE, GET_SKILLS, GET_EXPERIENCES, GET_EDUCATIONS } from '../graphql/queries';
import { FaBuilding, FaCalendar, FaMapMarkerAlt, FaGraduationCap, FaUniversity, FaAward } from 'react-icons/fa';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  const { selectedRole, getRoleTheme } = usePortfolio();
  const theme = getRoleTheme();

  const { data: profileData } = useQuery(GET_PROFILE, {
    variables: { portfolioType: selectedRole }
  });

  const { data: skillsData } = useQuery(GET_SKILLS, {
    variables: { portfolioType: selectedRole }
  });

  const { data: experiencesData } = useQuery(GET_EXPERIENCES, {
    variables: { portfolioType: selectedRole }
  });

  const { data: educationsData } = useQuery(GET_EDUCATIONS, {
    variables: { portfolioType: selectedRole }
  });

  const profile = profileData?.profile;
  const visibleSkills = skillsData?.skills?.filter(skill => skill.isVisible) || [];
  const visibleExperiences = experiencesData?.experiences?.filter(exp => exp.isVisible) || [];
  const visibleEducations = educationsData?.educations?.filter(edu => edu.isVisible) || [];

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      frontend: '#00d4ff',
      backend: '#00ff88',
      database: '#ff6b9d',
      tools: '#ffd700',
      datascience: '#9d4edd',
      ml: '#ff6b35',
      design: '#ff006e',
      other: '#8b95a5'
    };
    return colors[category] || colors.other;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate, current) => {
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    }
  };

  return (
    <>
      <SEO 
        title="About"
        description={profile?.bio || `Learn more about ${profile?.name || 'me'}`}
      />
      <div className="about-page" style={{ background: theme?.gradient }}>
        <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ color: theme?.primary }}>
            {profile?.aboutHeading || 'About Me'}
          </h1>
          <p>{profile?.title || 'Multi-disciplinary creator & problem solver'}</p>
        </motion.div>

        {profile?.showAbout && (
          <motion.section
            className="about-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 style={{ color: theme?.primary }}>Who I Am</h2>
            <p>
              {profile?.aboutDescription || `I'm ${profile?.name || 'Kuruguntla Deepak Reddy'}, a versatile technologist with expertise spanning software development,
              data science, and UX/UI design. I believe in creating holistic digital solutions that are not just
              functional, but delightful to use and backed by data-driven insights.`}
            </p>
            
            {profile?.aboutHighlights && profile.aboutHighlights.length > 0 && (
              <ul style={{ marginTop: '2rem' }}>
                {profile.aboutHighlights.map((highlight, index) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        )}

        {visibleSkills.length > 0 && (
          <motion.section
            className="skills-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 style={{ color: theme?.primary }}>Technical Skills</h2>
            <div className="skills-grid">
              {visibleSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="skill-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="skill-header">
                    {skill.icon && <span className="skill-icon">{skill.icon}</span>}
                    <h3 className="skill-name">{skill.name}</h3>
                  </div>
                  
                  <div className="skill-meta">
                    <span 
                      className="skill-category" 
                      style={{ backgroundColor: getCategoryColor(skill.category) }}
                    >
                      {skill.category}
                    </span>
                    {skill.yearsOfExperience > 0 && (
                      <span className="skill-years">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                      </span>
                    )}
                  </div>

                  <div className="skill-level">
                    <div className="skill-level-bar">
                      <motion.div 
                        className="skill-level-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                    <span className="skill-level-text">{skill.level}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {visibleExperiences.length > 0 && (
          <motion.section
            className="experience-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 style={{ color: theme?.primary }}>Professional Experience</h2>
            <div className="experience-timeline">
              {visibleExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="exp-header">
                      {exp.companyLogo && (
                        <img src={exp.companyLogo} alt={exp.company} className="exp-company-logo" />
                      )}
                      <div>
                        <h3>{exp.position}</h3>
                        <p className="exp-company">
                          <FaBuilding /> {exp.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="exp-meta">
                      <span className="exp-employment">{exp.employmentType}</span>
                      <span className="exp-date">
                        <FaCalendar /> {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                      <span className="exp-duration">
                        {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                      </span>
                      {exp.location && (
                        <span className="exp-location">
                          <FaMapMarkerAlt /> {exp.location}
                        </span>
                      )}
                    </div>

                    {exp.description && <p className="exp-description">{exp.description}</p>}

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="exp-responsibilities">
                        <h4>Key Responsibilities:</h4>
                        <ul>
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="exp-achievements">
                        <h4>Achievements:</h4>
                        <ul>
                          {exp.achievements.map((ach, idx) => (
                            <li key={idx}>🏆 {ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="exp-technologies">
                        {exp.technologies.map((tech, idx) => (
                          <span key={idx} className="exp-tech-badge">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {visibleEducations.length > 0 && (
          <motion.section
            className="education-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="section-title">
              <FaGraduationCap /> Education
            </h2>
            <div className="education-timeline">
              {visibleEducations.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="education-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="education-marker"></div>
                  <div className="education-content">
                    <div className="education-header">
                      {edu.institutionLogo && (
                        <img src={edu.institutionLogo} alt={edu.institution} className="institution-logo" />
                      )}
                      <div className="education-title-group">
                        <h3>{edu.degree}</h3>
                        {edu.field && <p className="education-field">{edu.field}</p>}
                        <p className="education-institution">
                          <FaUniversity /> {edu.institution}
                        </p>
                      </div>
                    </div>
                    
                    <div className="education-meta">
                      <span className="education-year">
                        <FaCalendar /> {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                      </span>
                      {edu.grade && (
                        <span className="education-grade">
                          <FaAward /> {edu.grade}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="education-description">{edu.description}</p>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="education-achievements">
                        <h4>Achievements & Honors</h4>
                        <ul>
                          {edu.achievements.map((ach, idx) => (
                            <li key={idx}>🏆 {ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="education-coursework">
                        <h4>Relevant Coursework</h4>
                        <div className="coursework-tags">
                          {edu.coursework.map((course, idx) => (
                            <span key={idx} className="course-tag">📚 {course}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
      </div>
    </>
  );
};

export default About;
