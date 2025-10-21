import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading, verifyAdmin } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      verifyAdmin();
    }
  }, [isAuthenticated, verifyAdmin]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid #00d4ff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal-dk-sys-2025/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
