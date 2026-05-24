// Central API Service - Nikka The Brand
// Conecta el Frontend en React (Vite) con el Backend en Spring Boot (Puerto 8080)

const BASE_URL = 'http://localhost:8080/api';

/**
 * Genera la cabecera de autorización básica (HTTP Basic Auth) a partir de las credenciales del admin
 */
const getHeaders = (auth = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (auth && auth.username && auth.password) {
    const encodedCredentials = btoa(`${auth.username}:${auth.password}`);
    headers['Authorization'] = `Basic ${encodedCredentials}`;
  }
  return headers;
};

export const apiService = {
  // ===================================================================
  // ENDPOINTS PÚBLICOS (CLIENTE)
  // ===================================================================

  /**
   * Obtiene todos los productos activos (filtrados por categoría si se proporciona)
   */
  async getProducts(category = null) {
    let url = `${BASE_URL}/products`;
    if (category && category.toLowerCase() !== 'ver todo') {
      url += `?category=${encodeURIComponent(category.trim().toLowerCase())}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener productos.');
    return response.json();
  },

  /**
   * Obtiene el detalle de un producto específico (solo si está activo)
   */
  async getProductById(id) {
    const response = await fetch(`${BASE_URL}/products/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Producto no encontrado o inactivo.');
    return response.json();
  },

  /**
   * Obtiene las colecciones de la tienda
   */
  async getCollections() {
    const response = await fetch(`${BASE_URL}/collections`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener colecciones.');
    return response.json();
  },

  /**
   * Procesa el checkout del carrito y obtiene el enlace de redirección a WhatsApp
   */
  async checkout(orderRequest) {
    const response = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderRequest)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al procesar el checkout.');
    }
    return response.json();
  },

  /**
   * Intenta autenticar las credenciales del administrador
   */
  async login(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      throw new Error('Credenciales incorrectas.');
    }
    return response.json();
  },

  // ===================================================================
  // ENDPOINTS ADMINISTRATIVOS PROTEGIDOS (REQUIEREN CREDENCIALES ADMIN)
  // ===================================================================

  /**
   * Obtiene todos los productos sin filtrar (activos e inactivos)
   */
  async adminGetProducts(auth) {
    const response = await fetch(`${BASE_URL}/admin/products`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('No autorizado.');
    return response.json();
  },

  /**
   * Crea un nuevo producto (incluyendo imágenes y stock por tallas)
   */
  async adminCreateProduct(productData, auth) {
    const response = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Error al crear producto.');
    return response.json();
  },

  /**
   * Actualiza los datos de un producto existente
   */
  async adminUpdateProduct(id, productData, auth) {
    const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(auth),
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Error al actualizar producto.');
    return response.json();
  },

  /**
   * Elimina un producto por su ID
   */
  async adminDeleteProduct(id, auth) {
    const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al eliminar producto.');
    return response;
  },

  /**
   * Obtiene el listado de todos los clientes registrados
   */
  async adminGetCustomers(auth) {
    const response = await fetch(`${BASE_URL}/admin/customers`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener clientes.');
    return response.json();
  },

  /**
   * Obtiene el listado histórico de pedidos
   */
  async adminGetOrders(auth) {
    const response = await fetch(`${BASE_URL}/admin/orders`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener pedidos.');
    return response.json();
  },

  /**
   * Obtiene las métricas y analíticas de la tienda
   */
  async adminGetAnalytics(auth) {
    const response = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener analíticas.');
    return response.json();
  },

  /**
   * Crea una nueva colección
   */
  async adminCreateCollection(collectionData, auth) {
    const response = await fetch(`${BASE_URL}/admin/collections`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(collectionData)
    });
    if (!response.ok) throw new Error('Error al crear colección.');
    return response.json();
  }
};
