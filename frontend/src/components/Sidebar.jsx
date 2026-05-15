import React from 'react';
import './Sidebar.css';

const shortcuts = [
  'New',
  'Intimates',
  'Bags',
  'Accessories',
  'Gift Cards',
  'Sale',
  'Envíos y Devoluciones',
  'Nuestra Historia',
  'Contáctanos'
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}> 
      <button className="close-button" onClick={onClose}>×</button>
      <nav className="sidebar-nav">
        <ul>
          {shortcuts.map((item) => (
            <li key={item} className="sidebar-item">{item}</li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
