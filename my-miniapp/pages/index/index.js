/**
 * pages/index/index.js - Página principal con ejemplo de contador
 *
 * Demuestra:
 * - this.setData() para actualizar estado reactivamente
 * - Event handlers: onTap
 * - Ciclo de vida de página
 * - Integración con API wrapper
 */

import { request } from '../../utils/api';

Page({
  /**
   * data: Estado reactivo de la página
   * Se actualiza mediante this.setData()
   */
  data: {
    counter: 0,
    userInfo: null,
    loading: false,
    error: null,
    apiResponse: null,
    message: 'Hola desde Alipay+ Mini Program!'
  },

  /**
   * onLoad: Se ejecuta cuando la página se carga
   * Aquí se pueden cargar datos iniciales
   */
  onLoad() {
    console.log('Index page loaded');
    // Ejemplo: Cargar datos iniciales
    this.loadInitialData();
  },

  /**
   * onShow: Se ejecuta cuando la página se muestra
   */
  onShow() {
    console.log('Index page is now visible');
  },

  /**
   * onHide: Se ejecuta cuando la página se oculta
   */
  onHide() {
    console.log('Index page is now hidden');
  },

  /**
   * onUnload: Se ejecuta cuando la página se descarga
   */
  onUnload() {
    console.log('Index page unloaded');
  },

  /**
   * increment: Incrementa el contador
   * Demuestra el patrón this.setData() correcto
   */
  increment() {
    // CORRECTO: usar this.setData()
    this.setData({
      counter: this.data.counter + 1
    });
    console.log('Counter incremented to:', this.data.counter + 1);
  },

  /**
   * decrement: Decrementa el contador
   */
  decrement() {
    if (this.data.counter > 0) {
      this.setData({
        counter: this.data.counter - 1
      });
    }
  },

  /**
   * reset: Reinicia el contador a 0
   */
  reset() {
    this.setData({
      counter: 0,
      apiResponse: null,
      error: null
    });
  },

  /**
   * loadInitialData: Carga datos iniciales (ejemplo)
   * Demuestra el patrón de uso del API wrapper
   */
  loadInitialData() {
    this.setData({ loading: true });

    // Simular obtención de datos del servidor
    // En una app real, esto sería una llamada a tu API
    const mockUserInfo = {
      name: 'Usuario de Prueba',
      id: 'user_12345',
      status: 'active'
    };

    this.setData({
      userInfo: mockUserInfo,
      loading: false
    });

    console.log('Initial data loaded:', mockUserInfo);
  },

  /**
   * fetchData: Ejemplo de llamada a API (comentado)
   * Descomenta para probar con tu API real
   */
  async fetchData() {
    this.setData({ loading: true, error: null });

    try {
      // Ejemplo usando el wrapper de API
      // const response = await request({
      //   url: '/api/user/info',
      //   method: 'GET'
      // });
      //
      // this.setData({
      //   apiResponse: response,
      //   loading: false
      // });

      // Para demo, mostramos que el método está disponible
      console.log('API request pattern is available');
      this.setData({
        apiResponse: { message: 'API wrapper disponible y listo' },
        loading: false
      });
    } catch (error) {
      this.setData({
        error: error.message || 'Error al obtener datos',
        loading: false
      });
      console.error('Fetch error:', error);
    }
  },

  /**
   * showAlert: Demuestra el uso de my.alert
   */
  showAlert() {
    my.alert({
      title: 'Información',
      content: `El contador está en: ${this.data.counter}`,
      buttonText: 'OK'
    });
  }
});
