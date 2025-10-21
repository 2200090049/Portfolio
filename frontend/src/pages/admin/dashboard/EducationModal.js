import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaGraduationCap } from 'react-icons/fa';
import './EducationModal.css';

const EducationModal = ({ education, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    grade: '',
    startYear: '',
    endYear: '',
    current: false,
    description: '',
    achievements: [],
    coursework: [],
    institutionLogo: '',
    institutionWebsite: '',
    portfolioType: 'all',
    isVisible: true
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || '',
        degree: education.degree || '',
        field: education.field || '',
        grade: education.grade || '',
        startYear: education.startYear || '',
        endYear: education.endYear || '',
        current: education.current || false,
        description: education.description || '',
        achievements: education.achievements || [],
        coursework: education.coursework || [],
        institutionLogo: education.institutionLogo || '',
        institutionWebsite: education.institutionWebsite || '',
        portfolioType: education.portfolioType || 'all',
        isVisible: education.isVisible !== undefined ? education.isVisible : true
      });
    }
  }, [education]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear endYear if current is checked
    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, endYear: '' }));
    }
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

  const addCourse = () => {
    if (newCourse.trim()) {
      setFormData(prev => ({
        ...prev,
        coursework: [...prev.coursework, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const removeCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      coursework: prev.coursework.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.institution || !formData.degree || !formData.startYear) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare input data (exclude id, order, timestamps)
      const inputData = {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field || null,
        grade: formData.grade || null,
        startYear: parseInt(formData.startYear),
        endYear: formData.current ? null : (formData.endYear ? parseInt(formData.endYear) : null),
        current: formData.current,
        description: formData.description || null,
        achievements: formData.achievements,
        coursework: formData.coursework,
        institutionLogo: formData.institutionLogo || null,
        institutionWebsite: formData.institutionWebsite || null,
        portfolioType: formData.portfolioType,
        isVisible: formData.isVisible
      };

      const mutation = education
        ? `
          mutation UpdateEducation($id: ID!, $input: EducationInput!) {
            updateEducation(id: $id, input: $input) {
              id
              institution
              degree
            }
          }
        `
        : `
          mutation CreateEducation($input: EducationInput!) {
            createEducation(input: $input) {
              id
              institution
              degree
            }
          }
        `;

      const variables = education
        ? { id: education.id, input: inputData }
        : { input: inputData };

      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: mutation, variables })
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      if (data) {
        onSuccess(education ? '✅ Education updated successfully!' : '✅ Education added successfully!');
        onClose(true);
      }
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="education-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaGraduationCap /> {education ? 'Edit Education' : 'Add Education'}
          </h2>
          <button className="btn-close" onClick={() => onClose(false)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-group full-width">
              <label>Institution Name *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g., Harvard University"
                required
              />
            </div>

            <div className="form-group">
              <label>Degree *</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>

            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                name="field"
                value={formData.field}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="form-group">
              <label>Grade/GPA</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., 3.8/4.0"
              />
            </div>

            <div className="form-group">
              <label>Start Year *</label>
              <input
                type="number"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                placeholder="e.g., 2018"
                min="1950"
                max="2100"
                required
              />
            </div>

            <div className="form-group">
              <label>End Year</label>
              <input
                type="number"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                placeholder="e.g., 2022"
                min="1950"
                max="2100"
                disabled={formData.current}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                />
                Currently Pursuing
              </label>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of your studies..."
              />
            </div>

            {/* Institution Details */}
            <div className="form-group">
              <label>Institution Logo URL</label>
              <input
                type="url"
                name="institutionLogo"
                value={formData.institutionLogo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="form-group">
              <label>Institution Website</label>
              <input
                type="url"
                name="institutionWebsite"
                value={formData.institutionWebsite}
                onChange={handleChange}
                placeholder="https://university.edu"
              />
            </div>

            {/* Achievements */}
            <div className="form-group full-width">
              <label>Achievements & Honors</label>
              <div className="array-input">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add an achievement..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <button type="button" onClick={addAchievement} className="btn-add-item">
                  <FaPlus /> Add
                </button>
              </div>
              {formData.achievements.length > 0 && (
                <div className="array-list">
                  {formData.achievements.map((achievement, idx) => (
                    <div key={idx} className="array-item">
                      <span>🏆 {achievement}</span>
                      <button type="button" onClick={() => removeAchievement(idx)} className="btn-remove">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coursework */}
            <div className="form-group full-width">
              <label>Relevant Coursework</label>
              <div className="array-input">
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Add a course..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                />
                <button type="button" onClick={addCourse} className="btn-add-item">
                  <FaPlus /> Add
                </button>
              </div>
              {formData.coursework.length > 0 && (
                <div className="array-list">
                  {formData.coursework.map((course, idx) => (
                    <div key={idx} className="array-item">
                      <span>📚 {course}</span>
                      <button type="button" onClick={() => removeCourse(idx)} className="btn-remove">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="form-group">
              <label>Portfolio Type</label>
              <select name="portfolioType" value={formData.portfolioType} onChange={handleChange}>
                <option value="all">All Portfolios</option>
                <option value="developer">Developer</option>
                <option value="datascience">Data Science</option>
                <option value="ux">UX Designer</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                />
                Visible on Portfolio
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => onClose(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : (education ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationModal;
