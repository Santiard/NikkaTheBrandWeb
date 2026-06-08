import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import lambsVideo from '../images/lambs_video.mp4';
import './ProductDetail.css';

export default function ProductDetail({ productId, onBack, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        let idToFetch = productId;
        
        // Resolver IDs de mockup estáticos del Home a IDs numéricos de PostgreSQL/H2
        if (isNaN(Number(productId))) {
          const allProducts = await apiService.getProducts();
          const lowerId = String(productId).toLowerCase();
          
          if (lowerId.includes('bonnie') || lowerId.includes('sunday')) {
            idToFetch = allProducts.find(p => p.name.includes('BONNIE'))?.id || allProducts[0]?.id;
          } else if (lowerId.includes('duvet')) {
            idToFetch = allProducts.find(p => p.name.includes('DUVET'))?.id || allProducts[0]?.id;
          } else {
            idToFetch = allProducts[0]?.id;
          }
        }

        if (!idToFetch) {
          throw new Error('Producto no disponible.');
        }

        const data = await apiService.getProductById(idToFetch);
        setProduct(data);
        
        // Configurar imagen por defecto
        const mainImg = data.images && data.images.length > 0 
          ? data.images.find(img => img.imageType === 'MAIN')?.imageUrl || data.images[0].imageUrl
          : data.mainImage;
        setActiveImage(mainImg);

        // Preseleccionar la primera talla disponible que tenga stock (S/M/L)
        const sizesList = ['S', 'M', 'L'];
        const firstAvailable = sizesList.find(size => {
          const stock = data.sizes?.find(s => s.size === size)?.stock || 0;
          return stock > 0;
        }) || 'S';
        setSelectedSize(firstAvailable);

      } catch (err) {
        console.error(err);
        setError('Lo sentimos, este producto no está disponible en este momento.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="product-not-found">
        <p className="vintage-italic">cargando detalles de la pieza...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <p>{error || 'Producto no encontrado.'}</p>
        <button onClick={onBack} className="back-link">volver al catálogo</button>
      </div>
    );
  }

  // Agrupar todas las imágenes para la galería
  const allImages = product.images && product.images.length > 0
    ? [
        product.images.find(img => img.imageType === 'MAIN')?.imageUrl || product.images[0].imageUrl,
        ...product.images.filter(img => img.imageType === 'DETAIL').map(img => img.imageUrl)
      ]
    : [product.mainImage, ...(product.gallery || [])];

  const getStockForSize = (sizeName) => {
    return product.sizes?.find(s => s.size === sizeName)?.stock ?? 5; // 5 por defecto si es mock
  };

  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = product.price - (product.price * (product.discountPercentage || 0) / 100);

  const handleAddClick = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
    
    // Animar feedback visual temporal en el botón
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  return (
    <section className="detail-section">
      {/* Botón de Volver */}
      <div className="back-navigation">
        <button onClick={onBack} className="back-button">
          ← volver
        </button>
      </div>

      <div className="detail-container">
        {/* Columna Izquierda: Galería Interactiva */}
        <div className="detail-gallery">
          <div className="main-preview-wrapper">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="main-preview-image"
              draggable="false"
            />
          </div>
          <div className="thumbnail-row">
            {allImages.filter(Boolean).map((imgSrc, idx) => (
              <button 
                key={`thumb-${idx}`} 
                className={`thumbnail-button ${activeImage === imgSrc ? 'active' : ''}`}
                onClick={() => setActiveImage(imgSrc)}
              >
                <img 
                  src={imgSrc} 
                  alt={`${product.name} miniatura ${idx + 1}`} 
                  className="thumbnail-img"
                  draggable="false"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Información y Compra */}
        <div className="detail-info">
          <span className="brand-subtitle">nikka the brand</span>
          <h1 className="detail-product-name">{product.name.toLowerCase()}</h1>
          
          <div className="price-status-row">
            <span className="detail-price">
              {hasDiscount ? (
                <>
                  <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '10px' }}>
                    ${Math.round(product.price).toLocaleString('es-CO')}
                  </span>
                  <span>${Math.round(finalPrice).toLocaleString('es-CO')}</span>
                </>
              ) : (
                <>${Math.round(product.price).toLocaleString('es-CO')}</>
              )}
            </span>
            <span className="detail-status">
              {getStockForSize(selectedSize) > 0 ? 'DISPONIBLE' : 'SIN STOCK'}
            </span>
          </div>

          <div className="divider-dotted"></div>

          {/* Selector de Tallas Completo (XS, S, M, L) */}
          <div className="size-selector-section">
            <span className="section-label">talla</span>
            <div className="size-buttons">
              {['S', 'M', 'L'].map((size) => {
                const stock = getStockForSize(size);
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    title={isOutOfStock ? `Talla ${size} sin existencias` : `Talla ${size} disponible`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de Añadir al Carrito */}
          {(() => {
            const isAllOutOfStock = ['S', 'M', 'L'].every(size => getStockForSize(size) <= 0);
            return (
              <button 
                className={`add-to-cart-btn ${addedFeedback ? 'added' : ''} ${isAllOutOfStock ? 'disabled-btn' : ''}`}
                onClick={handleAddClick}
                disabled={isAllOutOfStock || getStockForSize(selectedSize) <= 0}
              >
                {isAllOutOfStock 
                  ? 'agotado' 
                  : addedFeedback 
                    ? '¡añadido a la bolsa!' 
                    : 'añadir al carrito'}
              </button>
            );
          })()}

          <div className="divider-dotted"></div>

          {/* Descripción Detallada del Producto */}
          <div className="detail-description">
            {/* Si es array (mock) o string largo (JPA) */}
            {Array.isArray(product.description) ? (
              product.description.map((paragraph, idx) => (
                <p key={`desc-${idx}`}>{paragraph}</p>
              ))
            ) : (
              product.description?.split('\n').map((paragraph, idx) => (
                <p key={`desc-${idx}`}>{paragraph}</p>
              ))
            )}
          </div>

          {/* Video de Corderos Animados en la esquina inferior */}
          <div className="detail-lambs-container">
            <video 
              src={lambsVideo} 
              className="detail-lambs-img" 
              autoPlay 
              loop 
              muted 
              playsInline 
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
