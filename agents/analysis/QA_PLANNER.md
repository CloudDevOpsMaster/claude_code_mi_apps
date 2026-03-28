# Plan de QA — Alipay+ Mini Programs Development Setup
**Fecha:** 2026-03-28
**QA Engineer:** Senior QA
**Cobertura objetivo:** 80%

---

## 1. Análisis de Tests Existentes

**Estado actual:** ✗ No hay tests existentes
**Razón:** Proyecto en fase inicial de setup — los tests se crearán junto con los artefactos

### Configuración esperada para testing:
- **Framework:** pytest (Python) O jest (JavaScript)
- **Config:** conftest.py (si existe) con sys.modules patches
- **Mocks:** Considerar patches a Node.js APIs, CLI invocations, file system

---

## 2. Artefactos a Validar (según PROMPT_SETUP_MINIPROGRAM.md)

### 2.1 Estructura de Archivos y Directorios

| Artefacto | Tipo | Criterio de Validación |
|-----------|------|--------------------------|
| `my-miniapp/` | directorio | Existe y tiene permisos 755 |
| `app.js` | archivo | Contiene lifecycle hooks válidos (onLaunch, onShow, onHide, onError) |
| `app.json` | archivo JSON | JSON válido con `pages`, `window` |
| `app.acss` | archivo CSS | Sintaxis CSS válida |
| `mini.project.json` | archivo JSON | JSON válido con configuración del proyecto |
| `pages/index/index.{js,axml,acss,json}` | 4 archivos | Cada uno existe y es válido |
| `components/` | directorio | Existe (puede estar vacío) |
| `utils/api.js` | archivo JS | Exporta función wrapper de `my.request` con Promise |
| `assets/` | directorio | Existe (puede estar vacío) |
| `.env.example` | archivo | Contiene todas las variables requeridas |
| `package.json` | archivo JSON | Scripts npm correctos |
| `scripts/init-dev.sh` | archivo bash | Ejecutable, contiene validaciones |
| `CLAUDE.md` | archivo markdown | Contiene todas las secciones documentadas |
| `README.md` | archivo markdown | Contiene pasos de setup reproducibles |

### 2.2 Contenido Esperado en Archivos Clave

#### `app.js` - Lifecycle y Globals
```javascript
✓ Page({...})
✓ onLaunch() {}
✓ onShow() {}
✓ onHide() {}
✓ onError(e) {}
✓ this.setData() (no this.data = value)
```

#### `pages/index/index.js` - Page Logic
```javascript
✓ Page({...})
✓ data: {...}
✓ onLoad() {}
✓ onReady() {}
✓ onShow() {}
✓ onHide() {}
✓ Métodos de evento: onTap(), onChange(), etc.
✓ this.setData() para mutations
```

#### `pages/index/index.axml` - Markup Template
```axml
✓ <view>, <text>, <button>, <image>, <scroll-view> (no <div>, <span>, <h1>)
✓ {{variable}} para data binding
✓ a:if={{condition}} para condicionales
✓ a:for={{items}} para loops (con {{item}}, {{index}})
✓ onTap="methodName" para eventos
```

#### `pages/index/index.acss` - Responsive Styles
```css
✓ Sintaxis CSS válida
✓ Uso de rpx (responsive pixels)
✓ NO media queries estándar CSS (usa rpx en lugar de px)
```

#### `utils/api.js` - HTTP Wrapper
```javascript
✓ Export default o named export
✓ Función que acepta config object {url, method, data, ...}
✓ Retorna una Promise (no callback-based my.request)
✓ Maneja success/fail internamente
✓ Error handling coherente
```

#### `package.json` - Scripts npm
```json
✓ "preview": comando con miniprogram-cli preview
✓ "upload": comando con miniprogram-cli upload
✓ "init-cli": inicialización de CLI
✓ Todas las variables de entorno en scripts
```

#### `scripts/init-dev.sh` - Inicialización
```bash
✓ Shebang correcto (#!/bin/bash)
✓ Permiso ejecutable (chmod +x)
✓ Verificar Node.js version >= 18
✓ Verificar npm disponible
✓ Verificar git disponible
✓ Verificar miniprogram-cli instalado
✓ Prompts claros para Access Token
✓ Validación de connection con plataforma
✓ Configuración de .env
```

