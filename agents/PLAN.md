# PLAN UNIFICADO: Setup Alipay+ Mini Programs (80% Coverage)

**Fecha:** 2026-03-28
**Tech Lead:** Synthesizer
**Cobertura Objetivo:** 80%+
**Estado:** ✅ Aprobado para implementación

---

## SÍNTESIS EJECUTIVA

### Objetivo Unificado
Configurar un ambiente de desarrollo **completo y funcional** para Alipay+ Mini Programs en Linux, con:
- ✅ Estructura de proyecto estándar validada
- ✅ CLI inicializado y testeable
- ✅ Documentación exhaustiva para Claude Code
- ✅ Scripts automatizados de setup
- ✅ Cobertura de pruebas ≥ 80%

### Complejidad: **MEDIA-ALTA**
- 20+ archivos a crear
- 5-6 directorios nuevos
- 3 niveles de validación (estructura, scripts, funcionalidad)
- Dependencias en CLI externo (miniprogram-cli)

### Duración Estimada: **2-3 horas de implementación**

---

## 1️⃣ SÍNTESIS DE ANÁLISIS

### 1.1 ANALYST — Mapeo del Ecosistema ✅

**Hallazgos clave:**

| Aspecto | Resultado |
|---------|-----------|
| **Módulos afectados** | 25-30 artefactos (raíz + my-miniapp/) |
| **Complejidad por área** | CLI (90%), Estructura (95%), Scripts (85%), Docs (80%), Code (75%) |
| **Riesgos críticos** | Exposición de credenciales, CLI externo, divergencia framework |
| **Cobertura esperada** | 80%+ viable con mitigaciones |

**Riesgos principales a mitigar:**
1. 🔴 **CRÍTICO:** .env con credenciales → Mitigar con `.gitignore` + docs
2. 🔴 **CRÍTICO:** miniprogram-cli externo → Mitigar con error handling en init-dev.sh
3. 🟡 **MODERADO:** Confusión framework vs web estándar → Mitigar con CLAUDE.md exhaustivo

---

### 1.2 ARCHITECT — Diseño de Estructura ✅

**Decisiones de arquitectura:**

| Decisión | Opción Elegida | Justificación |
|----------|---|---|
| Ubicación my-miniapp | `./my-miniapp/` (subdirectorio) | Permite múltiples apps en future |
| package.json | Dos archivos (raíz + my-miniapp) | Separación clara de concerns |
| Ejemplo inicial | Minimal + comments | Contador simple + API call |
| Validaciones en init-dev.sh | Todas 5 (node, npm, git, CLI, token) | Máxima robustez |

**Estructura final:**
```
/home/dev/Repos/claude_code_mi_apps/
├── package.json                    ← Workflow CLI
├── CLAUDE.md                       ← Contexto para IA
├── README.md                       ← Setup quick start
├── .env.example                    ← Variables documentadas
├── .gitignore                      ← Incluye .env, node_modules
├── mini.project.json               ← Config raíz
├── scripts/
│   └── init-dev.sh                ← Setup automatizado
└── my-miniapp/                     ← MINI PROGRAM REAL
    ├── package.json                ← Deps de app
    ├── app.js                      ← Lifecycle global
    ├── app.json                    ← Configuración global
    ├── app.acss                    ← Estilos base
    ├── mini.project.json           ← Config miniapp
    ├── pages/
    │   └── index/
    │       ├── index.js            ← Page logic
    │       ├── index.axml          ← Markup
    │       ├── index.acss          ← Estilos
    │       └── index.json          ← Config página
    ├── components/                 ← Custom components (dir)
    ├── utils/
    │   └── api.js                  ← my.request wrapper
    └── assets/                     ← Recursos (dir)
```

---

### 1.3 QA_PLANNER — Estrategia de Validación ✅

**Pirámide de tests (80% coverage):**

| Nivel | Tests | Cobertura |
|-------|-------|-----------|
| **Unit** | 35+ | Estructura, sintaxis, patrones |
| **Integration** | 20+ | Scripts, env, package.json |
| **Functional** | 15+ | Lifecycle, API wrapper, markup |
| **E2E** | Manual | Device real con Alipay+ |

