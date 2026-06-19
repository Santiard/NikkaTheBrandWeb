import React, { useState, useEffect, useRef } from 'react';
import './SearchOverlay.css';

export default function SearchOverlay({ isOpen, onClose, products, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Foco automático en el input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Filtrado en tiempo real
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = products.filter(product => {
      // Buscar en nombre, descripción y categoría
      const inName = product.name?.toLowerCase().includes(searchTerm);
      const inDesc = product.description?.toLowerCase().includes(searchTerm);
      const inCat = product.category?.toLowerCase().includes(searchTerm);
      
      // Filtrado por colección o etiquetas (ej: new in, lanzamiento)
      const isNew = searchTerm.includes('new') || searchTerm.includes('nuevo') || searchTerm.includes('lanzamiento');
      const inCollection = isNew && product.discountPercentage > 0; // Ejemplo lógico, o usar un flag real

      return inName || inDesc || inCat || inCollection;
    });

    setResults(filtered);
  }, [query, products]);

  const handleResultClick = (e, productId) => {
    e.preventDefault();
    onClose();
    onNavigate('detail', productId);
  };

  return (
    <div className={`search-overlay ${isOpen ? 'open' : ''}`}>
      <button className="search-close-btn" onClick={onClose}>
        cerrar ✕
      </button>

      <div className="search-input-container">
        <input 
          ref={inputRef}
          type="text" 
          className="search-input"
          placeholder="buscar productos, colecciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="search-results-container">
        {results.map(product => {
          const mainImg = product.images && product.images.length > 0 
            ? product.images.find(img => img.imageType === 'MAIN')?.imageUrl || product.images[0].imageUrl
            : 'https://via.placeholder.com/300x400?text=No+Image';

          return (
            <a 
              key={product.id}
              href="#" 
              className="search-result-card"
              onClick={(e) => handleResultClick(e, product.id)}
            >
              <img 
                src={mainImg} 
                alt={product.name} 
                className="search-result-image"
              />
              <div className="search-result-info">
                <span className="search-result-name">{product.name}</span>
                <span className="search-result-price">${product.price?.toLocaleString()}</span>
              </div>
            </a>
          );
        })}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="search-empty-state">
          No se encontraron resultados para "{query}"
        </div>
      )}
    </div>
  );
}
