import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['developer', 'datascience', 'ux'],
    required: true
  },
  techStack: [{
    type: String
  }],
  tools: [{
    type: String
  }],
  github: {
    type: String,
    default: ''
  },
  liveDemo: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  challenges: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  showInAllPortfolios: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
