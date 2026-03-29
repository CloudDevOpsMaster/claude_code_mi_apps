# Arquitectura: Setup Alipay+ Mini Programs (Linux)

## Visión General

Configurar ambiente completo de desarrollo para Alipay+ Mini Programs con estructura productiva, documentación clara y herramientas automáticas.

**Objetivo**: Workflow reproducible desde cero (clonar → instalar → preview → desarrollar).

---

## 1. Patrón de Diseño

### Arquitectura Principal: **Convention over Configuration + Layered**

```
┌────────────────────────────────────────────────┐
│  Mini App Layer                                 │
│  (pages/, components/, utils/, assets/)        │
├────────────────────────────────────────────────┤
│  Framework Layer (Alipay Runtime)              │
│  - AXML parser, ACSS renderer                  │
│  - Data binding (setData), lifecycle hooks     │
│  - my.* APIs (request, navigateTo, etc)       │
├────────────────────────────────────────────────┤
│  Platform Layer (Alipay + Super Apps)         │
│  - Device APIs, file system, sensors          │
└────────────────────────────────────────────────┘
```

**Patrones aplicados**:
- **Convention over Configuration**: Estructura predefinida `/pages/{name}/{name}.{js,axml,acss,json}`
- **Layered Architecture**: Separación clara entre app logic, framework, platform
- **Module Pattern**: Cada página/componente es módulo autocontendido
- **Repository Pattern** (utils/api.js): Abstrae my.request con Promise
- **Configuration Management**: .env.example + CLAUDE.md como fuente de verdad

---

## 2. Estructura de Archivos

```
/home/dev/Repos/claude_code_mi_apps/
│
├── CLAUDE.md                    # 📘 Contexto para Claude Code
├── README.md                    # 📖 Quick start
├── package.json                 # 🔧 Scripts npm (root workspace)
├── .env.example                 # 🔐 Variables de entorno
├── .gitignore                   # 📦 node_modules, .env, coverage/
│
├── scripts/
│   └── init-dev.sh              # 🚀 Setup interactivo CLI
│
└── my-miniapp/                  # 🎯 MINI PROGRAM REAL
    ├── package.json             # Dependencias de la app
    ├── mini.project.json        # Metadata Alipay
    ├── .env                     # (generado por init-dev.sh)
    │
    ├── app.js                   # 📱 App lifecycle (onLaunch, onShow)
    ├── app.json                 # Configuración global (pages, window)
    ├── app.acss                 # Estilos globales (rpx units)
    │
    ├── pages/
    │   └── index/
    │       ├── index.js         # Page logic + handlers
    │       ├── index.axml       # AXML markup (binding, loops, conditions)
    │       ├── index.acss       # ACSS styles (responsive)
    │       └── index.json       # Page meta
    │
    ├── components/              # Reutilizable custom components
    │   └── .gitkeep
    │
    ├── utils/
    │   ├── api.js               # 🔑 Promise wrapper para my.request
    │   └── logger.js            # Logging helper (debug)
    │
    └── assets/                  # 📷 Imágenes, fuentes
        └── .gitkeep
```

### Convención de Ruta Página/Componente

Cada página/componente tiene 4 archivos en carpeta homónima:

```
pages/product-list/
├── product-list.js     # Lógica (Page({ data, onLoad, ...}))
├── product-list.axml   # Markup (<view a:for="{{items}}" ...>)
├── product-list.acss   # Estilos (.container { width: 750rpx; })
└── product-list.json   # Config ({ "navigationBarTitleText": "..." })
```

---

## 3. Módulos Lógicos y Responsabilidades

### 3.1 **app.js** — Ciclo de Vida Global

```javascript
App({
  // Estado global accesible desde Pages
  globalData: {
    userToken: null,
    apiBaseUrl: 'https://api.example.com'
  },

  // onLaunch: Se ejecuta al iniciar la app
  onLaunch() {
    this.restoreSession();
  },

  // onShow: Al volver a primer plano
  onShow() {
    console.log('App visible');
  },

  // onHide: Al ir a segundo plano
  onHide() {
    console.log('App hidden');
  },

  // onError: Manejo global de errores
  onError(error) {
    console.error('Global error:', error);
  },

  // Métodos helper
  restoreSession() { /* ... */ },
  setUserToken(token) { /* ... */ }
});
```

**Responsabilidad**: Inicialización global, manejo de errores app-level, estado compartido.

### 3.2 **app.json** — Configuración Global

```json
{
  "pages": [
    "pages/index/index",
    "pages/product-list/product-list",
    "pages/detail/detail"
  ],
  "window": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "Mi App",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#333",
    "backgroundColor": "#fafafa",
    "items": [
      {
        "pagePath": "pages/index/index",
        "name": "Inicio"
      }
    ]
  }
}
```

