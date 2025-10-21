import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardHome from './dashboard/DashboardHome';
import ProjectsManager from './dashboard/ProjectsManager';
import BlogsManager from './dashboard/BlogsManager';
import DeveloperEditor from './dashboard/DeveloperEditor';
import DataScienceEditor from './dashboard/DataScienceEditor';
import UXEditor from './dashboard/UXEditor';
import SkillsManager from './dashboard/SkillsManager';
import ExperienceManager from './dashboard/ExperienceManager';
import EducationManager from './dashboard/EducationManager';
import SettingsPanel from './dashboard/SettingsPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="blogs" element={<BlogsManager />} />
          <Route path="developer" element={<DeveloperEditor />} />
          <Route path="datascience" element={<DataScienceEditor />} />
          <Route path="ux" element={<UXEditor />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="education" element={<EducationManager />} />
          <Route path="settings" element={<SettingsPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
