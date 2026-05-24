import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { editorialImages } from '../services/products';
import './Catalog.css';

export default function Catalog({ categoryFilter, onProductClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  // Cargar productos desde el backend
  useEffect(() => {
    setLoading(true);
    apiService.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = products.filter((product) => {
    if (!categoryFilter || categoryFilter.toLowerCase() === 'ver todo') {
      return true;
    }
    if (categoryFilter.toLowerCase() === 'new') {
      // Simular nuevos usando el flag o ids específicos
      return product.discountPercentage === 0;
    }
    if (categoryFilter.toLowerCase() === 'sale') {
      // Para simular rebajas, mostramos productos con descuento activo
      return product.discountPercentage > 0 || product.price < 130;
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

  if (loading) {
    return (
      <section className="catalog-section">
        <div className="catalog-header-title">
          <h2>cargando catálogo...</h2>
        </div>
        <div className="admin-info-text">reuniendo las mejores piezas vintage para ti...</div>
      </section>
    );
  }

  return (
    <section className="catalog-section">
      {/* Título de la Categoría */}
      <div className="catalog-header-title">
        <h2>{categoryFilter ? categoryFilter.toLowerCase() : 'shop all'}</h2>
      </div>

      {/* Grid de Productos */}
      <div className="catalog-grid">
        {filteredProducts.slice(0, visibleCount).map((product) => {
          // Extraer la imagen principal o respaldo
          const mainImg = product.images && product.images.length > 0 
            ? product.images.find(img => img.imageType === 'MAIN')?.imageUrl || product.images[0].imageUrl
            : product.mainImage; // Respaldo estático si no hay imágenes en la BD

          const hasDiscount = product.discountPercentage > 0;
          const finalPrice = product.price - (product.price * (product.discountPercentage || 0) / 100);

          return (
            <div 
              key={product.id} 
              className="catalog-card"
              onClick={() => onProductClick(product.id)}
            >
              <div className="catalog-image-wrapper">
                <img 
                  src={mainImg} 
                  alt={product.name} 
                  className="catalog-image" 
                  draggable="false"
                />
                {product.discountPercentage > 0 && (
                  <span className="badge-new">-{product.discountPercentage}%</span>
                )}
              </div>
              <div className="catalog-info">
                <h3 className="product-title">{product.name.toLowerCase()}</h3>
                <p className="product-price">
                  {hasDiscount ? (
                    <>
                      <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '8px' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span>${finalPrice.toFixed(2)} USD</span>
                    </>
                  ) : (
                    <>${product.price.toFixed(2)} USD</>
                  )}
                </p>
              </div>
            </div>
          );
        })}
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