**Responsabilidad**: Declarar rutas, temas globales, tabs (si aplica).

### 3.3 **pages/index/index.js** — Lógica de Página

```javascript
Page({
  data: {
    // Estado reactivo
    counter: 0,
    items: [],
    loading: false,
    userInfo: null
  },

  // Lifecycle hooks
  onLoad(options) {
    // options contiene parámetros de navegación
    this.fetchData();
  },

  onShow() {
    // Se ejecuta cuando página es visible
    // Refrescar si fue oculta
  },

  onHide() {
    // Cleanup: cancelar requests pendientes, timers
  },

  onUnload() {
    // Página será destruida
  },

  // Event handlers
  handleTap(event) {
    this.setData({ counter: this.data.counter + 1 });
  },

  handleInput(event) {
    const value = event.detail.value;
    this.setData({ inputValue: value });
  },

  // Data fetching
  fetchData() {
    this.setData({ loading: true });
    // Usar utils/api.js (Promise-based)
    api.get('/products')
      .then(data => {
        this.setData({ items: data, loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setData({ loading: false });
      });
  }
});
```

**Responsabilidad**: Estado reactivo, handlers, fetching de datos.

### 3.4 **pages/index/index.axml** — Markup

```axml
<view class="container">
  <!-- Encabezado -->
  <view class="header">
    <text class="title">Hola {{userName}}</text>
  </view>

  <!-- Contador (ejemplo funcional) -->
  <view class="counter-section">
    <text>Contador: {{counter}}</text>
    <button onTap="handleTap" class="btn">Incrementar</button>
  </view>

  <!-- Condicional -->
  <view a:if="{{loading}}">
    <text>Cargando...</text>
  </view>

  <!-- Loop -->
  <scroll-view class="list" a:if="{{!loading}}">
    <view a:for="{{items}}" a:key="id" class="item">
      <text>{{item.name}}</text>
      <text>Precio: {{item.price}}</text>
    </view>
  </scroll-view>

  <!-- Form -->
  <form onSubmit="handleSubmit" class="form">
    <input
      name="email"
      type="text"
      placeholder="Email"
      onInput="handleInput"
      value="{{email}}"
    />
    <button form-type="submit" class="btn-primary">Enviar</button>
  </form>
</view>
```

**Responsabilidad**: Renderizar UI con data binding, eventos.

### 3.5 **pages/index/index.acss** — Estilos

```acss
.container {
  width: 750rpx;              /* Ancho completo */
  padding: 32rpx;             /* Responsive padding */
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.counter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40rpx 0;
}

.btn {
  width: 200rpx;
  height: 80rpx;
  background-color: #1890ff;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.btn:active {
  transform: scale(0.95);    /* Feedback visual */
  background-color: #0050b3;
}

.list {
  max-height: 400rpx;
  border-radius: 8rpx;
  background: white;
}

.item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.item text {
  display: block;
  margin: 8rpx 0;
}
```

**Responsabilidad**: Estilos responsive con rpx units.

### 3.6 **utils/api.js** — Repository de HTTP

```javascript
/**
 * Wrapper Promise-based para my.request
 * Abstrae callback-style → Promise-style
 */

class APIClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'https://api.example.com';
  }

  request(options) {
    return new Promise((resolve, reject) => {
      my.request({
        url: `${this.baseUrl}${options.path}`,
        method: options.method || 'GET',
        data: options.data,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        success: (response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(new Error(response.data?.message || 'API Error'));
          }
        },
        fail: (error) => {
          reject(new Error(error.errorMessage || 'Network Error'));
        }
      });
    });
  }

  get(path) {
    return this.request({ path, method: 'GET' });
  }

  post(path, data) {
    return this.request({ path, method: 'POST', data });
  }

  put(path, data) {
    return this.request({ path, method: 'PUT', data });
  }

  delete(path) {
    return this.request({ path, method: 'DELETE' });
  }
}

// Exportar instancia singleton
export default new APIClient(getApp().globalData.apiBaseUrl);
```

**Responsabilidad**: Abstracción de HTTP, reutilizable en todas las páginas.

---

## 4. Configuración y Scripts

### 4.1 **package.json (Root)**

```json
{
  "name": "claude-alipay-miniapp",
  "version": "1.0.0",
  "scripts": {
    "init-cli": "bash scripts/init-dev.sh",
    "preview": "cd my-miniapp && miniprogram-cli preview",
    "upload": "cd my-miniapp && miniprogram-cli upload --version 1.0.0",
    "dev": "echo 'Usa npm run preview para desarrollo'"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 4.2 **scripts/init-dev.sh** — Setup Interactivo

```bash
#!/bin/bash
set -euo pipefail

