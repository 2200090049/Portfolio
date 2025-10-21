import React, { useState, useEffect, useMemo } from 'react';
import { FaProjectDiagram, FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';
import ProjectModal from '../../../components/admin/ProjectModal';
import '../AdminDashboard.css';
import './ProjectsManager.css';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
              allProjects {
                id
                title
                description
                category
                techStack
                tools
                github
                liveDemo
                image
                featured
                order
                achievements
                challenges
                duration
                role
                showInAllPortfolios
                createdAt
                updatedAt
              }
            }
          `
        })
      });

      const { data } = await response.json();
      if (data?.allProjects) {
        console.log('✅ Fetched projects:', data.allProjects.length, 'projects');
        setProjects(data.allProjects);
      } else {
        console.log('⚠️ No projects data received');
        setProjects([]); // Ensure projects is always an array
      }
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      setProjects([]); // Ensure projects is always an array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone!')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
  const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation DeleteProject($id: ID!) {
              deleteProject(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id: projectId }
        })
      });

      const { data } = await response.json();
      if (data?.deleteProject?.success) {
        alert('✅ Project deleted successfully!');
        fetchProjects(); // Refresh list to update stats
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('❌ Failed to delete project');
    }
  };

  const handleModalClose = (updatedProject) => {
    setShowModal(false);
    if (updatedProject) {
      fetchProjects(); // Refresh list
    }
  };

  const filteredProjects = (projects || [])
    .filter(p => filter === 'all' || p.category === filter)
    .filter(p => 
      p?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = useMemo(() => {
    const calculatedStats = {
      total: projects.length,
      developer: projects.filter(p => p.category === 'developer').length,
      datascience: projects.filter(p => p.category === 'datascience').length,
      ux: projects.filter(p => p.category === 'ux').length,
      featured: projects.filter(p => p.featured).length
    };
    console.log('📊 Projects Stats:', calculatedStats, 'Total Projects:', projects.length);
    return calculatedStats;
  }, [projects]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-manager">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaProjectDiagram /> Projects Manager
          </h1>
          <p className="page-subtitle">
            Manage all your projects across all portfolios
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddProject}>
          <FaPlus /> Add New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="mini-stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{stats?.total || 0}</div>
          <div className="stat-text">Total Projects</div>
        </div>
        <div className="mini-stat-card" onClick={() => setFilter('developer')} style={{ cursor: 'pointer' }}>
          <div className="stat-number" style={{ color: '#00d4ff' }}>{stats?.developer || 0}</div>
          <div className="stat-text">Developer</div>
        </div>
        <div className="mini-stat-card" onClick={() => setFilter('datascience')} style={{ cursor: 'pointer' }}>
          <div className="stat-number" style={{ color: '#0077ff' }}>{stats?.datascience || 0}</div>
          <div className="stat-text">Data Science</div>
        </div>
        <div className="mini-stat-card" onClick={() => setFilter('ux')} style={{ cursor: 'pointer' }}>
          <div className="stat-number" style={{ color: '#8a2be2' }}>{stats?.ux || 0}</div>
          <div className="stat-text">UX Designer</div>
        </div>
        <div className="mini-stat-card">
          <div className="stat-number" style={{ color: '#ffdd00' }}>{stats?.featured || 0}</div>
          <div className="stat-text">Featured</div>
        </div>
      </div>

      {/* Filters */}
      <div className="content-container" style={{ marginBottom: '20px' }}>
        <div className="filters-bar">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <FaFilter />
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'developer' ? 'active' : ''}`}
              onClick={() => setFilter('developer')}
            >
              Developer
            </button>
            <button 
              className={`filter-btn ${filter === 'datascience' ? 'active' : ''}`}
              onClick={() => setFilter('datascience')}
            >
              Data Science
            </button>
            <button 
              className={`filter-btn ${filter === 'ux' ? 'active' : ''}`}
              onClick={() => setFilter('ux')}
            >
              UX Designer
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaProjectDiagram /></div>
          <div className="empty-state-text">
            {searchTerm || filter !== 'all' ? 'No projects found matching your criteria' : 'No projects yet'}
          </div>
          <button className="btn-primary" onClick={handleAddProject}>
            <FaPlus /> Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              {project.featured && (
                <div className="featured-badge">⭐ Featured</div>
              )}
              
              <div className="project-image">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div className="project-placeholder">
                    <FaProjectDiagram />
                  </div>
                )}
                <div className="project-overlay">
                  <button 
                    className="overlay-btn edit"
                    onClick={() => handleEditProject(project)}
                    title="Edit Project"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="overlay-btn delete"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Delete Project"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="project-content">
                <div className="project-category" data-category={project.category}>
                  {project.category}
                </div>
                
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">
                  {project.description.substring(0, 100)}...
                </p>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="tech-stack">
                    {project.techStack.slice(0, 4).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="tech-tag">+{project.techStack.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ProjectsManager;
