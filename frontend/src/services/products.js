// Products Mock Database - Nikka The Brand
// Creado dinámicamente para simular una Base de Datos real con categorías y detalles de producto.

// 1. Importación de Imágenes de Productos
import bonnieImg from '../images/pj set/bonnie.png';
import tezza3399 from '../images/pj set/Tezza-3399.jpg';
import tezza7563 from '../images/pj set/Tezza-7563.jpg';
import tezza9847 from '../images/pj set/Tezza-9847 2.JPG';

import butterduckImg from '../images/pj set/butterduck.png';
import kiwpieImg from '../images/pj set/kiwpie.png';
import nikkaImg from '../images/pj set/nikka.png';

import duvetImg from '../images/puffer bag/duvet.JPG';
import blueberryImg from '../images/puffer bag/blueberry.png';
import cherryImg from '../images/puffer bag/cherry.png';

import blueBImg from '../images/monederos/blue b.png';
import creamBImg from '../images/monederos/creamb .png';
import monederoWebp from '../images/monederos/monedero.webp';

import sundayMornImg from '../images/sunday morn/pijama sunday morning.png';
import miniBag15 from '../images/mini bags y tote bags/15.png';
import miniBag16 from '../images/mini bags y tote bags/16.png';
import miniBag17 from '../images/mini bags y tote bags/17.png';
import miniBag18 from '../images/mini bags y tote bags/18.png';

// 2. Importación de Imágenes Editoriales / Lifestyle
import tezzaLifestyle1 from '../images/pj set/Tezza-1345 2.JPG';
import tezzaLifestyle2 from '../images/pj set/Tezza-9426.JPG';
import farmhouseImg from '../images/the farmhouse.jpg';
import newInImg from '../images/new in.JPG';