echo "=== Setup Alipay+ Mini Program CLI ==="

# 1. Verificar prerequisitos
echo "✓ Verificando prerequisitos..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "✗ Requiere Node 18+, actual: $(node --version)"
  exit 1
fi
echo "✓ Node: $(node --version)"
echo "✓ NPM: $(npm --version)"

# 2. Instalar miniprogram-cli globalmente
if ! command -v miniprogram-cli &> /dev/null; then
  echo "📦 Instalando miniprogram-cli..."
  npm install -g @alipay/miniprogram-cli
fi
echo "✓ miniprogram-cli: $(miniprogram-cli --version)"

# 3. Crear .env en my-miniapp/
echo ""
echo "🔐 Configurando variables de entorno..."
cd my-miniapp

if [ ! -f .env ]; then
  read -p "WORKSPACE_ID: " WORKSPACE_ID
  read -p "SUPER_APP_ID: " SUPER_APP_ID
  read -p "MINI_PROGRAM_ID: " MINI_PROGRAM_ID
  read -sp "CLI_ACCESS_KEY_ID: " CLI_ACCESS_KEY_ID
  echo
  read -sp "CLI_SECRET_ACCESS_KEY: " CLI_SECRET_ACCESS_KEY
  echo

  cat > .env << EOF
WORKSPACE_ID=$WORKSPACE_ID
SUPER_APP_ID=$SUPER_APP_ID
MINI_PROGRAM_ID=$MINI_PROGRAM_ID
CLI_ACCESS_KEY_ID=$CLI_ACCESS_KEY_ID
CLI_SECRET_ACCESS_KEY=$CLI_SECRET_ACCESS_KEY
EOF
  echo "✓ .env creado"
else
  echo "✓ .env ya existe"
fi

# 4. Inicializar CLI con credentials
echo ""
echo "🚀 Inicializando miniprogram-cli..."
miniprogram-cli init \
  --workspace-id $(grep WORKSPACE_ID .env | cut -d'=' -f2) \
  --super-app-id $(grep SUPER_APP_ID .env | cut -d'=' -f2) \
  --mini-program-id $(grep MINI_PROGRAM_ID .env | cut -d'=' -f2) \
  --access-key-id $(grep CLI_ACCESS_KEY_ID .env | cut -d'=' -f2) \
  --secret-access-key $(grep CLI_SECRET_ACCESS_KEY .env | cut -d'=' -f2)

echo ""
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "  npm run preview    # Genera QR para preview en dispositivo"
echo "  npm run upload     # Publica versión"
```

### 4.3 **.env.example**

```env
# Alipay+ Mini Program CLI Configuration
# Obtén estos valores de: https://mini.alipay.com/account/credentials

WORKSPACE_ID=
SUPER_APP_ID=
MINI_PROGRAM_ID=
CLI_ACCESS_KEY_ID=
CLI_SECRET_ACCESS_KEY=
```

### 4.4 **CLAUDE.md** — Referencia para IA

Contenido completo del CLAUDE.md ya proporcionado en el system-reminder.

---

## 5. Decisiones de Diseño

### 5.1 Estructura Flat-by-Convention

```
pages/index/index.js
     index.axml
     index.acss
     index.json
```

**Pro**: Fácil navegar, búsqueda rápida en editor (Ctrl+P: "index").
**Con**: 4 archivos por página pueden parecer verbosos.
**Mitigación**: Snippets en editor para generar estructura.

### 5.2 Utils/api.js como Singleton Promise-Based

```javascript
// En lugar de callbacks directos
import api from '../../utils/api.js';

api.get('/products')
  .then(data => this.setData({ items: data }))
  .catch(error => console.error(error));
