import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load admin from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation LoginAdmin($input: LoginAdminInput!) {
              loginAdmin(input: $input) {
                success
                message
                token
                admin {
                  id
                  username
                  email
                  role
                  isActive
                  lastLogin
                }
              }
            }
          `,
          variables: {
            input: { username, password }
          }
        })
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      const { success, message, token: authToken, admin: adminData } = data.loginAdmin;

      if (!success) {
        throw new Error(message);
      }

      // Save to localStorage
      localStorage.setItem('adminToken', authToken);
      localStorage.setItem('adminData', JSON.stringify(adminData));

      setToken(authToken);
      setAdmin(adminData);

      return { success: true, message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Register function
  const register = async (username, email, password, secureKey) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RegisterAdmin($input: RegisterAdminInput!) {
              registerAdmin(input: $input) {
                success
                message
                token
                admin {
                  id
                  username
                  email
                  role
                  isActive
                }
              }
            }
          `,
          variables: {
            input: { username, email, password, secureKey }
          }
        })
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      const { success, message, token: authToken, admin: adminData } = data.registerAdmin;

      if (!success) {
        throw new Error(message);
      }

      // Save to localStorage
      localStorage.setItem('adminToken', authToken);
      localStorage.setItem('adminData', JSON.stringify(adminData));

      setToken(authToken);
      setAdmin(adminData);

      return { success: true, message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
    navigate('/portal-dk-sys-2025/login');
  };

  // Verify admin token
  const verifyAdmin = async () => {
    if (!token) return false;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query VerifyAdmin {
              verifyAdmin {
                id
                username
                email
                role
                isActive
              }
            }
          `
        })
      });

      const { data, errors } = await response.json();

      if (errors || !data?.verifyAdmin) {
        logout();
        return false;
      }

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const value = {
    admin,
    token,
    loading,
    isAuthenticated: !!admin && !!token,
    login,
    register,
    logout,
    verifyAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
