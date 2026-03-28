# CLAUDE.md - Contexto de Alipay+ Mini Programs

> **IMPORTANTE:** Este NO es React, Vue, o cualquier framework web estándar.
> Este es el framework propietario de Alipay+ Mini Programs. Las reglas y APIs son completamente diferentes.

---

## 📋 Tabla de Contenidos

1. [Framework Description](#1-framework-description)
2. [Sintaxis y Lenguaje](#2-sintaxis-y-lenguaje)
3. [Convenciones de la Plataforma](#3-convenciones-de-la-plataforma)
4. [Lo Que NO Existe](#4-lo-que-no-existe)
5. [Estructura de Archivos](#5-estructura-de-archivos)
6. [Comandos Disponibles](#6-comandos-disponibles)

---

## 1. Framework Description

### ¿Qué es Alipay+ Mini Programs?

Un Alipay+ Mini Program es una aplicación ligera que se ejecuta dentro de la app de Alipay (y otros Super Apps de la red Alipay+) en dispositivos móviles. NO es una web app, aunque comparte conceptos similares.

**Características clave:**

- **Runtime:** JavaScript ES2015+ ejecutado en un motor de Alipay
- **Markup:** AXML (Alipay XML), NO HTML estándar
- **Styling:** ACSS (Alipay CSS), similar a CSS pero con extensiones
- **State management:** Basado en Pages con `this.setData()`
- **APIs:** Propietarias de Alipay (`my.*`)
- **Plataforma:** Mobile-only (iOS y Android vía Alipay app)

### Diferencias Críticas de Web Estándar

| Aspecto | Web | Alipay Mini Program |
|---------|-----|-------------------|
| **Markup** | HTML (`<div>`, `<span>`) | AXML (`<view>`, `<text>`) |
| **Styling** | CSS3 | ACSS (CSS similar + rpx) |
| **Runtime** | V8/SpiderMonkey | Motor de Alipay |
| **Estado** | Cualquier método | `this.setData()` reactivo |
| **HTTP** | `fetch()`, `axios` | `my.request()` |
| **DOM** | Completo | No existe |
| **APIs del SO** | Muy limitadas | `my.*` comprehensive |
| **Navegación** | `window.location` | `my.navigateTo()` |

### Arquitectura de una Mini App

```
Mini Program
├── App Lifecycle (app.js)
│   ├── onLaunch()    - Se inicia la app
│   ├── onShow()      - App vuelve a primer plano
│   ├── onHide()      - App va a segundo plano
│   └── onError()     - Manejo de errores global
│
├── Pages (carpeta pages/)
│   ├── Page Lifecycle (*.js)
│   │   ├── onLoad()      - Se carga la página
│   │   ├── onShow()      - Página visible
│   │   ├── onHide()      - Página oculta
│   │   ├── onUnload()    - Página descargada
│   │   └── data{}        - Estado reactivo
│   │
│   ├── Markup (*.axml)   - Estructura visual
│   ├── Styles (*.acss)   - Estilos (rpx)
│   └── Config (*.json)   - Metadatos de página
│
└── Utilities (carpeta utils/)
    └── API wrappers, helpers
```

---

## 2. Sintaxis y Lenguaje

### 2.1 AXML (Alipay XML Markup)

**NO es HTML.** Usa elementos específicos de Alipay:

#### Elementos Base

```axml
<!-- Contenedor general -->
<view class="container">
  <!-- Texto (NO usar <span> o <p>) -->
  <text>Hola mundo</text>

  <!-- Botón con evento onTap (NO onClick) -->
  <button onTap="handleTap">Presiona</button>

  <!-- Imagen -->
  <image src="./assets/logo.png" style="width: 200rpx"></image>

  <!-- Scroll view (scroll vertical) -->
  <scroll-view class="list">
    <view>Item 1</view>
    <view>Item 2</view>
  </scroll-view>

  <!-- Input de texto -->
  <input
    type="text"
    placeholder="Escribe algo..."
    onInput="handleInput"
    value="{{inputValue}}"
  />

  <!-- Form (agrupador de inputs) -->
  <form onSubmit="handleFormSubmit">
    <input name="email" type="text" placeholder="Email" />
    <button form-type="submit">Enviar</button>
  </form>
</view>
```

#### Binding de Datos (Data Binding)

```axml
<!-- Interpolación simple -->
<text>Contador: {{counter}}</text>

<!-- Condicionales -->
<view a:if="{{isLoggedIn}}">
  <text>Bienvenido, {{username}}</text>
</view>
<view a:else>
  <text>Por favor, inicia sesión</text>
</view>

<!-- Loops -->
<view a:for="{{items}}" a:key="id">
  <text>Nombre: {{item.name}}</text>
  <text>Index: {{index}}</text>
</view>

<!-- Atributos dinámicos -->
<button class="btn {{isActive ? 'active' : 'inactive'}}">
  Click
</button>
```

### 2.2 ACSS (Alipay CSS)

**Similar a CSS estándar, pero con responsividad especial.**

#### Unidades y Responsividad

```acss
/* IMPORTANTE: Usar rpx (responsive pixel), NO px */

.container {
  width: 750rpx;           /* Ancho completo */
  height: 100vh;           /* 100% viewport */
  padding: 32rpx;          /* Responsive padding */
  margin: 16rpx auto 0;    /* Responsive margins */
}

/* Regla de conversión:
   750rpx = ancho completo de pantalla (cualquier dispositivo)
   Alipay escala automáticamente según DPI
*/

.button {
  width: 200rpx;           /* Escalará automáticamente */
  height: 80rpx;
  font-size: 28rpx;        /* Font responsive */
  border-radius: 8rpx;
}
```

#### Características Estándar

```acss
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12rpx;
}

.text {
  color: #333333;
  font-size: 28rpx;
  line-height: 1.5;
  word-break: break-word;  /* Importante para text wrapping */
}

.box {
  background-color: white;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.box:active {
  transform: scale(0.95);  /* Feedback visual */
}
```

### 2.3 Estado Reactivo (this.setData)

**NUNCA modifiques `this.data` directamente. SIEMPRE usa `this.setData()`**

```javascript
Page({
  data: {
    counter: 0,
    user: {
      name: 'John',
      email: 'john@example.com'
    },
    items: []
  },

  // ✓ CORRECTO: usar this.setData()
  increment() {
    this.setData({
      counter: this.data.counter + 1
    });
  },

  // ✗ INCORRECTO: modificar directamente
  // incrementWrong() {
  //   this.data.counter++;  // NO HACE NADA - no reactivo
  // }

  // ✓ Actualizar propiedades anidadas
  updateUser() {
    this.setData({
      'user.name': 'Jane'  // Notación de punto para nested
    });
  },

  // ✓ Actualizar arrays
  addItem(newItem) {
    this.setData({
      items: [...this.data.items, newItem]
    });
  },

  // ✓ Actualizar múltiples estados
  complexUpdate() {
    this.setData({
      counter: 0,
      'user.name': 'Reset',
      items: []
    });
  }
});
```

### 2.4 Event Handlers

```javascript
Page({
  data: {
    text: ''
  },

  // onTap (NO onClick)
  handleTap(event) {
    console.log('Tapped:', event);
    my.alert({ content: 'Button pressed!' });
  },

  // onChange, onInput para inputs
  handleInput(event) {
    const value = event.detail.value;
    this.setData({
      text: value
    });
  },

  // onSubmit para forms
  handleFormSubmit(event) {
    console.log('Form data:', event.detail.value);
  },

  // onScroll para scroll-view
  handleScroll(event) {
    console.log('ScrollTop:', event.detail.scrollTop);
  },

  // onTouchStart, onTouchMove, onTouchEnd para gestures
  handleTouchStart(event) {
    console.log('Touch started at:', event.touches[0]);
  }
});
```

### 2.5 Page Lifecycle

```javascript
Page({
  /**
   * onLoad(options)
   * Se ejecuta cuando la página se carga
   * `options` contiene parámetros de navegación
   */
  onLoad(options) {
    console.log('Page loaded with:', options);
    this.loadData();  // Cargar datos iniciales
  },

  /**
   * onShow()
   * Se ejecuta cada vez que la página se muestra
   * (Puede ser múltiples veces si hay navegación)
   */
  onShow() {
    console.log('Page is visible');
    // Refresh data, restart timers, etc
  },

  /**
   * onHide()
   * Se ejecuta cuando la página se oculta
   */
  onHide() {
    console.log('Page is hidden');
    // Stop timers, cleanup resources
  },

  /**
   * onUnload()
   * Se ejecuta cuando la página se destruye
   */
  onUnload() {
    console.log('Page unloaded');
    // Final cleanup
  }
});
```

---

## 3. Convenciones de la Plataforma

### 3.1 HTTP Requests (my.request)

**Alipay NO tiene `fetch()` o `axios`. Usa `my.request()` con callbacks.**

```javascript
// ✗ NO FUNCIONA:
// fetch('/api/user');
// axios.get('/api/user');

// ✓ CORRECTO - Callback style (nativo)
my.request({
  url: 'https://api.example.com/user',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  success: (response) => {
    console.log('Success:', response.data);
    this.setData({ user: response.data });
  },
  fail: (error) => {
    console.error('Error:', error.errorMessage);
  }
});

// ✓ MEJOR - Wrapper Promise (para usar async/await)
import { request } from './utils/api';

async loadUser() {
  try {
    const response = await request({
      url: 'https://api.example.com/user',
      method: 'GET'
    });
    this.setData({ user: response.data });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### 3.2 Navegación (my.navigateTo)

```javascript
// Navegar a otra página
my.navigateTo({
  url: '/pages/detail/detail?id=123',  // Ruta relativa + parámetros
  success: () => {
    console.log('Navigation successful');
  },
  fail: (error) => {
    console.error('Navigation failed:', error);
  }
});

// Navegar sin agregar a historial
my.redirectTo({
  url: '/pages/home/home'
});

// Volver a la página anterior
my.navigateBack({
  delta: 1  // Número de páginas atrás
});

// Ir a tab (si la app tiene tabs)
my.switchTab({
  url: '/pages/tab-page/tab-page'
});
```

### 3.3 Dialogs y Alerts

```javascript
// Alert simple
my.alert({
  title: 'Atención',
  content: 'Esto es un mensaje',
  buttonText: 'Aceptar',
  success: () => {
    console.log('Alert closed');
  }
});

// Confirmación
my.confirm({
  title: '¿Estás seguro?',
  content: 'Esta acción no se puede deshacer',
  confirmButtonText: 'Sí',
  cancelButtonText: 'No',
  success: (result) => {
    if (result.confirm) {
      console.log('Usuario confirmed');
    } else {
      console.log('Usuario canceló');
    }
  }
});

// Prompt de entrada
my.prompt({
  title: '¿Cuál es tu nombre?',
  okButtonText: 'OK',
  cancelButtonText: 'Cancelar',
  success: (result) => {
    if (result.ok) {
      console.log('Input:', result.inputValue);
    }
  }
});

// Toast (notificación flotante)
my.showToast({
  type: 'success',  // 'success', 'fail', 'loading'
  content: 'Guardado exitosamente',
  duration: 2  // segundos
});
```

### 3.4 Storage Local

```javascript
// Guardar data (clave-valor)
my.setStorage({
  key: 'userToken',
  data: 'abc123token',
  success: () => {
    console.log('Saved');
  }
});

// Recuperar data
my.getStorage({
  key: 'userToken',
  success: (result) => {
    console.log('Token:', result.data);
  }
});

// Remover una clave
my.removeStorage({
  key: 'userToken',
  success: () => {
    console.log('Removed');
  }
});

// Limpiar todo el storage
my.clearStorage({
  success: () => {
    console.log('Storage cleared');
  }
});
```

### 3.5 Obtener Info del Sistema

```javascript
// Info del dispositivo
my.getSystemInfo({
  success: (res) => {
    console.log('Platform:', res.platform);  // iOS, Android
    console.log('Model:', res.model);
    console.log('Screen width:', res.windowWidth);
    console.log('Screen height:', res.windowHeight);
  }
});

// Info de la app
const app = getApp();
console.log('Global data:', app.globalData);
```

---

## 4. Lo Que NO Existe

### JavaScript Estándar (No disponible)

```javascript
// ✗ NO EXISTE:
// window          - No hay ventana global
// document        - No hay DOM
// localStorage    - Usa my.setStorage/getStorage
// sessionStorage  - Usa my.setStorage/getStorage
// fetch()         - Usa my.request()
// axios           - Usa my.request()
// setTimeout/setInterval - FUNCIONA (nativo del runtime)
// Promise         - FUNCIONA (ES2015+)
// async/await     - FUNCIONA (ES2015+)
```

### DOM APIs (No disponibles)

```javascript
// ✗ NO EXISTE:
// document.querySelector()
// document.getElementById()
// element.innerHTML
// element.appendChild()
// element.addEventListener()
// classList.add()

// En su lugar: Usa data binding reactivo en AXML
// <view a:if="{{showModal}}">...</view>
// this.setData({ showModal: true });
```

### Web APIs (No disponibles)

```javascript
// ✗ NO EXISTE:
// FormData
// XMLHttpRequest
// WebSocket (solo a través de my.connectSocket)
// Service Workers
// IndexedDB
```

---

## 5. Estructura de Archivos

```
/home/dev/Repos/claude_code_mi_apps/
│
├── package.json                    # Workspace (scripts de raíz)
├── CLAUDE.md                       # Este archivo
├── README.md                       # Guía rápida
├── .env.example                    # Variables de ejemplo
├── .gitignore                      # Ignorar .env, node_modules
├── mini.project.json              # Metadata del workspace
│
├── scripts/
│   └── init-dev.sh                # Script de setup (ejecutable)
│
└── my-miniapp/                     # MINI PROGRAM REAL
    ├── package.json                # Dependencias de la app
    ├── mini.project.json           # Metadata de app
    ├── app.js                      # Ciclo de vida global (onLaunch, onShow, etc)
    ├── app.json                    # Config global (pages, window)
    ├── app.acss                    # Estilos globales
    │
    ├── pages/
    │   └── index/                  # Página principal
    │       ├── index.js            # Lógica (this.setData, handlers)
    │       ├── index.axml          # Markup (<view>, <text>, binding)
    │       ├── index.acss          # Estilos (rpx units)
    │       └── index.json          # Config de página
    │
    ├── components/                 # Componentes reutilizables (directorio)
    │   # Estructura similar a pages/
    │
    ├── utils/
    │   └── api.js                  # Wrapper Promise para my.request
    │
    └── assets/                     # Recursos (imágenes, etc)
```

### Convención de Estructura de Página/Componente

Cada página o componente tiene 4 archivos en la misma carpeta:

```
pages/detail/
├── detail.js       # Lógica con Page() o Component()
├── detail.axml     # Markup
├── detail.acss     # Estilos
└── detail.json     # Config
```

---

## 6. Comandos Disponibles

### Scripts NPM (desde raíz)

```bash
# Iniciar setup del CLI
npm run init-cli
# Ejecuta: bash scripts/init-dev.sh

# Preview en dispositivo (requiere CLI configurado)
npm run preview
# Ejecuta: cd my-miniapp && miniprogram-cli preview
# Genera QR para escanear con Alipay+

# Upload a plataforma (publicar)
npm run upload
# Ejecuta: cd my-miniapp && miniprogram-cli upload
# Requiere CLI autenticado

# Development (placeholder)
npm run dev
# Para desarrollo local
```

### miniprogram-cli Commands

```bash
# Mostrar version
miniprogram-cli --version

# Inicializar CLI (obtener token de acceso)
miniprogram-cli init
# Te pide:
# - Workspace ID
# - SUPER_APP_ID
# - MINI_PROGRAM_ID
# - Access Key ID
# - Secret Access Key

# Preview (genera QR)
cd my-miniapp
miniprogram-cli preview

# Upload (publicar versión)
miniprogram-cli upload --version 1.0.1 --desc "Mi actualización"

# Build (compilar sin preview)
miniprogram-cli build

# Logs (ver logs de desarrollo)
miniprogram-cli logs
```

### Flujo Típico de Desarrollo

```bash
# 1. Setup inicial (una sola vez)
npm run init-cli
cp .env.example .env
# Edita .env con credenciales

# 2. Desarrollo iterativo
npm run preview
# Escanea QR con Alipay+
# Haz cambios en el código
# Actualiza automáticamente en el dispositivo

# 3. Listo para publicar
npm run upload

# 4. Verificar versión en Plataforma
# Ve a Mini Program Platform > Versions
```

---

## Recursos Adicionales

- **Oficial Alipay:** https://open.alipay.com/
- **Mini Program Docs:** https://open.alipay.com/api/mini-program
- **API Reference:** https://open.alipay.com/doc/mini-program/api-reference
- **Component Gallery:** https://open.alipay.com/doc/mini-program/components

---

**Última actualización:** 2026-03-28
**Versión:** 1.0
**Mantenedor:** Development Team