#### `.env.example` - Variables Documentadas
```
✓ WORKSPACE_ID=<descripción>
✓ SUPER_APP_ID=<descripción>
✓ MINI_PROGRAM_ID=<descripción>
✓ CLI_ACCESS_KEY_ID=<descripción>
✓ CLI_SECRET_ACCESS_KEY=<descripción>
```

#### `CLAUDE.md` - Documentación para Claude Code
```markdown
✓ Sección: Framework Overview (NO es React/Vue)
✓ Sección: Syntax Rules (axml, acss, setData, onTap)
✓ Sección: Platform Conventions (my.request, my.navigateTo, rpx)
✓ Sección: What Doesn't Exist (document, window, localStorage, fetch)
✓ Sección: File Structure & Conventions
✓ Sección: Available Commands
```

#### `README.md` - Quick Start
```markdown
✓ Prerequisites section
✓ Installation steps (clone → install → init CLI → preview)
✓ Daily workflow with claude-iterative
✓ Common troubleshooting
```

---

## 3. Casos de Prueba por Categoría

### 3.1 Unit Tests — Validación de Archivos

#### Grupo: File Existence & Structure
```
✓ test_all_required_directories_exist()
✓ test_all_required_files_exist()
✓ test_app_js_contains_page_definition()
✓ test_app_json_is_valid_json()
✓ test_app_json_has_required_fields(pages, window)
✓ test_mini_project_json_is_valid_json()
✓ test_index_page_directory_structure()
✓ test_components_directory_exists()
✓ test_assets_directory_exists()
✓ test_utils_directory_exists()
✓ test_api_js_exists_in_utils()
```

#### Grupo: File Syntax Validation
```
✓ test_app_js_valid_javascript_syntax()
✓ test_index_js_valid_javascript_syntax()
✓ test_index_axml_valid_axml_syntax()
  - Regex: <view>, <text>, <button>, <image>, <scroll-view>
  - NO HTML tags: <div>, <span>, <h1>, etc.
✓ test_index_acss_valid_css_syntax()
  - Regex: \b\d+rpx\b (at least one rpx usage)
✓ test_page_json_valid_json()
✓ test_env_example_format_valid()
```

#### Grupo: Code Pattern Validation
```
✓ test_app_js_has_lifecycle_hooks()
  - Assertions: onLaunch, onShow, onHide, onError defined
✓ test_index_js_uses_setdata_not_direct_mutation()
  - Regex: this.setData({...})
  - NOT: this.data.key = value
✓ test_index_axml_no_html_bindings()
  - NOT: onClick, onChange (should use onTap, onChange)
  - Check: {{variable}}, a:if, a:for
✓ test_api_js_exports_function()
  - Check: module.exports OR export default OR export const
✓ test_api_js_handles_promises()
  - Look for: Promise, async/await, .then()
```

### 3.2 Integration Tests — Configuration & Scripts

#### Grupo: Package.json Configuración
```
✓ test_package_json_has_preview_script()
  - miniprogram-cli preview in command
✓ test_package_json_has_upload_script()
  - miniprogram-cli upload in command
✓ test_package_json_has_init_cli_script()
✓ test_scripts_use_env_variables()
  - Check: ${WORKSPACE_ID}, ${SUPER_APP_ID}, etc.
```

#### Grupo: Shell Scripts
```
✓ test_init_dev_sh_is_executable()
✓ test_init_dev_sh_has_bash_shebang()
✓ test_init_dev_sh_has_prerequisite_checks()
  - Assertions: node version, npm, git, miniprogram-cli
✓ test_init_dev_sh_has_env_configuration()
✓ test_init_dev_sh_has_user_prompts()
✓ test_init_dev_sh_exit_codes_on_failure()
```

#### Grupo: Documentation
```
✓ test_claude_md_exists()
✓ test_claude_md_has_framework_description()
✓ test_claude_md_has_syntax_rules()
✓ test_claude_md_has_platform_conventions()
✓ test_claude_md_has_what_doesnt_exist_section()
✓ test_claude_md_has_file_structure_section()
✓ test_readme_md_exists()
✓ test_readme_md_has_prerequisites()
✓ test_readme_md_has_installation_steps()
✓ test_readme_md_has_troubleshooting()
```

### 3.3 Functional Tests — Code Behavior

#### Grupo: app.js Behavior
```
✓ test_app_js_can_be_required()
✓ test_app_lifecycle_hooks_callable()
✓ test_app_onLaunch_defined()
✓ test_app_onError_handles_error_param()
```

