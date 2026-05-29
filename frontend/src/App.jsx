import { useState, useRef, useEffect } from 'react'
import './App.css'

// Layout & Components
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Catalog from './components/Catalog'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import AdminDashboard from './components/AdminDashboard'
import History from './components/History'
import Contact from './components/Contact'
import Faqs from './components/Faqs'
import GiftCard from './components/GiftCard'
import Medidas from './components/Medidas'

// Mockup Images
import newInImg from './images/new in.webp'
import sundayMorningImg from './images/sunday morning.webp'
import theFarmhouseImg from './images/THE FARMHOUSE.webp'
import duvetImg from './images/puffer bag/duvet.JPG'
import toteBagsImg from './images/tote bags y mini bags.webp'
import sizeGuideImg from './images/sizes.webp'
import lambsImg from './images/little-lambs.webp'

// Data for the 6 cards matching the mockup
const cardsData = [
  { id: 'new-in', className: 'card-new-in', img: newInImg, title: 'new in' },
  { id: 'sunday-morning', className: 'card-sunday-morning', img: sundayMorningImg, title: 'sunday morning' },
  { id: 'the-farmhouse', className: 'card-the-farmhouse', img: theFarmhouseImg, title: 'THE FARMHOUSE' },
  { id: 'duvet', className: 'card-duvet', img: duvetImg, title: 'duvet nikka x nc' },
  { id: 'tote-bags', className: 'card-tote-bags', img: toteBagsImg, title: 'tote bags y mini bags' },
  { id: 'size-guide', className: 'card-size-guide', img: sizeGuideImg, title: 'sizes' },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Navigation states: 'home', 'catalog', 'detail', 'admin'
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('bonnie-set');

  // Estado del Carrito Global
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Drag-to-scroll & Infinite Scroll references
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Enrutamiento de URL nativo avanzado para toda la aplicación
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (path === '/nikiadministradora') {
        setActivePage('admin');
      } else if (path.startsWith('/product/')) {
        const productId = path.replace('/product/', '');
        setActivePage('detail');
        setSelectedProductId(productId);
      } else if (path === '/catalog') {
        const cat = searchParams.get('category');
        setActivePage('catalog');
        setSelectedCategory(cat);
      } else if (path === '/history') {
        setActivePage('history');
      } else if (path === '/contact') {
        setActivePage('contact');
      } else if (path === '/faqs') {
        setActivePage('faqs');
      } else if (path === '/giftcard') {
        setActivePage('giftcard');
      } else if (path === '/medidas') {
        setActivePage('medidas');
      } else {
        // Por defecto regresa al home
        setActivePage('home');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Verificar al montar e inicializar la página correcta

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Set initial scroll position to the middle set of cards for infinite scroll feel
  useEffect(() => {
    if (activePage === 'home') {
      const container = scrollContainerRef.current;
      if (container) {
        const setWidth = container.scrollWidth / 3;
        container.scrollLeft = setWidth;
      }
    }
  }, [activePage]);

  // Seamless Infinite Looping Scroll logic
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const setWidth = container.scrollWidth / 3;
    
    // Seamlessly warp when scrolling near boundaries
    if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
    } else if (container.scrollLeft <= 5) {
      container.scrollLeft += setWidth;
    }
  };

  // Drag-to-Scroll Event Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeftState(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Navigation Controller
  const handleNavigate = (page, categoryOrProductId = null) => {
    setActivePage(page);
    
    // Sincronizar parámetros en el estado
    if (page === 'catalog') {
      setSelectedCategory(categoryOrProductId);
    } else if (page === 'detail') {
      setSelectedProductId(categoryOrProductId);
    }

    // Registrar navegación real en el Historial del Navegador (History API / pushState)
    if (page === 'catalog') {
      const search = categoryOrProductId ? `?category=${encodeURIComponent(categoryOrProductId)}` : '';
      window.history.pushState(null, '', `/catalog${search}`);
    } else if (page === 'detail') {
      window.history.pushState(null, '', `/product/${categoryOrProductId}`);
    } else if (page === 'admin') {
      window.history.pushState(null, '', '/nikiadministradora');
    } else if (page === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      // Para páginas estáticas ('history', 'contact', 'faqs', 'giftcard', 'medidas')
      window.history.pushState(null, '', `/${page}`);
    }

    // Scroll automáticamente arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogoClick = () => {
    handleNavigate('home');
  };

  // Card click handler inside carousel
  const handleCardClick = (e, cardId) => {
    e.preventDefault();
    if (isDragging) return; // Prevent navigation if user was just dragging

    if (cardId === 'new-in') {
      handleNavigate('catalog', 'new');
    } else if (cardId === 'sunday-morning') {
      handleNavigate('detail', 'sunday-morning-pj');
    } else if (cardId === 'duvet') {
      handleNavigate('detail', 'duvet-bag');
    } else if (cardId === 'tote-bags') {
      handleNavigate('catalog', 'bags');
    } else if (cardId === 'the-farmhouse') {
      handleNavigate('catalog', 'ver todo');
    } else if (cardId === 'size-guide') {
      handleNavigate('medidas');
    }
  };

  // ===================================================================
  // CONTROLADORES DE CARRITO
  // ===================================================================
  const handleAddToCart = (product, size) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.size === size);
      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prev, { product, size, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Abre la bolsa de compra automáticamente para feedback
  };

  const handleUpdateCartQuantity = (productId, size, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.product.id === productId && item.size === size) ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveCartItem = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // RENDERIZADO EXCLUSIVO PARA PANEL ADMINISTRATIVO
  if (activePage === 'admin') {
    return (
      <AdminDashboard onBackToStore={() => handleNavigate('home')} />
    );
  }

  return (
    <>
      {/* Navigation Header */}
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onLogoClick={handleLogoClick} 
        onCartClick={() => setIsCartOpen(true)}
        cartCount={getCartCount()}
      />

      {/* Slide-out Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={handleNavigate} 
      />

      {/* Bolsa de compras deslizante */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Dynamic Main Body Content based on activePage */}
      {activePage === 'home' && (
        <main className="home-container">
          {/* Horizontal Drag-to-Scroll Carousel */}
          <div 
            className="home-carousel-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="home-carousel-track">
              {/* Set 1 (Left Boundary Padding) */}
              {cardsData.map((card, idx) => (
                <a 
                  key={`set1-${card.id}-${idx}`} 
                  href="#" 
                  className={`grid-card ${card.className}`}
                  onClick={(e) => handleCardClick(e, card.id)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="image-wrapper">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      draggable="false" 
                      onDragStart={(e) => e.preventDefault()} 
                    />
                  </div>
                  <span className="card-title">{card.title}</span>
                </a>
              ))}

              {/* Set 2 (Active Viewport Center) */}
              {cardsData.map((card, idx) => (
                <a 
                  key={`set2-${card.id}-${idx}`} 
                  href="#" 
                  className={`grid-card ${card.className}`}
                  onClick={(e) => handleCardClick(e, card.id)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="image-wrapper">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      draggable="false" 
                      onDragStart={(e) => e.preventDefault()} 
                    />
                  </div>
                  <span className="card-title">{card.title}</span>
                </a>
              ))}

              {/* Set 3 (Right Boundary Padding) */}
              {cardsData.map((card, idx) => (
                <a 
                  key={`set3-${card.id}-${idx}`} 
                  href="#" 
                  className={`grid-card ${card.className}`}
                  onClick={(e) => handleCardClick(e, card.id)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="image-wrapper">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      draggable="false" 
                      onDragStart={(e) => e.preventDefault()} 
                    />
                  </div>
                  <span className="card-title">{card.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 3 Little Lambs Illustration at the bottom */}
          <div className="lambs-container">
            <img src={lambsImg} alt="little lambs" className="lambs-image" draggable="false" />
          </div>
        </main>
      )}

      {activePage === 'catalog' && (
        <Catalog 
          categoryFilter={selectedCategory} 
          onProductClick={(productId) => handleNavigate('detail', productId)} 
        />
      )}

      {activePage === 'detail' && (
        <ProductDetail 
          productId={selectedProductId} 
          onBack={() => handleNavigate('catalog', selectedCategory || 'ver todo')} 
          onAddToCart={handleAddToCart}
        />
      )}

      {activePage === 'history' && (
        <History 
          onBackToCatalog={() => handleNavigate('catalog', 'ver todo')} 
        />
      )}

      {activePage === 'contact' && (
        <Contact 
          onBackToCatalog={() => handleNavigate('catalog', 'ver todo')} 
          onNavigateToFaqs={() => handleNavigate('faqs')}
        />
      )}

      {activePage === 'faqs' && (
        <Faqs 
          onBackToCatalog={() => handleNavigate('catalog', 'ver todo')} 
        />
      )}

      {activePage === 'giftcard' && (
        <GiftCard 
          onAddToCart={handleAddToCart}
        />
      )}

      {activePage === 'medidas' && (
        <Medidas />
      )}

      {/* Footer Links */}
      <Footer onNavigate={handleNavigate} />
    </>
  )
}

export default App;
