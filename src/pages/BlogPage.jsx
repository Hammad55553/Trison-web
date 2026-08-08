import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../services/blogService';
import './BlogPage.css';
import { Calendar, ArrowRight, User } from 'lucide-react';
import fallbackImg from '../assets/images/pv_module.webp';

const BlogPage = ({ onViewChange }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const featuredPost = blogs.find(p => p.featured);
  const regularPosts = blogs.filter(p => !p.featured);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>Newsroom & Blog</h1>
          <p>Stay updated with the latest innovations, corporate news, and global events from Trison Solar.</p>
        </div>
      </div>

      <div className="blog-container">
        {loading ? (
          <div className="trison-loader">
            <div className="trison-loader-ring">
              <span className="trison-loader-core"></span>
            </div>
            <div className="trison-loader-brand">
              TRIS<span>O</span>N
            </div>
            <p className="trison-loader-text">Fetching the latest solar news…</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="blog-featured">
                <div className="blog-featured-image">
                  <img src={featuredPost.image} alt={featuredPost.title} loading="lazy" />
                  <div className="blog-category-badge">{featuredPost.category}</div>
                </div>
                <div className="blog-featured-content">
                  <div className="blog-meta">
                    <span className="blog-date"><Calendar size={14} /> {new Date(featuredPost.date).toLocaleDateString()}</span>
                    <span className="blog-author"><User size={14} /> {featuredPost.author}</span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <button className="blog-read-more" onClick={() => {
                    if(onViewChange) onViewChange('blog-post', featuredPost.id);
                  }}>Read Full Story <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div className="blog-section-header">
              <h2>Recent Articles</h2>
              <div className="blog-divider"></div>
            </div>

            <div className="blog-grid">
              {regularPosts.map(post => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    <img src={post.image || fallbackImg} alt={post.title} loading="lazy" />
                    <div className="blog-category-badge sm">{post.category}</div>
                    {post.imageCredit && <span className="blog-img-credit">{post.imageCredit}</span>}
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-meta sm">
                      <span className="blog-date"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <button className="blog-read-more sm" onClick={() => {
                      if(onViewChange) onViewChange('blog-post', post.id);
                    }}>Read More <ArrowRight size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
