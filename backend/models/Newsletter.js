import mongoose from 'mongoose';
import validator from 'validator';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format'
    }
  },
  name: {
    type: String,
    default: ''
  },
  interests: [{
    type: String,
    enum: ['developer', 'datascience', 'ux', 'general']
  }],
  subscribed: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Newsletter', newsletterSchema);
