import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaSave,
  FaGlobe,
  FaEnvelope,
  FaInfoCircle,
  FaPalette,
  FaToggleOn,
  FaChartBar,
  FaSearch as FaSeo,
  FaTools,
  FaPlus,
  FaTrash,
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaDev,
  FaStackOverflow,
  FaPhone,
  FaMapMarkerAlt,
  FaLink
} from 'react-icons/fa';
import { SiKaggle, SiBehance, SiDribbble, SiLeetcode, SiHackerrank } from 'react-icons/si';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('social');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Social Links State
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    leetcode: '',
    hackerrank: '',
    medium: '',
    devto: '',
    stackoverflow: '',
    kaggle: '',
    behance: '',
    dribbble: '',
    email: '',
    phone: '',
    location: '',
    personalWebsite: '',
    customLinks: []
  });

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    siteKeywords: [],
    availableForWork: false,
    availabilityMessage: '',
    emailConfig: {
      enabled: false,
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      senderEmail: '',
      receiverEmail: '',
      autoReply: false,
      autoReplyMessage: ''
    },
    theme: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      darkMode: true,
      font: 'Inter'
    },
    features: {
      showBlog: true,
      showProjects: true,
      showTestimonials: true,
      showNewsletter: false,
      showContact: true,
      enableComments: false,
      enableAnalytics: false
    },
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: ''
    },
    seo: {
      ogImage: '',
      twitterHandle: '',
      favicon: ''
    },
    maintenanceMode: false,
    maintenanceMessage: ''
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newCustomLink, setNewCustomLink] = useState({ name: '', url: '', icon: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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
              siteSettings {
                siteName
                siteTitle
                siteDescription
                siteKeywords
                availableForWork
                availabilityMessage
                emailConfig {
                  enabled
                  smtpHost
                  smtpPort
                  smtpUser
                  smtpPassword
                  senderEmail
                  receiverEmail
                  autoReply
                  autoReplyMessage
                }
                theme {
                  primaryColor
                  secondaryColor
                  darkMode
                  font
                }
                features {
                  showBlog
                  showProjects
                  showTestimonials
                  showNewsletter
                  showContact
                  enableComments
                  enableAnalytics
                }
                analytics {
                  googleAnalyticsId
                  facebookPixelId
                }
                seo {
                  ogImage
                  twitterHandle
                  favicon
                }
                maintenanceMode
                maintenanceMessage
              }
              socialLinks {
                github
                linkedin
                leetcode
                hackerrank
                medium
                devto
                stackoverflow
                kaggle
                behance
                dribbble
                email
                phone
                location
                personalWebsite
                customLinks {
                  name
                  url
                  icon
                }
              }
            }
          `
        })
      });

      const { data } = await response.json();
      if (data?.siteSettings) {
        setSiteSettings(data.siteSettings);
      }
      if (data?.socialLinks) {
        setSocialLinks(data.socialLinks);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Save Site Settings
  const settingsResponse = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateSiteSettings($input: SiteSettingsInput!) {
              updateSiteSettings(input: $input) {
                id
                siteName
                siteTitle
              }
            }
          `,
          variables: { input: siteSettings }
        })
      });

      const settingsResult = await settingsResponse.json();
      if (settingsResult.errors) {
        console.error('Settings save errors:', settingsResult.errors);
        throw new Error(settingsResult.errors[0].message);
      }

      // Save Social Links
  const socialResponse = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateSocialLinks($input: SocialLinksInput!) {
              updateSocialLinks(input: $input) {
                id
                github
                linkedin
              }
            }
          `,
          variables: { input: socialLinks }
        })
      });

      const socialResult = await socialResponse.json();
      if (socialResult.errors) {
        console.error('Social links save errors:', socialResult.errors);
        throw new Error(socialResult.errors[0].message);
      }

      setMessage('✅ Settings saved successfully!');
      
      // Notify other components that settings have been updated
      window.dispatchEvent(new CustomEvent('siteSettingsUpdated'));
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(`❌ Failed to save settings: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !siteSettings.siteKeywords.includes(newKeyword.trim())) {
      setSiteSettings(prev => ({
        ...prev,
        siteKeywords: [...prev.siteKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setSiteSettings(prev => ({
      ...prev,
      siteKeywords: prev.siteKeywords.filter((_, i) => i !== index)
    }));
  };

  const addCustomLink = () => {
    if (newCustomLink.name && newCustomLink.url) {
      setSocialLinks(prev => ({
        ...prev,
        customLinks: [...prev.customLinks, { ...newCustomLink }]
      }));
      setNewCustomLink({ name: '', url: '', icon: '' });
    }
  };

  const removeCustomLink = (index) => {
    setSocialLinks(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'social', label: 'Social Links', icon: <FaGlobe /> },
    { id: 'email', label: 'Email Config', icon: <FaEnvelope /> },
    { id: 'site', label: 'Site Info', icon: <FaInfoCircle /> },
    { id: 'theme', label: 'Theme', icon: <FaPalette /> },
    { id: 'features', label: 'Features', icon: <FaToggleOn /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'seo', label: 'SEO', icon: <FaSeo /> },
    { id: 'maintenance', label: 'Maintenance', icon: <FaTools /> }
  ];

  if (loading) {
    return (
      <div className="settings-panel">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div>
          <h1 className="god-mode-title">
            <FaCog /> <span className="gradient-text">Site Settings</span>
          </h1>
          <p className="settings-subtitle">Configure your portfolio settings</p>
        </div>
        <button className="btn-save-all" onClick={handleSaveAll} disabled={loading}>
          <FaSave /> Save All Changes
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="settings-container">
        {/* Tab Navigation */}
        <div className="tabs-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="tab-panel">
              <h2>Social Media Links</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label><FaGithub /> GitHub</label>
                  <input
                    type="url"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><FaLinkedin /> LinkedIn</label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-group">
                  <label><SiLeetcode /> LeetCode</label>
                  <input
                    type="url"
                    value={socialLinks.leetcode}
                    onChange={(e) => setSocialLinks({ ...socialLinks, leetcode: e.target.value })}
                    placeholder="https://leetcode.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><SiHackerrank /> HackerRank</label>
                  <input
                    type="url"
                    value={socialLinks.hackerrank}
                    onChange={(e) => setSocialLinks({ ...socialLinks, hackerrank: e.target.value })}
                    placeholder="https://www.hackerrank.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><FaMedium /> Medium</label>
                  <input
                    type="url"
                    value={socialLinks.medium}
                    onChange={(e) => setSocialLinks({ ...socialLinks, medium: e.target.value })}
                    placeholder="https://medium.com/@username"
                  />
                </div>
                <div className="form-group">
                  <label><FaDev /> Dev.to</label>
                  <input
                    type="url"
                    value={socialLinks.devto}
                    onChange={(e) => setSocialLinks({ ...socialLinks, devto: e.target.value })}
                    placeholder="https://dev.to/username"
                  />
                </div>
                <div className="form-group">
                  <label><FaStackOverflow /> Stack Overflow</label>
                  <input
                    type="url"
                    value={socialLinks.stackoverflow}
                    onChange={(e) => setSocialLinks({ ...socialLinks, stackoverflow: e.target.value })}
                    placeholder="https://stackoverflow.com/users/..."
                  />
                </div>
                <div className="form-group">
                  <label><SiKaggle /> Kaggle</label>
                  <input
                    type="url"
                    value={socialLinks.kaggle}
                    onChange={(e) => setSocialLinks({ ...socialLinks, kaggle: e.target.value })}
                    placeholder="https://kaggle.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><SiBehance /> Behance</label>
                  <input
                    type="url"
                    value={socialLinks.behance}
                    onChange={(e) => setSocialLinks({ ...socialLinks, behance: e.target.value })}
                    placeholder="https://behance.net/username"
                  />
                </div>
                <div className="form-group">
                  <label><SiDribbble /> Dribbble</label>
                  <input
                    type="url"
                    value={socialLinks.dribbble}
                    onChange={(e) => setSocialLinks({ ...socialLinks, dribbble: e.target.value })}
                    placeholder="https://dribbble.com/username"
                  />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem' }}>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input
                    type="email"
                    value={socialLinks.email}
                    onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input
                    type="tel"
                    value={socialLinks.phone}
                    onChange={(e) => setSocialLinks({ ...socialLinks, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="form-group">
                  <label><FaMapMarkerAlt /> Location</label>
                  <input
                    type="text"
                    value={socialLinks.location}
                    onChange={(e) => setSocialLinks({ ...socialLinks, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group">
                  <label><FaLink /> Personal Website</label>
                  <input
                    type="url"
                    value={socialLinks.personalWebsite}
                    onChange={(e) => setSocialLinks({ ...socialLinks, personalWebsite: e.target.value })}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem' }}>Custom Links</h3>
              <div className="array-input-group">
                <input
                  type="text"
                  placeholder="Platform name"
                  value={newCustomLink.name}
                  onChange={(e) => setNewCustomLink({ ...newCustomLink, name: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newCustomLink.url}
                  onChange={(e) => setNewCustomLink({ ...newCustomLink, url: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Icon (optional)"
                  value={newCustomLink.icon}
                  onChange={(e) => setNewCustomLink({ ...newCustomLink, icon: e.target.value })}
                />
                <button type="button" onClick={addCustomLink} className="btn-add">
                  <FaPlus /> Add
                </button>
              </div>
              {socialLinks.customLinks && socialLinks.customLinks.length > 0 && (
                <div className="custom-links-list">
                  {socialLinks.customLinks.map((link, idx) => (
                    <div key={idx} className="custom-link-item">
                      <span>{link.icon} {link.name}: {link.url}</span>
                      <button onClick={() => removeCustomLink(idx)} className="btn-remove">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Email Config Tab */}
          {activeTab === 'email' && (
            <div className="tab-panel">
              <h2>Email Configuration</h2>
              <div className="toggle-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteSettings.emailConfig.enabled}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      emailConfig: { ...siteSettings.emailConfig, enabled: e.target.checked }
                    })}
                  />
                  Enable Email Functionality
                </label>
              </div>

              {siteSettings.emailConfig.enabled && (
                <>
                  <h3>SMTP Settings</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>SMTP Host</label>
                      <input
                        type="text"
                        value={siteSettings.emailConfig.smtpHost}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, smtpHost: e.target.value }
                        })}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>SMTP Port</label>
                      <input
                        type="number"
                        value={siteSettings.emailConfig.smtpPort}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, smtpPort: e.target.value }
                        })}
                        placeholder="587"
                      />
                    </div>
                    <div className="form-group">
                      <label>SMTP Username</label>
                      <input
                        type="text"
                        value={siteSettings.emailConfig.smtpUser}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, smtpUser: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>SMTP Password</label>
                      <input
                        type="password"
                        value={siteSettings.emailConfig.smtpPassword}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, smtpPassword: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Sender Email</label>
                      <input
                        type="email"
                        value={siteSettings.emailConfig.senderEmail}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, senderEmail: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Receiver Email</label>
                      <input
                        type="email"
                        value={siteSettings.emailConfig.receiverEmail}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, receiverEmail: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <h3 style={{ marginTop: '2rem' }}>Auto Reply</h3>
                  <div className="toggle-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={siteSettings.emailConfig.autoReply}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, autoReply: e.target.checked }
                        })}
                      />
                      Enable Auto Reply
                    </label>
                  </div>
                  {siteSettings.emailConfig.autoReply && (
                    <div className="form-group">
                      <label>Auto Reply Message</label>
                      <textarea
                        value={siteSettings.emailConfig.autoReplyMessage}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          emailConfig: { ...siteSettings.emailConfig, autoReplyMessage: e.target.value }
                        })}
                        rows="4"
                        placeholder="Thank you for your message..."
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Site Info Tab */}
          {activeTab === 'site' && (
            <div className="tab-panel">
              <h2>Site Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    placeholder="My Portfolio"
                  />
                </div>
                <div className="form-group">
                  <label>Site Title</label>
                  <input
                    type="text"
                    value={siteSettings.siteTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                    placeholder="John Doe - Full Stack Developer"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Site Description</label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                    rows="3"
                    placeholder="A brief description of your portfolio..."
                  />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem' }}>Keywords (SEO)</h3>
              <div className="array-input">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a keyword..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <button type="button" onClick={addKeyword} className="btn-add">
                  <FaPlus /> Add
                </button>
              </div>
              {siteSettings.siteKeywords && siteSettings.siteKeywords.length > 0 && (
                <div className="keywords-list">
                  {siteSettings.siteKeywords.map((keyword, idx) => (
                    <div key={idx} className="keyword-item">
                      <span>{keyword}</span>
                      <button onClick={() => removeKeyword(idx)} className="btn-remove">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ marginTop: '2rem' }}>Availability Status</h3>
              <div className="toggle-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteSettings.availableForWork}
                    onChange={(e) => setSiteSettings({ ...siteSettings, availableForWork: e.target.checked })}
                  />
                  Available for Work
                </label>
              </div>
              <div className="form-group">
                <label>Availability Message</label>
                <input
                  type="text"
                  value={siteSettings.availabilityMessage}
                  onChange={(e) => setSiteSettings({ ...siteSettings, availabilityMessage: e.target.value })}
                  placeholder="Open to new opportunities"
                />
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="tab-panel">
              <h2>Theme Customization</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Primary Color</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={siteSettings.theme.primaryColor}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        theme: { ...siteSettings.theme, primaryColor: e.target.value }
                      })}
                    />
                    <input
                      type="text"
                      value={siteSettings.theme.primaryColor}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        theme: { ...siteSettings.theme, primaryColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Secondary Color</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={siteSettings.theme.secondaryColor}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        theme: { ...siteSettings.theme, secondaryColor: e.target.value }
                      })}
                    />
                    <input
                      type="text"
                      value={siteSettings.theme.secondaryColor}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        theme: { ...siteSettings.theme, secondaryColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Font Family</label>
                  <select
                    value={siteSettings.theme.font}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      theme: { ...siteSettings.theme, font: e.target.value }
                    })}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
              </div>
              <div className="toggle-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteSettings.theme.darkMode}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      theme: { ...siteSettings.theme, darkMode: e.target.checked }
                    })}
                  />
                  Dark Mode
                </label>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="tab-panel">
              <h2>Feature Toggles</h2>
              <div className="toggles-grid">
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.showBlog}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, showBlog: e.target.checked }
                      })}
                    />
                    Show Blog Section
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.showProjects}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, showProjects: e.target.checked }
                      })}
                    />
                    Show Projects Section
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.showTestimonials}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, showTestimonials: e.target.checked }
                      })}
                    />
                    Show Testimonials
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.showNewsletter}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, showNewsletter: e.target.checked }
                      })}
                    />
                    Show Newsletter Signup
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.showContact}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, showContact: e.target.checked }
                      })}
                    />
                    Show Contact Section
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.enableComments}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, enableComments: e.target.checked }
                      })}
                    />
                    Enable Comments
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={siteSettings.features.enableAnalytics}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        features: { ...siteSettings.features, enableAnalytics: e.target.checked }
                      })}
                    />
                    Enable Analytics
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="tab-panel">
              <h2>Analytics & Tracking</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Google Analytics ID</label>
                  <input
                    type="text"
                    value={siteSettings.analytics.googleAnalyticsId}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      analytics: { ...siteSettings.analytics, googleAnalyticsId: e.target.value }
                    })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="form-group">
                  <label>Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={siteSettings.analytics.facebookPixelId}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      analytics: { ...siteSettings.analytics, facebookPixelId: e.target.value }
                    })}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="tab-panel">
              <h2>SEO Settings</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Open Graph Image URL</label>
                  <input
                    type="url"
                    value={siteSettings.seo.ogImage}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, ogImage: e.target.value }
                    })}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter Handle</label>
                  <input
                    type="text"
                    value={siteSettings.seo.twitterHandle}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, twitterHandle: e.target.value }
                    })}
                    placeholder="@username"
                  />
                </div>
                <div className="form-group">
                  <label>Favicon URL</label>
                  <input
                    type="url"
                    value={siteSettings.seo.favicon}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, favicon: e.target.value }
                    })}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="tab-panel">
              <h2>Maintenance Mode</h2>
              <div className="toggle-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteSettings.maintenanceMode}
                    onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                  />
                  Enable Maintenance Mode
                </label>
              </div>
              {siteSettings.maintenanceMode && (
                <div className="form-group">
                  <label>Maintenance Message</label>
                  <textarea
                    value={siteSettings.maintenanceMessage}
                    onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMessage: e.target.value })}
                    rows="4"
                    placeholder="We're currently updating the site. Please check back soon!"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
