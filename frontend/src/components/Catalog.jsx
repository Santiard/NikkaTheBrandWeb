import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Catalog.css';
import lambsVideo from '../images/lambs_video.mp4';

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

  // Helper para saber si hay stock
  const isProductInStock = (product) => {
    if (!product.sizes || product.sizes.length === 0) return false;
    return product.sizes.reduce((total, size) => total + (size.stock || 0), 0) > 0;
  };

  // Filtrar productos según la categoría o colección seleccionada
  let filteredProducts = products.filter((product) => {
    // Nunca mostrar giftcards en el catálogo general
    const pCat = product.category ? product.category.toLowerCase() : '';
    const pName = product.name ? product.name.toLowerCase() : '';
    if (pCat.includes('gift') || pName.includes('gift card') || pName.includes('giftcard')) {
      return false;
    }

    if (!categoryFilter || categoryFilter.toLowerCase() === 'ver todo' || categoryFilter.toLowerCase() === 'new') {
      return true;
    }
    
    const filterLower = categoryFilter.toLowerCase();
    
    // Filtrado por colección (formato "col:nombre")
    if (filterLower.startsWith('col:')) {
      const collectionName = filterLower.replace('col:', '').trim();
      return product.collection?.name?.toLowerCase() === collectionName;
    }

    if (filterLower === 'sale') {
      return product.discountPercentage > 0;
    }
    return product.category.toLowerCase() === filterLower;
  });

  // Ordenar SIEMPRE priorizando los que TIENEN STOCK. Dentro del mismo estado de stock, ordenar del más nuevo al más viejo.
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const aStock = isProductInStock(a) ? 1 : 0;
    const bStock = isProductInStock(b) ? 1 : 0;
    
    if (aStock !== bStock) {
      return bStock - aStock; // 1 (in stock) va primero que 0
    }
    return b.id - a.id; // Luego ordenar por más nuevo
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

  // Preparar el título y descripción a mostrar
  let displayTitle = categoryFilter ? categoryFilter.toLowerCase() : 'shop all';
  if (displayTitle.startsWith('col:')) {
    displayTitle = displayTitle.replace('col:', '').trim();
  }

  const collectionDescriptions = {
    'the farmhouse': '“Incluso en lo cotidiano, ya hay abundancia”. Piezas bordadas con pequeños recuerdos que nos llevan a lo simple y esencial.',
    'sunday morning': 'Piezas clásicas, diseñadas para envolver tu manera más honesta de habitarte.',
    'duvet': 'For carrying comfort everywhere.',
    'daydream': 'Delicate pointelle for everyday dreaming.'
  };

  const displayDescription = collectionDescriptions[displayTitle];

  return (
    <section className="catalog-section">
      {/* Título de la Categoría y Descripción */}
      <div className="catalog-header-title">
        <h2>{displayTitle}</h2>
        {displayDescription && <p className="catalog-collection-desc">{displayDescription}</p>}
      </div>

      {/* Contenido del Catálogo o Estado Vacío */}
      {filteredProducts.length === 0 ? (
        <div className="catalog-empty-state">
          <video 
            src={lambsVideo} 
            className="catalog-empty-video" 
            autoPlay 
            loop 
            muted 
            playsInline 
            draggable="false" 
          />
          <p className="catalog-empty-text">Esto se está preparando especialmente para ti...</p>
        </div>
      ) : (
        <>
          <div className="catalog-grid">
            {filteredProducts.slice(0, visibleCount).map((product) => {
              // Extraer la imagen principal o respaldo
              const mainImg = product.images && product.images.length > 0 
                ? product.images.find(img => img.imageType === 'MAIN')?.imageUrl || product.images[0].imageUrl
                : product.mainImage; // Respaldo estático si no hay imágenes en la BD

              const hasDiscount = product.discountPercentage > 0;
              const finalPrice = hasDiscount 
                ? product.price - (product.price * (product.discountPercentage / 100))
                : product.price;
              
              const isProductOutOfStock = !isProductInStock(product);

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
                      className={`catalog-image ${isProductOutOfStock ? 'out-of-stock-img' : ''}`} 
                      draggable="false"
                    />
                    {isProductOutOfStock ? (
                      <span className="badge-out-of-stock">sin stock</span>
                    ) : (
                      product.discountPercentage > 0 && (
                        <span className="badge-new">-{product.discountPercentage}%</span>
                      )
                    )}
                  </div>
                  <div className="catalog-info">
                    <h3 className="product-title">{product.name.toLowerCase()}</h3>
                    <p className="product-price">
                      {hasDiscount ? (
                        <>
                          <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '8px' }}>
                            ${Math.round(product.price).toLocaleString('es-CO')}
                          </span>
                          <span>${Math.round(finalPrice).toLocaleString('es-CO')}</span>
                        </>
                      ) : (
                        <>${Math.round(product.price).toLocaleString('es-CO')}</>
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
        </>
      )}
    </section>
  );
}
