/**
 * utils/helpers.js - Utilidades puras sin dependencia de Alipay
 *
 * Funciones de lógica de negocio que son independientes del framework
 */

/**
 * Validar que un contador sea válido
 * @param {number} value - Valor del contador
 * @returns {boolean} true si es válido
 */
function isValidCounter(value) {
  return typeof value === 'number' && value >= 0 && value === Math.floor(value);
}

/**
 * Incrementar un contador
 * @param {number} current - Valor actual
 * @returns {number} Nuevo valor incrementado
 */
function incrementCounter(current) {
  if (!isValidCounter(current)) {
    throw new Error('Contador inválido');
  }
  return current + 1;
}

/**
 * Decrementar un contador (no puede ser negativo)
 * @param {number} current - Valor actual
 * @returns {number} Nuevo valor decrementado
 */
function decrementCounter(current) {
  if (!isValidCounter(current)) {
    throw new Error('Contador inválido');
  }
  if (current === 0) {
    return 0;
  }
  return current - 1;
}

/**
 * Resetear contador a cero
 * @param {number} current - Valor actual
 * @returns {number} Siempre 0
 */
function resetCounter(current) {
  if (!isValidCounter(current)) {
    throw new Error('Contador inválido');
  }
  return 0;
}

/**
 * Validar que una URL sea válida
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
function isValidUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  try {
    new URL(url, 'https://example.com');
    return true;
  } catch {
    return /^\//.test(url); // Aceptar URLs relativas
  }
}

/**
 * Validar método HTTP
 * @param {string} method - Método HTTP
 * @returns {boolean} true si es válido
 */
function isValidHttpMethod(method) {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  return validMethods.includes(String(method).toUpperCase());
}

/**
 * Normalizar método HTTP a mayúsculas
 * @param {string} method - Método HTTP
 * @returns {string} Método normalizado
 */
function normalizeHttpMethod(method) {
  return String(method).toUpperCase();
}

/**
 * Crear headers de solicitud con Content-Type
 * @param {Object} additionalHeaders - Headers adicionales
 * @returns {Object} Headers completos
 */
function createRequestHeaders(additionalHeaders = {}) {
  return {
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
}

/**
 * Validar respuesta HTTP por código de estado
 * @param {number} status - Código de estado HTTP
 * @returns {boolean} true si es éxito (< 400)
 */
function isSuccessStatus(status) {
  return typeof status === 'number' && status >= 200 && status < 400;
}

/**
 * Crear mensaje de error basado en status HTTP
 * @param {number} status - Código de estado
 * @param {string} message - Mensaje adicional
 * @returns {string} Mensaje de error formateado
 */
function createHttpErrorMessage(status, message = '') {
  const baseMessage = `HTTP ${status}`;
  return message ? `${baseMessage}: ${message}` : baseMessage;
}

/**
 * Formatear respuesta API para el frontend
 * @param {Object} response - Respuesta cruda del servidor
 * @returns {Object} Respuesta formateada
 */
function formatApiResponse(response) {
  return {
    status: response.status,
    data: response.data || {},
    headers: response.headers || {}
  };
}

/**
 * Validar estructura de datos de usuario
 * @param {Object} userInfo - Datos de usuario
 * @returns {boolean} true si es válido
 */
function isValidUserInfo(userInfo) {
  if (!userInfo || typeof userInfo !== 'object') {
    return false;
  }
  return 'name' in userInfo || 'id' in userInfo || 'status' in userInfo;
}

/**
 * Crear estado de página válido
 * @returns {Object} Estado inicial válido
 */
function createInitialPageState() {
  return {
    counter: 0,
    userInfo: null,
    loading: false,
    error: null,
    apiResponse: null,
    message: 'Hola desde Alipay+ Mini Program!'
  };
}

/**
 * Validar estado de página
 * @param {Object} state - Estado a validar
 * @returns {boolean} true si es válido
 */
function isValidPageState(state) {
  return (
    typeof state === 'object' &&
    state !== null &&
    'counter' in state &&
    'loading' in state &&
    'error' in state
  );
}

/**
 * Mergear updates a estado manteniendo inmutabilidad
 * @param {Object} currentState - Estado actual
 * @param {Object} updates - Updates a aplicar
 * @returns {Object} Nuevo estado
 */
function mergeStateUpdate(currentState, updates) {
  return { ...currentState, ...updates };
}

module.exports = {
  isValidCounter,
  incrementCounter,
  decrementCounter,
  resetCounter,
  isValidUrl,
  isValidHttpMethod,
  normalizeHttpMethod,
  createRequestHeaders,
  isSuccessStatus,
  createHttpErrorMessage,
  formatApiResponse,
  isValidUserInfo,
  createInitialPageState,
  isValidPageState,
  mergeStateUpdate
};