**Áreas de validación:**
- ✓ Existence & structure (11 tests)
- ✓ Syntax validation (6 tests)
- ✓ Code patterns (7 tests)
- ✓ Configuration (7 tests)
- ✓ Shell scripts (6 tests)
- ✓ Documentation (8 tests)
- ✓ Code behavior (15 tests)

---

## 2️⃣ PLAN DE IMPLEMENTACIÓN

### FASE 1: Artefactos Fundamentales (30 min)

**Orden crítico:** Crear directorios y archivos de configuración.

| Paso | Artefacto | Comando de Validación |
|------|-----------|----------------------|
| 1.1 | Crear directorios | `find my-miniapp -type d \| wc -l` → 6 dirs |
| 1.2 | `.gitignore` | `grep ".env" .gitignore` ✓ |
| 1.3 | `package.json` (raíz) | `jq .scripts package.json` → preview, upload, init-cli |
| 1.4 | `.env.example` | `grep WORKSPACE_ID .env.example` ✓ |
| 1.5 | `mini.project.json` (raíz) | `jq .projectId mini.project.json` ✓ |

**Validación:** Estructura + JSON válido

---

### FASE 2: Código de la App (45 min)

**Orden:** Lógica → Markup → Estilos → Config

| Paso | Artefacto | Criterio de Éxito |
|------|-----------|-------------------|
| 2.1 | `my-miniapp/app.js` | Lifecycle: onLaunch, onShow, onHide, onError |
| 2.2 | `my-miniapp/app.json` | JSON válido + pages array |
| 2.3 | `my-miniapp/app.acss` | CSS válido |
| 2.4 | `my-miniapp/pages/index/index.js` | setData() pattern, event handlers |
| 2.5 | `my-miniapp/pages/index/index.axml` | No HTML, use `<view>`, `<text>`, `<button>` |
| 2.6 | `my-miniapp/pages/index/index.acss` | Contiene `rpx` units |
| 2.7 | `my-miniapp/pages/index/index.json` | JSON válido |
| 2.8 | `my-miniapp/utils/api.js` | Promise-based wrapper de my.request |

**Validación:** Sintaxis + patrones Alipay

---

### FASE 3: Automatización e Inicialización (30 min)

| Paso | Artefacto | Criterio de Éxito |
|------|-----------|-------------------|
| 3.1 | `scripts/init-dev.sh` | Ejecutable, contiene 5 validaciones |
| 3.2 | `my-miniapp/package.json` | Dependencias mínimas |

**Validación:** `chmod +x scripts/init-dev.sh && bash scripts/init-dev.sh --help`

---

### FASE 4: Documentación (30 min)

