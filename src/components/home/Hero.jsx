import React, { useState, useRef, useEffect } from 'react';
import './Hero.css';

// Import local background videos
import bannerVideo from '../../assets/videos/Banner_3b83dcd243.mp4';
import hiMoVideo from '../../assets/videos/Hi_MO_9_PV_14ff44ca50.mp4';

// Per-video text content
const videoContent = [
  {
    label: 'EST. 2007 · CHINESE MANUFACTURER',
    title: <>Precision-Engineered <br /><span className="text-gradient-orange">Monocrystalline Silicon Cells</span></>,
    subtitle: 'From ingot to finished panel — vertically integrated solar manufacturing at global scale.',
  },
  {
    label: 'TIER-1 PRODUCTION · HI-MO 9 SERIES',
    title: <>Setting World Records in <br /><span className="text-gradient-orange">Silicon PV Cell Efficiency</span></>,
    subtitle: 'Over 50GW shipped worldwide. Trusted by utility developers, EPC contractors, and distributors.',
  },
];

const videos = [bannerVideo, hiMoVideo];

const Hero = ({ onViewChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRefs = [useRef(null), useRef(null)];

  // When active index changes, play the newly active video from start
  useEffect(() => {
    const active = videoRefs[activeIndex].current;
    const inactive = videoRefs[1 - activeIndex].current;
    if (active) {
      active.currentTime = 0;
      active.play().catch(() => {});
    }
    if (inactive) {
      inactive.pause();
    }
    setProgress(0);
  }, [activeIndex]);

  const handleTimeUpdate = (idx) => {
    if (idx !== activeIndex) return;
    const vid = videoRefs[idx].current;
    if (vid && vid.duration) {
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  const handleEnded = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const jumpTo = (idx) => {
    setActiveIndex(idx);
  };

  const content = videoContent[activeIndex];

  return (
    <section id="hero" className="hero-section">
      {/* Both videos always in DOM — crossfade via opacity */}
      {videos.map((src, idx) => (
        <video
          key={idx}
          ref={videoRefs[idx]}
          className={`hero-bg-video ${idx === activeIndex ? 'video-active' : 'video-inactive'}`}
          src={src}
          autoPlay={idx === 0}
          muted
          playsInline
          onEnded={idx === activeIndex ? handleEnded : undefined}
          onTimeUpdate={() => handleTimeUpdate(idx)}
        />
      ))}
      <div className="hero-video-overlay"></div>

      {/* Background abstract glowing shapes */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="hero-container">
        <div className="hero-content">
          <span key={`label-${activeIndex}`} className="hero-label hero-title-anim">
            {content.label}
          </span>

          <h1 key={`title-${activeIndex}`} className="hero-title hero-title-anim">
            {content.title}
          </h1>

          <p key={`sub-${activeIndex}`} className="hero-subtitle hero-subtitle-anim">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Video Progress Indicators */}
      <div className="hero-progress-bar-container">
        {videos.map((_, idx) => (
          <div
            key={idx}
            className={`hero-progress-track ${idx === activeIndex ? 'active-track' : ''}`}
            onClick={() => jumpTo(idx)}
          >
            <div
              className="hero-progress-fill"
              style={{
                width: idx === activeIndex
                  ? `${progress}%`
                  : idx < activeIndex ? '100%' : '0%',
              }}
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
