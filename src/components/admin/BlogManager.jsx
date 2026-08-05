import React, { useState, useEffect } from 'react';
import { getCustomBlogs, addCustomBlog, updateCustomBlog, deleteCustomBlog, getAllBlogs } from '../../services/blogService';
import { Edit2, Trash2, Plus, X, Check, FileText } from 'lucide-react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('News');
  const [author, setAuthor] = useState('Admin');
  const [imageUrl, setImageUrl] = useState('');

  const fetchBlogs = () => {
    // Only get custom blogs to edit, or all blogs to see what's what.
    // For admin, we should let them see all, but only edit/delete custom ones.
    getAllBlogs().then(data => setBlogs(data));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentBlog(null);
    setTitle('');
    setExcerpt('');
    setCategory('Company News');
    setAuthor('Trison Admin');
    setImageUrl('');
  };

  const handleEdit = (blog) => {
    if (blog.source !== 'custom') {
      alert("This is an external API news article and cannot be edited directly.");
      return;
    }
    setIsEditing(true);
    setCurrentBlog(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setCategory(blog.category);
    setAuthor(blog.author);
    setImageUrl(blog.image || '');
  };

  const handleDelete = (blog) => {
    if (blog.source !== 'custom') {
      alert("This is an external API news article and cannot be deleted.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteCustomBlog(blog.id);
      fetchBlogs();
      // Notify parent admin page for toast
      const event = new CustomEvent('admin-notify', { detail: { type: 'success', message: 'Blog post deleted successfully!' } });
      window.dispatchEvent(event);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !excerpt) {
      alert("Title and Excerpt are required.");
      return;
    }

    const blogData = {
      title,
      excerpt,
      category,
      author,
      image: imageUrl || 'https://images.unsplash.com/photo-1509391366360-1200424bb9a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    };

    if (currentBlog) {
      updateCustomBlog(currentBlog.id, blogData);
    } else {
      addCustomBlog(blogData);
    }

    setIsEditing(false);
    fetchBlogs();
    
    // Notify parent admin page for toast
    const event = new CustomEvent('admin-notify', { detail: { type: 'success', message: `Blog post ${currentBlog ? 'updated' : 'created'} successfully!` } });
    window.dispatchEvent(event);
  };

  return (
    <div className="admin-content-section">
      <div className="admin-header-flex">
        <h2>News & Blog Manager</h2>
        {!isEditing && (
          <button className="admin-btn-primary" onClick={handleAddNew}>
            <Plus size={16} /> Add Custom Post
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="admin-card blog-form-card">
          <div className="admin-card-header">
            <h3>{currentBlog ? 'Edit Post' : 'Create New Post'}</h3>
            <button className="icon-btn" onClick={() => setIsEditing(false)}><X size={20} /></button>
          </div>
          <form className="admin-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Post Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Trison Launches New Module" required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Technology" required />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
              <small style={{color: '#94a3b8', marginTop: '4px', display: 'block'}}>Leave blank for a default solar image.</small>
            </div>

            <div className="form-group">
              <label>Excerpt / Content Summary</label>
              <textarea 
                rows="4" 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)} 
                placeholder="A brief summary of the news article..."
                required 
              />
            </div>

            <div className="form-actions">
              <button type="button" className="admin-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="admin-btn-primary"><Check size={16} /> Save Post</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td>
                    <div className="flex-align" style={{gap: '8px', color: '#fff', fontWeight: '500'}}>
                      <FileText size={16} color="var(--primary)" />
                      {blog.title.substring(0, 50)}{blog.title.length > 50 ? '...' : ''}
                      {blog.featured && <span className="status-badge active" style={{marginLeft: '8px'}}>Featured</span>}
                    </div>
                  </td>
                  <td style={{color: '#94a3b8'}}>{blog.category}</td>
                  <td style={{color: '#94a3b8'}}>{new Date(blog.date).toLocaleDateString()}</td>
                  <td>
                    {blog.source === 'custom' ? (
                      <span className="status-badge" style={{background: 'rgba(16, 185, 129, 0.2)', color: '#34d399'}}>Trison Custom</span>
                    ) : (
                      <span className="status-badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa'}}>Global API</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {blog.source === 'custom' ? (
                        <>
                          <button className="icon-btn edit" title="Edit Post" onClick={() => handleEdit(blog)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-btn delete" title="Delete Post" onClick={() => handleDelete(blog)}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span style={{color: '#64748b', fontSize: '0.85rem'}}>Read Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
              No blog posts found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
