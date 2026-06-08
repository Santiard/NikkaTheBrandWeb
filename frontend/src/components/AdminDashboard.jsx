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
  const [collections, setCollections] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  
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
    stockS: '10',
    stockM: '10',
    stockL: '5',
    collectionId: '',
    selectedPromotions: []
  });

  // Estado del Modal de Promoción
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null); // null para nuevo
  const [promoProductSearch, setPromoProductSearch] = useState('');
  const [promoForm, setPromoForm] = useState({
    name: '',
    discountPercentage: '10',
    isActive: true,
    selectedProducts: []
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
        const colData = await apiService.getCollections();
        setCollections(colData);
        const catData = await apiService.getCategories();
        setCategories(catData);
      } else if (activeTab === 'promotions') {
        const data = await apiService.adminGetPromotions(auth);
        setPromotions(data);
        const prodData = await apiService.adminGetProducts(auth);
        setProducts(prodData);
      } else if (activeTab === 'users') {
        const data = await apiService.adminGetCustomers(auth);
        setCustomers(data);
      } else if (activeTab === 'analytics') {
        const data = await apiService.adminGetAnalytics(auth);
        setAnalytics(data);
      } else if (activeTab === 'categories') {
        const catData = await apiService.getCategories();
        setCategories(catData);
        const colData = await apiService.getCollections();
        setCollections(colData);
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
      category: categories[0]?.name || '',
      active: true,
      mainImageUrl: '',
      detailImageUrl1: '',
      detailImageUrl2: '',
      detailImageUrl3: '',
      stockS: '10',
      stockM: '10',
      stockL: '5',
      collectionId: '',
      selectedPromotions: []
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
      stockS: String(product.sizes?.find(s => s.size === 'S')?.stock || '0'),
      stockM: String(product.sizes?.find(s => s.size === 'M')?.stock || '0'),
      stockL: String(product.sizes?.find(s => s.size === 'L')?.stock || '0'),
      collectionId: product.collection ? String(product.collection.id) : '',
      selectedPromotions: product.promotions ? product.promotions.map(p => p.id) : []
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
        sizes: sizesList,
        collection: productForm.collectionId ? { id: parseInt(productForm.collectionId) } : null
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
    setPromoProductSearch('');
    setPromoForm({
      name: '',
      discountPercentage: '10',
      isActive: true,
      selectedProducts: []
    });
    setIsPromoModalOpen(true);
  };

  // Abrir modal para editar promoción existente
  const handleEditPromoClick = (promo) => {
    setEditingPromo(promo);
    setPromoProductSearch('');
    setPromoForm({
      name: promo.name,
      discountPercentage: String(promo.discountPercentage),
      isActive: promo.isActive,
      selectedProducts: promo.products ? promo.products.map(p => p.id) : []
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
        isActive: promoForm.isActive,
        products: promoForm.selectedProducts.map(id => ({ id: parseInt(id) }))
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

  // ===================================================================
  // ACCIONES DE CATEGORÍAS Y COLECCIONES
  // ===================================================================

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setError(null);
    try {
      await apiService.adminCreateCategory({ name: newCategoryName.trim() }, auth);
      setNewCategoryName('');
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear la categoría.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
    setError(null);
    try {
      await apiService.adminDeleteCategory(id, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar la categoría. Asegúrate de que no haya productos asociados.');
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    setError(null);
    try {
      await apiService.adminCreateCollection({
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim()
      }, auth);
      setNewCollectionName('');
      setNewCollectionDesc('');
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear la colección.');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta colección? Los productos asociados quedarán sin colección (no se eliminarán).')) return;
    setError(null);
    try {
      await apiService.adminDeleteCollection(id, auth);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar la colección.');
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
              <button 
                className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => handleTabClick('categories')}
              >
                categorías y colecciones
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
                   activeTab === 'analytics' ? 'centro de analíticas' :
                   'categorías & colecciones'}</h1>
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
                          <th>existencias (S/M/L)</th>
                          <th>estado</th>
                          <th>acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const mainImg = product.images?.find(i => i.imageType === 'MAIN')?.imageUrl || '';
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
                              <td className="admin-italic">${Math.round(product.price).toLocaleString('es-CO')}</td>
                              <td>{product.discountPercentage}%</td>
                              <td>
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
                      <h2 className="analytics-card-val">${Math.round(analytics.totalSales || 0).toLocaleString('es-CO')} COP</h2>
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
                              <td className="admin-italic">${Math.round(rev).toLocaleString('es-CO')} COP</td>
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

              {/* TAB 5: CATEGORÍAS Y COLECCIONES */}
              {activeTab === 'categories' && (
                <div className="admin-categories-collections-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                  {/* Columna Categorías */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <h3 className="section-title-retro" style={{ marginBottom: '15px', borderBottom: '1px solid rgba(56, 91, 147, 0.15)', paddingBottom: '10px' }}>gestión de categorías</h3>
                    <form onSubmit={handleCreateCategory} className="retro-form" style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
                      <div className="form-group-retro" style={{ flex: 1, marginBottom: 0 }}>
                        <label>nueva categoría</label>
                        <input 
                          type="text" 
                          placeholder="ej. vestidos" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="admin-action-btn-main" style={{ whiteSpace: 'nowrap', height: '42px', padding: '0 20px' }}>agregar</button>
                    </form>

                    <div className="admin-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>nombre</th>
                            <th>acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => (
                            <tr key={cat.id}>
                              <td className="admin-bold">{cat.name.toLowerCase()}</td>
                              <td>
                                <button 
                                  className="admin-row-btn delete" 
                                  onClick={() => handleDeleteCategory(cat.id)}
                                >
                                  eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {categories.length === 0 && (
                            <tr>
                              <td colSpan="2" className="admin-empty-row">no hay categorías creadas.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Columna Colecciones */}
                  <div className="admin-card" style={{ padding: '24px' }}>
                    <h3 className="section-title-retro" style={{ marginBottom: '15px', borderBottom: '1px solid rgba(56, 91, 147, 0.15)', paddingBottom: '10px' }}>gestión de colecciones</h3>
                    <form onSubmit={handleCreateCollection} className="retro-form" style={{ marginBottom: '20px' }}>
                      <div className="form-group-retro">
                        <label>nombre de colección</label>
                        <input 
                          type="text" 
                          placeholder="ej. Otoño Retro 2026" 
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group-retro" style={{ marginTop: '10px' }}>
                        <label>descripción (opcional)</label>
                        <textarea 
                          rows="2"
                          placeholder="Descripción corta..." 
                          value={newCollectionDesc}
                          onChange={(e) => setNewCollectionDesc(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid rgba(56, 91, 147, 0.2)',
                            borderRadius: '2px',
                            fontFamily: 'var(--font-sans)',
                            backgroundColor: '#faf8f5',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <button type="submit" className="admin-action-btn-main" style={{ width: '100%', marginTop: '10px' }}>agregar colección</button>
                    </form>

                    <div className="admin-table-wrapper" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>nombre</th>
                            <th>descripción</th>
                            <th>acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collections.map(col => (
                            <tr key={col.id}>
                              <td className="admin-bold">{col.name.toLowerCase()}</td>
                              <td className="admin-italic" style={{ fontSize: '0.8rem' }}>{col.description || 'sin descripción'}</td>
                              <td>
                                <button 
                                  className="admin-row-btn delete" 
                                  onClick={() => handleDeleteCollection(col.id)}
                                >
                                  eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {collections.length === 0 && (
                            <tr>
                              <td colSpan="3" className="admin-empty-row">no hay colecciones creadas.</td>
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
                    <label>precio (COP)</label>
                    <input 
                      type="text" 
                      value={productForm.price}
                      onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value.replace(/[^0-9]/g, '') }))}
                      placeholder="129000"
                      required
                    />
                  </div>
                  <div className="admin-form-group half">
                    <label>descuento (%)</label>
                    <input 
                      type="text" 
                      value={productForm.discountPercentage}
                      onChange={(e) => setProductForm(p => ({ ...p, discountPercentage: e.target.value.replace(/[^0-9]/g, '') }))}
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
                      required
                    >
                      <option value="">seleccionar categoría...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name.toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group half">
                    <label>colección</label>
                    <select 
                      value={productForm.collectionId}
                      onChange={(e) => setProductForm(p => ({ ...p, collectionId: e.target.value }))}
                    >
                      <option value="">sin colección / ninguna</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name.toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-form-group checkbox-group" style={{ height: 'auto', margin: '5px 0 16px 0' }}>
                  <label className="checkbox-label-retro">
                    <input 
                      type="checkbox" 
                      checked={productForm.active}
                      onChange={(e) => setProductForm(p => ({ ...p, active: e.target.checked }))}
                    />
                    producto activo en catálogo
                  </label>
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
                    <label>talla S</label>
                    <input 
                      type="text" 
                      value={productForm.stockS}
                      onChange={(e) => setProductForm(p => ({ ...p, stockS: e.target.value.replace(/[^0-9]/g, '') }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group quarter">
                    <label>talla M</label>
                    <input 
                      type="text" 
                      value={productForm.stockM}
                      onChange={(e) => setProductForm(p => ({ ...p, stockM: e.target.value.replace(/[^0-9]/g, '') }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group quarter">
                    <label>talla L</label>
                    <input 
                      type="text" 
                      value={productForm.stockL}
                      onChange={(e) => setProductForm(p => ({ ...p, stockL: e.target.value.replace(/[^0-9]/g, '') }))}
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
                      type="text" 
                      value={promoForm.discountPercentage}
                      onChange={(e) => setPromoForm(p => ({ ...p, discountPercentage: e.target.value.replace(/[^0-9]/g, '') }))}
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

                <div className="modal-divider-dotted"></div>

                <div className="admin-form-group">
                  <label>aplicar a los siguientes productos</label>
                  
                  {/* Buscador de Productos por Nombre */}
                  <input 
                    type="text"
                    value={promoProductSearch}
                    onChange={(e) => setPromoProductSearch(e.target.value)}
                    placeholder="buscar producto por nombre..."
                    className="promo-search-input"
                    style={{
                      backgroundColor: '#faf8f5',
                      border: '1px solid rgba(56, 91, 147, 0.2)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.85rem',
                      color: 'var(--color-primary)',
                      padding: '8px 12px',
                      outline: 'none',
                      marginBottom: '10px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />

                  <div className="admin-products-checkbox-list">
                    {products
                      .filter(prod => prod.name.toLowerCase().includes(promoProductSearch.toLowerCase()))
                      .map(prod => {
                        const isChecked = promoForm.selectedProducts.includes(prod.id);
                        return (
                          <label key={prod.id} className="admin-product-checkbox-item">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPromoForm(prev => ({
                                    ...prev,
                                    selectedProducts: [...prev.selectedProducts, prod.id]
                                  }));
                                } else {
                                  setPromoForm(prev => ({
                                    ...prev,
                                    selectedProducts: prev.selectedProducts.filter(id => id !== prod.id)
                                  }));
                                }
                              }}
                            />
                            <span>
                              {prod.name.toLowerCase()} <span className="admin-product-checkbox-meta">({prod.category} - ${Math.round(prod.price).toLocaleString('es-CO')})</span>
                            </span>
                          </label>
                        );
                      })}
                    {products.filter(prod => prod.name.toLowerCase().includes(promoProductSearch.toLowerCase())).length === 0 && (
                      <p className="admin-info-text small">no se encontraron productos.</p>
                    )}
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
