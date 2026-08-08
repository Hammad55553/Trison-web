import React, { useState, useEffect } from 'react';
import './NewsFeed.css';
import { fetchPixabayPool } from '../../services/blogService';
// Local solar images used only as a fallback if Pixabay is unreachable.
import newsTandemCell from '../../assets/images/news_tandem_cell.webp';
import pvModule from '../../assets/images/pv_module.webp';
import expo from '../../assets/images/expo.webp';

const NewsFeed = () => {
  const news = [
    {
      date: '2026.07.14',
      tag: 'Trison Breakthroughs',
      title: '35.5% Efficiency! Trison Once Again Breaks World Record for Tandem Solar Cells',
      desc: 'At the 2026 Solar and Energy Storage Conference, Trison officially announced that its independently developed crystalline silicon-perovskite tandem cell has achieved a conversion efficiency of 35.5%, certified by national testing laboratories.',
      image: newsTandemCell
    },
    {
      date: '2026.07.13',
      tag: 'Global Recognition',
      title: 'Trison Joins S&P Global energy List of Tier 1 Cleantech Companies 2026',
      desc: 'Recognizing continuous excellence and market supply leadership, Trison secures its place among an elite selection of top-performing global solar cell suppliers.',
      image: pvModule
    },
    {
      date: '2026.06.04',
      tag: 'Trade Conventions',
      title: 'Trison-Storage Technology Debuts at SNEC 2026 Exhibit',
      desc: 'Highlighting multi-scenario full-stack module and battery storage solutions to build standalone generator systems for large-scale industrial projects.',
      image: expo
    }
  ];

  // Swap in free Pixabay solar photos once loaded (keeps local as fallback).
  const [images, setImages] = useState(news.map(n => n.image));
  useEffect(() => {
    let alive = true;
    fetchPixabayPool().then(pool => {
      if (alive && pool && pool.length) {
        setImages(news.map((_, i) => pool[i % pool.length]));
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <section id="news" className="news-section">
      <div className="news-container">
        <div className="news-header-block">
          <h2>Trending News & Events</h2>
          <p>Stay informed with the latest technological developments, press announcements, and global events from Trison.</p>
        </div>

        <div className="news-grid-cards">
          {news.map((item, idx) => (
            <div className="news-item-card" key={idx}>
              <div className="news-img-box">
                <img src={images[idx] || item.image} alt={item.title} className="news-img" loading="lazy" decoding="async" />
              </div>
              <div className="news-content-box">
                <span className="news-tag-badge">{item.tag}</span>
                <span className="news-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
