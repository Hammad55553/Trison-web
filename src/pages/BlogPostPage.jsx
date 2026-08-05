import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../services/blogService';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import './BlogPostPage.css';

const BlogPostPage = ({ blogId, onViewChange }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const allBlogs = await getAllBlogs();
        const found = allBlogs.find(b => String(b.id) === String(blogId));
        setBlog(found);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div style={{ textAlign: 'center', padding: '150px 20px', color: '#fff' }}>
          Loading article...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-post-page">
        <div style={{ textAlign: 'center', padding: '150px 20px', color: '#fff' }}>
          <h2>Article Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Article Header */}
      <div className="post-hero">
        <div className="post-hero-container">
          <div className="post-category">{blog.category}</div>
          <h1 className="post-title">{blog.title}</h1>
          
          <div className="post-meta">
            <span className="post-meta-item">
              <Calendar size={16} /> {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="post-meta-item">
              <User size={16} /> {blog.author}
            </span>
          </div>
        </div>
      </div>

      {/* Article Featured Image */}
      <div className="post-image-container">
        <img src={blog.image || 'https://images.unsplash.com/photo-1509391366360-1200424bb9a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt={blog.title} />
      </div>

      {/* Article Content */}
      <div className="post-content-container">
        <div className="post-social-share">
          <span>Share:</span>
          <button className="share-btn" title="Share Article">
            <Share2 size={18} />
          </button>
        </div>
        
        <div className="post-body">
          <p className="post-lead">{blog.excerpt}</p>
          
          <p>
            The global transition to renewable energy is experiencing unprecedented momentum, driven by technological breakthroughs and an urgent need for sustainable power generation. Solar energy, at the forefront of this revolution, is no longer just an alternative—it is rapidly becoming the backbone of the world's future energy matrix. As highlighted in recent industry reports and announcements, the focus has shifted from simply increasing raw installation capacity to drastically improving the underlying efficiency, durability, and lifecycle of solar modules operating in diverse and extreme environmental conditions.
          </p>
          
          <h2>Pioneering New Horizons in Solar Tech</h2>
          <p>
            The solar energy landscape is undergoing a monumental shift. New wafer technologies, such as the adoption of N-Type TOPCon and heterojunction (HJT) architectures, are pushing cell efficiencies past historical theoretical limits. This development is crucial. By maximizing the power output per square meter, utility-scale developers and commercial and industrial (C&I) facility owners can generate significantly more energy without requiring additional land area. 
          </p>

          <p>
            Furthermore, the industry is seeing rapid advancements in bifacial module designs. These panels not only capture direct sunlight from the front but also absorb reflected light from the ground (albedo), boosting overall energy yields by an additional 10% to 25% depending on the installation environment. This is a game-changer for large-scale utility deployments in desert or snow-covered regions.
          </p>
          
          <h2>The Path Forward for Trison Solar</h2>
          <p>
            Trison Solar remains firmly committed to leading this transition. By investing heavily in cutting-edge Research & Development and expanding our highly automated global manufacturing footprint, we are ensuring that premium, Tier-1 solar technology is accessible across all major international markets. Our recent milestones underscore our dedication to quality and performance at scale.
          </p>

          <blockquote>
            "Our focus has always been on combining cutting-edge cell technology with robust manufacturing practices. True innovation in solar isn't just about laboratory records; it's about delivering those records to the field reliably for 30 years. This announcement is a testament to our dedicated engineering teams and their relentless pursuit of excellence." — {blog.author}
          </blockquote>

          <p>
            Looking ahead, the integration of smart manufacturing processes—utilizing AI-driven quality control and advanced robotics—will further reduce our carbon footprint, keeping us tightly aligned with our aggressive 2030 corporate sustainability goals. 
          </p>

          <h2>A Greener Future, Together</h2>
          <p>
            The challenges of climate change require collaborative, large-scale solutions. We invite our EPC partners, international distributors, and end-customers to join us on this journey toward a cleaner, greener future. By deploying advanced monocrystalline solutions today, we are paving the way for a truly sustainable tomorrow. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
