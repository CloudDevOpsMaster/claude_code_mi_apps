#!/usr/bin/env node

/**
 * scripts/dev-server.js
 *
 * Servidor de desarrollo local para el mini program de Alipay+.
 *
 * Este script levanta un servidor Express local que compila y sirve el mini program,
 * permitiendo desarrollo sin necesidad de dispositivo físico.
 *
 * REQUERIMIENTO: miniprogram-cli init
 * =================================
 * Antes de usar este script, necesitas inicializar miniprogram-cli con tus credenciales
 * de Alipay Platform (requiere aprobación de cuenta "Under Review"):
 *
 *   miniprogram-cli init
 *
 * Una vez inicializado, usa:
 *
 *   npm run dev:local
 *
 * Esto levantará un servidor en http://localhost:3000 con los endpoints:
 * - GET /packageInfoV2.json
 * - GET /packageInfo.json
 * - GET /debugInfo.json
 * - GET /compile-page
 *
 * El servidor compila automáticamente cambios en el código (HMR enabled).
 * El IDE de Alipay puede conectarse a este servidor para preview visual.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

const projectPath = path.resolve(__dirname, '../my-miniapp');
const port = process.env.PORT || 3000;

function checkCliInit() {
  const settingsPath = path.join(os.homedir(), '.miniprogram-cli', 'settings.json');

  if (!fs.existsSync(settingsPath)) {
    console.log('\n❌ miniprogram-cli aún no está inicializado\n');
    console.log('📋 Pasos para habilitar el dev server:\n');
    console.log('1. Ve a https://open.alipay.com/ e inicia sesión');
    console.log('2. Crea un Mini Program (si aún no existe)');
    console.log('3. Obtén las credenciales CLI:\n');
    console.log('   - WORKSPACE_ID');
    console.log('   - SUPER_APP_ID');
    console.log('   - MINI_PROGRAM_ID');
    console.log('   - CLI_ACCESS_KEY_ID');
    console.log('   - CLI_SECRET_ACCESS_KEY\n');
    console.log('4. Ejecuta: miniprogram-cli init');
    console.log('   (Te pedirá que ingrese las credenciales)\n');
    console.log('5. Luego: npm run dev:local\n');
    console.log('⏳ Si tu aplicación está "Under Review", espera 1-3 días por aprobación.\n');
    process.exit(1);
  }

  return settingsPath;
}

async function startDevServer() {
  try {
    console.log('\n🔧 Iniciando servidor de desarrollo local...\n');

    // Verificar que miniprogram-cli esté inicializado
    const settingsPath = checkCliInit();

    // Obtener la API del CLI
    let getApi;
    try {
      const miniProgramCli = require('@antglobal/miniprogram-cli');
      getApi = miniProgramCli.getApi || (typeof miniProgramCli === 'function' ? miniProgramCli : undefined);
    } catch (e) {
      throw new Error(`No se pudo cargar miniprogram-cli: ${e.message}`);
    }

    if (!getApi || typeof getApi !== 'function') {
      throw new Error('getApi no está disponible en miniprogram-cli');
    }

    const api = getApi();

    if (!api || typeof api.startDevServer !== 'function') {
      throw new Error('api.startDevServer no está disponible');
    }

    console.log(`📁 Proyecto: ${projectPath}`);
    console.log(`🔌 Puerto: ${port}`);
    console.log(`⚙️  Config: ${settingsPath}\n`);

    // Iniciar el servidor dev
    await api.startDevServer({
      projectPath,
      port,
      host: 'localhost'
    });

    console.log(`\n✓ Servidor de desarrollo levantado`);
    console.log(`\n📍 URL: http://localhost:${port}`);
    console.log('\n📡 Endpoints:\n');
    console.log(`   GET /packageInfoV2.json`);
    console.log(`   GET /packageInfo.json`);
    console.log(`   GET /debugInfo.json`);
    console.log(`   GET /compile-page\n`);
    console.log('🔄 HMR activado — cambios en código se reflejan automáticamente\n');
    console.log('💡 Ctrl+C para detener\n');

    // Mantener el servidor corriendo
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Verifica que miniprogram-cli esté inicializado:');
    console.error('   miniprogram-cli init\n');
    process.exit(1);
  }
}

startDevServer();
