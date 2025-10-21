import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Testimonial from './models/Testimonial.js';
import Blog from './models/Blog.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI.replace('<db_password>', process.env.DB_PASSWORD || 'your_password_here');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack MERN application with payment integration and real-time inventory',
        category: 'developer',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        github: 'https://github.com/deepakreddy/ecommerce',
        liveDemo: 'https://example.com',
        featured: true,
        order: 1
      },
      {
        title: 'Customer Churn Prediction',
        description: 'ML model to predict customer churn with 92% accuracy using ensemble methods',
        category: 'datascience',
        techStack: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
        github: 'https://github.com/deepakreddy/churn-prediction',
        featured: true,
        order: 2
      },
      {
        title: 'FinTech Mobile App Redesign',
        description: 'Complete UX overhaul of banking app, increasing user engagement by 45%',
        category: 'ux',
        tools: ['Figma', 'Sketch', 'Adobe XD', 'Miro'],
        liveDemo: 'https://behance.net/example',
        featured: true,
        order: 3
      }
    ];

    await Project.insertMany(projects);
    console.log('✅ Seeded projects');

    // Seed Testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Product Manager',
        company: 'Tech Corp',
        message: 'Deepak delivered an exceptional web application that exceeded our expectations.',
        rating: 5,
        category: 'developer',
        approved: true,
        featured: true
      },
      {
        name: 'Dr. Michael Chen',
        role: 'Data Science Lead',
        company: 'Analytics Inc',
        message: 'His ML models are production-ready and well-documented. Highly recommended!',
        rating: 5,
        category: 'datascience',
        approved: true,
        featured: true
      },
      {
        name: 'Emily Williams',
        role: 'Design Director',
        company: 'Creative Studio',
        message: 'Deepak\'s UX research and design work transformed our product experience.',
        rating: 5,
        category: 'ux',
        approved: true,
        featured: true
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('✅ Seeded testimonials');

    // Seed Blogs
    const blogs = [
      {
        title: 'Building Scalable React Applications',
        slug: 'building-scalable-react-applications',
        excerpt: 'Best practices for structuring large-scale React projects',
        content: '<p>In this article, we explore architectural patterns for building maintainable React applications...</p>',
        category: 'developer',
        tags: ['React', 'JavaScript', 'Architecture'],
        published: true,
        featured: true,
        readTime: '8 min read'
      },
      {
        title: 'Introduction to Machine Learning Pipelines',
        slug: 'ml-pipelines-introduction',
        excerpt: 'Learn how to build production-ready ML pipelines',
        content: '<p>Machine learning pipelines are essential for deploying models at scale...</p>',
        category: 'datascience',
        tags: ['Machine Learning', 'Python', 'MLOps'],
        published: true,
        featured: true,
        readTime: '10 min read'
      }
    ];

    await Blog.insertMany(blogs);
    console.log('✅ Seeded blogs');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
