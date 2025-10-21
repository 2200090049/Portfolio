import React, { useState, useEffect } from 'react';
import { FaBlog, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSearch, FaFilter, FaClock, FaCalendar } from 'react-icons/fa';
import BlogModal from '../../../components/admin/BlogModal';
import './BlogsManager.css';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query GetBlogs {
              blogs {
                id
                title
                slug
                excerpt
                content
                coverImage
                category
                tags
                author
                published
                readTime
                views
                showInAllPortfolios
                createdAt
                updatedAt
              }
            }
          `
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        console.error('GraphQL errors:', errors);
        return;
      }

      if (data?.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation DeleteBlog($id: ID!) {
              deleteBlog(id: $id)
            }
          `,
          variables: { id: blogId }
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        alert('Error deleting blog: ' + errors[0].message);
        return;
      }

      if (data?.deleteBlog) {
        setBlogs(blogs.filter(b => b.id !== blogId));
        alert('✅ Blog deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateBlog($id: ID!, $input: BlogInput!) {
              updateBlog(id: $id, input: $input) {
                id
                published
              }
            }
          `,
          variables: {
            id: blog.id,
            input: { 
              title: blog.title,
              slug: blog.slug,
              excerpt: blog.excerpt,
              content: blog.content,
              category: blog.category,
              tags: blog.tags,
              coverImage: blog.coverImage,
              author: blog.author,
              published: !blog.published,
              featured: blog.featured,
              readTime: blog.readTime
            }
          }
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        alert('Error updating blog: ' + errors[0].message);
        return;
      }

      if (data?.updateBlog) {
        setBlogs(blogs.map(b => b.id === blog.id ? { ...b, published: data.updateBlog.published } : b));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleModalClose = (updatedBlog) => {
    setShowModal(false);
    setEditingBlog(null);
    if (updatedBlog) {
      fetchBlogs();
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesStatus = filter === 'all' || 
                         (filter === 'published' && blog.published) ||
                         (filter === 'draft' && !blog.published);
    
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    
    const matchesSearch = !searchTerm || 
                         blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.published).length,
    draft: blogs.filter(b => !b.published).length,
    totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0)
  };

  // Get unique categories
  const categories = ['all', ...new Set(blogs.map(b => b.category).filter(Boolean))];

  if (loading) {
    return <div className="loading-spinner">Loading blogs...</div>;
  }

  return (
    <div className="blogs-manager">
      <div className="page-header">
        <div>
          <h1 className="page-title"><FaBlog /> Blogs Manager</h1>
          <p>Manage your blog posts and content</p>
        </div>
        <button className="btn-primary" onClick={handleAddBlog}>
          <FaPlus /> Add New Blog
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="mini-stat-card" onClick={() => setFilter('all')}>
          <div className="stat-icon"><FaBlog /></div>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-text">Total Blogs</div>
          </div>
        </div>
        <div className="mini-stat-card" onClick={() => setFilter('published')}>
          <div className="stat-icon"><FaEye /></div>
          <div>
            <div className="stat-number">{stats.published}</div>
            <div className="stat-text">Published</div>
          </div>
        </div>
        <div className="mini-stat-card" onClick={() => setFilter('draft')}>
          <div className="stat-icon"><FaEyeSlash /></div>
          <div>
            <div className="stat-number">{stats.draft}</div>
            <div className="stat-text">Drafts</div>
          </div>
        </div>
        <div className="mini-stat-card">
          <div className="stat-icon"><FaEye /></div>
          <div>
            <div className="stat-number">{stats.totalViews}</div>
            <div className="stat-text">Total Views</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search blogs by title, excerpt, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <FaFilter />
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
        </div>
        {categories.length > 1 && (
          <select 
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <FaBlog className="empty-icon" />
          <h3>No blogs found</h3>
          <p>{searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Create your first blog post to get started!'}</p>
          {!searchTerm && filter === 'all' && (
            <button className="btn-primary" onClick={handleAddBlog}>
              <FaPlus /> Create Your First Blog
            </button>
          )}
        </div>
      ) : (
        <div className="blogs-list">
          {filteredBlogs.map(blog => (
            <div key={blog.id} className={`blog-card ${!blog.published ? 'draft' : ''}`}>
              <div className="blog-header">
                <div className="blog-status">
                  {blog.published ? (
                    <span className="status-badge published">
                      <FaEye /> Published
                    </span>
                  ) : (
                    <span className="status-badge draft">
                      <FaEyeSlash /> Draft
                    </span>
                  )}
                  {blog.category && (
                    <span className="category-badge">{blog.category}</span>
                  )}
                </div>
                <div className="blog-actions">
                  <button
                    className="action-btn toggle-btn"
                    onClick={() => handleTogglePublish(blog)}
                    title={blog.published ? 'Unpublish' : 'Publish'}
                  >
                    {blog.published ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditBlog(blog)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="blog-content">
                {blog.coverImage && (
                  <div className="blog-cover">
                    <img src={blog.coverImage} alt={blog.title} />
                  </div>
                )}
                <div className="blog-info">
                  <h3 className="blog-title">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  )}
                  <div className="blog-meta">
                    {blog.author && (
                      <span className="meta-item">
                        👤 {blog.author}
                      </span>
                    )}
                    {blog.readTime && (
                      <span className="meta-item">
                        <FaClock /> {blog.readTime} min read
                      </span>
                    )}
                    {blog.createdAt && (
                      <span className="meta-item">
                        <FaCalendar /> {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {blog.views > 0 && (
                      <span className="meta-item">
                        <FaEye /> {blog.views} views
                      </span>
                    )}
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Modal */}
      {showModal && (
        <BlogModal
          blog={editingBlog}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default BlogsManager;
