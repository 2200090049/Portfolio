import jwt from 'jsonwebtoken';

// Generate JWT token for admin
export const generateAdminToken = (admin) => {
  const payload = {
    id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    type: 'admin'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token valid for 7 days
  });

  return token;
};

// Verify admin token
export const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure it's an admin token
    if (decoded.type !== 'admin') {
      throw new Error('Invalid token type');
    }
    
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Admin authentication middleware for GraphQL context
export const getAdminFromToken = (token) => {
  if (!token) {
    return null;
  }

  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace('Bearer ', '');
  
  const result = verifyAdminToken(cleanToken);
  
  if (result.valid) {
    return result.decoded;
  }
  
  return null;
};

// Check if user is admin (for resolver protection)
export const requireAdmin = (admin) => {
  if (!admin) {
    throw new Error('Authentication required. Please login as admin.');
  }
  
  if (admin.type !== 'admin') {
    throw new Error('Admin privileges required.');
  }
  
  return true;
};

// Check if user is super admin
export const requireSuperAdmin = (admin) => {
  requireAdmin(admin);
  
  if (admin.role !== 'superadmin') {
    throw new Error('Super admin privileges required.');
  }
  
  return true;
};

export default {
  generateAdminToken,
  verifyAdminToken,
  getAdminFromToken,
  requireAdmin,
  requireSuperAdmin
};
