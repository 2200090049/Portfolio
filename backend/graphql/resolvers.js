import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';
import Newsletter from '../models/Newsletter.js';
import Admin from '../models/Admin.js';
import SecureKey from '../models/SecureKey.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import SocialLinks from '../models/SocialLinks.js';
import SiteSettings from '../models/SiteSettings.js';
import jwt from 'jsonwebtoken';
import { sendContactNotification, sendContactConfirmation, sendNewsletterConfirmation } from '../utils/emailService.js';
import { generateAdminToken, requireAdmin } from '../utils/adminAuth.js';

// JWT verification helper
const verifyToken = (context) => {
  const token = context.token;
  if (!token) {
    throw new Error('Authentication required');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const resolvers = {
  Query: {
    // Projects
    projects: async (_, { category }) => {
      if (!category) {
        // If no category specified, return nothing (force category selection)
        return [];
      }
      // Return projects that match the category OR have showInAllPortfolios = true
      const filter = {
        $or: [
          { category },
          { showInAllPortfolios: true }
        ]
      };
      return await Project.find(filter).sort({ order: 1, createdAt: -1 });
    },
    allProjects: async () => {
      // Return all projects for admin panel
      return await Project.find().sort({ order: 1, createdAt: -1 });
    },
    project: async (_, { id }) => {
      return await Project.findById(id);
    },
    featuredProjects: async (_, { category }) => {
      const filter = { featured: true };
      if (category) {
        filter.$or = [
          { category },
          { showInAllPortfolios: true }
        ];
      }
      return await Project.find(filter).sort({ order: 1 }).limit(6);
    },

    // Testimonials
    testimonials: async (_, { category }) => {
      const filter = { approved: true };
      if (category) filter.category = category;
      return await Testimonial.find(filter).sort({ createdAt: -1 });
    },
    testimonial: async (_, { id }) => {
      return await Testimonial.findById(id);
    },
    featuredTestimonials: async () => {
      return await Testimonial.find({ featured: true, approved: true }).limit(6);
    },

    // Blogs
    blogs: async (_, { category, published }) => {
      const filter = {};
      if (published !== undefined) filter.published = published;
      
      if (category) {
        filter.$or = [
          { category },
          { showInAllPortfolios: true }
        ];
      }
      
      return await Blog.find(filter).sort({ createdAt: -1 });
    },
    blog: async (_, { id, slug }) => {
      if (id) return await Blog.findById(id);
      if (slug) return await Blog.findOne({ slug });
      throw new Error('Provide either id or slug');
    },
    featuredBlogs: async (_, { category }) => {
      const filter = { featured: true, published: true };
      
      if (category) {
        filter.$or = [
          { category },
          { showInAllPortfolios: true }
        ];
      }
      
      return await Blog.find(filter).limit(6);
    },

    // Contacts (Admin only)
    contacts: async (_, { status }, context) => {
      verifyToken(context);
      const filter = status ? { status } : {};
      return await Contact.find(filter).sort({ createdAt: -1 });
    },
    contact: async (_, { id }, context) => {
      verifyToken(context);
      return await Contact.findById(id);
    },

    // Newsletter (Admin only)
    newsletters: async (_, __, context) => {
      verifyToken(context);
      return await Newsletter.find().sort({ subscribedAt: -1 });
    },

    // Stats
    stats: async () => {
      const [
        totalProjects,
        totalTestimonials,
        totalBlogs,
        totalContacts,
        totalNewsletters,
        projects,
        testimonials
      ] = await Promise.all([
        Project.countDocuments(),
        Testimonial.countDocuments({ approved: true }),
        Blog.countDocuments({ published: true }),
        Contact.countDocuments(),
        Newsletter.countDocuments({ subscribed: true }),
        Project.find(),
        Testimonial.find({ approved: true })
      ]);

      const projectsByCategory = {
        developer: projects.filter(p => p.category === 'developer').length,
        datascience: projects.filter(p => p.category === 'datascience').length,
        ux: projects.filter(p => p.category === 'ux').length,
        general: 0
      };

      const testimonialsByCategory = {
        developer: testimonials.filter(t => t.category === 'developer').length,
        datascience: testimonials.filter(t => t.category === 'datascience').length,
        ux: testimonials.filter(t => t.category === 'ux').length,
        general: testimonials.filter(t => t.category === 'general').length
      };

      return {
        totalProjects,
        totalTestimonials,
        totalBlogs,
        totalContacts,
        totalNewsletters,
        projectsByCategory,
        testimonialsByCategory
      };
    },

    // Admin Queries
    verifyAdmin: async (_, __, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Admin.findById(admin.id);
    },

    getAdminProfile: async (_, __, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Admin.findById(admin.id);
    },

    getAllAdmins: async (_, __, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Admin.find().sort({ createdAt: -1 });
    },

    getRemainingSecureKeys: async (_, __, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await SecureKey.getRemainingKeysCount();
    },

    getSecureKeys: async (_, __, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await SecureKey.find().sort({ createdAt: -1 }).populate('usedBy');
    },

    // ============= GOD MODE QUERIES =============
    
    // Profiles
    profiles: async () => {
      return await Profile.find().sort({ portfolioType: 1 });
    },
    profile: async (_, { portfolioType }) => {
      return await Profile.findOne({ portfolioType });
    },
    
    // Skills
    skills: async (_, { category, portfolioType }) => {
      const filter = {};
      if (category) filter.category = category;
      if (portfolioType) filter.portfolioType = { $in: [portfolioType, 'all'] };
      return await Skill.find(filter).sort({ order: 1, createdAt: -1 });
    },
    skill: async (_, { id }) => {
      return await Skill.findById(id);
    },
    
    // Experience
    experiences: async (_, { portfolioType }) => {
      const filter = {};
      if (portfolioType) filter.portfolioType = { $in: [portfolioType, 'all'] };
      return await Experience.find(filter).sort({ startDate: -1, order: 1 });
    },
    experience: async (_, { id }) => {
      return await Experience.findById(id);
    },
    experienceStats: async () => {
      const experiences = await Experience.find({});
      const currentJobs = experiences.filter(exp => exp.current).length;
      
      // Calculate total years of experience
      let totalMonths = 0;
      experiences.forEach(exp => {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
        totalMonths += months;
      });
      const totalYears = Math.floor(totalMonths / 12);
      
      return {
        totalExperiences: experiences.length,
        currentJobs,
        totalYears
      };
    },
    
    // Education
    educations: async (_, { portfolioType }) => {
      const filter = {};
      if (portfolioType) filter.portfolioType = { $in: [portfolioType, 'all'] };
      return await Education.find(filter).sort({ startYear: -1, order: 1 });
    },
    education: async (_, { id }) => {
      return await Education.findById(id);
    },
    educationStats: async () => {
      const educations = await Education.find({});
      
      // Count degrees vs certifications
      const degrees = educations.filter(edu => 
        edu.degree && (
          edu.degree.toLowerCase().includes('bachelor') ||
          edu.degree.toLowerCase().includes('master') ||
          edu.degree.toLowerCase().includes('phd') ||
          edu.degree.toLowerCase().includes('associate')
        )
      ).length;
      
      const certifications = educations.length - degrees;
      
      return {
        totalEducations: educations.length,
        degrees,
        certifications
      };
    },
    
    // Social Links
    socialLinks: async () => {
      let links = await SocialLinks.findById('social_links');
      if (!links) {
        // Create default if not exists
        links = await SocialLinks.create({ _id: 'social_links' });
      }
      return links;
    },
    
    // Site Settings
    siteSettings: async () => {
      let settings = await SiteSettings.findById('site_settings');
      if (!settings) {
        // Create default if not exists
        settings = await SiteSettings.create({ _id: 'site_settings' });
      }
      return settings;
    }
  },

  Mutation: {
    // Admin Authentication
    registerAdmin: async (_, { input }) => {
      try {
        const { username, email, password, secureKey } = input;

        // Validate secure key
        const keyValidation = await SecureKey.validateKey(secureKey);
        if (!keyValidation.valid) {
          return {
            success: false,
            message: keyValidation.message,
            token: null,
            admin: null
          };
        }

        // Check if username already exists
        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
          return {
            success: false,
            message: 'Username already taken',
            token: null,
            admin: null
          };
        }

        // Check if email already exists
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
          return {
            success: false,
            message: 'Email already registered',
            token: null,
            admin: null
          };
        }

        // Create admin
        const admin = new Admin({
          username,
          email,
          password,
          usedSecureKey: secureKey
        });

        await admin.save();

        // Mark secure key as used
        await keyValidation.key.markAsUsed(admin._id);

        // Generate token
        const token = generateAdminToken(admin);

        return {
          success: true,
          message: 'Admin account created successfully',
          token,
          admin
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to create admin account',
          token: null,
          admin: null
        };
      }
    },

    loginAdmin: async (_, { input }) => {
      try {
        const { username, password } = input;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return {
            success: false,
            message: 'Invalid username or password',
            token: null,
            admin: null
          };
        }

        // Check if account is locked
        if (admin.isLocked()) {
          const lockTime = Math.ceil((admin.lockUntil - Date.now()) / 60000);
          return {
            success: false,
            message: `Account locked due to too many failed attempts. Try again in ${lockTime} minutes.`,
            token: null,
            admin: null
          };
        }

        // Check if account is active
        if (!admin.isActive) {
          return {
            success: false,
            message: 'Account has been deactivated. Contact super admin.',
            token: null,
            admin: null
          };
        }

        // Verify password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          // Increment login attempts
          await admin.incLoginAttempts();
          return {
            success: false,
            message: 'Invalid username or password',
            token: null,
            admin: null
          };
        }

        // Reset login attempts and update last login
        await admin.resetLoginAttempts();

        // Generate token
        const token = generateAdminToken(admin);

        return {
          success: true,
          message: 'Login successful',
          token,
          admin
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Login failed',
          token: null,
          admin: null
        };
      }
    },

    logoutAdmin: async (_, __, context) => {
      // In JWT-based auth, logout is handled client-side by removing token
      // This endpoint can be used for logging/tracking
      return {
        success: true,
        message: 'Logged out successfully'
      };
    },

    updateAdminProfile: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);

      const { username, email } = input;
      const updates = {};

      if (username) {
        // Check if username is taken by another admin
        const existing = await Admin.findOne({ username, _id: { $ne: admin.id } });
        if (existing) {
          throw new Error('Username already taken');
        }
        updates.username = username;
      }

      if (email) {
        // Check if email is taken by another admin
        const existing = await Admin.findOne({ email, _id: { $ne: admin.id } });
        if (existing) {
          throw new Error('Email already registered');
        }
        updates.email = email;
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        admin.id,
        updates,
        { new: true, runValidators: true }
      );

      return updatedAdmin;
    },

    changeAdminPassword: async (_, { currentPassword, newPassword }, context) => {
      const admin = context.admin;
      requireAdmin(admin);

      const adminDoc = await Admin.findById(admin.id);
      if (!adminDoc) {
        throw new Error('Admin not found');
      }

      // Verify current password
      const isMatch = await adminDoc.comparePassword(currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      adminDoc.password = newPassword;
      await adminDoc.save();

      return {
        success: true,
        message: 'Password changed successfully'
      };
    },

    deleteAdmin: async (_, { id }, context) => {
      const admin = context.admin;
      requireAdmin(admin);

      // Cannot delete yourself
      if (admin.id === id) {
        throw new Error('Cannot delete your own account');
      }

      await Admin.findByIdAndDelete(id);

      return {
        success: true,
        message: 'Admin account deleted successfully'
      };
    },

    // Projects (Admin only)
    createProject: async (_, { input }, context) => {
      verifyToken(context);
      const project = new Project(input);
      return await project.save();
    },
    updateProject: async (_, { id, input }, context) => {
      verifyToken(context);
      return await Project.findByIdAndUpdate(id, input, { new: true });
    },
    deleteProject: async (_, { id }, context) => {
      verifyToken(context);
      await Project.findByIdAndDelete(id);
      return { success: true, message: 'Project deleted successfully' };
    },

    // Testimonials
    createTestimonial: async (_, { input }) => {
      const testimonial = new Testimonial(input);
      return await testimonial.save();
    },
    updateTestimonial: async (_, { id, input }, context) => {
      verifyToken(context);
      return await Testimonial.findByIdAndUpdate(id, input, { new: true });
    },
    deleteTestimonial: async (_, { id }, context) => {
      verifyToken(context);
      await Testimonial.findByIdAndDelete(id);
      return { success: true, message: 'Testimonial deleted successfully' };
    },
    approveTestimonial: async (_, { id }, context) => {
      verifyToken(context);
      return await Testimonial.findByIdAndUpdate(id, { approved: true }, { new: true });
    },

    // Blogs (Admin only)
    createBlog: async (_, { input }, context) => {
      verifyToken(context);
      const blog = new Blog(input);
      return await blog.save();
    },
    updateBlog: async (_, { id, input }, context) => {
      verifyToken(context);
      return await Blog.findByIdAndUpdate(id, input, { new: true });
    },
    deleteBlog: async (_, { id }, context) => {
      verifyToken(context);
      await Blog.findByIdAndDelete(id);
      return { success: true, message: 'Blog deleted successfully' };
    },
    incrementBlogViews: async (_, { id }) => {
      return await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    },

    // Contacts
    createContact: async (_, { input }) => {
      const contact = new Contact(input);
      const savedContact = await contact.save();
      
      // Send email notifications (async, don't wait)
      sendContactNotification(input).catch(err => console.error('Email error:', err));
      sendContactConfirmation(input).catch(err => console.error('Email error:', err));
      
      return savedContact;
    },
    updateContactStatus: async (_, { id, status }, context) => {
      verifyToken(context);
      return await Contact.findByIdAndUpdate(id, { status }, { new: true });
    },
    deleteContact: async (_, { id }, context) => {
      verifyToken(context);
      await Contact.findByIdAndDelete(id);
      return { success: true, message: 'Contact deleted successfully' };
    },

    // Newsletter
    subscribeNewsletter: async (_, { input }) => {
      const existing = await Newsletter.findOne({ email: input.email });
      if (existing) {
        if (existing.subscribed) {
          throw new Error('Email already subscribed');
        }
        existing.subscribed = true;
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = null;
        if (input.name) existing.name = input.name;
        if (input.interests) existing.interests = input.interests;
        const updated = await existing.save();
        
        // Send confirmation email
        sendNewsletterConfirmation(input.email).catch(err => console.error('Email error:', err));
        
        return updated;
      }
      const newsletter = new Newsletter(input);
      const saved = await newsletter.save();
      
      // Send confirmation email
      sendNewsletterConfirmation(input.email).catch(err => console.error('Email error:', err));
      
      return saved;
    },
    unsubscribeNewsletter: async (_, { email }) => {
      const newsletter = await Newsletter.findOne({ email });
      if (!newsletter) {
        throw new Error('Email not found');
      }
      newsletter.subscribed = false;
      newsletter.unsubscribedAt = new Date();
      return await newsletter.save();
    },

    // ============= GOD MODE MUTATIONS =============
    
    // Profile Management
    createProfile: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      // Check if profile already exists for this type
      const existing = await Profile.findOne({ portfolioType: input.portfolioType });
      if (existing) {
        throw new Error(`Profile for ${input.portfolioType} already exists. Use updateProfile instead.`);
      }
      
      return await Profile.create(input);
    },
    
    updateProfile: async (_, { portfolioType, input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      let profile = await Profile.findOne({ portfolioType });
      if (!profile) {
        // Create if doesn't exist
        profile = await Profile.create({ ...input, portfolioType });
      } else {
        // Update existing
        Object.assign(profile, input);
        await profile.save();
      }
      return profile;
    },
    
    deleteProfile: async (_, { portfolioType }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const profile = await Profile.findOneAndDelete({ portfolioType });
      if (!profile) {
        return { success: false, message: 'Profile not found' };
      }
      return { success: true, message: 'Profile deleted successfully' };
    },
    
    // Skills Management
    createSkill: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Skill.create(input);
    },
    
    updateSkill: async (_, { id, input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Skill.findByIdAndUpdate(id, input, { new: true });
    },
    
    deleteSkill: async (_, { id }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const skill = await Skill.findByIdAndDelete(id);
      if (!skill) {
        return { success: false, message: 'Skill not found' };
      }
      return { success: true, message: 'Skill deleted successfully' };
    },
    
    reorderSkills: async (_, { ids }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      // Update order for each skill
      const updates = ids.map((id, index) => 
        Skill.findByIdAndUpdate(id, { order: index }, { new: true })
      );
      return await Promise.all(updates);
    },
    
    // Experience Management
    createExperience: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Experience.create(input);
    },
    
    updateExperience: async (_, { id, input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Experience.findByIdAndUpdate(id, input, { new: true });
    },
    
    deleteExperience: async (_, { id }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const experience = await Experience.findByIdAndDelete(id);
      if (!experience) {
        return { success: false, message: 'Experience not found' };
      }
      return { success: true, message: 'Experience deleted successfully' };
    },
    
    reorderExperiences: async (_, { ids }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const updates = ids.map((id, index) => 
        Experience.findByIdAndUpdate(id, { order: index }, { new: true })
      );
      return await Promise.all(updates);
    },
    
    // Education Management
    createEducation: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Education.create(input);
    },
    
    updateEducation: async (_, { id, input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      return await Education.findByIdAndUpdate(id, input, { new: true });
    },
    
    deleteEducation: async (_, { id }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const education = await Education.findByIdAndDelete(id);
      if (!education) {
        return { success: false, message: 'Education not found' };
      }
      return { success: true, message: 'Education deleted successfully' };
    },
    
    reorderEducations: async (_, { ids }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      const updates = ids.map((id, index) => 
        Education.findByIdAndUpdate(id, { order: index }, { new: true })
      );
      return await Promise.all(updates);
    },
    
    // Social Links Management (Singleton)
    updateSocialLinks: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      let links = await SocialLinks.findById('social_links');
      if (!links) {
        links = await SocialLinks.create({ _id: 'social_links', ...input });
      } else {
        Object.assign(links, input);
        await links.save();
      }
      return links;
    },
    
    // Site Settings Management (Singleton)
    updateSiteSettings: async (_, { input }, context) => {
      const admin = context.admin;
      requireAdmin(admin);
      
      let settings = await SiteSettings.findById('site_settings');
      if (!settings) {
        settings = await SiteSettings.create({ _id: 'site_settings', ...input });
      } else {
        // Deep merge for nested objects
        if (input.emailConfig) Object.assign(settings.emailConfig, input.emailConfig);
        if (input.theme) Object.assign(settings.theme, input.theme);
        if (input.features) Object.assign(settings.features, input.features);
        if (input.analytics) Object.assign(settings.analytics, input.analytics);
        if (input.seo) Object.assign(settings.seo, input.seo);
        
        // Update top-level fields
        const topLevelFields = ['siteName', 'siteTitle', 'siteDescription', 'siteKeywords', 
                                'availableForWork', 'availabilityMessage', 'maintenanceMode', 'maintenanceMessage'];
        topLevelFields.forEach(field => {
          if (input[field] !== undefined) settings[field] = input[field];
        });
        
        await settings.save();
      }
      return settings;
    }
  }
};