export const productsData = [
  {
    id: 'bonnie-set',
    name: 'BONNIE SHIFT SET - BLUE',
    price: 129.0,
    currency: 'USD',
    category: 'intimates',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: bonnieImg,
    gallery: [tezza3399, tezza7563, tezza9847],
    description: [
      'Nikka the brand - shift set celeste con bordados de conejito en color blanco.',
      'El top es de tirantes finos ajustables con detalle de encaje blanco en el pecho y un lazo coqueto.',
      'Los shorts cuentan con una cintura elástica fruncida ultra-cómoda y volantes bordados en los dobladillos.',
      'Hecho de 100% algodón orgánico peinado de textura suave para un descanso y comodidad absoluta.'
    ]
  },
  {
    id: 'sunday-morning-pj',
    name: 'SUNDAY MORNING PJ SET - WHITE',
    price: 139.0,
    currency: 'USD',
    category: 'intimates',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: sundayMornImg,
    gallery: [nikkaImg, tezza7563, bonnieImg],
    description: [
      'Nikka the brand - pijama de dos piezas Sunday Morning clásica en color blanco perlado.',
      'Camisa de cuello sastre con botones de nácar genuinos y delicados bordes de encaje azul pastel.',
      'Pantalón fluido de tiro alto con cordón ajustable de algodón y bolsillos laterales funcionales.',
      'Nuestra mezcla premium de viscosa y seda aporta una caída espectacular y frescura inigualable.'
    ]
  },
  {
    id: 'butterduck-set',
    name: 'BUTTERDUCK FLOUNCE SET',
    price: 119.0,
    currency: 'USD',
    category: 'intimates',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: butterduckImg,
    gallery: [bonnieImg, tezza3399, nikkaImg],
    description: [
      'Set íntimo de color amarillo mantequilla suave con bordados de patitos silvestres.',
      'Top elástico estilo nido de abeja súper favorecedor con volantes decorativos en los hombros.',
      'Shorts de tiro medio con dobladillo festoneado y ajuste elástico suave que no marca la piel.',
      'Tejido liso de algodón ideal para los días cálidos de verano y las mañanas lentas de domingo.'
    ]
  },
  {
    id: 'kewpie-lace-set',
    name: 'KEWPIE LACE ROMPER',
    price: 125.0,
    currency: 'USD',
    category: 'intimates',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: kiwpieImg,
    gallery: [tezza7563, tezza9847, sundayMornImg],
    description: [
      'Romper de encaje de punto de algodón elástico con diseño vintage inspirado en los años 70.',
      'Tirantes cruzados ajustables en la espalda y botones planos vintage de madera en el escote delantero.',
      'Detalles calados florales finos y encaje elástico francés en los contornos.',
      'Se amolda perfectamente al cuerpo ofreciendo libertad de movimiento con una silueta femenina preciosa.'
    ]
  },
  {
    id: 'duvet-bag',
    name: 'DUVET NIKKA BAG - CRÈME',
    price: 189.0,
    currency: 'USD',
    category: 'bags',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: duvetImg,
    gallery: [blueberryImg, cherryImg, duvetImg],
    description: [
      'El bolso acolchado acolchado definitivo en color crema vainilla de textura ultra-mullida.',
      'Nikka x NC Limited Edition - un diseño oversized extremadamente suave con tacto tipo edredón.',
      'Cuenta con un compartimento principal espacioso con cierre de cremallera metálica YKK y bolsillo interior con logo de piel grabado.',
      'Correa ancha reforzada para llevar al hombro cómodamente todo el día sin fatiga.'
    ]
  },
  {
    id: 'blueberry-puffer',
    name: 'PUFFER BLUEBERRY MINI BAG',
    price: 145.0,
    currency: 'USD',
    category: 'bags',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: blueberryImg,
    gallery: [duvetImg, cherryImg, blueberryImg],
    description: [
      'Bolso puffer de tamaño mediano-pequeño en color azul arándano vibrante pero sofisticado.',
      'Estructura acolchada resistente a salpicaduras con acabado satinado semi-brillante.',
      'Cierre magnético oculto de alta resistencia y herrajes plateados con acabado antiguo.',
      'Perfecto para llevar tus esenciales diarios dándole un toque de color retro de alta costura a tu outfit.'
    ]
  },
  {
    id: 'cherry-puffer',
    name: 'PUFFER CHERRY SHOULDER BAG',
    price: 155.0,
    currency: 'USD',
    category: 'bags',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: cherryImg,
    gallery: [duvetImg, blueberryImg, cherryImg],
    description: [
      'Bolso acolchado de hombro de silueta alargada tipo baguette en color rojo cereza profundo.',
      'Pespuntes geométricos en forma de diamante acolchado que garantizan una retención de forma perfecta.',
      'Forro interno satinado color rosa pastel a contraste con dos bolsillos organizadores.',
      'Incluye una correa desmontable adicional para llevarlo estilo bandolera según la ocasión.'
    ]
  },
  {
    id: 'tote-classic-bag',
    name: 'NIKKA CLASSIC CANVAS TOTE',
    price: 95.0,
    currency: 'USD',
    category: 'bags',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: miniBag15,
    gallery: [miniBag16, miniBag17, miniBag18],
    description: [
      'Bolso tipo tote clásico confeccionado en canvas de algodón pesado de alta durabilidad.',
      'Bordado frontal en hilo azul de marca con el isotipo de la flor de Nikka y letras manuscritas.',
      'Asas dobles reforzadas de cuero vegano texturizado y base rígida desmontable para mantener la forma.',
      'Ideal como bolso de fin de semana, para la playa, o llevar tus libros y laptop con máxima elegancia.'
    ]
  },
  {
    id: 'monedero-blue-b',
    name: 'COIN PURSE BLUE FLOWER',
    price: 45.0,
    currency: 'USD',
    category: 'accessories',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: blueBImg,
    gallery: [creamBImg, monederoWebp, blueBImg],
    description: [
      'Monedero retro de boquilla metálica dorada de diseño exclusivo Nikka.',
      'Confeccionado en tela Jacquard brocada azul con pequeños motivos florales bordados a mano.',
      'Forro interior de seda suave que protege tus pertenencias más valiosas como joyas o monedas.',
      'Un accesorio nostálgico encantador y atemporal que cabe en cualquier bolso de mano.'
    ]
  },
  {
    id: 'monedero-cream-b',
    name: 'COIN PURSE CREAM CHARM',
    price: 45.0,
    currency: 'USD',
    category: 'accessories',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: creamBImg,
    gallery: [blueBImg, monederoWebp, creamBImg],
    description: [
      'Delicado monedero vintage con boquilla metálica de beso con cuentas perla.',
      'Tela de lino rústica color crema bordada con pequeñas flores silvestres de tonos apagados.',
      'Añade un toque artesanal y de dulzura romántica a tus pequeños accesorios del día a día.',
      'Hecho éticamente en nuestro taller utilizando retazos de tela de algodón premium reutilizada.'
    ]
  },
  {
    id: 'monedero-retro-kiss',
    name: 'RETRO LEATHER KISS LOCK PURSE',
    price: 65.0,
    currency: 'USD',
    category: 'accessories',
    status: 'DISPONIBLE',
    isNew: true,
    mainImage: monederoWebp,
    gallery: [blueBImg, creamBImg, monederoWebp],
    description: [
      'Monedero retro grande estructurado en piel ovina extra suave de curtido vegetal.',
      'Cierre clásico kiss-lock en bronce pulido de tacto y sonido sumamente satisfactorio.',
      'Tamaño perfecto para tarjetas, billetes e incluso llaves, con doble división interior.',
      'Un guiño elegante a los accesorios de tocador antiguos que dura toda la vida.'
    ]
  },
  {
    id: 'bag-crochet-vintage',
    name: 'HAND-WOVEN CROCHET BAG',
    price: 110.0,
    currency: 'USD',
    category: 'bags',
    status: 'DISPONIBLE',
    isNew: false,
    mainImage: miniBag17,
    gallery: [miniBag18, miniBag15, miniBag16],
    description: [
      'Bolso tejido 100% a mano por artesanos utilizando hilo de algodón mercerizado de alta resistencia.',
      'Patrón de encaje floral abierto y asas trenzadas de longitud ideal para colgar en el hombro.',
      'Incluye saco interior extraíble de lino natural para resguardar objetos pequeños de manera segura.',
      'El complemento bohemio definitivo que añade ligereza y textura vintage a tus looks de verano.'
    ]
  }
];

// 4 Imágenes Editoriales para la base del catálogo
export const editorialImages = [
  tezzaLifestyle1,
  tezzaLifestyle2,
  farmhouseImg,
  newInImg
];
