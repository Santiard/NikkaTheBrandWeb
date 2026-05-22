import React, { useState, useEffect } from 'react';
import { productsData, editorialImages } from '../services/products';
import './Catalog.css';

export default function Catalog({ categoryFilter, onProductClick }) {
  // Paginación: Mostrar de 8 en 8 al principio
  const [visibleCount, setVisibleCount] = useState(8);

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = productsData.filter((product) => {
    if (!categoryFilter || categoryFilter.toLowerCase() === 'ver todo') {
      return true;
    }
    if (categoryFilter.toLowerCase() === 'new') {
      return product.isNew;
    }
    if (categoryFilter.toLowerCase() === 'sale') {
      // Para simular rebajas, mostramos un subconjunto o todos
      return product.price < 130;
    }
    return product.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Si cambia el filtro de categoría, reiniciar la paginación a 8
  useEffect(() => {
    setVisibleCount(8);
  }, [categoryFilter]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredProducts.length));
  };

  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section className="catalog-section">
      {/* Título de la Categoría */}
      <div className="catalog-header-title">
        <h2>{categoryFilter ? categoryFilter.toLowerCase() : 'shop all'}</h2>
      </div>

      {/* Grid de Productos */}
      <div className="catalog-grid">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <div 
            key={product.id} 
            className="catalog-card"
            onClick={() => onProductClick(product.id)}
          >
            <div className="catalog-image-wrapper">
              <img 
                src={product.mainImage} 
                alt={product.name} 
                className="catalog-image" 
                draggable="false"
              />
              {product.isNew && (
                <span className="badge-new">NEW</span>
              )}
            </div>
            <div className="catalog-info">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">
                ${product.price.toFixed(2)} {product.currency}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación y Botón SEE MORE */}
      <div className="catalog-pagination-container">
        <p className="pagination-text">
          Showing 1 - {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length}
        </p>
        {hasMore && (
          <button className="see-more-button" onClick={handleSeeMore}>
            SEE MORE
          </button>
        )}
      </div>

      {/* Fila inferior de 4 Imágenes Editoriales/Lifestyle */}
      <div className="editorial-divider"></div>
      <div className="editorial-row">
        {editorialImages.map((imgSrc, idx) => (
          <div key={`editorial-${idx}`} className="editorial-item">
            <img 
              src={imgSrc} 
              alt={`Lifestyle Nikka ${idx + 1}`} 
              className="editorial-image"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
