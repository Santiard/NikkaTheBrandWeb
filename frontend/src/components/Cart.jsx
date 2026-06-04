import React, { useState } from 'react';
import { apiService } from '../services/api';
import './Cart.css';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [shippingData, setShippingData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerDepartment: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Calcular subtotal de la compra
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.price;
      const discount = item.product.discountPercentage || 0;
      const finalPrice = price - (price * discount / 100);
      return acc + (finalPrice * item.quantity);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === 'customerName' || name === 'customerCity' || name === 'customerDepartment') {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]/g, '');
    } else if (name === 'customerPhone') {
      filteredValue = value.replace(/[^0-9]/g, '');
    }
    setShippingData(prev => ({
      ...prev,
      [name]: filteredValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setError(null);
    setLoading(true);

    try {
      // Mapear items del carrito al DTO esperado por Spring Boot
      const itemsRequest = cartItems.map(item => ({
        productId: item.product.id,
        size: item.size,
        quantity: item.quantity
      }));

      const payload = {
        ...shippingData,
        items: itemsRequest
      };

      // Mandar request al backend
      const response = await apiService.checkout(payload);

      // Limpiar carrito y cerrar drawer
      onClearCart();
      onClose();

      // Redirigir al cliente a WhatsApp
      if (response.whatsappUrl) {
        window.location.href = response.whatsappUrl;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al completar el pedido. Por favor verifica los datos o el inventario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Carrito */}
        <div className="cart-header">
          <h2>bolsa de compras</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content-scroll">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p className="vintage-italic">tu bolsa está vacía</p>
              <button className="continue-shopping-btn" onClick={onClose}>volver al catálogo</button>
            </div>
          ) : (
            <>
              {/* Listado de Items en Bolsa */}
              <div className="cart-items-list">
                {cartItems.map((item, idx) => {
                  const price = item.product.price;
                  const discount = item.product.discountPercentage || 0;
                  const finalPrice = price - (price * discount / 100);
                  
                  return (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="cart-item-card">
                      <div className="cart-item-img-wrapper">
                        {/* Se busca la imagen principal */}
                        <img 
                          src={item.product.images && item.product.images.length > 0 
                            ? item.product.images.find(img => img.imageType === 'MAIN')?.imageUrl || item.product.images[0].imageUrl
                            : item.product.mainImage // Respaldo para mocks estáticos
                          } 
                          alt={item.product.name} 
                          className="cart-item-img"
                        />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-title">{item.product.name.toLowerCase()}</h4>
                        <p className="cart-item-spec">talla: {item.size}</p>
                        
                        <div className="quantity-controls">
                          <button onClick={() => onUpdateQuantity(item.product.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, item.size, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <div className="cart-item-price-col">
                        <span className="item-price">${Math.round(finalPrice * item.quantity).toLocaleString('es-CO')}</span>
                        <button className="remove-item-btn" onClick={() => onRemoveItem(item.product.id, item.size)}>eliminar</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="divider-dotted-cart"></div>

              {/* Formulario de Checkout */}
              <div className="checkout-form-container">
                <h3 className="section-title-retro">detalles de envío</h3>
                <form onSubmit={handleSubmit} className="retro-form">
                  <div className="form-group-retro">
                    <label htmlFor="customerName">nombre completo</label>
                    <input 
                      type="text" 
                      id="customerName"
                      name="customerName" 
                      value={shippingData.customerName}
                      onChange={handleInputChange}
                      placeholder="ej. maría camila gutiérrez"
                      required 
                    />
                  </div>

                  <div className="form-group-retro">
                    <label htmlFor="customerPhone">teléfono de contacto</label>
                    <input 
                      type="tel" 
                      id="customerPhone"
                      name="customerPhone" 
                      value={shippingData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="ej. 573001234567"
                      required 
                    />
                  </div>

                  <div className="form-group-retro">
                    <label htmlFor="customerAddress">dirección exacta de entrega</label>
                    <input 
                      type="text" 
                      id="customerAddress"
                      name="customerAddress" 
                      value={shippingData.customerAddress}
                      onChange={handleInputChange}
                      placeholder="ej. calle 10 # 5-25 apto 302"
                      required 
                    />
                  </div>

                  <div className="form-row-retro">
                    <div className="form-group-retro half">
                      <label htmlFor="customerCity">ciudad</label>
                      <input 
                        type="text" 
                        id="customerCity"
                        name="customerCity" 
                        value={shippingData.customerCity}
                        onChange={handleInputChange}
                        placeholder="ej. medellín"
                        required 
                      />
                    </div>
                    <div className="form-group-retro half">
                      <label htmlFor="customerDepartment">departamento</label>
                      <input 
                        type="text" 
                        id="customerDepartment"
                        name="customerDepartment" 
                        value={shippingData.customerDepartment}
                        onChange={handleInputChange}
                        placeholder="ej. antioquia"
                        required 
                      />
                    </div>
                  </div>

                  {error && <div className="checkout-error-message">{error}</div>}

                  <div className="cart-total-summary">
                    <span className="total-label">total estimado:</span>
                    <span className="total-val">${Math.round(calculateSubtotal()).toLocaleString('es-CO')}</span>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-checkout-btn" 
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? 'procesando compra...' : 'finalizar compra (por whatsapp)'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
