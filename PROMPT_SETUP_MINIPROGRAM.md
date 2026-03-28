# Prompt: Setup Ambiente de Desarrollo — Alipay+ Mini Programs (Linux)

## Comando de ejecución

```bash
# Modo interactivo (recomendado para primer setup)
claude-iterative \
  -t "$(cat PROMPT_SETUP_MINIPROGRAM.md | tail -n +10)" \
  --type feature \
  --coverage 80

# Modo automático (sin pausas)
claude-iterative \
  -t "$(cat PROMPT_SETUP_MINIPROGRAM.md | tail -n +10)" \
  --type feature \
  --auto
```

O copiando directamente el task text:

```bash
claude-iterative \
  --type feature \
  --auto \
  -t "
Configurar el ambiente de desarrollo completo para Alipay+ Mini Programs en Linux.

CONTEXTO DEL SISTEMA:
- OS: Linux (Ubuntu/Debian o compatible)
- Runtime: Node.js 18+ ya instalado
- Herramienta de flujo: claude-iterative (este mismo workflow)
- Propósito: desarrollo de Alipay+ Mini Programs usando MiniProgram CLI (sin IDE gráfico)
- Preview: dispositivo real via QR code en terminal

ALCANCE DEL SETUP — implementar todo lo siguiente:

1. INSTALACIÓN DEL CLI
   - Instalar miniprogram-cli globalmente via npm
   - Verificar disponibilidad del comando apmp y miniprogram-cli
   - Script de verificación de prerequisitos (node version, npm, git)

2. ESTRUCTURA DEL PROYECTO
   Crear la estructura estándar de un Alipay+ Mini Program:
   my-miniapp/
   ├── app.js           # App lifecycle + globals
   ├── app.json         # Configuración global (pages, window)
   ├── app.acss         # Estilos globales
   ├── mini.project.json
   ├── pages/
   │   └── index/
   │       ├── index.js     # Page logic con lifecycle completo
   │       ├── index.axml   # Markup con ejemplo funcional
   │       ├── index.acss   # Estilos con rpx
   │       └── index.json   # Config de página
   ├── components/          # Directorio para custom components
   ├── utils/
   │   └── api.js           # Wrapper de my.request como Promise
   ├── assets/
   └── .env.example         # Variables de entorno requeridas

3. CONFIGURACIÓN DE PACKAGE.JSON
   Scripts npm para el workflow diario:
   - preview: miniprogram-cli preview con variables de entorno
   - upload: miniprogram-cli upload
   - init-cli: inicialización del CLI con access token

4. ARCHIVO CLAUDE.md
   Crear CLAUDE.md en la raíz con contexto completo para Claude Code:
   - Descripción del framework (NO es React/Vue, es Alipay+ propio)
   - Reglas de sintaxis: axml, acss, setData, onTap, a:for, a:if
   - Convenciones de la plataforma: my.request, my.navigateTo, rpx
   - Lo que NO existe: document, window, localStorage, fetch, axios
   - Estructura de archivos y convenciones del proyecto
   - Comandos disponibles (npm run preview, npm run upload)

5. SCRIPT DE INICIALIZACIÓN CLI
   Crear scripts/init-dev.sh que:
   - Verifique prerequisitos (node, npm, git, miniprogram-cli)
   - Guíe al usuario a obtener Access Token desde Mini Program Platform
   - Ejecute miniprogram-cli init con prompts claros
   - Configure variables de entorno en .env
   - Valide la conexión con la plataforma

6. ARCHIVO .env.example
   Con todas las variables necesarias documentadas:
   - WORKSPACE_ID
   - SUPER_APP_ID
   - MINI_PROGRAM_ID
   - CLI_ACCESS_KEY_ID
   - CLI_SECRET_ACCESS_KEY

7. README.md DEL PROYECTO
   Documentación de inicio rápido incluyendo:
   - Prerequisitos
   - Pasos de configuración (clonar → instalar → init CLI → preview)
   - Flujo de trabajo diario con claude-iterative
   - Troubleshooting común

REGLAS TÉCNICAS DEL FRAMEWORK (para que los agentes las conozcan):
- .axml usa <view> <text> <button> <image> <scroll-view> (no HTML estándar)
- Estado: this.setData({ key: value }) NUNCA this.data.key = value
- Eventos: onTap (no onClick), onChange, onInput
- Template: {{variable}}, a:if={{cond}}, a:for={{items}} con {{item}} e {{index}}
- Unidad responsive: rpx (750rpx = ancho completo de pantalla)
- HTTP: my.request({ url, method, data, success, fail }) — no fetch ni axios
- Navegación: my.navigateTo({ url: '/pages/name/name' })
- No existe document, window, localStorage, sessionStorage
- Módulos: import/export ES2015 o require() — no CDNs externos

CRITERIOS DE ACEPTACIÓN:
- [ ] miniprogram-cli instalado y verificable con --version
- [ ] Estructura de proyecto creada y válida para la plataforma
- [ ] CLAUDE.md completo y usable como contexto para Claude Code
- [ ] package.json con scripts npm funcionales
- [ ] scripts/init-dev.sh ejecutable y con instrucciones claras
- [ ] .env.example con todas las variables documentadas
- [ ] README.md con pasos reproducibles desde cero
- [ ] utils/api.js con wrapper de my.request funcional
- [ ] La página index tiene un ejemplo funcional (al menos contador o hello world)
"
```

---

## Qué hacen los agentes con este prompt

```
FASE 0  →  Crea branch: feature/YYYYMMDD-alipayplus-dev-setup
     ↓
FASE 1  →  3 agentes en paralelo:
           ANALYST    — mapea el ecosistema, dependencias, riesgos del CLI
           ARCHITECT  — diseña estructura de archivos, convenciones, CLAUDE.md
           QA_PLANNER — define cómo validar que el setup funciona
     ↓
FASE 2  →  SYNTHESIZER genera PLAN.md unificado con pasos concretos
     ↓
FASE 3  →  IMPLEMENTER crea todos los archivos
           TEST_WRITER valida prerequisitos y estructura
     ↓
FASE 4  →  INTEGRATOR verifica que todos los archivos existen y son válidos
     ↓
FASE 5  →  Commit automático con mensaje Conventional Commits
```

---

## Flags recomendados por escenario

| Escenario | Comando |
|---|---|
| Primera vez, quiero revisar cada fase | `--type feature` (sin `--auto`) |
| Setup rápido sin interrupciones | `--type feature --auto` |
| Ver el plan antes de ejecutar | `--type feature --dry-run` |
| Setup fue interrumpido | `--resume sess_YYYYMMDD-alipayplus-dev-setup` |
| Agregar agentes paralelos para velocidad | `--parallel-impl` |

---

## Después del setup

```bash
# 1. Copia y configura variables
cp .env.example .env
# edita .env con tus IDs reales

# 2. Inicializa el CLI con tu Access Token
bash scripts/init-dev.sh

# 3. Preview en tu dispositivo
npm run preview
# Escanea el QR con la app de Alipay+

# 4. Desarrollo continuo con Claude Code
claude
# > "agrega una página de listado de productos"
```
