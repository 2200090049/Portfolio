// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  graphql: `${API_URL}/graphql`,
  uploadProfileImage: `${API_URL}/api/upload/profile-image`,
  uploadCoverImage: `${API_URL}/api/upload/cover-image`,
  uploads: `${API_URL}/uploads`,
};

export default API_URL;
