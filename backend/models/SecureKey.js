import mongoose from 'mongoose';

const secureKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null // Can set expiration if needed
  },
  description: {
    type: String,
    default: 'Admin registration key'
  }
}, {
  timestamps: true
});

// Index for faster queries
secureKeySchema.index({ key: 1, isUsed: 1 });

// Method to mark key as used
secureKeySchema.methods.markAsUsed = async function(adminId) {
  this.isUsed = true;
  this.usedBy = adminId;
  this.usedAt = new Date();
  return this.save();
};

// Static method to validate key
secureKeySchema.statics.validateKey = async function(key) {
  const secureKey = await this.findOne({ key, isUsed: false });
  
  if (!secureKey) {
    return { valid: false, message: 'Invalid or already used secure key' };
  }
  
  // Check if key has expired
  if (secureKey.expiresAt && secureKey.expiresAt < new Date()) {
    return { valid: false, message: 'Secure key has expired' };
  }
  
  return { valid: true, key: secureKey };
};

// Static method to check remaining keys
secureKeySchema.statics.getRemainingKeysCount = async function() {
  return this.countDocuments({ isUsed: false });
};

const SecureKey = mongoose.model('SecureKey', secureKeySchema);

export default SecureKey;
