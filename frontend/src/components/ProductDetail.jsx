import React, { useState, useEffect } from 'react';
import { productsData } from '../services/products';
import lambsImg from '../images/little lambs.png';
import './ProductDetail.css';

export default function ProductDetail({ productId, onBack }) {
  const product = productsData.find((p) => p.id === productId) || productsData[0];

  const [activeImage, setActiveImage] = useState(product.mainImage);
  const [selectedSize, setSelectedSize] = useState('S');

  // Si cambia el producto, reiniciar la imagen activa y la talla seleccionada
  useEffect(() => {
    if (product) {
      setActiveImage(product.mainImage);
      setSelectedSize('S');
      // Subir arriba en la página
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="product-not-found">
        <p>Producto no encontrado.</p>
        <button onClick={onBack} className="back-link">volver al catálogo</button>
      </div>
    );
  }

  // Agrupar todas las imágenes para la galería (principal + adicionales)
  const allImages = [product.mainImage, ...(product.gallery || [])];

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
            {allImages.map((imgSrc, idx) => (
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
            <span className="detail-price">${product.price.toFixed(2)} {product.currency}</span>
            <span className="detail-status">{product.status}</span>
          </div>

          <div className="divider-dotted"></div>

          {/* Selector de Tallas */}
          <div className="size-selector-section">
            <span className="section-label">talla</span>
            <div className="size-buttons">
              {['S', 'M'].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Botón de Añadir al Carrito (Estilo Premium) */}
          <button className="add-to-cart-btn">
            añadir al carrito
          </button>

          <div className="divider-dotted"></div>

          {/* Descripción Detallada del Producto */}
          <div className="detail-description">
            {product.description.map((paragraph, idx) => (
              <p key={`desc-${idx}`}>{paragraph}</p>
            ))}
          </div>

          {/* Ilustración de Corderos en la esquina inferior */}
          <div className="detail-lambs-container">
            <img src={lambsImg} alt="little lambs" className="detail-lambs-img" draggable="false" />
          </div>
        </div>
      </div>
    </section>
  );
}