| Paso | Artefacto | Secciones Requeridas |
|------|-----------|----------------------|
| 4.1 | `CLAUDE.md` | 6 secciones (framework, syntax, conventions, what-doesn't-exist, file-structure, commands) |
| 4.2 | `README.md` | Prerequisites, steps, daily workflow, troubleshooting |

**Validación:** `wc -l CLAUDE.md README.md` → >300 líneas

---

### FASE 5: Validación & Tests (30 min)

| Paso | Validación | Pass Criteria |
|------|-----------|---------------|
| 5.1 | File structure tests | 11/11 tests pass |
| 5.2 | Syntax validation tests | 6/6 tests pass |
| 5.3 | Code pattern tests | 7/7 tests pass |
| 5.4 | Configuration tests | 7/7 tests pass |
| 5.5 | Shell script tests | 6/6 tests pass |
| 5.6 | Documentation tests | 8/8 tests pass |
| 5.7 | Code behavior tests | 15/15 tests pass |
| **TOTAL** | **Coverage measurement** | **≥ 80%** |

---

## 3️⃣ DEPENDENCIAS Y DECISIONES CRÍTICAS

### 3.1 Dependencias Externas

```
CRÍTICAS (bloquean si fallan):
├── miniprogram-cli (npm global)
├── Node.js 18+
├── npm 8+
└── git 2.20+

ESTÁNDAR:
├── dotenv (npm)
└── (ninguna otra requerida)
```

**Riesgo:** miniprogram-cli es package propietario de Alipay
- **Mitigación:** Script init-dev.sh con fallback a instrucciones manuales

### 3.2 Decisiones que Requieren Confirmación

#### ❓ D1: ¿Crear example de app funcional o minimal?
- **Opción A (Recomendada):** Contador + API call (funcional, educativo)
- **Opción B:** Solo hola mundo (minimal, rápido)

#### ❓ D2: ¿Incluir tests automatizados en este setup?
- **Opción A (Recomendada):** Sí, bash/python scripts para validación
- **Opción B:** Solo documentación de tests (manual)

#### ❓ D3: ¿Dos package.json o uno?
- **Opción A (Recomendada):** Dos (raíz + my-miniapp/) - separación clara
- **Opción B:** Solo en raíz - estructura más plana

---

## 4️⃣ CRITERIOS DE ACEPTACIÓN

### Aceptación Estructural ✅
- [ ] 6 directorios creados con estructura exacta
- [ ] 20+ archivos en lugar correcto
- [ ] .gitignore incluye .env, node_modules
- [ ] Todos los JSON válidos (validar con jq)

### Aceptación de Código ✅
- [ ] app.js tiene lifecycle hooks (onLaunch, onShow, onHide, onError)
- [ ] index.js usa this.setData() NO this.data.key = value
- [ ] index.axml usa <view>, <text>, <button> NO <div>, <span>
- [ ] index.acss contiene rpx units
- [ ] api.js exporta función que retorna Promise

### Aceptación de Scripts ✅
- [ ] scripts/init-dev.sh es ejecutable (chmod +x)
- [ ] init-dev.sh contiene 5 validaciones (node, npm, git, cli, token)
- [ ] package.json tiene scripts: preview, upload, init-cli

### Aceptación de Documentación ✅
- [ ] CLAUDE.md tiene 6 secciones y >300 líneas
- [ ] README.md tiene pasos reproducibles
- [ ] .env.example contiene todas variables documentadas

### Aceptación de Testing ✅
- [ ] Coverage report >= 80%
- [ ] 60+ tests totales (unit + integration)
- [ ] Cero hardcoded secrets en código
- [ ] Ejemplo de app funcional (contador o hello world)

---

## 5️⃣ ORDEN DE IMPLEMENTACIÓN PRECISO

### Orden Crítico (respeta dependencias):

```
1. Crear directorio structure (mkdir -p)
   ↓
2. package.json + .gitignore + mini.project.json (raíz)
   ↓
3. app.js + app.json + app.acss (my-miniapp/)
   ↓
4. pages/index/* (4 archivos: .js, .axml, .acss, .json)
   ↓
5. utils/api.js
   ↓
6. scripts/init-dev.sh + my-miniapp/package.json
   ↓
7. CLAUDE.md + README.md + .env.example
   ↓
8. Validación final + tests
```

**NO hacer en paralelo:**
- No crear pages/ antes de my-miniapp/ structure
- No escribir scripts antes de que package.json exista
- No validar código antes de que exista

---

## 6️⃣ MATRIZ DE RIESGOS

### Riesgos Críticos (Probability x Impact)

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|--------|-------|--------|-----------|
| 1 | `.env` commiteado (secretos expuestos) | ALTA | CRÍTICO | .gitignore + docs explícitas |
| 2 | miniprogram-cli no instala | MEDIA | ALTO | Error handling + fallback manual |
| 3 | Confusión framework vs web | MEDIA | MEDIO | CLAUDE.md exhaustivo + ejemplos |
| 4 | init-dev.sh incompatible (zsh/Windows) | BAJA | BAJO | Shebang #!/bin/bash + POSIX only |
| 5 | my.request API cambia en Alipay+ | BAJA | MEDIO | Documentar versión CLI en README |

### Plan de Mitigación por Riesgo

**R1 - Exposición de credenciales:**
```bash
✓ .gitignore: .env, *.key, .DS_Store
✓ .env.example: Solo placeholders sin valores reales
✓ CLAUDE.md: Sección de seguridad explícita
✓ init-dev.sh: Prompta usuario a entrar credenciales
```

**R2 - CLI externo falla:**
```bash
✓ init-dev.sh: Verifica miniprogram-cli --version
✓ Error handling: exit 1 con mensaje claro
✓ README: Link a documentación oficial Alipay
✓ Alternativa: Instrucciones de instalación manual
```

**R3 - Confusión de framework:**
```bash
✓ CLAUDE.md: Primera línea = "NO ES REACT/VUE"
✓ Ejemplos: Código funcional en index.axml y index.js
✓ Comentarios: Explican APIs propietarias
```

---

## 7️⃣ MÉTRICAS Y KPIs

### Cobertura Esperada

```
Módulo                 Target    Est. Real
────────────────────────────────────────
app.js                  85%        ✓
pages/index/index.js    90%        ✓
utils/api.js            95%        ✓
scripts/init-dev.sh     75%        ✓ (bash es difícil)
────────────────────────────────────────
TOTAL                   80%        ✓ Viable
```

### Tamaño de Cambio

| Métrica | Estimado |
|---------|----------|
| Archivos creados | 20+ |
| Directorios | 6 |
| Líneas de código | 200-250 |
| Líneas de docs | 400-500 |
| Líneas de tests | 300-400 |
| **Total diff** | ~1500 líneas |

---

## 8️⃣ PRÓXIMOS PASOS (PARA IMPLEMENTER)

### ✅ Fase 1: Setup (30 min)
1. Crear estructura de directorios
2. `package.json` + `.gitignore` + configs

### ✅ Fase 2: Core (45 min)
3. `app.js` + `app.json` + `app.acss`
4. Pages (index.js, index.axml, index.acss, index.json)
5. `utils/api.js`

### ✅ Fase 3: Automation (30 min)
6. `scripts/init-dev.sh` ejecutable
7. `my-miniapp/package.json`

### ✅ Fase 4: Documentation (30 min)
8. `CLAUDE.md` (6 secciones)
9. `README.md` (pasos reproducibles)
10. `.env.example` (variables documentadas)

### ✅ Fase 5: Validation (30 min)
11. Ejecutar validaciones (60+ tests)
12. Verificar coverage >= 80%
13. Commit con mensaje Conventional Commits

---

## 9️⃣ ROLES Y RESPONSABILIDADES

| Rol | Tarea | Validación |
|-----|-------|-----------|
| **IMPLEMENTER** | Crear todos los archivos en orden | Checklist Fase 1-4 |
| **TEST_WRITER** | Escribir tests de validación | 60+ tests pass, coverage >= 80% |
| **QA_LEAD** | Revisar estructura y código | Matches ANALYST + ARCHITECT specs |
| **TECH_LEAD** | Aprobar plan y tomar decisiones | Este documento |

---

## 🔟 APROBACIONES Y FIRMAS

### Decisiones Críticas Pendientes

❓ **D1:** ¿Example funcional (contador) o minimal (hello world)?
→ **Recomendación:** Contador (educativo, demuestra setData + API)

❓ **D2:** ¿Incluir tests automatizados ahora?
→ **Recomendación:** Sí, validación bash simple (rápido)

❓ **D3:** ¿Dos package.json?
→ **Recomendación:** Sí, separación clara (raíz = workflow, my-miniapp = app)

---

## CONCLUSIÓN

✅ **Tarea es VIABLE** con:
- ✓ 80%+ cobertura alcanzable
- ✓ Riesgos identificados y mitigados
- ✓ Arquitectura clara y escalable
- ✓ Documentación exhaustiva

**Estado:** Listo para que IMPLEMENTER comience.

**Siguientes pasos:**
1. Confirmación de decisiones D1, D2, D3
2. IMPLEMENTER crea archivos en orden de Fase 1-5
3. TEST_WRITER ejecuta validaciones
4. Commit y PR con mensaje Conventional Commits

---

**Plan finalizado:** 2026-03-28
**Versión:** 1.0 - LISTO PARA IMPLEMENTACIÓN
**Aprobación necesaria por:** Tech Lead / Product Manager
