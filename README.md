# Alipay+ Mini Program Development Environment

Ambiente de desarrollo completo para crear **Alipay+ Mini Programs en Linux**.

> **⚠️ IMPORTANTE:** Este NO es React, Vue, o Next.js. Es el framework propietario de Alipay+.
> Lee [CLAUDE.md](./CLAUDE.md) para entender los conceptos fundamentales.

---

## 📋 Requisitos Previos

- **Node.js 18+** (https://nodejs.org/)
- **npm 8+** (viene con Node.js)
- **git 2.20+** (https://git-scm.com/)
- **Linux/Mac/WSL** (Windows Native no soportado sin modificaciones)
- **Cuenta Alipay Mini Program Platform** (https://open.alipay.com/)
- **Access Token de Alipay** (desde Platform Settings)

---

## 🚀 Quick Start (5 minutos)

### 1. Clonar el Repositorio

```bash
git clone <repo-url>
cd claude_code_mi_apps
```

### 2. Inicializar Ambiente

```bash
npm run init-cli
```

Este comando:
- ✓ Valida Node.js 18+, npm 8+, git 2.20+
- ✓ Instala/verifica `miniprogram-cli` globalmente
- ✓ Guía obtener credenciales de Alipay Platform

**Salida esperada:**
```
[1/5] Validando Node.js 18+...
✓ Node.js v18.x.x
[2/5] Validando npm 8+...
✓ npm 8.x.x
[3/5] Validando git 2.20+...
✓ git 2.x.x
[4/5] Validando/Instalando miniprogram-cli...
✓ miniprogram-cli [version]
[5/5] Configuración de Credenciales...
⚠ Archivo .env no encontrado
```

### 3. Configurar Credenciales

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env
# O usa tu editor favorito: code .env, vim .env, etc
```

**Archivo `.env` después de editar:**
```env
WORKSPACE_ID=your_actual_workspace_id
SUPER_APP_ID=your_actual_super_app_id
MINI_PROGRAM_ID=your_actual_mini_program_id
CLI_ACCESS_KEY_ID=your_actual_access_key_id
CLI_SECRET_ACCESS_KEY=your_actual_secret_key
API_BASE_URL=
DEBUG=false
```

> ⚠️ **Importante:** `.env` está en `.gitignore`. NUNCA lo commits.

### 4. Obtener Credenciales de Alipay Platform

1. Ve a https://open.alipay.com/
2. Inicia sesión con tu cuenta de Workspace
3. Ve a **Settings → API Credentials**
4. Copia:
   - `WORKSPACE_ID`
   - `SUPER_APP_ID`
   - `MINI_PROGRAM_ID`
   - `CLI_ACCESS_KEY_ID`
   - `CLI_SECRET_ACCESS_KEY`
5. Pega en `.env`

### 5. Preview en Dispositivo

```bash
npm run preview
```

**Output:**
```
Starting preview server...
✓ QR Code generated:
  [████████████████████]
  [████████████████████]
  [████ SCAN WITH ALIPAY+]
  [████████████████████]
  [████████████████████]
```

### 6. Escanear QR

1. Abre la app **Alipay+** (o Alipay) en tu dispositivo
2. Ve a **Scan** o busca el ícono de cámara
3. Escanea el QR mostrado en terminal
4. ¡Tu Mini Program se abre en el dispositivo!

Los cambios en el código se reflejan automáticamente.

---

## 📁 Estructura de Carpetas

```
my-miniapp/
├── app.js              # Ciclo de vida global (onLaunch, onShow, onHide, onError)
├── app.json            # Configuración global (páginas, ventana)
├── app.acss            # Estilos globales
├── mini.project.json   # Metadata de la app
│
├── pages/
│   └── index/          # Página principal
│       ├── index.js    # Lógica con setData(), handlers
│       ├── index.axml  # Markup con <view>, <text>, <button>
│       ├── index.acss  # Estilos con unidades rpx
│       └── index.json  # Configuración de página
│
├── components/         # Componentes reutilizables (misma estructura que pages)
├── utils/
│   └── api.js          # Wrapper Promise para my.request
│
└── assets/             # Imágenes, recursos
```

---

## 💻 Flujo de Desarrollo Diario

### Editar una Página Existente

```bash
# 1. Iniciar preview
npm run preview

# 2. Editar archivos en mi-miniapp/pages/*/
#    - *.js   - Lógica (handlers, ciclo de vida)
#    - *.axml - Markup (estructura visual)
#    - *.acss - Estilos (responsive con rpx)
#    - *.json - Config (título, colores nav bar)

# 3. Guardar y ver cambios en el dispositivo
#    (se actualiza automáticamente)

# 4. Presiona Ctrl+C para salir del preview
```

### Crear una Nueva Página

```bash
# 1. Crear carpeta con estructura estándar
mkdir -p my-miniapp/pages/mypage

# 2. Crear 4 archivos
cat > my-miniapp/pages/mypage/mypage.js << 'EOF'
Page({
  data: {
    // Tu estado aquí
  },

  onLoad() {
    console.log('Página cargada');
  }
});
EOF

cat > my-miniapp/pages/mypage/mypage.axml << 'EOF'
<view class="container">
  <text>Mi página</text>
</view>
EOF

cat > my-miniapp/pages/mypage/mypage.acss << 'EOF'
.container {
  padding: 32rpx;
}
EOF

cat > my-miniapp/pages/mypage/mypage.json << 'EOF'
{
  "defaultTitle": "Mi Página"
}
EOF

# 3. Registrar en app.json
# Edita my-miniapp/app.json:
# "pages": ["pages/index/index", "pages/mypage/mypage"]

# 4. Navegar a la página
# En cualquier handler:
my.navigateTo({
  url: '/pages/mypage/mypage'
});
```

### Usar API Wrapper

```javascript
// En cualquier página o componente
import { request, get, post } from '../../utils/api';

Page({
  async loadData() {
    try {
      // GET request
      const user = await get('/api/user/me');
      console.log('User:', user.data);

      // POST request
      const result = await post('/api/users', {
        name: 'John',
        email: 'john@example.com'
      });

      // Actualizar UI
      this.setData({
        user: user.data,
        saveResult: result.data
      });
    } catch (error) {
      console.error('API Error:', error.message);
      my.showToast({
        type: 'fail',
        content: error.message
      });
    }
  }
});
```

---

## 🔧 Comandos Disponibles

```bash
# Setup inicial (una sola vez)
npm run init-cli

# Desarrollo - Preview en dispositivo
npm run preview

# Desarrollo - Servidor local sin dispositivo
npm run dev:local

# Publicar versión
npm run upload

# Info de versión del CLI
miniprogram-cli --version

# Logs de desarrollo
miniprogram-cli logs
```

---

## 🖥️ Servidor de Desarrollo Local

Si esperas la aprobación de Alipay Platform o prefieres desarrollar sin dispositivo físico, puedes usar el servidor local:

### Uso Básico

```bash
npm run dev:local
```

### Requisitos

1. **Credenciales de Alipay Platform aprobadas**
   - Tu aplicación debe estar completamente aprobada (no "Under Review")
   - Ve a https://open.alipay.com/ para verificar el estado

2. **Inicializar miniprogram-cli** (una sola vez)
   ```bash
   miniprogram-cli init
   # Te pedirá:
   # - WORKSPACE_ID
   # - SUPER_APP_ID
   # - MINI_PROGRAM_ID
   # - CLI_ACCESS_KEY_ID
   # - CLI_SECRET_ACCESS_KEY
   ```

### Qué hace `npm run dev:local`

1. **Levanta servidor Express** en `http://localhost:3000`
2. **Compila el mini program** automáticamente
3. **Expone endpoints de debugging:**
   ```
   GET /packageInfoV2.json
   GET /packageInfo.json
   GET /debugInfo.json
   GET /compile-page
   ```
4. **Soporta HMR** — cambios en código se reflejan automáticamente

### Conectar el Alipay IDE

Una vez que el servidor local está corriendo, puedes conectar el **Alipay Developer IDE** (si está disponible en tu plataforma) para visualizar cambios en tiempo real:

```bash
# Terminal 1
npm run dev:local
# Servidor en http://localhost:3000

# Terminal 2 (opcional - monitorear cambios)
npm test:watch
```

### Diferencias: `npm run preview` vs `npm run dev:local`

| Comando | Requiere | QR | Dispositivo | Servidor Local |
|---|---|---|---|---|
| `npm run preview` | Credenciales aprobadas | ✅ Genera | ✅ Requiere | ❌ No |
| `npm run dev:local` | Credenciales aprobadas | ❌ No | ❌ No | ✅ Sí |

### Troubleshooting

**Error: "accessKey is not configured"**
```bash
# Solución: Inicializar CLI con credenciales reales
miniprogram-cli init
```

**Error: "WORKSPACE_ID not found"**
```bash
# Verifica que miniprogram-cli init se ejecutó completamente
# Revisa: ~/.miniprogram-cli/settings.json
cat ~/.miniprogram-cli/settings.json
```

---

## ✅ Validaciones y Tests

Ejecutar validaciones:

```bash
# (Tests implementados en agents/testing/)
# python3 agents/testing/run_tests.py
```

Expected output:
```
Running Phase 1: File Structure Tests...
✓ 11/11 tests passed

Running Phase 2: Syntax Validation Tests...
✓ 6/6 tests passed

...

Coverage: 80%+
```

---

## 🐛 Troubleshooting

### Problema: "miniprogram-cli: command not found"

```bash
# Solución 1: Instalar globalmente
npm install -g @alipay/miniprogram-cli

# Solución 2: Verificar instalación
which miniprogram-cli
miniprogram-cli --version
```

### Problema: "No se genera QR en preview"

```bash
# Verificar que miniprogram-cli está inicializado
miniprogram-cli init  # Te pide credenciales

# Verificar .env está completo
grep "WORKSPACE_ID=" .env | grep -v "your_"

# Si sigue fallando, logs detallados
miniprogram-cli preview --debug
```

### Problema: "Error de autenticación"

```bash
# Verificar Access Key ID y Secret
# Ve a: Mini Program Platform → Settings → API Credentials

# Reinicializar CLI
miniprogram-cli init
# Te pide entrar credenciales de nuevo

# Verificar variables en .env
cat .env
```

### Problema: "Los cambios no se reflejan en el dispositivo"

```bash
# 1. Verificar que preview está corriendo
#    (debería estar activo en terminal)

# 2. Recargar en el dispositivo
#    (swipe down o menu de Alipay)

# 3. Si sigue, matar y reiniciar preview
npm run preview  # Ctrl+C para salir
npm run preview  # Reiniciar
```

### Problema: ".env fue commiteado accidentalmente"

```bash
# Remover del git pero mantener en disco
git rm --cached .env
git commit -m "Remove .env from tracking"

# Verificar .gitignore lo tiene
grep ".env" .gitignore
```

---

## 📖 Documentación Adicional

- **[CLAUDE.md](./CLAUDE.md)** - Guía técnica detallada del framework
- **[Alipay Official Docs](https://open.alipay.com/)** - Documentación oficial
- **[API Reference](https://open.alipay.com/doc/mini-program/api-reference)** - APIs disponibles
- **[Component Gallery](https://open.alipay.com/doc/mini-program/components)** - Componentes UI

---

## 🎯 Próximos Pasos

1. ✅ Setup completado
2. ✅ Preview en dispositivo funciona
3. **📝 Crear tu primera página**
   ```bash
   # Edita: my-miniapp/pages/index/index.axml
   # para cambiar el contenido
   ```
4. **🔌 Conectar a tu API**
   ```bash
   # Edita: my-miniapp/utils/api.js
   # Para cambiar la URL base
   ```
5. **🚀 Publicar versión**
   ```bash
   npm run upload
   ```

---

## 📞 Support

Si encuentras problemas:
1. Revisa [CLAUDE.md](./CLAUDE.md) - Sección "Lo que NO existe"
2. Consulta [Troubleshooting](#-troubleshooting) arriba
3. Verifica [Alipay Official Docs](https://open.alipay.com/)

---

**Última actualización:** 2026-03-28
**Versión:** 1.0.0
**Status:** ✅ Listo para desarrollo
