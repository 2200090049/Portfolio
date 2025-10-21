import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import './ExperienceModal.css';

const ExperienceModal = ({ experience, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    achievements: [],
    technologies: [],
    companyLogo: '',
    companyWebsite: '',
    portfolioType: 'all',
    isVisible: true
  });
  const [saving, setSaving] = useState(false);
  
  // Temporary inputs for arrays
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newTechnology, setNewTechnology] = useState('');

  useEffect(() => {
    if (experience) {
      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
      };

      setFormData({
        ...experience,
        startDate: formatDate(experience.startDate),
        endDate: formatDate(experience.endDate)
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Array management functions
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.position || !formData.startDate) {
      alert('Company, Position, and Start Date are required!');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare input - exclude id and timestamps
      const { id, order, createdAt, updatedAt, ...inputData } = formData;
      
      let query, variables;
      
      if (experience) {
        // Update existing experience
        query = `
          mutation UpdateExperience($id: ID!, $input: ExperienceInput!) {
            updateExperience(id: $id, input: $input) {
              id
              company
              position
            }
          }
        `;
        variables = { id: experience.id, input: inputData };
      } else {
        // Create new experience
        query = `
          mutation CreateExperience($input: ExperienceInput!) {
            createExperience(input: $input) {
              id
              company
              position
            }
          }
        `;
        variables = { input: inputData };
      }

      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }

      const mutationName = experience ? 'updateExperience' : 'createExperience';
      if (data?.[mutationName]) {
        onSuccess(experience ? '✅ Experience updated successfully!' : '✅ Experience created successfully!');
        onClose(true);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose(false)}>
      <div className="modal-content experience-modal">
        <div className="modal-header">
          <h2>{experience ? 'Edit Experience' : 'Add New Experience'}</h2>
          <button className="btn-close" onClick={() => onClose(false)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google"
                required
              />
            </div>

            <div className="form-group">
              <label>Position/Title *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label>Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Dates */}
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current}
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                />
                <span>I currently work here</span>
              </label>
            </div>

            {/* Company Details */}
            <div className="form-group">
              <label>Company Logo URL</label>
              <input
                type="text"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>Company Website</label>
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief overview of your role and company..."
              />
            </div>

            {/* Responsibilities */}
            <div className="form-group full-width">
              <label>Responsibilities</label>
              <div className="array-input">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Add a responsibility..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                />
                <button type="button" onClick={addResponsibility} className="btn-add-item">
                  <FaPlus />
                </button>
              </div>
              <div className="array-list">
                {formData.responsibilities.map((item, index) => (
                  <div key={index} className="array-item">
                    <span>• {item}</span>
                    <button type="button" onClick={() => removeResponsibility(index)} className="btn-remove-item">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="form-group full-width">
              <label>Achievements</label>
              <div className="array-input">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add an achievement..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <button type="button" onClick={addAchievement} className="btn-add-item">
                  <FaPlus />
                </button>
              </div>
              <div className="array-list">
                {formData.achievements.map((item, index) => (
                  <div key={index} className="array-item">
                    <span>🏆 {item}</span>
                    <button type="button" onClick={() => removeAchievement(index)} className="btn-remove-item">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="form-group full-width">
              <label>Technologies Used</label>
              <div className="array-input">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <button type="button" onClick={addTechnology} className="btn-add-item">
                  <FaPlus />
                </button>
              </div>
              <div className="tech-list">
                {formData.technologies.map((item, index) => (
                  <div key={index} className="tech-item">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeTechnology(index)} className="btn-remove-item">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Settings */}
            <div className="form-group">
              <label>Portfolio Type</label>
              <select name="portfolioType" value={formData.portfolioType} onChange={handleChange}>
                <option value="all">All Portfolios</option>
                <option value="developer">Developer Only</option>
                <option value="datascience">Data Science Only</option>
                <option value="ux">UX Designer Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                />
                <span>Visible on portfolio</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => onClose(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceModal;
