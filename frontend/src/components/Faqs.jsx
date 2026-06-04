import React from 'react';
import lambsVideo from '../images/lambs_video.mp4';
import './Faqs.css';

export default function Faqs({ onBackToCatalog }) {
  return (
    <section className="faqs-section">


      <div className="faqs-container">
        {/* Columna Izquierda */}
        <div className="faqs-col">
          <h1 className="faqs-main-title">faqs</h1>

          <div className="faq-item">
            <h3 className="faq-question">Envíos internacionales</h3>
            <p className="faq-answer">
              Por el momento no, únicamente realizamos envíos dentro de Colombia.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Métodos de pago</h3>
            <p className="faq-answer">
              Aceptamos pagos por Nequi, Daviplata y Banco de Bogotá.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Costos de envío</h3>
            <p className="faq-answer">
              El valor del envío a ciudades principales es de $18.000 COP.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Cuánto tarda en procesarse mi pedido</h3>
            <p className="faq-answer">
              Todas las órdenes requieren de 1 a 3 días hábiles de procesamiento antes de ser enviadas. Sin embargo, la mayoría de pedidos son despachados dentro de las primeras 24 horas.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Cuánto tarda en llegar mi pedido</h3>
            <p className="faq-answer">
              El tiempo de entrega puede variar dependiendo de la ciudad de destino y la transportadora.
            </p>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="faqs-col right-col-adjust">
          <div className="faq-item">
            <h3 className="faq-question">Restock de prendas agotadas</h3>
            <p className="faq-answer">
              Normalmente no manejamos restock, ya que trabajamos bajo una esencia de exclusividad. Una vez una colección se agota, no vuelve a salir.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Puedo cambiar o cancelar mi pedido</h3>
            <p className="faq-answer">
              Si tu pedido aún no ha sido enviado, puedes comunicarte con nosotros lo antes posible para revisar posibles cambios. No realizamos devoluciones de dinero, por lo que recomendamos revisar cuidadosamente las tallas antes de realizar tu compra.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Rastrea tu pedido</h3>
            <p className="faq-answer">
              Una vez tu orden sea enviada, recibirás la información de seguimiento para rastrear tu paquete.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Qué hago si recibo un producto incorrecto o con algún problema</h3>
            <p className="faq-answer">
              Puedes contactarnos a través de nuestro correo, WhatsApp o Instagram y te ayudaremos lo más rápido posible.
            </p>
          </div>
        </div>
      </div>

      {/* Video de Corderos Animados al final (Centrado como en el mockup) */}
      <div className="faqs-lambs-container">
        <video 
          src={lambsVideo} 
          className="faqs-lambs-image"
          autoPlay 
          loop 
          muted 
          playsInline 
          draggable="false"
        />
      </div>
    </section>
  );
}
