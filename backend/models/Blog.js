import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['developer', 'datascience', 'ux', 'general'],
    required: true
  },
  tags: [{
    type: String
  }],
  coverImage: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Kuruguntla Deepak Reddy'
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: String,
    default: '5 min read'
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

export default mongoose.model('Blog', blogSchema);
