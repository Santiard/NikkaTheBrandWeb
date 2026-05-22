import { useState, useRef, useEffect } from 'react'
import './App.css'

// Layout & Components
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Catalog from './components/Catalog'
import ProductDetail from './components/ProductDetail'

// Mockup Images
import newInImg from './images/new in.JPG'
import sundayMorningImg from './images/pj set/nikka.png'
import theFarmhouseImg from './images/the farmhouse.jpg'
import duvetImg from './images/puffer bag/duvet.JPG'
import toteBagsImg from './images/tote bag.png'
import sizeGuideImg from './images/size.JPG'
import lambsImg from './images/little lambs.png'

// Data for the 6 cards matching the mockup
const cardsData = [
  { id: 'new-in', className: 'card-new-in', img: newInImg, title: 'new in' },
  { id: 'sunday-morning', className: 'card-sunday-morning', img: sundayMorningImg, title: 'sunday morning' },
  { id: 'the-farmhouse', className: 'card-the-farmhouse', img: theFarmhouseImg, title: 'the farmhouse' },
  { id: 'duvet', className: 'card-duvet', img: duvetImg, title: 'duvet nikka x nc' },
  { id: 'tote-bags', className: 'card-tote-bags', img: toteBagsImg, title: 'tote bags and mini bags' },
  { id: 'size-guide', className: 'card-size-guide', img: sizeGuideImg, title: 'size guide' },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Navigation states: 'home', 'catalog', 'detail'
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('bonnie-set');

  // Drag-to-scroll & Infinite Scroll references
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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
    if (page === 'catalog') {
      setSelectedCategory(categoryOrProductId);
    } else if (page === 'detail') {
      setSelectedProductId(categoryOrProductId);
    }
    // Scroll automatically to top on page transition
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
      handleNavigate('catalog', 'ver todo'); // shortcut fallback
    }
  };

  return (
    <>
      {/* Navigation Header */}
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onLogoClick={handleLogoClick} 
      />

      {/* Slide-out Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={handleNavigate} 
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
        />
      )}

      {/* Footer Links (Fixed always at viewport bottom) */}
      <Footer onNavigate={handleNavigate} />
    </>
  )
}

export default App;