#### Grupo: index.js (Page) Behavior
```
✓ test_index_page_can_be_required()
✓ test_index_page_has_data_object()
✓ test_index_page_lifecycle_hooks_defined()
✓ test_index_page_has_event_handlers()
✓ test_setdata_mutation_pattern()
```

#### Grupo: api.js (HTTP Wrapper)
```
✓ test_api_wrapper_is_module()
✓ test_api_wrapper_accepts_config_object()
✓ test_api_wrapper_returns_promise()
✓ test_api_wrapper_handles_url_param()
✓ test_api_wrapper_handles_method_param()
✓ test_api_wrapper_handles_data_param()
✓ test_api_wrapper_error_handling()
  - Simula my.request failure
  - Verifica Promise rejection
```

#### Grupo: Markup Templates
```
✓ test_index_axml_renders_text_element()
✓ test_index_axml_has_button_with_ontap()
✓ test_index_axml_data_binding_syntax_{{var}}()
✓ test_index_axml_conditional_a_if_syntax()
✓ test_index_axml_loop_a_for_syntax()
```

#### Grupo: Styles Responsiveness
```
✓ test_index_acss_has_rpx_units()
✓ test_index_acss_no_px_media_queries()
✓ test_app_acss_has_base_styles()
```

---

## 4. Edge Cases & Expected Errors

### 4.1 Missing Dependencies
```
test_missing_package_json_script()
  → Should fail: init-dev.sh cannot run npm commands
  → Expected error: Command not found or script undefined

test_missing_env_variables()
  → Should fail: scripts/init-dev.sh stops and asks user
  → Expected error: "WORKSPACE_ID not set"

test_missing_miniprogram_cli()
  → Should fail: npm scripts won't execute
  → Expected error: "miniprogram-cli: command not found"
```

### 4.2 Invalid Configurations
```
test_invalid_json_in_app_json()
  → Should fail parsing
  → Expected error: JSON syntax error

test_invalid_json_in_package_json()
  → Should fail parsing
  → Expected error: JSON syntax error

test_malformed_axml_syntax()
  → Should validate: no closing tags, invalid nesting
  → Expected error: Regex validation fails

test_setdata_direct_mutation_detected()
  → Should flag: this.data.key = value (anti-pattern)
  → Expected error: Validation rule violation
```

### 4.3 Permission & Execution Issues
```
test_init_dev_sh_not_executable()
  → Should fail: bash scripts/init-dev.sh
  → Expected error: Permission denied

test_init_dev_sh_missing_shebang()
  → Should fail: cannot execute as shell script
  → Expected error: Shebang missing

test_init_dev_sh_prerequisite_fails()
  → Node.js version < 18
  → Expected error: "Node.js 18+ required, found X.Y.Z"
```

### 4.4 Integration Issues
```
test_init_dev_sh_access_token_invalid()
  → Simula token inválido
  → Expected error: "Authentication failed" or timeout

test_cli_preview_without_env()
  → npm run preview sin .env
  → Expected error: "WORKSPACE_ID required"

test_api_js_my_request_undefined()
  → my.request no disponible (no está en my global)
  → Expected error: Graceful fallback o error claro
```

---

## 5. Mocking Strategy

### 5.1 Module Patches (conftest.py o jest.setup.js)

```python
# For Node.js fs module
patch('fs.existsSync') → True/False
patch('fs.readdirSync') → [expected files]
patch('fs.readFileSync') → file contents

# For Node.js path module
patch('path.join') → expected paths
patch('path.resolve') → expected absolute paths

# For shell commands (subprocess)
patch('subprocess.run') → Command output
patch('subprocess.check_output') → Command return value

# For npm/CLI commands
patch('subprocess.Popen') → Mock miniprogram-cli invocation
```

### 5.2 my.request Mock (for api.js tests)
```javascript
// Mock the global my object
global.my = {
  request: jest.fn((config) => {
    if (config.url.includes('success')) {
      config.success({ data: {...} });
    } else {
      config.fail(new Error('Network error'));
    }
  })
};
```

### 5.3 File System Mocks
```python
# Use pytest-mock or unittest.mock
@patch('os.path.exists')
@patch('builtins.open', new_callable=mock_open)
def test_file_operations(mock_file, mock_exists):
    mock_exists.return_value = True
    mock_file.return_value.read.return_value = '{"valid": "json"}'
    # Test code here
```

### 5.4 CLI/subprocess Mocks
```python
@patch('subprocess.check_output')
def test_miniprogram_cli_installed(mock_check_output):
    mock_check_output.return_value = b'miniprogram-cli 1.0.0'
    # Assert CLI version detection works
```

