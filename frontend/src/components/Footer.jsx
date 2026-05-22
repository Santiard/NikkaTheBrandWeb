import React from 'react';
import './Footer.css';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, page, category) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page, category);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'catalog', 'ver todo')}>catálogo</a>
        <a href="#" className="footer-link">envíos y devoluciones</a>
        <a href="#" className="footer-link">contáctanos</a>
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'catalog', 'ver todo')}>gift cards</a>
        <a href="#" className="footer-link">nuestra historia</a>
        <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); window.open('https://instagram.com', '_blank'); }}>instagram</a>
        <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); window.open('https://tiktok.com', '_blank'); }}>tiktok</a>
        <span className="footer-brand">nikkathebrand 2026</span>
      </div>
    </footer>
  );
}

