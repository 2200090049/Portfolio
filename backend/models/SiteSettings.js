import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Singleton pattern - only one settings document
  _id: {
    type: String,
    default: 'site_settings'
  },
  
  // General Settings
  siteName: {
    type: String,
    default: 'Portfolio'
  },
  siteTitle: {
    type: String,
    default: 'Kuruguntla Deepak Reddy - Portfolio'
  },
  siteDescription: {
    type: String,
    default: ''
  },
  siteKeywords: [{
    type: String
  }],
  
  // Availability Status
  availableForWork: {
    type: Boolean,
    default: true
  },
  availabilityMessage: {
    type: String,
    default: 'Available for freelance work'
  },
  
  // Email Configuration (for contact form)
  emailConfig: {
    enabled: {
      type: Boolean,
      default: true
    },
    smtpHost: {
      type: String,
      default: ''
    },
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpUser: {
      type: String,
      default: ''
    },
    smtpPassword: {
      type: String,
      default: ''
    },
    senderEmail: {
      type: String,
      default: ''
    },
    receiverEmail: {
      type: String,
      default: ''
    },
    autoReply: {
      type: Boolean,
      default: false
    },
    autoReplyMessage: {
      type: String,
      default: 'Thank you for your message! I will get back to you soon.'
    }
  },
  
  // Theme Settings
  theme: {
    primaryColor: {
      type: String,
      default: '#00d4ff'
    },
    secondaryColor: {
      type: String,
      default: '#0077ff'
    },
    darkMode: {
      type: Boolean,
      default: true
    },
    font: {
      type: String,
      default: 'Inter'
    }
  },
  
  // Feature Toggles
  features: {
    showBlog: {
      type: Boolean,
      default: true
    },
    showProjects: {
      type: Boolean,
      default: true
    },
    showTestimonials: {
      type: Boolean,
      default: true
    },
    showNewsletter: {
      type: Boolean,
      default: true
    },
    showContact: {
      type: Boolean,
      default: true
    },
    enableComments: {
      type: Boolean,
      default: false
    },
    enableAnalytics: {
      type: Boolean,
      default: false
    }
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: {
      type: String,
      default: ''
    },
    facebookPixelId: {
      type: String,
      default: ''
    }
  },
  
  // SEO Settings
  seo: {
    ogImage: {
      type: String,
      default: ''
    },
    twitterHandle: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    }
  },
  
  // Maintenance Mode
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'Site is under maintenance. We will be back soon!'
  }
}, {
  timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
