import React from 'react';
import historyImg from '../images/historia.webp';
import './History.css';

export default function History({ onBackToCatalog }) {
  return (
    <section className="history-section">


      <div className="history-grid">
        {/* Columna 1: Imagen Principal */}
        <div className="history-col history-image-col">
          <div className="history-img-wrapper">
            <img 
              src={historyImg} 
              alt="Nikka Packaging Historia" 
              className="history-img"
              draggable="false"
            />
          </div>
        </div>

        {/* Columna 2: Nuestra Historia */}
        <div className="history-col text-col">
          <h2 className="history-col-title">nuestra historia</h2>
          <div className="history-text-content">
            <p>
              Nikka The Brand nació en julio de 2022 como una idea simple: crear bolsos con identidad propia. Con el tiempo, la marca comenzó a expandirse hacia nuevas piezas y colecciones, manteniendo siempre la misma esencia que la vio nacer: el amor por lo vintage, la nostalgia, los detalles y lo atemporal.
            </p>
            <p>
              Nuestro sello insignia siempre fue la tela borrego, una textura suave y acogedora que inevitablemente nos recordaba a una pequeña oveja. Así nació Nikka, nuestra little lamb, convertida hoy en el corazón visual y emocional de la marca.
            </p>
            <p>
              Inspirada en lo vintage y lo retro, Nikka busca transmitir delicadeza, calidez y exclusividad a través de cada diseño. Creemos en las piezas que permanecen en el tiempo, en los bordados cuidadosamente pensados y en las telas que cuentan historias. Cada colección nace desde la intención de crear algo especial, algo que se sienta cercano y auténtico.
            </p>
          </div>
        </div>

        {/* Columna 3: Producción y Packaging */}
        <div className="history-col text-col">
          <div className="history-sub-section">
            <h2 className="history-col-title">produccion</h2>
            <div className="history-text-content">
              <p>
                Todas nuestras piezas son producidas en Colombia. Nos enfocamos en crear productos con atención al detalle, priorizando la calidad y el acabado de cada pieza.
              </p>
              <p>
                Trabajamos en cantidades limitadas, manteniendo la esencia exclusiva de cada colección. Una vez una colección se agota, normalmente no vuelve a producirse.
              </p>
            </div>
          </div>

          <div className="history-sub-section spacing-top">
            <h2 className="history-col-title">packaging</h2>
            <div className="history-text-content">
              <p>
                Para nosotros, la experiencia comienza desde el momento en que recibes tu pedido.
              </p>
              <p>
                Cada orden es empacada como una pequeña caja de regalo, pensada para hacerte sentir que estás recibiendo algo especial, incluso si es un regalo de ti para ti. Nos encantan los detalles, la presentación delicada y crear una experiencia acogedora desde el primer momento.
              </p>
            </div>
          </div>
        </div>

        {/* Columna 4: Futuro */}
        <div className="history-col text-col futuro-col">
          <h2 className="history-col-title">futuro</h2>
          <div className="history-text-content">
            <p>
              En Nikka continuamos creciendo y evolucionando sin perder nuestra esencia. Nuestro propósito es seguir creando piezas atemporales que conecten con la nostalgia, el diseño y la delicadeza, manteniendo siempre nuestra identidad única y el amor por los pequeños detalles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
