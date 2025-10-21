import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBlog, FaEye } from 'react-icons/fa';
import './BlogModal.css';

const BlogModal = ({ blog, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    author: '',
    published: false,
    readTime: '0',
    showInAllPortfolios: false
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || '',
        category: blog.category || '',
        tags: blog.tags || [],
        author: blog.author || '',
        published: blog.published || false,
        readTime: blog.readTime || '0',
        showInAllPortfolios: blog.showInAllPortfolios || false
      });
      setAutoSlug(false);
    }
  }, [blog]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'title' && autoSlug) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    } else if (name === 'slug') {
      setAutoSlug(false);
      setFormData(prev => ({
        ...prev,
        slug: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleContentChange = (content) => {
    const readTime = calculateReadTime(content);
    setFormData(prev => ({
      ...prev,
      content,
      readTime: String(readTime) // Convert to string for GraphQL
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const mutation = blog ? 'updateBlog' : 'createBlog';
      const variables = blog 
        ? { id: blog.id, input: formData }
        : { input: formData };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation ${mutation === 'createBlog' ? 'CreateBlog' : 'UpdateBlog'}(${blog ? '$id: ID!, ' : ''}$input: BlogInput!) {
              ${mutation}(${blog ? 'id: $id, ' : ''}input: $input) {
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
                showInAllPortfolios
              }
            }
          `,
          variables
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        setError(errors[0].message);
        return;
      }

      if (data?.[mutation]) {
        alert(`✅ Blog ${blog ? 'updated' : 'created'} successfully!`);
        onClose(data[mutation]);
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay blog-modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container blog-modal-container">
        <div className="modal-header">
          <div>
            <h2><FaBlog /> {blog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            <p>Write and publish your content</p>
          </div>
          <button className="close-btn" onClick={() => onClose()}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form blog-modal-form">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group full-width">
              <label>Blog Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>URL Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="url-friendly-slug"
                required
              />
              <small>Auto-generated from title</small>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="developer">Developer</option>
                <option value="datascience">Data Science</option>
                <option value="ux">UX Design</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Excerpt (Short Description)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your blog post (shown in preview cards)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://..."
            />
            {formData.coverImage && (
              <div className="image-preview">
                <img src={formData.coverImage} alt="Cover preview" />
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label>
              Content * 
              <span className="read-time">
                <FaEye /> {formData.readTime} min read
              </span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your amazing content here... (Supports HTML & Markdown)"
              className="blog-editor"
              rows={20}
              required
            />
            <div className="editor-hint">
              💡 Tip: Use HTML tags or Markdown for formatting. Example: &lt;h2&gt;Heading&lt;/h2&gt;, **bold**, *italic*
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Type and press Enter"
              />
              <button type="button" onClick={addTag} className="add-tag-btn">Add</button>
            </div>
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button type="button" onClick={() => removeTag(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              <span>Publish immediately</span>
            </label>
            <small>Uncheck to save as draft</small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="showInAllPortfolios"
                checked={formData.showInAllPortfolios}
                onChange={handleChange}
              />
              <span>🌐 Show in ALL Portfolios</span>
            </label>
            {formData.showInAllPortfolios && (
              <small style={{ color: '#ffdd00' }}>
                ⚠️ This blog will appear in Developer, Data Science, AND UX portfolios
              </small>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => onClose()}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
