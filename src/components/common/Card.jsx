import React from 'react';
import './Card.css';

/**
 * Reusable Glassmorphism Card
 * @param {object} props
 * @param {React.ReactNode} props.children - Card contents
 * @param {string} props.className - Extra wrapper classes
 * @param {boolean} props.interactive - Enables hover scaling and borders
 * @param {boolean} props.glow - Adds a glowing border effect
 * @param {string} props.badgeText - Displays a pill badge at the top-right
 * @param {string} props.badgeType - 'primary' | 'secondary' | 'accent'
 */
const Card = ({ 
  children, 
  className = '', 
  interactive = true, 
  glow = false,
  badgeText = '',
  badgeType = 'primary',
  ...props 
}) => {
  return (
    <div 
      className={`glass-card ${interactive ? 'interactive' : ''} ${glow ? 'glow' : ''} ${className}`}
      {...props}
    >
      {badgeText && (
        <span className={`card-badge badge-${badgeType}`}>
          {badgeText}
        </span>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
