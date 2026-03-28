/**
 * app.js - Punto de entrada de la aplicación Alipay+ Mini Program
 *
 * Define el ciclo de vida global de la aplicación y datos compartidos
 * entre todas las páginas.
 */

App({
  /**
   * onLaunch: Se ejecuta cuando la aplicación se inicia
   * Aquí se puede inicializar configuración global
   */
  onLaunch() {
    console.log('App launched');

    // Obtener información del sistema
    my.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
        console.log('System info:', res.platform);
      },
      fail: (error) => {
        console.error('Failed to get system info:', error);
      }
    });
  },

  /**
   * onShow: Se ejecuta cuando la aplicación vuelve a estar visible
   * (cuando el usuario vuelve desde otra aplicación)
   */
  onShow() {
    console.log('App is now visible');
  },

  /**
   * onHide: Se ejecuta cuando la aplicación se oculta
   * (cuando el usuario cambia a otra aplicación)
   */
  onHide() {
    console.log('App is now hidden');
  },

  /**
   * onError: Captura errores globales de la aplicación
   * @param {string} error - Mensaje de error
   */
  onError(error) {
    console.error('Global error:', error);
  },

  /**
   * globalData: Datos compartidos entre todas las páginas
   * Accesible desde cualquier página mediante:
   *   const app = getApp();
   *   app.globalData.user
   */
  globalData: {
    user: null,
    token: null,
    systemInfo: null,
    apiBaseUrl: process.env.API_BASE_URL || ''
  }
});
