import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema({
  // Only one document should exist (singleton pattern)
  _id: {
    type: String,
    default: 'social_links'
  },
  
  // Social Media Links
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  leetcode: {
    type: String,
    default: ''
  },
  hackerrank: {
    type: String,
    default: ''
  },
  medium: {
    type: String,
    default: ''
  },
  devto: {
    type: String,
    default: ''
  },
  stackoverflow: {
    type: String,
    default: ''
  },
  kaggle: {
    type: String,
    default: ''
  },
  behance: {
    type: String,
    default: ''
  },
  dribbble: {
    type: String,
    default: ''
  },
  
  // Contact Info
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  
  // Portfolio Links
  personalWebsite: {
    type: String,
    default: ''
  },
  
  // Custom Links (for additional platforms)
  customLinks: [{
    name: String,
    url: String,
    icon: String
  }]
}, {
  timestamps: true
});

const SocialLinks = mongoose.model('SocialLinks', socialLinksSchema);

export default SocialLinks;
