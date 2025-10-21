import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOGS } from '../graphql/queries';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import './Blog.css';

const Blog = () => {
  const { getRoleTheme, selectedRole } = usePortfolio();
  const theme = getRoleTheme();
  const { data, loading } = useQuery(GET_BLOGS, {
    variables: { 
      published: true,
      category: selectedRole
    }
  });

  return (
    <div className="blog-page" style={{ background: theme?.gradient }}>
      <div className="container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ color: theme?.primary }}>Blog & Insights</h1>
          <p>Thoughts, stories, and ideas</p>
        </motion.div>

        <div className="blogs-grid">
          {loading ? (
            <p>Loading blogs...</p>
          ) : data?.blogs?.length > 0 ? (
            data.blogs.map((blog, index) => (
              <motion.div 
                key={blog.id} 
                className="blog-card" 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                style={{ borderColor: theme?.primary }}
              >
                <Link to={`/blog/${blog.slug}`}>
                  {blog.coverImage && (
                    <div className="blog-image">
                      <img src={blog.coverImage} alt={blog.title} />
                      {blog.featured && <div className="featured-badge">⭐ Featured</div>}
                    </div>
                  )}
                  <div className="blog-content">
                    <div className="blog-meta-top">
                      <span className="category-badge" style={{ background: theme?.primary }}>
                        {blog.category}
                      </span>
                      <span className="read-time">📖 {blog.readTime}</span>
                    </div>
                    <h3 style={{ color: theme?.primary }}>{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-tags">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="tag" style={{ color: theme?.secondary }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="blog-footer">
                      <span className="author">✍️ {blog.author}</span>
                      <span className="views">👁️ {blog.views} views</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p>No blogs yet. Check back soon!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
