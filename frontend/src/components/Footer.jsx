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
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'contact')}>contáctanos</a>
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'faqs')}>FAQs</a>
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'giftcard')}>gift cards</a>
        <a href="#" className="footer-link" onClick={(e) => handleLinkClick(e, 'history')}>nuestra historia</a>
        <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); window.open('https://www.instagram.com/nikkathebrand?igsh=MWdkOGdydmJqcWI3bg%3D%3D', '_blank'); }}>instagram</a>
        <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); window.open('https://www.tiktok.com/@nikkathebrand?_r=1&_t=ZS-96iM6cjOBjl', '_blank'); }}>tiktok</a>
        <span className="footer-brand">nikkathebrand 2026</span>
      </div>
    </footer>
  );
}

