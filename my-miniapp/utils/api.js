/**
 * utils/api.js - Wrapper de promesas para my.request
 *
 * La API nativa my.request de Alipay usa callbacks (success/fail).
 * Este wrapper lo convierte a Promises para un código más limpio.
 *
 * Ejemplo de uso:
 *   import { request } from '../utils/api';
 *   const response = await request({ url: '/api/user', method: 'GET' });
 */

/**
 * request - Wrapper Promise-based para my.request
 *
 * @param {Object} config - Configuración de la request
 * @param {string} config.url - URL del endpoint
 * @param {string} config.method - HTTP method (GET, POST, PUT, DELETE, etc)
 * @param {Object} config.data - Data a enviar (para POST/PUT)
 * @param {Object} config.headers - Headers adicionales
 * @param {number} config.timeout - Timeout en ms (default: 30000)
 * @returns {Promise<Object>} Response data
 *
 * @example
 * // GET request
 * const user = await request({
 *   url: '/api/user/123',
 *   method: 'GET'
 * });
 *
 * @example
 * // POST request
 * const result = await request({
 *   url: '/api/users',
 *   method: 'POST',
 *   data: { name: 'John', email: 'john@example.com' }
 * });
 */
export function request(config = {}) {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      method = 'GET',
      data = null,
      headers = {},
      timeout = 30000
    } = config;

    // Validar URL
    if (!url) {
      reject(new Error('URL es requerida'));
      return;
    }

    // Validar método
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    const upperMethod = method.toUpperCase();
    if (!validMethods.includes(upperMethod)) {
      reject(new Error(`Método HTTP inválido: ${method}`));
      return;
    }

    // Construir configuración para my.request
    const requestConfig = {
      url,
      method: upperMethod,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },

      // Success callback
      success: (response) => {
        // Verificar status HTTP
        if (response.status >= 400) {
          reject(new Error(`HTTP ${response.status}: ${response.data?.message || 'Error'}`));
          return;
        }

        // Resolver con los datos
        resolve({
          status: response.status,
          data: response.data,
          headers: response.headers
        });
      },

      // Fail callback
      fail: (error) => {
        const errorMessage = error.errorMessage || error.message || 'Network error';
        reject(new Error(errorMessage));
      }
    };

    // Agregar data si es POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(upperMethod) && data) {
      requestConfig.data = data;
    }

    // Ejecutar la request
    try {
      my.request(requestConfig);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * get - Shorthand para GET request
 * @param {string} url - URL del endpoint
 * @param {Object} config - Config adicional
 * @returns {Promise<Object>}
 */
export function get(url, config = {}) {
  return request({
    ...config,
    url,
    method: 'GET'
  });
}

/**
 * post - Shorthand para POST request
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Config adicional
 * @returns {Promise<Object>}
 */
export function post(url, data = {}, config = {}) {
  return request({
    ...config,
    url,
    method: 'POST',
    data
  });
}

/**
 * put - Shorthand para PUT request
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Config adicional
 * @returns {Promise<Object>}
 */
export function put(url, data = {}, config = {}) {
  return request({
    ...config,
    url,
    method: 'PUT',
    data
  });
}

/**
 * delete_ - Shorthand para DELETE request
 * Nota: delete es palabra reservada, por eso es delete_
 * @param {string} url - URL del endpoint
 * @param {Object} config - Config adicional
 * @returns {Promise<Object>}
 */
export function delete_(url, config = {}) {
  return request({
    ...config,
    url,
    method: 'DELETE'
  });
}

export default {
  request,
  get,
  post,
  put,
  delete_
};
