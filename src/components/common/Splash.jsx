import React, { useEffect, useState } from 'react';
import './Splash.css';

const LETTERS = ['T', 'R', 'I', 'S', 'O', 'N'];

const Splash = ({ onFinish }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Lock scroll while the splash is on screen
    document.body.style.overflow = 'hidden';

    const startLeave = setTimeout(() => setLeaving(true), 2400);
    const done = setTimeout(() => {
      document.body.style.overflow = '';
      onFinish();
    }, 3100);

    return () => {
      clearTimeout(startLeave);
      clearTimeout(done);
      document.body.style.overflow = '';
    };
  }, [onFinish]);

  return (
    <div className={`splash ${leaving ? 'splash-leaving' : ''}`}>
      {/* Ambient sunrise glow behind the wordmark */}
      <div className="splash-glow" />

      <div className="splash-wordmark" aria-label="Trison">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className={`splash-letter ${ch === 'O' ? 'splash-letter-sun' : ''}`}
            style={{ animationDelay: `${0.15 + i * 0.12}s` }}
          >
            {ch === 'O' ? (
              <span className="splash-sun">
                <span className="splash-sun-core" />
                <span className="splash-sun-rays" />
              </span>
            ) : (
              ch
            )}
          </span>
        ))}
        <span className="splash-reg">®</span>
      </div>

      {/* Loading sweep line */}
      <div className="splash-bar">
        <div className="splash-bar-fill" />
      </div>

      <p className="splash-tagline">PRECISION SOLAR · SINCE 2007</p>
    </div>
  );
};

export default Splash;
