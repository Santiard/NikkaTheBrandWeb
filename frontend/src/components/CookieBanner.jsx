import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

export default function CookieBanner({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nikka_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nikka_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner-content">
        <p className="cookie-text">
          Utilizamos almacenamiento local (cookies esenciales) estrictamente para guardar tu carrito de compras y mejorar tu experiencia. Al continuar navegando, aceptas nuestra <span className="cookie-link" onClick={() => onNavigate('privacidad')}>política de privacidad</span>.
        </p>
        <button className="cookie-accept-btn" onClick={handleAccept}>
          aceptar
        </button>
      </div>
    </div>
  );
}
