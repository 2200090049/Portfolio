import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import './SkillModal.css';

const SkillModal = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    level: 50,
    icon: '',
    portfolioType: 'all',
    yearsOfExperience: 0,
    isVisible: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData(skill);
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let finalValue = value;
    
    // Parse numbers for level and yearsOfExperience
    if (name === 'level' || name === 'yearsOfExperience') {
      finalValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      alert('Name and Category are required!');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare input - exclude id and other non-input fields
      const { id, order, createdAt, updatedAt, ...inputData } = formData;
      
      let query, variables;
      
      if (skill) {
        // Update existing skill
        query = `
          mutation UpdateSkill($id: ID!, $input: SkillInput!) {
            updateSkill(id: $id, input: $input) {
              id
              name
              category
              level
            }
          }
        `;
        variables = { id: skill.id, input: inputData };
      } else {
        // Create new skill
        query = `
          mutation CreateSkill($input: SkillInput!) {
            createSkill(input: $input) {
              id
              name
              category
              level
            }
          }
        `;
        variables = { input: inputData };
      }

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const response = await fetch(`${apiUrl}/graphql`, {
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

      const mutationName = skill ? 'updateSkill' : 'createSkill';
      if (data?.[mutationName]) {
        onSuccess(skill ? '✅ Skill updated successfully!' : '✅ Skill created successfully!');
        onClose(true);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose(false)}>
      <div className="modal-content skill-modal">
        <div className="modal-header">
          <h2>{skill ? 'Edit Skill' : 'Add New Skill'}</h2>
          <button className="btn-close" onClick={() => onClose(false)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Skill Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., React.js"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="tools">Tools & DevOps</option>
                <option value="datascience">Data Science</option>
                <option value="ml">Machine Learning</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>

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
              <label>Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="50"
              />
            </div>

            <div className="form-group full-width">
              <label>Icon (URL or name)</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., FaReact or https://..."
              />
            </div>

            <div className="form-group full-width">
              <label>Proficiency Level: {formData.level}%</label>
              <input
                type="range"
                name="level"
                value={formData.level}
                onChange={handleChange}
                min="0"
                max="100"
                className="level-slider"
              />
              <div className="level-bar-preview">
                <div 
                  className="level-fill-preview"
                  style={{ width: `${formData.level}%` }}
                ></div>
              </div>
            </div>

            <div className="form-group full-width">
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
              <FaSave /> {saving ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
