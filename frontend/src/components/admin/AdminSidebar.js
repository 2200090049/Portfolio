import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  FaHome, FaProjectDiagram, FaBlog, FaCode, FaChartLine, FaPalette,
  FaTools, FaBriefcase, FaGraduationCap, FaCog, FaSignOutAlt,
  FaBars, FaTimes, FaShieldAlt 
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { admin, logout } = useAdmin();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const menuItems = [
    { path: '/portal-dk-sys-2025/dashboard/home', icon: <FaHome />, label: 'Dashboard' },
    { path: '/portal-dk-sys-2025/dashboard/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/portal-dk-sys-2025/dashboard/blogs', icon: <FaBlog />, label: 'Blogs' },
    { 
      label: 'Portfolio Editors',
      isGroup: true,
      items: [
        { path: '/portal-dk-sys-2025/dashboard/developer', icon: <FaCode />, label: 'Developer' },
        { path: '/portal-dk-sys-2025/dashboard/datascience', icon: <FaChartLine />, label: 'Data Science' },
        { path: '/portal-dk-sys-2025/dashboard/ux', icon: <FaPalette />, label: 'UX Designer' }
      ]
    },
    { 
      label: 'Content Management',
      isGroup: true,
      items: [
        { path: '/portal-dk-sys-2025/dashboard/skills', icon: <FaTools />, label: 'Skills' },
        { path: '/portal-dk-sys-2025/dashboard/experience', icon: <FaBriefcase />, label: 'Experience' },
        { path: '/portal-dk-sys-2025/dashboard/education', icon: <FaGraduationCap />, label: 'Education' }
      ]
    },
    { path: '/portal-dk-sys-2025/dashboard/settings', icon: <FaCog />, label: 'Settings' }
  ];

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <FaShieldAlt className="logo-icon" />
            <div className="logo-text">
              <h2>GOD MODE</h2>
              <p>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="admin-info">
          <div className="admin-avatar">
            {admin?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="admin-details">
            <p className="admin-name">{admin?.username || 'Admin'}</p>
            <span className="admin-role">{admin?.role || 'admin'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            if (item.isGroup) {
              return (
                <div key={index} className="nav-group">
                  <div className="nav-group-label">{item.label}</div>
                  {item.items.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                    >
                      <span className="nav-icon">{subItem.icon}</span>
                      <span className="nav-label">{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              );
            }
            
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
