import React, { useState } from 'react';
import img32 from '../images/medidas/32.webp';
import img33 from '../images/medidas/33.webp';
import img34 from '../images/medidas/34.webp';
import img35 from '../images/medidas/35.webp';

// Importación de las guías de medidas respectivas
import guidePjSets3 from '../images/medidas/pj set talla 3.WEBP';
import guidePjSets from '../images/medidas/pj set talla.webp';
import guidePjSets2 from '../images/medidas/pj set talla 2.webp';
import guideBata from '../images/medidas/bata.webp';
import guideBags from '../images/medidas/medidas puffer.webp';
import guideCoinPurses from '../images/medidas/guiacp.webp';
import guideMb from '../images/medidas/mb.webp';
import guideMiniBags from '../images/medidas/guiami.webp';

import './Medidas.css';

export default function Medidas() {
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleOptionClick = (guideKey) => {
    setSelectedGuide(guideKey);
  };

  const guidesData = {
    'pj-sets': {
      title: 'pj sets',
      images: [guidePjSets3, guidePjSets, guidePjSets2, guideBata],
    },
    'bags': {
      title: 'bags & totes',
      images: [guideBags],
    },
    'coin-purses': {
      title: 'coin purses',
      images: [guideCoinPurses, guideMb],
    },
    'mini-bags': {
      title: 'mini bags',
      images: [guideMiniBags],
    }
  };

  // Renderizado de la página de medidas individual cuando se hace clic
  if (selectedGuide) {
    const guide = guidesData[selectedGuide];
    return (
      <section className="medidas-section-detail">
        <div className="medidas-detail-container">
          <button className="medidas-back-button" onClick={() => setSelectedGuide(null)}>
            ← volver
          </button>
          
          <div className="medidas-detail-img-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {guide.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Guía de medidas de ${guide.title}`} 
                className="medidas-detail-img"
                draggable="false"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="medidas-section">
      {/* Contenedor Banner de Tapizado en la mitad de la página */}
      <div className="medidas-banner">
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
