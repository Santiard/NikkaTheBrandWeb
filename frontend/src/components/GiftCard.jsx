import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import giftCardImg from '../images/gift-card.webp';
import './GiftCard.css';

export default function GiftCard({ onAddToCart }) {
  const [selectedPrice, setSelectedPrice] = useState(80000); // Default to 80.000 COP
  const [dbGiftProducts, setDbGiftProducts] = useState([]);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Fetch products from database to get real catalog items for checkout
  useEffect(() => {
    apiService.getProducts()
      .then(data => {
        const giftCards = data.filter(p => p.category === 'Gift Card');
        setDbGiftProducts(giftCards);
      })
      .catch(err => {
        console.error('Error fetching Gift Cards from DB:', err);
      });
  }, []);

  // Find corresponding DB product or build robust fallback
  const getActiveProduct = () => {
    // Map selected price to search text
    const priceText = selectedPrice === 50000 ? '50.000' : selectedPrice === 80000 ? '80.000' : '150.000';
    const found = dbGiftProducts.find(p => p.name.includes(priceText));
    
    if (found) {
      return found;
    }

    // Fallback if DB is not populated yet
    return {
      id: selectedPrice === 50000 ? 3 : selectedPrice === 80000 ? 4 : 5,
      name: `E-GIFT CARD $${selectedPrice.toLocaleString('es-CO')} COP`,
      price: selectedPrice === 50000 ? 15.00 : selectedPrice === 80000 ? 25.00 : 45.00,
      category: 'Gift Card',
      discountPercentage: 0,
      mainImage: giftCardImg
    };
  };

  const handleAddClick = () => {
    const product = getActiveProduct();
    // E-Gift Cards have a single universal size 'UNI'
    onAddToCart(product, 'UNI');

    // Visual feedback
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  return (
    <section className="giftcard-section">
      <div className="giftcard-container">
        {/* Columna Izquierda: Imagen */}
        <div className="giftcard-image-col">
          <div className="giftcard-img-wrapper">
            <img 
              src={giftCardImg} 
              alt="Nikka E-Gift Card Illustration" 
              className="giftcard-img"
              draggable="false"
            />
          </div>
        </div>

        {/* Columna Derecha: Información y Opciones */}
        <div className="giftcard-info-col">
          <span className="giftcard-brand-sub">nikka the brand</span>
          <h1 className="giftcard-main-title">E-GIFT CARDS</h1>
          
          <h2 className="giftcard-selected-price">
            $ {selectedPrice.toLocaleString('es-CO')} COP
          </h2>

          {/* Opciones de Precios (Círculos) */}
          <div className="giftcard-price-options">
            <button 
              className={`price-circle ${selectedPrice === 50000 ? 'active' : ''}`}
              onClick={() => setSelectedPrice(50000)}
            >
              $50.000<br/>COP
            </button>
            <button 
              className={`price-circle ${selectedPrice === 80000 ? 'active' : ''}`}
              onClick={() => setSelectedPrice(80000)}
            >
              $80.000<br/>COP
            </button>
            <button 
              className={`price-circle ${selectedPrice === 150000 ? 'active' : ''}`}
              onClick={() => setSelectedPrice(150000)}
            >
              $150.000<br/>COP
            </button>
          </div>

          {/* Descripciones en gris legibilidad */}
          <div className="giftcard-description">
            <p>
              Las tarjetas de regalo electrónicas (E-gift cards) pueden utilizarse para comprar cualquier artículo en nikka.
            </p>
            <p>
              Estas Gift Cards pueden usarse en cualquier momento y no tienen fecha de vencimiento.
            </p>
          </div>

          {/* Botón de añadir al carrito */}
          <button 
            className={`giftcard-add-btn ${addedFeedback ? 'added' : ''}`}
            onClick={handleAddClick}
          >
            {addedFeedback ? '¡añadido a la bolsa!' : 'añadir al carrito'}
          </button>
        </div>
      </div>
    </section>
  );
}
