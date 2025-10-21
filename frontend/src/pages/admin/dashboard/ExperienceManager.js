import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FaBriefcase, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaGripVertical,
  FaBuilding,
  FaCalendar,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaClock
} from 'react-icons/fa';
import ExperienceModal from './ExperienceModal';
import './ExperienceManager.css';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState({
    totalExperiences: 0,
    currentJobs: 0,
    totalYears: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [message, setMessage] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [employmentFilter, setEmploymentFilter] = useState('all');

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              experiences {
                id
                company
                position
                employmentType
                location
                startDate
                endDate
                current
                description
                responsibilities
                achievements
                technologies
                companyLogo
                companyWebsite
                portfolioType
                order
                isVisible
              }
            }
          `
        })
      });

      const { data } = await response.json();
      setExperiences(data?.experiences || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              experienceStats {
                totalExperiences
                currentJobs
                totalYears
              }
            }
          `
        })
      });

      const { data } = await response.json();
      setStats(data?.experienceStats || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchExperiences();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExperiences(items);

    // Save new order to backend
    try {
      const token = localStorage.getItem('adminToken');
      const ids = items.map(item => item.id);
      
      await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation ReorderExperiences($ids: [ID!]!) {
              reorderExperiences(ids: $ids) {
                success
              }
            }
          `,
          variables: { ids }
        })
      });
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setShowModal(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setShowModal(true);
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation DeleteExperience($id: ID!) {
              deleteExperience(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id }
        })
      });

      const { data } = await response.json();
      if (data?.deleteExperience?.success) {
        setMessage('✅ Experience deleted successfully!');
        fetchExperiences();
        fetchStats();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      setMessage('❌ Failed to delete experience');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    setEditingExperience(null);
    if (shouldRefresh) {
      fetchExperiences();
      fetchStats();
    }
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
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

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Filter experiences
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPortfolio = portfolioFilter === 'all' || exp.portfolioType === portfolioFilter || exp.portfolioType === 'all';
    const matchesEmployment = employmentFilter === 'all' || exp.employmentType === employmentFilter;
    
    return matchesSearch && matchesPortfolio && matchesEmployment;
  });

  if (loading) {
    return (
      <div className="experience-manager">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="experience-manager">
      <div className="manager-header">
        <div>
          <h1 className="god-mode-title">
            <FaBriefcase /> <span className="gradient-text">Experience Manager</span>
          </h1>
          <p className="manager-subtitle">Manage your professional journey</p>
        </div>
        <button className="btn-add" onClick={handleAddExperience}>
          <FaPlus /> Add Experience
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaBriefcase className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalExperiences}</h3>
            <p>Total Positions</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.currentJobs}</h3>
            <p>Current Roles</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendar className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalYears}</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by company or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Portfolio:</label>
          <select value={portfolioFilter} onChange={(e) => setPortfolioFilter(e.target.value)}>
            <option value="all">All Portfolios</option>
            <option value="developer">Developer</option>
            <option value="datascience">Data Science</option>
            <option value="ux">UX Designer</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Employment:</label>
          <select value={employmentFilter} onChange={(e) => setEmploymentFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Experiences List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experiences" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`experiences-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {filteredExperiences.length === 0 ? (
                <div className="empty-state">
                  <FaBriefcase size={64} />
                  <h3>No experiences found</h3>
                  <p>Add your first work experience to get started</p>
                </div>
              ) : (
                filteredExperiences.map((exp, index) => (
                  <Draggable key={exp.id} draggableId={exp.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`experience-card ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <div className="drag-handle" {...provided.dragHandleProps}>
                          <FaGripVertical />
                        </div>

                        <div className="experience-content">
                          <div className="experience-header">
                            {exp.companyLogo && (
                              <img src={exp.companyLogo} alt={exp.company} className="company-logo" />
                            )}
                            <div className="experience-title">
                              <h3>{exp.position}</h3>
                              <p className="company-name">
                                <FaBuilding /> {exp.company}
                              </p>
                            </div>
                          </div>

                          <div className="experience-meta">
                            <span className="employment-type">{exp.employmentType}</span>
                            <span className="date-range">
                              <FaCalendar /> {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </span>
                            <span className="duration">
                              <FaClock /> {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                            </span>
                            {exp.location && (
                              <span className="location">
                                <FaMapMarkerAlt /> {exp.location}
                              </span>
                            )}
                          </div>

                          {exp.description && (
                            <p className="experience-description">{exp.description}</p>
                          )}

                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="technologies">
                              {exp.technologies.map((tech, idx) => (
                                <span key={idx} className="tech-badge">{tech}</span>
                              ))}
                            </div>
                          )}

                          <div className="experience-footer">
                            <div className="experience-badges">
                              <span className="portfolio-badge">{exp.portfolioType}</span>
                              <span className={`visibility-badge ${exp.isVisible ? 'visible' : 'hidden'}`}>
                                {exp.isVisible ? <><FaEye /> Visible</> : <><FaEyeSlash /> Hidden</>}
                              </span>
                            </div>

                            <div className="experience-actions">
                              <button className="btn-edit" onClick={() => handleEditExperience(exp)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="btn-delete" onClick={() => handleDeleteExperience(exp.id)}>
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showModal && (
        <ExperienceModal
          experience={editingExperience}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ExperienceManager;
