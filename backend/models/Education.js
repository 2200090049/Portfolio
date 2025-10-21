import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    default: ''
  },
  grade: {
    type: String,
    default: ''
  },
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number,
    default: null // null means currently studying
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  achievements: [{
    type: String
  }],
  coursework: [{
    type: String
  }],
  institutionLogo: {
    type: String,
    default: ''
  },
  institutionWebsite: {
    type: String,
    default: ''
  },
  portfolioType: {
    type: String,
    enum: ['developer', 'datascience', 'ux', 'all'],
    default: 'all'
  },
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for sorting by year
educationSchema.index({ startYear: -1, order: 1 });

const Education = mongoose.model('Education', educationSchema);

export default Education;