### 5.5 Environment Variable Patches
```python
@patch.dict(os.environ, {
    'WORKSPACE_ID': 'test-workspace',
    'CLI_ACCESS_KEY_ID': 'test-key',
    'CLI_SECRET_ACCESS_KEY': 'test-secret'
})
def test_env_setup(self):
    # Test code using env vars
```

---

## 6. Test Execution Plan

### 6.1 Phase 1: File Structure Validation (Unit Tests)
- **Scope:** Existence, format, syntax validation
- **Expected pass rate:** 100% after file creation
- **Time:** ~5 min execution

### 6.2 Phase 2: Configuration & Scripts (Integration Tests)
- **Scope:** package.json, shell scripts, env setup
- **Expected pass rate:** 100% after scripts written
- **Time:** ~10 min execution

### 6.3 Phase 3: Code Behavior (Functional Tests)
- **Scope:** Lifecycle hooks, data mutations, event handlers
- **Expected pass rate:** 100% after page/app logic implemented
- **Time:** ~15 min execution

### 6.4 Phase 4: API Wrapper (Unit + Integration)
- **Scope:** my.request wrapper, Promise behavior, error handling
- **Expected pass rate:** 100% after api.js complete
- **Time:** ~10 min execution

---

## 7. Coverage Strategy for 80% Target

### 7.1 Lines to Cover
| Component | Target Lines | Est. Coverage |
|-----------|-------------|---|
| app.js | 15-20 | 85% |
| pages/index/index.js | 25-30 | 90% |
| utils/api.js | 20-25 | 95% |
| scripts/init-dev.sh | 40-50 | 75% (bash harder to test) |
| **Total** | **100-125** | **80%+** |

### 7.2 Lines NOT to Cover
- Comments and docstrings
- Shebang lines
- Empty lines
- Mock setup code
- Error paths that are unlikely to execute (e.g., "file not found on a file we just created")

### 7.3 Coverage Measurement
```bash
# JavaScript (Jest)
jest --coverage --collectCoverageFrom='**/*.js'

# Bash (kcov or shunit2)
bash -x scripts/init-dev.sh 2>&1 | tee coverage.log
```

---

## 8. Success Criteria

| Criterio | Validación |
|----------|-----------|
| ✓ 80% coverage achieved | `coverage report >= 80%` |
| ✓ All acceptance criteria tests pass | 9/9 acceptance criteria validated |
| ✓ No security issues in code | No hardcoded secrets, safe file handling |
| ✓ Shell scripts executable | `chmod +x` verified |
| ✓ Documentation complete | All 5 CLAUDE.md sections present |
| ✓ Example page functional | index page renders counter or hello world |
| ✓ API wrapper tested | Promise-based my.request wrapper works |

---

## 9. Known Dependencies & Constraints

### 9.1 Environment Assumptions
- Node.js 18+ available
- npm 8+ available
- Bash 4+ available
- git available
- miniprogram-cli will be installed via npm

### 9.2 Mock Requirements
From `conftest.py` (if used):
- sys.modules patches for Node.js module simulation
- subprocess patches for shell command execution
- fs module patches for file operations

### 9.3 Testing Frameworks
- **JavaScript tests:** Jest + @testing-library (if needed)
- **Bash scripts:** bats-core or manual test harness
- **File validation:** Custom regex patterns or schema validators

---

## 10. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| miniprogram-cli not installed during test | HIGH | Mock or use docker container |
| my.request API differs from mock | MEDIUM | Use official documentation as source of truth |
| Bash script portability (macOS vs Linux) | LOW | Test on both, use POSIX features only |
| JSON validation too strict | MEDIUM | Validate against official Alipay schema if available |
| rpx unit recognition in CSS | MEDIUM | Regex pattern + manual review |

---

## 11. Next Steps

1. **Create test files** based on this plan
2. **Implement mocks** for fs, subprocess, my.request
3. **Run Phase 1** (file structure) after initial file creation
4. **Run Phase 2** (config) after package.json and scripts
5. **Run Phase 3** (behavior) after app.js, pages, utils
6. **Run Phase 4** (api.js) after wrapper implementation
7. **Report coverage** and iterate until 80%

---

**Plan creado:** 2026-03-28
**Estado:** ✓ Listo para ser revisado por QA Lead
**Próximo paso:** Aprobación de plan y creación de archivos de test
