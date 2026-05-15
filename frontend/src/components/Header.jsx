import React from 'react';
import './Header.css';
import logo from '../images/nikka.png';

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button className="menu-button" onClick={onMenuClick}>Menu</button>
      <div className="logo-wrapper">
        <img src={logo} alt="Nikka" className="logo" />
        <span className="tagline">Designed for the love of vintage</span>
      </div>
      <div className="header-actions">
        <input type="text" placeholder="Search" className="search-input" />
        <button className="cart-button">Cart</button>
      </div>
    </header>
  );
}
