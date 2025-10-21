import React, { useState, useEffect } from 'react';
import { FaSave, FaUser, FaInfoCircle, FaChartBar, FaEye, FaTag, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import ImageUpload from '../../../components/admin/ImageUpload';
import './ProfileEditor.css';

const DataScienceEditor = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [highlightInput, setHighlightInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  const [formData, setFormData] = useState({
    portfolioType: 'datascience',
    name: '',
    title: '',
    tagline: '',
    bio: '',
    coverImage: '',
    aboutHeading: '',
    aboutDescription: '',
    aboutHighlights: [],
    stats: {
      projectsCompleted: 0,
      yearsExperience: 0
    },
    resumeUrl: '',
    isVisible: true,
    showStats: true,
    showAbout: true,
    showProjects: true,
    showBlogs: true,
    showContact: true,
    metaDescription: '',
    metaKeywords: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
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
                profile(portfolioType: "datascience") {
                  portfolioType
                  name
                  title
                  tagline
                  bio
                  coverImage
                  aboutHeading
                  aboutDescription
                  aboutHighlights
                  stats {
                    projectsCompleted
                    yearsExperience
                  }
                  resumeUrl
                  isVisible
                  showStats
                  showAbout
                  showProjects
                  showBlogs
                  showContact
                  metaDescription
                  metaKeywords
                }
              }
            `
          })
        });

        const { data } = await response.json();
        if (data?.profile) {
          setFormData(data.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        aboutHighlights: [...prev.aboutHighlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      aboutHighlights: prev.aboutHighlights.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.title) {
      setMessage({ type: 'error', text: 'Name and Title are required!' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

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
            mutation UpdateProfile($portfolioType: String!, $input: ProfileInput!) {
              updateProfile(portfolioType: $portfolioType, input: $input) {
                portfolioType
                name
                title
              }
            }
          `,
          variables: {
            portfolioType: 'datascience',
            input: {
              name: formData.name,
              title: formData.title,
              tagline: formData.tagline,
              bio: formData.bio,
              coverImage: formData.coverImage,
              aboutHeading: formData.aboutHeading,
              aboutDescription: formData.aboutDescription,
              aboutHighlights: formData.aboutHighlights,
              stats: formData.stats,
              resumeUrl: formData.resumeUrl,
              isVisible: formData.isVisible,
              showStats: formData.showStats,
              showAbout: formData.showAbout,
              showProjects: formData.showProjects,
              showBlogs: formData.showBlogs,
              showContact: formData.showContact,
              metaDescription: formData.metaDescription,
              metaKeywords: formData.metaKeywords
            }
          }
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        setMessage({ type: 'error', text: errors[0].message });
      } else if (data?.updateProfile) {
        setMessage({ type: 'success', text: '✅ Data Science Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <FaUser /> },
    { id: 'photos', label: 'Photos', icon: <FaImage /> },
    { id: 'about', label: 'About Section', icon: <FaInfoCircle /> },
    { id: 'stats', label: 'Stats & Resume', icon: <FaChartBar /> },
    { id: 'visibility', label: 'Visibility', icon: <FaEye /> },
    { id: 'seo', label: 'SEO & Meta', icon: <FaTag /> }
  ];

  if (loading) {
    return (
      <div className="profile-editor">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Data Science Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-editor">
      <div className="editor-header">
        <div className="header-content">
          <h1 className="god-mode-title">
            <span className="gradient-text">GOD MODE</span> Data Science Profile
          </h1>
          <p className="editor-subtitle">Configure your Data Science portfolio settings</p>
        </div>
        <button 
          className="btn-save" 
          onClick={handleSubmit}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="editor-form">
        
        {/* BASIC INFO TAB */}
        {activeTab === 'basic' && (
          <div className="tab-content">
            <h2 className="section-title">Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Professional Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Data Scientist"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A catchy one-liner about yourself"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="5"
              />
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="tab-content">
            <h2 className="section-title">Profile & Cover Photos</h2>
            <p className="section-description">Upload your cover image</p>
            
            <div className="form-grid">
              <ImageUpload
                label="Cover Image"
                currentImage={formData.coverImage}
                portfolioType="datascience"
                imageType="cover"
                onUploadSuccess={(imagePath) => setFormData({ ...formData, coverImage: imagePath })}
                onDelete={() => setFormData({ ...formData, coverImage: '' })}
              />
            </div>
            
            <div className="info-box">
              <p><strong>Profile Image:</strong> Recommended size 400x400px (square)</p>
              <p><strong>Cover Image:</strong> Recommended size 1200x400px (wide banner)</p>
            </div>
          </div>
        )}

        {/* ABOUT SECTION TAB */}
        {activeTab === 'about' && (
          <div className="tab-content">
            <h2 className="section-title">About Section</h2>

            <div className="form-group">
              <label>About Heading</label>
              <input
                type="text"
                name="aboutHeading"
                value={formData.aboutHeading}
                onChange={handleChange}
                placeholder="e.g., About Me"
              />
            </div>

            <div className="form-group">
              <label>About Description</label>
              <textarea
                name="aboutDescription"
                value={formData.aboutDescription}
                onChange={handleChange}
                placeholder="Detailed description for your about section..."
                rows="8"
              />
            </div>

            <div className="form-group">
              <label>About Highlights</label>
              <div className="array-input">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add a highlight point"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                />
                <button type="button" onClick={addHighlight} className="btn-add">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="tags-container">
                {formData.aboutHighlights.map((highlight, index) => (
                  <span key={index} className="tag">
                    {highlight}
                    <button type="button" onClick={() => removeHighlight(index)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATS & RESUME TAB */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <h2 className="section-title">Statistics & Resume</h2>

            <div className="stats-grid">
              <div className="form-group">
                <label>Projects Completed</label>
                <input
                  type="number"
                  name="projectsCompleted"
                  value={formData.stats.projectsCompleted}
                  onChange={handleStatChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.stats.yearsExperience}
                  onChange={handleStatChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Resume URL</label>
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />
              {formData.resumeUrl && (
                <small className="hint">
                  📄 <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </small>
              )}
            </div>
          </div>
        )}

        {/* VISIBILITY TAB */}
        {activeTab === 'visibility' && (
          <div className="tab-content">
            <h2 className="section-title">Visibility Settings</h2>
            <p className="section-description">Control which sections are visible on your portfolio</p>

            <div className="visibility-grid">
              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Portfolio Visible</span>
                    <span className="checkbox-description">Make your entire portfolio visible to public</span>
                  </div>
                </label>
              </div>

              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showStats"
                    checked={formData.showStats}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Show Statistics</span>
                    <span className="checkbox-description">Display stats (projects, experience, etc.)</span>
                  </div>
                </label>
              </div>

              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showAbout"
                    checked={formData.showAbout}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Show About Section</span>
                    <span className="checkbox-description">Display about section on portfolio</span>
                  </div>
                </label>
              </div>

              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showProjects"
                    checked={formData.showProjects}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Show Projects</span>
                    <span className="checkbox-description">Display projects section</span>
                  </div>
                </label>
              </div>

              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showBlogs"
                    checked={formData.showBlogs}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Show Blogs</span>
                    <span className="checkbox-description">Display blogs section</span>
                  </div>
                </label>
              </div>

              <div className="checkbox-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showContact"
                    checked={formData.showContact}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-title">Show Contact</span>
                    <span className="checkbox-description">Display contact section</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SEO & META TAB */}
        {activeTab === 'seo' && (
          <div className="tab-content">
            <h2 className="section-title">SEO & Meta Information</h2>
            <p className="section-description">Optimize your portfolio for search engines</p>

            <div className="form-group">
              <label>Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Brief description for search engines (160 characters max)"
                rows="3"
                maxLength="160"
              />
              <small className="char-count">
                {formData.metaDescription.length}/160 characters
              </small>
            </div>

            <div className="form-group">
              <label>Meta Keywords</label>
              <div className="array-input">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add a keyword"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <button type="button" onClick={addKeyword} className="btn-add">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="tags-container">
                {formData.metaKeywords.map((keyword, index) => (
                  <span key={index} className="tag keyword-tag">
                    {keyword}
                    <button type="button" onClick={() => removeKeyword(index)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Save Button */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Save Data Science Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataScienceEditor;
