import React from 'react';
import './Header.css';
import logo from '../images/nikka-logo.webp';

export default function Header({ onMenuClick, onLogoClick, onCartClick, cartCount }) {
  return (
    <div className="header-wrapper">
      <div className="top-strip">
        Designed for the love of vintage⣠⠞𐙚⢷
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
          <button className="cart-button" onClick={onCartClick}>cart ({cartCount})</button>
        </div>
      </header>
    </div>
  );
}

