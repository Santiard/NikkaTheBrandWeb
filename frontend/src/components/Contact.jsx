import React from 'react';
import contactImg from '../images/contacto.webp';
import './Contact.css';

export default function Contact({ onBackToCatalog, onNavigateToFaqs }) {
  return (
    <section className="contact-section">


      <div className="contact-container">
        {/* Columna Izquierda: Imagen de Paisaje */}
        <div className="contact-image-col">
          <div className="contact-img-wrapper">
            <img 
              src={contactImg} 
              alt="Paisaje Corderos Nikka" 
              className="contact-img"
              draggable="false"
            />
          </div>
        </div>

        {/* Columna Derecha: Información y Canales */}
        <div className="contact-info-col">
          <div className="contact-group">
            <h2 className="contact-title">contacto</h2>
            <p className="contact-detail-link">
              <a href="mailto:nikkathebrand@gmail.com">nikkathebrand@gmail.com</a>
            </p>
          </div>

          <div className="contact-group">
            <h2 className="contact-title">colaboraciones</h2>
            <p className="contact-detail-link">
              <a href="mailto:nikkathebrand@gmail.com">nikkathebrand@gmail.com</a>
            </p>
          </div>

          <div className="contact-group">
            <h2 className="contact-title">canal de ventas</h2>
            <div className="contact-sales-channels">
              <p>
                WhatsApp <a href="https://wa.me/573223113632" target="_blank" rel="noopener noreferrer">3223113632</a>
              </p>
              <p>
                Instagram <a href="https://instagram.com/nikkathebrand" target="_blank" rel="noopener noreferrer">nikkathebrand</a>
              </p>
            </div>
          </div>

          <div className="contact-footer-text">
            <p className="vintage-question">¿Tienes alguna duda sobre tu pedido, envíos o productos?</p>
            <p>
              Puedes visitar nuestra sección de{' '}
              <button onClick={onNavigateToFaqs} className="faqs-inline-btn">
                preguntas frecuentes
              </button>{' '}
              o rastrear tu pedido desde la página de seguimiento.
            </p>
            <p>Si necesitas ayuda adicional, contáctanos a WhatsApp o Instagram.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
