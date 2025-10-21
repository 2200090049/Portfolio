import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaSearch, FaFilter, FaChartBar } from 'react-icons/fa';
import SkillModal from './SkillModal';
import './SkillsManager.css';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'tools', label: 'Tools & DevOps' },
    { value: 'datascience', label: 'Data Science' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'design', label: 'Design' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('adminToken');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              skills {
                id
                name
                category
                level
                icon
                portfolioType
                order
                isVisible
                yearsOfExperience
              }
            }
          `
        })
      });

      const { data } = await response.json();
      if (data?.skills) {
        setSkills(data.skills.sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setMessage({ type: 'error', text: 'Failed to load skills' });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate stats from skills array
  const stats = {
    totalSkills: skills.length,
    skillsByCategory: {
      frontend: skills.filter(s => s.category === 'frontend').length,
      backend: skills.filter(s => s.category === 'backend').length,
      database: skills.filter(s => s.category === 'database').length,
      tools: skills.filter(s => s.category === 'tools').length,
      datascience: skills.filter(s => s.category === 'datascience').length,
      ml: skills.filter(s => s.category === 'ml').length,
      design: skills.filter(s => s.category === 'design').length,
      other: skills.filter(s => s.category === 'other').length
    },
    skillsByPortfolio: {
      developer: skills.filter(s => s.portfolioType === 'developer').length,
      datascience: skills.filter(s => s.portfolioType === 'datascience').length,
      ux: skills.filter(s => s.portfolioType === 'ux').length
    }
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('adminToken');
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation DeleteSkill($id: ID!) {
              deleteSkill(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id: skillId }
        })
      });

      const { data } = await response.json();
      if (data?.deleteSkill?.success) {
        setMessage({ type: 'success', text: '✅ Skill deleted successfully!' });
        fetchSkills(); // This will recalculate stats automatically
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setMessage({ type: 'error', text: 'Failed to delete skill' });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredSkills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately
    const updatedSkills = items.map((item, index) => ({
      ...item,
      order: index
    }));
    setSkills(updatedSkills);

    // Save to backend
    try {
      const token = localStorage.getItem('adminToken');
      const ids = items.map(item => item.id);
      
  await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation ReorderSkills($ids: [ID!]!) {
              reorderSkills(ids: $ids) {
                success
                message
              }
            }
          `,
          variables: { ids }
        })
      });
    } catch (error) {
      console.error('Error reordering skills:', error);
      setMessage({ type: 'error', text: 'Failed to save new order' });
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    setEditingSkill(null);
    if (shouldRefresh) {
      fetchSkills(); // This will recalculate stats automatically
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesPortfolio = portfolioFilter === 'all' || skill.portfolioType === portfolioFilter || skill.portfolioType === 'all';
    return matchesSearch && matchesCategory && matchesPortfolio;
  });

  const getCategoryBadgeColor = (category) => {
    const colors = {
      frontend: '#00d4ff',
      backend: '#00ff88',
      database: '#ff6b9d',
      tools: '#ffd700',
      datascience: '#9d4edd',
      ml: '#ff006e',
      design: '#ff7e00',
      other: '#64dfdf'
    };
    return colors[category] || '#00d4ff';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="skills-manager">
      <div className="manager-header">
        <div>
          <h1 className="god-mode-title">
            <span className="gradient-text">⚡ GOD MODE</span> Skills Manager
          </h1>
          <p className="header-subtitle">Manage and reorder your technical skills</p>
        </div>
        <button className="btn-add" onClick={handleAddSkill}>
          <FaPlus /> Add Skill
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaChartBar className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalSkills || 0}</h3>
            <p>Total Skills</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-info">
            <h3>{stats.skillsByCategory?.frontend || 0}</h3>
            <p>Frontend</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <h3>{stats.skillsByCategory?.backend || 0}</h3>
            <p>Backend</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗄️</div>
          <div className="stat-info">
            <h3>{stats.skillsByCategory?.database || 0}</h3>
            <p>Database</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select value={portfolioFilter} onChange={(e) => setPortfolioFilter(e.target.value)}>
            <option value="all">All Portfolios</option>
            <option value="developer">Developer</option>
            <option value="datascience">Data Science</option>
            <option value="ux">UX Designer</option>
          </select>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Skills List with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              className={`skills-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredSkills.length === 0 ? (
                <div className="empty-state">
                  <p>No skills found. Add your first skill!</p>
                </div>
              ) : (
                filteredSkills.map((skill, index) => (
                  <Draggable key={skill.id} draggableId={skill.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={`skill-card ${snapshot.isDragging ? 'dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="drag-handle" {...provided.dragHandleProps}>
                          <FaGripVertical />
                        </div>
                        
                        <div className="skill-info">
                          <h3>{skill.name}</h3>
                          <span 
                            className="category-badge"
                            style={{ background: getCategoryBadgeColor(skill.category) }}
                          >
                            {skill.category}
                          </span>
                        </div>

                        <div className="skill-level">
                          <div className="level-bar">
                            <div 
                              className="level-fill"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <span className="level-text">{skill.level}%</span>
                        </div>

                        <div className="skill-meta">
                          <span className="portfolio-badge">{skill.portfolioType}</span>
                          <span className="years-badge">{skill.yearsOfExperience} yrs</span>
                          <span className={`visibility-badge ${skill.isVisible ? 'visible' : 'hidden'}`}>
                            {skill.isVisible ? '👁️ Visible' : '🚫 Hidden'}
                          </span>
                        </div>

                        <div className="skill-actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditSkill(skill)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <FaTrash />
                          </button>
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

      {/* Modal */}
      {showModal && (
        <SkillModal
          skill={editingSkill}
          onClose={handleModalClose}
          onSuccess={(msg) => setMessage({ type: 'success', text: msg })}
        />
      )}
    </div>
  );
};

export default SkillsManager;
