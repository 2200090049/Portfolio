import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaProjectDiagram, FaBlog, FaTools, FaBriefcase, 
  FaGraduationCap, FaEnvelope, FaChartLine 
} from 'react-icons/fa';
import '../AdminDashboard.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    experiences: 0,
    educations: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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
              stats {
                totalProjects
                totalBlogs
                totalContacts
              }
              skills { id }
              experiences { id }
              educations { id }
            }
          `
        })
      });

      const { data } = await response.json();
      if (data) {
        setStats({
          projects: data.stats?.totalProjects || 0,
          blogs: data.stats?.totalBlogs || 0,
          contacts: data.stats?.totalContacts || 0,
          skills: data.skills?.length || 0,
          experiences: data.experiences?.length || 0,
          educations: data.educations?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <FaProjectDiagram />,
      value: stats.projects,
      label: 'Total Projects',
      color: '#00d4ff',
      link: '/portal-dk-sys-2025/dashboard/projects'
    },
    {
      icon: <FaBlog />,
      value: stats.blogs,
      label: 'Total Blogs',
      color: '#0077ff',
      link: '/portal-dk-sys-2025/dashboard/blogs'
    },
    {
      icon: <FaTools />,
      value: stats.skills,
      label: 'Skills',
      color: '#00ff88',
      link: '/portal-dk-sys-2025/dashboard/skills'
    },
    {
      icon: <FaBriefcase />,
      value: stats.experiences,
      label: 'Experience',
      color: '#ff8800',
      link: '/portal-dk-sys-2025/dashboard/experience'
    },
    {
      icon: <FaGraduationCap />,
      value: stats.educations,
      label: 'Education',
      color: '#ff00ff',
      link: '/portal-dk-sys-2025/dashboard/education'
    },
    {
      icon: <FaEnvelope />,
      value: stats.contacts,
      label: 'Messages',
      color: '#ffdd00',
      link: '#'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaChartLine /> Welcome to GOD MODE
          </h1>
          <p className="page-subtitle">
            Complete control over your portfolio. Edit anything, anywhere.
          </p>
        </div>
      </div>

      <div className="dashboard-cards">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="stat-card"
            onClick={() => card.link !== '#' && navigate(card.link)}
            style={{ cursor: card.link !== '#' ? 'pointer' : 'default' }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="content-container">
        <h2 style={{ marginBottom: '20px', color: '#00d4ff' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/portal-dk-sys-2025/dashboard/projects')}
          >
            <FaProjectDiagram /> Manage Projects
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/portal-dk-sys-2025/dashboard/blogs')}
          >
            <FaBlog /> Manage Blogs
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/portal-dk-sys-2025/dashboard/developer')}
          >
            Edit Developer Profile
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/portal-dk-sys-2025/dashboard/settings')}
          >
            Site Settings
          </button>
        </div>
      </div>

      <div className="content-container" style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '15px', color: '#00d4ff' }}>Portfolio Sections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '20px', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '10px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Developer Portfolio</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '15px' }}>
              Manage your development projects, skills, and experience
            </p>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/portal-dk-sys-2025/dashboard/developer')}
            >
              Edit Profile
            </button>
          </div>
          
          <div style={{ padding: '20px', background: 'rgba(0, 119, 255, 0.05)', borderRadius: '10px', border: '1px solid rgba(0, 119, 255, 0.2)' }}>
            <h3 style={{ color: '#0077ff', marginBottom: '10px' }}>Data Science Portfolio</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '15px' }}>
              Showcase your data science projects and analytics skills
            </p>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/portal-dk-sys-2025/dashboard/datascience')}
            >
              Edit Profile
            </button>
          </div>
          
          <div style={{ padding: '20px', background: 'rgba(138, 43, 226, 0.05)', borderRadius: '10px', border: '1px solid rgba(138, 43, 226, 0.2)' }}>
            <h3 style={{ color: '#8a2be2', marginBottom: '10px' }}>UX Designer Portfolio</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '15px' }}>
              Display your UX/UI projects and design process
            </p>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/portal-dk-sys-2025/dashboard/ux')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
