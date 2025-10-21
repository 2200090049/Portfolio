import React from 'react';
import { motion } from 'framer-motion';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <motion.div className="admin-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Admin Panel</h1>
        <p>Manage your portfolio content</p>
        <div className="admin-notice">
          <p>⚠️ This is a protected admin area. Full admin functionality coming soon!</p>
          <p>For now, you can use GraphQL playground at http://localhost:5000/graphql</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
