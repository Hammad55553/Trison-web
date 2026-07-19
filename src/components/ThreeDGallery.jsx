import React from 'react';

// Load 3D images from src/assets/images/3d using Vite's glob import
const modules = import.meta.glob('../assets/images/3d/*.{png,jpg,jpeg}', { eager: true });
const images = Object.keys(modules).map((k) => modules[k].default);

export default function ThreeDGallery() {
  return (
    <section style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>3D Asset Gallery</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {images.map((src, i) => (
          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', background: '#f6f6f6' }}>
            <img src={src} alt={`3d-${i + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        ))}
      </div>
    </section>
  );
}