```

**Pro**: Sintaxis familiar (async/await compatible), reutilizable.
**Con**: Abstracción adicional (thin wrapper).
**Mitigación**: Documentado en CLAUDE.md.

### 5.3 app.js como Single Source of Truth para Global State

```javascript
const app = getApp();
app.globalData.userToken = token;
```

**Pro**: Fácil de rastrear, accesible desde cualquier página.
**Con**: No reactivo como `setData()`.
**Mitigación**: Usar para config, token; usar `setData()` para UI.

### 5.4 .env en my-miniapp/ (No en raíz)

Separación clara: raíz = workspace de agentes/documentación, my-miniapp/ = app real.

### Trade-offs Documentados

| Decisión | Pro | Con | Mitigación |
|----------|-----|-----|-----------|
| Estructura 4-file (js,axml,acss,json) | Cohesión | Verbosidad | Snippets IDE |
| api.js wrapper | async/await | Thin layer | Doc clara |
| app.globalData | Centralizado | No reactivo | Usar setData para UI |
| .env en my-miniapp/ | Claridad | 2 niveles | Mencionar en docs |

---

## 6. Interfaz Pública (Módulos Exportables)

### 6.1 api.js Exports

```javascript
export default APIClient {
  get(path: string): Promise<any>
  post(path: string, data: any): Promise<any>
  put(path: string, data: any): Promise<any>
  delete(path: string): Promise<any>
  request(options: RequestOptions): Promise<any>
}

interface RequestOptions {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
}
```

### 6.2 Page Lifecycle (Interfaz Estándar)

```javascript
Page({
  data: { [key: string]: any },

  // Lifecycle
  onLoad(options?: Record<string, string>): void
  onShow(): void
  onHide(): void
  onUnload(): void

  // Handlers (nombrados con handle{EventType})
  handle[TapInput|Submit|Scroll|Touch]: (event: Event) => void

  // Data methods
  setData(data: Partial<Page.data>): void

  // Custom methods
  [methodName]: (...args: any[]) => any
})
```

### 6.3 App Lifecycle (Interfaz Estándar)

```javascript
App({
  globalData: { [key: string]: any },

  onLaunch(): void
  onShow(): void
  onHide(): void
  onError(error: Error): void

  [methodName]: (...args: any[]) => any
})
```

---

## 7. Flujo de Onboarding

```
1. Clonar repo
   git clone ...
   cd /home/dev/Repos/claude_code_mi_apps

2. Instalar raíz
   npm install

3. Ejecutar setup CLI
   npm run init-cli
   → Verifica Node, instala miniprogram-cli
   → Pide credentials
   → Genera .env en my-miniapp/

4. Validar estructura
   ls -R my-miniapp/
   → Verifica: app.js, pages/index/, utils/api.js, etc.

5. Preview
   npm run preview
   → Genera QR
   → Usuario escanea con Alipay+
   → Ve contador funcional en dispositivo

6. Desarrollo
   - Edita pages/index/index.axml (markup)
   - Edita pages/index/index.js (lógica)
   - Edita pages/index/index.acss (estilos)
   - Auto-actualización en dispositivo

7. Publicar
   npm run upload
   → Sube versión 1.0.0 a plataforma
```

---

## 8. Consideraciones de Seguridad

### 8.1 .env Handling
- ✅ `.env` en `.gitignore`
- ✅ `.env.example` con placeholders, en git
- ✅ `init-dev.sh` solo escribe en `.env` local (nunca committed)
- ✗ Nunca loguear credentials

### 8.2 API Requests
- ✅ HTTPS requerido (`my.request` lo enforza)
- ✅ Headers de autenticación en cada request
- ✅ Validar responses antes de usar

### 8.3 Data Binding
- ✅ Escapar variables en AXML (`{{variable}}` auto-escapa)
- ✗ No usar `innerHTML` o eval (no existen en Alipay)

---

## 9. Resumen de Artefactos a Crear

| Artefacto | Tipo | Propósito |
|-----------|------|-----------|
| `my-miniapp/app.js` | JS | Ciclo vida global, estado compartido |
| `my-miniapp/app.json` | JSON | Configuración global, rutas, temas |
| `my-miniapp/app.acss` | CSS | Estilos globales |
| `my-miniapp/pages/index/index.{js,axml,acss,json}` | Multipart | Página principal con contador |
| `my-miniapp/utils/api.js` | JS | Repository para HTTP |
| `my-miniapp/.env.example` | ENV | Variables (raíz upload a .gitignore) |
| `scripts/init-dev.sh` | Bash | Setup automático CLI |
| `CLAUDE.md` | MD | Contexto para agentes IA |
| `README.md` | MD | Quick start y troubleshooting |
| `package.json` (root) | JSON | Scripts npm (preview, upload) |

---

## Resumido

| Aspecto | Decisión |
|---------|----------|
| **Patrón** | Convention over Configuration + Layered |
| **Estructura** | 4-file per page/component (js, axml, acss, json) |
| **HTTP** | Promise wrapper (utils/api.js) |
| **Estado Global** | app.js globalData |
| **Estado Local** | Page data + setData() |
| **Setup** | init-dev.sh automático, CLI-driven |
| **Seguridad** | .env.gitignored, HTTPS enforced |
| **DX** | Estructura intuitiva, CLAUDE.md + README.md completos |
