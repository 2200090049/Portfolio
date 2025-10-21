import React from 'react';
import { motion } from 'framer-motion';
import { FaTools } from 'react-icons/fa';
import './MaintenancePage.css';

const MaintenancePage = ({ message }) => {
  return (
    <div className="maintenance-page">
      <motion.div
        className="maintenance-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="maintenance-icon"
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <FaTools />
        </motion.div>
        
        <h1>Under Maintenance</h1>
        
        <p className="maintenance-message">
          {message || "We're currently performing scheduled maintenance. We'll be back shortly!"}
        </p>
        
        <motion.div
          className="maintenance-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            ●
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            ●
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            ●
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
