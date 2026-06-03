import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard({ onBackToStore, initialTab, onTabChange }) {
  // Estado de Autenticación
  const [auth, setAuth] = useState(null); // { username, password }
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Navegación interna del Admin: 'products', 'promotions', 'users', 'analytics'
  const [activeTab, setActiveTab] = useState(initialTab || 'products');

  // Sincronizar la pestaña si cambia externamente (ej: popstate de URL)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sincronizar URL en la barra de direcciones cuando se loguea
  useEffect(() => {
    if (auth && onTabChange) {
      onTabChange(activeTab);
    }
  }, [auth]);

  // Sincronizar URL al montar
  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, []);

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado del Modal de Producto (Creación / Edición)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null para nuevo
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '0',
    category: 'intimates',
    active: true,
    mainImageUrl: '',
    detailImageUrl1: '',
    detailImageUrl2: '',
    detailImageUrl3: '',
    stockXS: '5',
    stockS: '10',
    stockM: '10',
    stockL: '5',
    selectedPromotions: []
  });

  // Estado del Modal de Promoción
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null); // null para nuevo
  const [promoForm, setPromoForm] = useState({
    name: '',
    discountPercentage: '10',
    isActive: true
  });

  // Cargar datos cuando el admin esté autenticado y cambie de pestaña
  useEffect(() => {
    if (auth) {
      fetchData();
    }
  }, [auth, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'products') {
        const data = await apiService.adminGetProducts(auth);
        setProducts(data);
        const promoData = await apiService.adminGetPromotions(auth);
        setPromotions(promoData);
      } else if (activeTab === 'promotions') {
        const data = await apiService.adminGetPromotions(auth);
        setPromotions(data);
      } else if (activeTab === 'users') {
        const data = await apiService.adminGetCustomers(auth);
        setCustomers(data);
      } else if (activeTab === 'analytics') {
        const data = await apiService.adminGetAnalytics(auth);
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del servidor. Verifica la conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Manejo de Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await apiService.login(loginData.username, loginData.password);
      setAuth({ username: loginData.username, password: loginData.password });
    } catch (err) {
      setLoginError(err.message || 'Error de conexión.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setLoginData({ username: '', password: '' });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // ===================================================================
  // ACCIONES DE PRODUCTOS
  // ===================================================================

  // Abrir modal para crear nuevo producto
  const handleNewProductClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      discountPercentage: '0',
      category: 'intimates',
      active: true,
      mainImageUrl: '',
      detailImageUrl1: '',
      detailImageUrl2: '',
      detailImageUrl3: '',
      stockXS: '5',
      stockS: '10',
      stockM: '10',
      stockL: '5'
    });
    setIsProductModalOpen(true);
  };

  // Abrir modal para editar producto existente
  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    
    // Obtener imágenes
    const mainImg = product.images?.find(img => img.imageType === 'MAIN')?.imageUrl || '';
    const detailImgs = product.images?.filter(img => img.imageType === 'DETAIL') || [];
    
    // Obtener existencias por tallas
    const getStock = (sizeName) => {
      return product.sizes?.find(s => s.size === sizeName)?.stock || '0';
    };

    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPercentage: String(product.discountPercentage || 0),
      category: product.category,
      active: product.active,
      mainImageUrl: mainImg,
      detailImageUrl1: detailImgs[0]?.imageUrl || '',
      detailImageUrl2: detailImgs[1]?.imageUrl || '',
      detailImageUrl3: detailImgs[2]?.imageUrl || '',
      stockXS: String(getStock('XS')),
      stockS: String(getStock('S')),
      stockM: String(getStock('M')),
      stockL: String(getStock('L'))
    });
    setIsProductModalOpen(true);
  };

  // Guardar (Crear o Editar)
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. Construir las imágenes
      const imagesList = [];
      if (productForm.mainImageUrl.trim()) {
        imagesList.push({ imageUrl: productForm.mainImageUrl.trim(), imageType: 'MAIN' });
      }
      if (productForm.detailImageUrl1.trim()) {
        imagesList.push({ imageUrl: productForm.detailImageUrl1.trim(), imageType: 'DETAIL' });
      }
      if (productForm.detailImageUrl2.trim()) {
        imagesList.push({ imageUrl: productForm.detailImageUrl2.trim(), imageType: 'DETAIL' });
      }
      if (productForm.detailImageUrl3.trim()) {
        imagesList.push({ imageUrl: productForm.detailImageUrl3.trim(), imageType: 'DETAIL' });
      }

      // 2. Construir existencias
      const sizesList = [
        { size: 'XS', stock: parseInt(productForm.stockXS) || 0 },
        { size: 'S', stock: parseInt(productForm.stockS) || 0 },
        { size: 'M', stock: parseInt(productForm.stockM) || 0 },
        { size: 'L', stock: parseInt(productForm.stockL) || 0 }
      ];

      const productPayload = {
        name: productForm.name.toUpperCase(),
        description: productForm.description,
        price: parseFloat(productForm.price),
        discountPercentage: parseInt(productForm.discountPercentage) || 0,
        category: productForm.category,
        active: productForm.active,
        images: imagesList,
        sizes: sizesList
      };

      if (editingProduct) {
        // Modo Edición
        await apiService.adminUpdateProduct(editingProduct.id, productPayload, auth);
      } else {
        // Modo Creación
        await apiService.adminCreateProduct(productPayload, auth);
      }

      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto. Por favor revisa los datos.');
    }
  };

  // Toggle directo de Activo / Inactivo
  const handleToggleProductActive = async (product) => {
    try {
      const updatedPayload = {
        ...product,
        active: !product.active
      };
      await apiService.adminUpdateProduct(product.id, updatedPayload, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al cambiar el estado del producto.');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente este producto del catálogo?')) return;
    try {
      await apiService.adminDeleteProduct(id, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el producto.');
    }
  };

  // ===================================================================
  // ACCIONES DE PROMOCIONES
  // ===================================================================

  // Abrir modal para crear nueva promoción
  const handleNewPromoClick = () => {
    setEditingPromo(null);
    setPromoForm({
      name: '',
      discountPercentage: '10',
      isActive: true
    });
    setIsPromoModalOpen(true);
  };

  // Abrir modal para editar promoción existente
  const handleEditPromoClick = (promo) => {
    setEditingPromo(promo);
    setPromoForm({
      name: promo.name,
      discountPercentage: String(promo.discountPercentage),
      isActive: promo.isActive
    });
    setIsPromoModalOpen(true);
  };

  // Guardar (Crear o Editar) promoción
  const handlePromoFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const promoPayload = {
        name: promoForm.name.toUpperCase(),
        discountPercentage: parseInt(promoForm.discountPercentage) || 0,
        isActive: promoForm.isActive
      };

      if (editingPromo) {
        // Modo Edición
        await apiService.adminUpdatePromotion(editingPromo.id, promoPayload, auth);
      } else {
        // Modo Creación
        await apiService.adminCreatePromotion(promoPayload, auth);
      }

      setIsPromoModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Error al guardar la promoción. Por favor revisa los datos.');
    }
  };

  // Toggle directo de Activo / Inactivo en Promociones
  const handleTogglePromoActive = async (promo) => {
    try {
      const updatedPayload = {
        ...promo,
        isActive: !promo.isActive
      };
      await apiService.adminUpdatePromotion(promo.id, updatedPayload, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al cambiar el estado de la promoción.');
    }
  };

  // Eliminar promoción
  const handleDeletePromo = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta campaña promocional?')) return;
    try {
      await apiService.adminDeletePromotion(id, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la promoción.');
    }
  };

  return (
    <div className="admin-container">
      {/* VISTA 1: LOGIN ADMINISTRATIVO */}
      {!auth ? (
        <div className="admin-login-backdrop">
          <div className="admin-login-card">
            <span className="login-brand-subtitle">nikka the brand</span>
            <h1 className="login-title-serif">acceso administrativo</h1>
            
            <form onSubmit={handleLoginSubmit} className="login-retro-form">
              <div className="login-form-group">
                <label htmlFor="username">usuario</label>
                <input 
                  type="text" 
                  id="username"
                  value={loginData.username} 
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="ej. admin" 
                  required
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="password">contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  value={loginData.password} 
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••" 
                  required
                />
              </div>

              {loginError && <div className="login-error-msg">{loginError}</div>}

              <button type="submit" className="login-submit-btn" disabled={loginLoading}>
                {loginLoading ? 'verificando...' : 'ingresar'}
              </button>
            </form>

            <button onClick={onBackToStore} className="login-back-to-store-btn">
              ← volver a la tienda
            </button>
          </div>
        </div>
      ) : (
        /* VISTA 2: PANEL DE CONTROL MAIN */
        <div className="admin-dashboard-layout">
          {/* Barra Lateral Admin */}
          <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
              <h3>nikka admin</h3>
              <p>sesión: {auth.username}</p>
            </div>
            
            <nav className="admin-nav">
              <button 
                className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabClick('products')}
              >
                catálogo de productos
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'promotions' ? 'active' : ''}`}
                onClick={() => handleTabClick('promotions')}
              >
                promociones
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => handleTabClick('users')}
              >
                usuarios registrados
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleTabClick('analytics')}
              >
                analíticas & ventas
              </button>
            </nav>

            <div className="admin-sidebar-footer">
              <button onClick={onBackToStore} className="admin-sidebar-btn store">volver a tienda</button>
              <button onClick={handleLogout} className="admin-sidebar-btn logout">cerrar sesión</button>
            </div>
          </aside>

          {/* Área de Contenido Principal */}
          <main className="admin-main-content">
            <header className="admin-main-header">
              <h1>{activeTab === 'products' ? 'gestión de catálogo' :
                   activeTab === 'promotions' ? 'campañas y promociones' :
                   activeTab === 'users' ? 'usuarios y clientes' :
                   'centro de analíticas'}</h1>
              {activeTab === 'products' && (
                <button className="admin-action-btn-main" onClick={handleNewProductClick}>
                  + agregar producto nuevo
                </button>
              )}
            </header>

            {error && <div className="admin-error-box">{error}</div>}

            <div className="admin-card-container">
              {/* TAB 1: PRODUCTOS */}
              {activeTab === 'products' && (
                <div className="admin-table-wrapper">
                  {loading ? <p className="admin-info-text">Cargando catálogo...</p> : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>imagen</th>
                          <th>nombre</th>
                          <th>categoría</th>
                          <th>precio</th>
                          <th>descuento</th>
                          <th>existencias (XS/S/M/L)</th>
                          <th>estado</th>
                          <th>acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const mainImg = product.images?.find(i => i.imageType === 'MAIN')?.imageUrl || '';
                          const stockXS = product.sizes?.find(s => s.size === 'XS')?.stock || 0;
                          const stockS = product.sizes?.find(s => s.size === 'S')?.stock || 0;
                          const stockM = product.sizes?.find(s => s.size === 'M')?.stock || 0;
                          const stockL = product.sizes?.find(s => s.size === 'L')?.stock || 0;

                          return (
                            <tr key={product.id}>
                              <td>
                                <div className="admin-table-img-wrapper">
                                  {mainImg ? <img src={mainImg} alt={product.name} /> : <div className="no-img">sin foto</div>}
                                </div>
                              </td>
                              <td className="admin-bold">{product.name.toLowerCase()}</td>
                              <td>{product.category}</td>
                              <td className="admin-italic">${product.price.toFixed(2)}</td>
                              <td>{product.discountPercentage}%</td>
                              <td>
                                <span className="stock-tag">XS: {stockXS}</span>
                                <span className="stock-tag">S: {stockS}</span>
                                <span className="stock-tag">M: {stockM}</span>
                                <span className="stock-tag">L: {stockL}</span>
                              </td>
                              <td>
                                {/* Interruptor Toggle switch premium */}
                                <label className="admin-switch">
                                  <input 
                                    type="checkbox" 
                                    checked={product.active} 
                                    onChange={() => handleToggleProductActive(product)}
                                  />
                                  <span className="admin-slider"></span>
                                </label>
                              </td>
                              <td>
                                <div className="admin-actions-cell">
                                  <button className="admin-row-btn edit" onClick={() => handleEditProductClick(product)}>editar</button>
                                  <button className="admin-row-btn delete" onClick={() => handleDeleteProduct(product.id)}>eliminar</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 2: PROMOCIONES */}
              {activeTab === 'promotions' && (
                <div className="admin-table-wrapper">
                  <div className="admin-sub-header">
                    <h2>campañas activas</h2>
                    <button className="admin-action-btn-main small" onClick={handleNewPromoClick}>
                      + nueva promoción
                    </button>
                  </div>
                  
                  {loading ? <p className="admin-info-text">Cargando promociones...</p> : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>nombre de campaña</th>
                          <th>descuento global</th>
                          <th>estado</th>
                          <th>acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map(promo => (
                          <tr key={promo.id}>
                            <td className="admin-bold">{promo.name.toLowerCase()}</td>
                            <td className="admin-italic">{promo.discountPercentage}% de descuento</td>
                            <td>
                              <label className="admin-switch">
                                <input 
                                  type="checkbox" 
                                  checked={promo.isActive} 
                                  onChange={() => handleTogglePromoActive(promo)}
                                />
                                <span className="admin-slider"></span>
                              </label>
                            </td>
                            <td>
                              <div className="admin-actions-cell">
                                <button className="admin-row-btn edit" onClick={() => handleEditPromoClick(promo)}>editar</button>
                                <button className="admin-row-btn delete" onClick={() => handleDeletePromo(promo.id)}>eliminar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {promotions.length === 0 && (
                          <tr>
                            <td colSpan="4" className="admin-empty-row">no hay campañas o promociones creadas aún.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 3: USUARIOS REGISTRADOS */}
              {activeTab === 'users' && (
                <div className="admin-table-wrapper">
                  {loading ? <p className="admin-info-text">Cargando clientes...</p> : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>id</th>
                          <th>nombre completo</th>
                          <th>teléfono</th>
                          <th>dirección</th>
                          <th>ciudad</th>
                          <th>departamento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(customer => (
                          <tr key={customer.id}>
                            <td>#{customer.id}</td>
                            <td className="admin-bold">{customer.name.toLowerCase()}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.address}</td>
                            <td>{customer.city}</td>
                            <td>{customer.department}</td>
                          </tr>
                        ))}
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan="6" className="admin-empty-row">no hay usuarios registrados de compras aún.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 4: ANALÍTICAS */}
              {activeTab === 'analytics' && analytics && (
                <div className="analytics-dashboard-grid">
                  {/* Fila superior de widgets */}
                  <div className="analytics-widget-row">
                    <div className="analytics-card">
                      <span className="analytics-card-title">ventas totales</span>
                      <h2 className="analytics-card-val">${analytics.totalSales?.toFixed(2) || '0.00'} USD</h2>
                      <p className="analytics-card-desc">ventas acumuladas netas</p>
                    </div>

                    <div className="analytics-card">
                      <span className="analytics-card-title">pedidos procesados</span>
                      <h2 className="analytics-card-val">{analytics.totalOrders}</h2>
                      <p className="analytics-card-desc">compras registradas</p>
                    </div>

                    <div className="analytics-card">
                      <span className="analytics-card-title">clientes totales</span>
                      <h2 className="analytics-card-val">{analytics.totalCustomers}</h2>
                      <p className="analytics-card-desc">usuarios registrados por envío</p>
                    </div>
                  </div>

                  {/* Fila inferior de tablas */}
                  <div className="analytics-tables-row">
                    <div className="analytics-table-card">
                      <h3>ventas por categoría</h3>
                      <table className="analytics-sub-table">
                        <thead>
                          <tr>
                            <th>categoría</th>
                            <th>recaudación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(analytics.salesByCategory || {}).map(([cat, rev]) => (
                            <tr key={cat}>
                              <td className="admin-bold">{cat}</td>
                              <td className="admin-italic">${rev.toFixed(2)} USD</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="analytics-table-card">
                      <h3>top 5 productos más vendidos</h3>
                      <table className="analytics-sub-table">
                        <thead>
                          <tr>
                            <th>producto</th>
                            <th>unidades vendidas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.topProducts?.map((prod, idx) => (
                            <tr key={prod.id}>
                              <td className="admin-bold">{idx + 1}. {prod.name.toLowerCase()}</td>
                              <td className="admin-italic text-center">{prod.quantity} unidades</td>
                            </tr>
                          ))}
                          {(!analytics.topProducts || analytics.topProducts.length === 0) && (
                            <tr>
                              <td colSpan="2" className="admin-empty-row">No hay suficientes datos de ventas.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* MODAL 1: REGISTRO / EDICIÓN DE PRODUCTO */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal-header">
              <h2>{editingProduct ? 'editar producto' : 'agregar nuevo producto'}</h2>
              <button className="admin-modal-close" onClick={() => setIsProductModalOpen(false)}>×</button>
            </header>
            
            <form onSubmit={handleProductFormSubmit} className="admin-modal-form">
              <div className="modal-form-scroll">
                <h3 className="modal-section-title">información básica</h3>
                <div className="admin-form-group">
                  <label>nombre del producto</label>
                  <input 
                    type="text" 
                    value={productForm.name}
                    onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="ej. BONNIE SHIFT SET - BLUE"
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group half">
                    <label>precio (USD)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="129.00"
                      required
                    />
                  </div>
                  <div className="admin-form-group half">
                    <label>descuento (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="99"
                      value={productForm.discountPercentage}
                      onChange={(e) => setProductForm(p => ({ ...p, discountPercentage: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group half">
                    <label>categoría</label>
                    <select 
                      value={productForm.category}
                      onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                    >
                      <option value="intimates">intimates</option>
                      <option value="bags">bags</option>
                      <option value="accessories">accessories</option>
                    </select>
                  </div>
                  <div className="admin-form-group half checkbox-group">
                    <label className="checkbox-label-retro">
                      <input 
                        type="checkbox" 
                        checked={productForm.active}
                        onChange={(e) => setProductForm(p => ({ ...p, active: e.target.checked }))}
                      />
                      producto activo en catálogo
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>descripción del producto</label>
                  <textarea 
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Detalles de materiales, diseño, lavado, etc..."
                    required
                  />
                </div>

                <div className="modal-divider-dotted"></div>

                <h3 className="modal-section-title">imágenes del producto (enlaces directos)</h3>
                <div className="admin-form-group">
                  <label>url imagen principal (MAIN)</label>
                  <input 
                    type="text" 
                    value={productForm.mainImageUrl}
                    onChange={(e) => setProductForm(p => ({ ...p, mainImageUrl: e.target.value }))}
                    placeholder="/src/images/pj set/bonnie.png"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>url imagen detalle 1</label>
                  <input 
                    type="text" 
                    value={productForm.detailImageUrl1}
                    onChange={(e) => setProductForm(p => ({ ...p, detailImageUrl1: e.target.value }))}
                    placeholder="/src/images/pj set/Tezza-3399.jpg"
                  />
                </div>
                <div className="admin-form-group">
                  <label>url imagen detalle 2</label>
                  <input 
                    type="text" 
                    value={productForm.detailImageUrl2}
                    onChange={(e) => setProductForm(p => ({ ...p, detailImageUrl2: e.target.value }))}
                    placeholder="/src/images/pj set/Tezza-7563.jpg"
                  />
                </div>

                <div className="modal-divider-dotted"></div>

                <h3 className="modal-section-title">existencias físicas por talla</h3>
                <div className="admin-form-row four-cols">
                  <div className="admin-form-group quarter">
                    <label>talla XS</label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stockXS}
                      onChange={(e) => setProductForm(p => ({ ...p, stockXS: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group quarter">
                    <label>talla S</label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stockS}
                      onChange={(e) => setProductForm(p => ({ ...p, stockS: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group quarter">
                    <label>talla M</label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stockM}
                      onChange={(e) => setProductForm(p => ({ ...p, stockM: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group quarter">
                    <label>talla L</label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stockL}
                      onChange={(e) => setProductForm(p => ({ ...p, stockL: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <footer className="admin-modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setIsProductModalOpen(false)}>cancelar</button>
                <button type="submit" className="modal-btn-submit">{editingProduct ? 'guardar cambios' : 'crear producto'}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREACIÓN / EDICIÓN DE PROMOCIÓN */}
      {isPromoModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsPromoModalOpen(false)}>
          <div className="admin-modal-card promo-modal" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal-header">
              <h2>{editingPromo ? 'editar promoción' : 'nueva promoción global'}</h2>
              <button className="admin-modal-close" onClick={() => setIsPromoModalOpen(false)}>×</button>
            </header>
            <form onSubmit={handlePromoFormSubmit} className="admin-modal-form">
              <div className="modal-form-scroll">
                <div className="admin-form-group">
                  <label>nombre de la campaña</label>
                  <input 
                    type="text" 
                    value={promoForm.name}
                    onChange={(e) => setPromoForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="ej. REBAJAS BLACK FRIDAY" 
                    required 
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group half">
                    <label>porcentaje descuento</label>
                    <input 
                      type="number" 
                      value={promoForm.discountPercentage}
                      onChange={(e) => setPromoForm(p => ({ ...p, discountPercentage: e.target.value }))}
                      placeholder="15" 
                      required 
                    />
                  </div>
                  <div className="admin-form-group half checkbox-group">
                    <label className="checkbox-label-retro">
                      <input 
                        type="checkbox" 
                        checked={promoForm.isActive}
                        onChange={(e) => setPromoForm(p => ({ ...p, isActive: e.target.checked }))}
                      />
                      activar de inmediato
                    </label>
                  </div>
                </div>
              </div>
              <footer className="admin-modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setIsPromoModalOpen(false)}>cancelar</button>
                <button type="submit" className="modal-btn-submit">{editingPromo ? 'guardar cambios' : 'crear campaña'}</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
