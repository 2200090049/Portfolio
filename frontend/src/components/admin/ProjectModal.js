import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaProjectDiagram } from 'react-icons/fa';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: [],
    tools: [],
    github: '',
    liveDemo: '',
    image: '',
    featured: false,
    order: 0,
    achievements: [],
    challenges: '',
    duration: '',
    role: '',
    showInAllPortfolios: false
  });
  const [techInput, setTechInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        techStack: project.techStack || [],
        tools: project.tools || [],
        github: project.github || '',
        liveDemo: project.liveDemo || '',
        image: project.image || '',
        featured: project.featured || false,
        order: project.order || 0,
        achievements: project.achievements || [],
        challenges: project.challenges || '',
        duration: project.duration || '',
        role: project.role || '',
        showInAllPortfolios: project.showInAllPortfolios || false
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, toolInput.trim()]
      }));
      setToolInput('');
    }
  };

  const removeTool = (index) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required!');
      return;
    }

    if (!formData.category) {
      setError('Please select a category!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const mutation = project ? 'updateProject' : 'createProject';
      const variables = project 
        ? { id: project.id, input: formData }
        : { input: formData };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation ${mutation === 'createProject' ? 'CreateProject' : 'UpdateProject'}(${project ? '$id: ID!, ' : ''}$input: ProjectInput!) {
              ${mutation}(${project ? 'id: $id, ' : ''}input: $input) {
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
                showInAllPortfolios
              }
            }
          `,
          variables
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        setError(errors[0].message);
        return;
      }

      if (data?.[mutation]) {
        alert(`✅ Project ${project ? 'updated' : 'created'} successfully!`);
        onClose(data[mutation]);
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2><FaProjectDiagram /> {project ? 'Edit Project' : 'Add New Project'}</h2>
            <p>Fill in the project details below</p>
          </div>
          <button className="close-btn" onClick={() => onClose()}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group full-width">
              <label>Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="developer">Developer</option>
                <option value="datascience">Data Science</option>
                <option value="ux">UX Designer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
              />
            </div>
            <div className="form-group">
              <label>Your Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="form-group">
              <label>Live Demo URL</label>
              <input
                type="url"
                name="liveDemo"
                value={formData.liveDemo}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* Tech Stack */}
          <div className="form-group">
            <label>Tech Stack</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="Type and press Enter"
              />
              <button type="button" onClick={addTech} className="add-tag-btn">Add</button>
            </div>
            <div className="tags-list">
              {formData.techStack.map((tech, index) => (
                <span key={index} className="tag">
                  {tech}
                  <button type="button" onClick={() => removeTech(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="form-group">
            <label>Tools/Frameworks</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                placeholder="Type and press Enter"
              />
              <button type="button" onClick={addTool} className="add-tag-btn">Add</button>
            </div>
            <div className="tags-list">
              {formData.tools.map((tool, index) => (
                <span key={index} className="tag">
                  {tool}
                  <button type="button" onClick={() => removeTool(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="form-group">
            <label>Achievements</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                placeholder="Type and press Enter"
              />
              <button type="button" onClick={addAchievement} className="add-tag-btn">Add</button>
            </div>
            <div className="tags-list">
              {formData.achievements.map((achievement, index) => (
                <span key={index} className="tag">
                  {achievement}
                  <button type="button" onClick={() => removeAchievement(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Challenges Faced</label>
            <textarea
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              placeholder="What challenges did you overcome?"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Order (for sorting)</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span>Mark as Featured</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="showInAllPortfolios"
                  checked={formData.showInAllPortfolios}
                  onChange={handleChange}
                />
                <span>🌐 Show in ALL Portfolios</span>
              </label>
              {formData.showInAllPortfolios && (
                <small style={{ color: '#ffdd00', marginTop: '5px', display: 'block' }}>
                  ⚠️ This project will appear in Developer, Data Science, AND UX portfolios
                </small>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => onClose()}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
