import React from 'react';
import medidasMonedero from '../images/medidas/medidas monedero.webp';
import medidasPuffer from '../images/medidas/medidas puffer.webp';
import pjSetTalla from '../images/medidas/pj set talla.webp';
import './Medidas.css';

export default function Medidas() {
  return (
    <section className="medidas-section">
      <div className="medidas-header">
        <span className="medidas-brand-sub">nikka the brand</span>
        <h1 className="medidas-main-title">guía de medidas</h1>
        <p className="medidas-subtitle">
          Encuentra las dimensiones exactas de nuestras prendas y bolsos para elegir tu pieza ideal.
        </p>
      </div>

      <div className="medidas-images-stack">
        <div className="medidas-card">
          <span className="medidas-card-title">Bonnie PJ Set & Sunday Morning</span>
          <div className="medidas-img-wrapper">
            <img src={pjSetTalla} alt="Medidas de Pijama Set" className="medidas-img" draggable="false" />
          </div>
        </div>

        <div className="medidas-card">
          <span className="medidas-card-title">Duvet Nikka Bag & Puffer Bags</span>
          <div className="medidas-img-wrapper">
            <img src={medidasPuffer} alt="Medidas de Puffer Bags" className="medidas-img" draggable="false" />
          </div>
        </div>

        <div className="medidas-card">
          <span className="medidas-card-title">Monederos & Mini Bags</span>
          <div className="medidas-img-wrapper">
            <img src={medidasMonedero} alt="Medidas de Monederos" className="medidas-img" draggable="false" />
          </div>
        </div>
      </div>
    </section>
  );
}
