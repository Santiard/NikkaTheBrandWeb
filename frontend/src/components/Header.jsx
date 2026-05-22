import React from 'react';
import './Header.css';
import logo from '../images/nikka logo.png';

export default function Header({ onMenuClick, onLogoClick }) {
  return (
    <div className="header-wrapper">
      <div className="top-strip">
        Designed for the love of vintage ..: 𓃶 :..
      </div>
      <header className="header">
        <div className="menu-btn-container">
          <button className="menu-button" onClick={onMenuClick}>menu</button>
        </div>
        <div className="logo-wrapper" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="nikka" className="logo" />
        </div>
        <div className="header-actions">
          <button className="search-button">search</button>
          <button className="cart-button">cart (0)</button>
        </div>
      </header>
    </div>
  );
}

