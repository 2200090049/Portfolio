import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FaGraduationCap, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaGripVertical,
  FaUniversity,
  FaCalendar,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaAward
} from 'react-icons/fa';
import EducationModal from './EducationModal';
import './EducationManager.css';

const EducationManager = () => {
  const [educations, setEducations] = useState([]);
  const [stats, setStats] = useState({
    totalEducations: 0,
    degrees: 0,
    certifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [message, setMessage] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('all');

  const fetchEducations = async () => {
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
              educations {
                id
                institution
                degree
                field
                grade
                startYear
                endYear
                current
                description
                achievements
                coursework
                institutionLogo
                institutionWebsite
                portfolioType
                order
                isVisible
              }
            }
          `
        })
      });

      const { data } = await response.json();
      setEducations(data?.educations || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
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
              educationStats {
                totalEducations
                degrees
                certifications
              }
            }
          `
        })
      });

      const { data } = await response.json();
      setStats(data?.educationStats || stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchEducations();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(educations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEducations(items);

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
            mutation ReorderEducations($ids: [ID!]!) {
              reorderEducations(ids: $ids) {
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

  const handleAddEducation = () => {
    setEditingEducation(null);
    setShowModal(true);
  };

  const handleEditEducation = (education) => {
    setEditingEducation(education);
    setShowModal(true);
  };

  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;

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
            mutation DeleteEducation($id: ID!) {
              deleteEducation(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id }
        })
      });

      const { data } = await response.json();
      if (data?.deleteEducation?.success) {
        setMessage('✅ Education deleted successfully!');
        fetchEducations();
        fetchStats();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      setMessage('❌ Failed to delete education');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    setEditingEducation(null);
    if (shouldRefresh) {
      fetchEducations();
      fetchStats();
    }
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Filter educations
  const filteredEducations = educations.filter(edu => {
    const matchesSearch = edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edu.degree.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPortfolio = portfolioFilter === 'all' || edu.portfolioType === portfolioFilter || edu.portfolioType === 'all';
    
    return matchesSearch && matchesPortfolio;
  });

  if (loading) {
    return (
      <div className="education-manager">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="education-manager">
      <div className="manager-header">
        <div>
          <h1 className="god-mode-title">
            <FaGraduationCap /> <span className="gradient-text">Education Manager</span>
          </h1>
          <p className="manager-subtitle">Manage your academic journey</p>
        </div>
        <button className="btn-add" onClick={handleAddEducation}>
          <FaPlus /> Add Education
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaGraduationCap className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalEducations}</h3>
            <p>Total Records</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUniversity className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.degrees}</h3>
            <p>Degrees</p>
          </div>
        </div>
        <div className="stat-card">
          <FaAward className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.certifications}</h3>
            <p>Certifications</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by institution or degree..."
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
      </div>

      {/* Educations List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="educations" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`educations-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {filteredEducations.length === 0 ? (
                <div className="empty-state">
                  <FaGraduationCap size={64} />
                  <h3>No education records found</h3>
                  <p>Add your first education to get started</p>
                </div>
              ) : (
                filteredEducations.map((edu, index) => (
                  <Draggable key={edu.id} draggableId={edu.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`education-card ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <div className="drag-handle" {...provided.dragHandleProps}>
                          <FaGripVertical />
                        </div>

                        <div className="education-content">
                          <div className="education-header">
                            {edu.institutionLogo && (
                              <img src={edu.institutionLogo} alt={edu.institution} className="institution-logo" />
                            )}
                            <div className="education-title">
                              <h3>{edu.degree}</h3>
                              <p className="institution-name">
                                <FaUniversity /> {edu.institution}
                              </p>
                              {edu.field && <p className="field-name">{edu.field}</p>}
                            </div>
                          </div>

                          <div className="education-meta">
                            <span className="year-range">
                              <FaCalendar /> {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                            </span>
                            {edu.grade && (
                              <span className="grade">
                                <FaAward /> {edu.grade}
                              </span>
                            )}
                          </div>

                          {edu.description && (
                            <p className="education-description">{edu.description}</p>
                          )}

                          {edu.achievements && edu.achievements.length > 0 && (
                            <div className="achievements">
                              <h4>Achievements:</h4>
                              {edu.achievements.slice(0, 3).map((ach, idx) => (
                                <span key={idx} className="achievement-badge">🏆 {ach}</span>
                              ))}
                              {edu.achievements.length > 3 && (
                                <span className="more-badge">+{edu.achievements.length - 3} more</span>
                              )}
                            </div>
                          )}

                          {edu.coursework && edu.coursework.length > 0 && (
                            <div className="coursework">
                              {edu.coursework.slice(0, 5).map((course, idx) => (
                                <span key={idx} className="course-badge">{course}</span>
                              ))}
                              {edu.coursework.length > 5 && (
                                <span className="more-badge">+{edu.coursework.length - 5} more</span>
                              )}
                            </div>
                          )}

                          <div className="education-footer">
                            <div className="education-badges">
                              <span className="portfolio-badge">{edu.portfolioType}</span>
                              <span className={`visibility-badge ${edu.isVisible ? 'visible' : 'hidden'}`}>
                                {edu.isVisible ? <><FaEye /> Visible</> : <><FaEyeSlash /> Hidden</>}
                              </span>
                            </div>

                            <div className="education-actions">
                              <button className="btn-edit" onClick={() => handleEditEducation(edu)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="btn-delete" onClick={() => handleDeleteEducation(edu.id)}>
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
        <EducationModal
          education={editingEducation}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default EducationManager;
