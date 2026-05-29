import React from 'react';
import './Sidebar.css';

const shortcuts = [
  { name: 'New', action: () => 'new' },
  { name: 'Intimates', action: () => 'intimates' },
  { name: 'Bags', action: () => 'bags' },
  { name: 'Accessories', action: () => 'accessories' },
  { name: 'Gift Cards', action: () => null },
  { name: 'Sale', action: () => 'sale' },
  { name: 'Guía de Medidas', action: () => null },
  { name: 'FAQs', action: () => null },
  { name: 'Nuestra Historia', action: () => null },
  { name: 'Contáctanos', action: () => null }
];

export default function Sidebar({ isOpen, onClose, onNavigate }) {
  const handleItemClick = (item) => {
    onClose();
    if (item.name === 'Nuestra Historia') {
      onNavigate('history');
      return;
    }
    if (item.name === 'Contáctanos') {
      onNavigate('contact');
      return;
    }
    if (item.name === 'FAQs') {
      onNavigate('faqs');
      return;
    }
    if (item.name === 'Gift Cards') {
      onNavigate('giftcard');
      return;
    }
    if (item.name === 'Guía de Medidas') {
      onNavigate('medidas');
      return;
    }
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

