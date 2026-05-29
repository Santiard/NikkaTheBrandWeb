import React, { useState } from 'react';
import bgPattern from '../images/medidas/the farmhouse-3.webp';
import img32 from '../images/medidas/32.webp';
import img33 from '../images/medidas/33.webp';
import img34 from '../images/medidas/34.webp';
import img35 from '../images/medidas/35.webp';
import './Medidas.css';

export default function Medidas() {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleOptionClick = (guideKey) => {
    setSelectedGuide(guideKey);
    // Para la siguiente parte asociaremos las redirecciones reales de las guías
  };

  return (
    <section className="medidas-section">
      {/* Contenedor Banner de Tapizado en la mitad de la página */}
      <div 
        className="medidas-banner"
        style={{ backgroundImage: `url(${bgPattern})` }}
      >
        <div className="medidas-options-row">
          {/* Opción 1: Pj sets */}
          <div className="medidas-option-card" onClick={() => handleOptionClick('pj-sets')}>
            <div className="medidas-option-img-wrapper">
              <img 
                src={img32} 
                alt="Pj sets" 
                className="medidas-option-img" 
                draggable="false"
              />
            </div>
          </div>

          {/* Opción 2: Bags */}
          <div className="medidas-option-card" onClick={() => handleOptionClick('bags')}>
            <div className="medidas-option-img-wrapper">
              <img 
                src={img33} 
                alt="bags" 
                className="medidas-option-img" 
                draggable="false"
              />
            </div>
          </div>

          {/* Opción 3: Coin purses */}
          <div className="medidas-option-card" onClick={() => handleOptionClick('coin-purses')}>
            <div className="medidas-option-img-wrapper">
              <img 
                src={img34} 
                alt="coin purses" 
                className="medidas-option-img" 
                draggable="false"
              />
            </div>
          </div>

          {/* Opción 4: Mini bags */}
          <div className="medidas-option-card" onClick={() => handleOptionClick('mini-bags')}>
            <div className="medidas-option-img-wrapper">
              <img 
                src={img35} 
                alt="mini bags" 
                className="medidas-option-img" 
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
