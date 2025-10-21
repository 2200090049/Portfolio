import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'datascience', 'ml', 'design', 'other'],
    required: true
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String, // Icon name or URL
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
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
skillSchema.index({ category: 1, portfolioType: 1, order: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
