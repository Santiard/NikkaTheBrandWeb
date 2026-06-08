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
   * Obtiene las categorías de la tienda
   */
  async getCategories() {
    const response = await fetch(`${BASE_URL}/categories`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener categorías.');
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
    const response = await fetch(`${BASE_URL}/nikiadministradora/products`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('No autorizado.');
    return response.json();
  },

  /**
   * Crea un nuevo producto (incluyendo imágenes y stock por tallas)
   */
  async adminCreateProduct(productData, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/products`, {
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
    const response = await fetch(`${BASE_URL}/nikiadministradora/products/${id}`, {
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
    const response = await fetch(`${BASE_URL}/nikiadministradora/products/${id}`, {
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
    const response = await fetch(`${BASE_URL}/nikiadministradora/customers`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener clientes.');
    return response.json();
  },

  /**
   * Obtiene el listado histórico de pedidos
   */
  async adminGetOrders(auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/orders`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener pedidos.');
    return response.json();
  },

  /**
   * Obtiene las métricas y analíticas de la tienda
   */
  async adminGetAnalytics(auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/analytics`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener analíticas.');
    return response.json();
  },

  /**
   * Crea una nueva colección
   */
  async adminCreateCollection(collectionData, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/collections`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(collectionData)
    });
    if (!response.ok) throw new Error('Error al crear colección.');
    return response.json();
  },

  /**
   * Obtiene todas las promociones sin filtrar
   */
  async adminGetPromotions(auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/promotions`, {
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al obtener promociones.');
    return response.json();
  },

  /**
   * Crea una nueva promoción
   */
  async adminCreatePromotion(promoData, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/promotions`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(promoData)
    });
    if (!response.ok) throw new Error('Error al crear promoción.');
    return response.json();
  },

  /**
   * Actualiza una promoción existente
   */
  async adminUpdatePromotion(id, promoData, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/promotions/${id}`, {
      method: 'PUT',
      headers: getHeaders(auth),
      body: JSON.stringify(promoData)
    });
    if (!response.ok) throw new Error('Error al actualizar promoción.');
    return response.json();
  },

  /**
   * Elimina una promoción por su ID
   */
  async adminDeletePromotion(id, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/promotions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al eliminar promoción.');
    return response;
  },

  /**
   * Elimina una colección
   */
  async adminDeleteCollection(id, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/collections/${id}`, {
      method: 'DELETE',
      headers: getHeaders(auth)
    });
    if (!response.ok) throw new Error('Error al eliminar colección.');
    return response;
  },

  /**
   * Crea una nueva categoría
   */
  async adminCreateCategory(categoryData, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/categories`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(categoryData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear categoría.');
    }
    return response.json();
  },

  /**
   * Elimina una categoría
   */
  async adminDeleteCategory(id, auth) {
    const response = await fetch(`${BASE_URL}/nikiadministradora/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(auth)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al eliminar categoría.');
    }
    return response;
  }
};
