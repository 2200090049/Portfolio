import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  portfolioType: {
    type: String,
    enum: ['developer', 'datascience', 'ux'],
    required: true
  },
  // Basic Info
  name: {
    type: String,
    required: true,
    default: 'Kuruguntla Deepak Reddy'
  },
  title: {
    type: String,
    required: true,
    default: 'Full Stack Developer'
  },
  tagline: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  
  // Images
  coverImage: {
    type: String,
    default: ''
  },
  
  // About Section
  aboutHeading: {
    type: String,
    default: 'About Me'
  },
  aboutDescription: {
    type: String,
    default: ''
  },
  aboutHighlights: [{
    type: String
  }],
  
  // Stats/Achievements
  stats: {
    projectsCompleted: {
      type: Number,
      default: 0
    },
    yearsExperience: {
      type: Number,
      default: 0
    }
  },
  
  // Resume
  resumeUrl: {
    type: String,
    default: ''
  },
  
  // Visibility Settings
  isVisible: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: true
  },
  showAbout: {
    type: Boolean,
    default: true
  },
  showProjects: {
    type: Boolean,
    default: true
  },
  showBlogs: {
    type: Boolean,
    default: true
  },
  showContact: {
    type: Boolean,
    default: true
  },
  
  // Meta
  metaDescription: {
    type: String,
    default: ''
  },
  metaKeywords: [{
    type: String
  }]
}, {
  timestamps: true
});

// Ensure only one profile per type
profileSchema.index({ portfolioType: 1 }, { unique: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
