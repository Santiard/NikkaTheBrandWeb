import React from 'react';
import './Privacidad.css';

export default function Privacidad({ onNavigate }) {
  return (
    <section className="privacidad-section">
      <div className="privacidad-container">
        <h2 className="privacidad-main-title">política de privacidad y cookies</h2>
        
        <div className="privacidad-block">
          <h2 className="privacidad-col-title">sobre el uso de cookies</h2>
          <div className="privacidad-text-content">
            <p>
              En Nikka The Brand utilizamos tecnologías de almacenamiento local (similares a las cookies) con un único propósito estrictamente necesario: guardar los productos que añades a tu carrito de compras. Esto te permite navegar por nuestra página o regresar más tarde sin perder tu selección.
            </p>
            <p>
              No utilizamos cookies para publicidad, rastreo de comportamiento, ni compartimos tu información de navegación con terceros (como Facebook, Instagram o Google Analytics). Tu navegación en nuestra tienda es privada.
            </p>
          </div>
        </div>

        <div className="privacidad-block">
          <h2 className="privacidad-col-title">recolección y uso de datos personales</h2>
          <div className="privacidad-text-content">
            <p>
              Cuando realizas una compra, recopilamos los datos estrictamente necesarios para procesar tu pedido a través de nuestro formulario, los cuales son enviados por WhatsApp. Estos datos incluyen tu nombre, dirección, barrio, ciudad y número de contacto.
            </p>
            <p>
              Esta información se utiliza única y exclusivamente para gestionar el envío de tu paquete y contactarte en caso de presentarse alguna novedad con tu compra. Todos tus datos están protegidos y son de uso interno y confidencial por parte del equipo de Nikka. 
            </p>
          </div>
        </div>

        <div className="privacidad-block">
          <h2 className="privacidad-col-title">derechos sobre tu información</h2>
          <div className="privacidad-text-content">
            <p>
              Como cliente, tienes el derecho de conocer, actualizar o solicitar la eliminación total de tus datos personales de nuestros registros internos de envíos en cualquier momento.
            </p>
            <p>
              Para ejercer este derecho, simplemente envíanos un correo electrónico a <strong>nikkathebrand@gmail.com</strong> indicando tu solicitud y procederemos a borrar tu información a la mayor brevedad posible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
