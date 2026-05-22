import React from 'react';
import './Sidebar.css';

const shortcuts = [
  { name: 'New', action: () => 'new' },
  { name: 'Intimates', action: () => 'intimates' },
  { name: 'Bags', action: () => 'bags' },
  { name: 'Accessories', action: () => 'accessories' },
  { name: 'Gift Cards', action: () => 'ver todo' },
  { name: 'Sale', action: () => 'sale' },
  { name: 'Envíos y Devoluciones', action: () => null },
  { name: 'Nuestra Historia', action: () => null },
  { name: 'Contáctanos', action: () => null }
];

export default function Sidebar({ isOpen, onClose, onNavigate }) {
  const handleItemClick = (item) => {
    onClose();
    if (item.action) {
      const category = item.action();
      if (category) {
        onNavigate('catalog', category);
      }
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}> 
      <button className="close-button" onClick={onClose} aria-label="Cerrar menú">×</button>
      <nav className="sidebar-nav">
        <ul>
          {shortcuts.map((item) => (
            <li 
              key={item.name} 
              className="sidebar-item"
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

