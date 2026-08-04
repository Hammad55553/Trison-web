import React from 'react';
import useReveal from '../../hooks/useReveal';
import './Reveal.css';

const Reveal = ({ as: Tag = 'div', className = '', delay = 0, effect = 'up', children, ...rest }) => {
  const [nodeRef, visible] = useReveal();

  return (
    <Tag
      ref={nodeRef}
      className={`reveal reveal-${effect} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
