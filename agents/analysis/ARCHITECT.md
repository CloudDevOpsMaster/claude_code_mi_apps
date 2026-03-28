# Arquitectura: claude-iterative (80% Test Coverage)

## Visión General

Sistema de orquestación de agentes IA multi-fase que ejecuta workflows automáticos.
**Objetivo**: 80% cobertura de código mediante arquitectura modular y testeable.

---

## 1. Patrón de Diseño

### Arquitectura Principal: **Pipeline de Fases + Factory Pattern**

```
┌─────────────────────────────────────────────────────┐
│         IterativeWorkflow (Orquestador)             │
│  - Coordina fases secuenciales/paralelas           │
│  - Gestiona estado y transiciones                  │
│  - Valida precondiciones/postcondiciones           │
└─────────────────────────────────────────────────────┘
           ↓        ↓        ↓        ↓
    ┌─────────┬─────────┬──────────┬──────────┐
    │         │         │          │          │
  PHASE-0   PHASE-1   PHASE-2   PHASE-3   PHASE-4
  (Setup)  (Parallel) (Synth)    (Build)   (Commit)
```

**Patrones aplicados**:
- **Pipeline**: Cada fase es una unidad independiente con entrada/salida clara
- **Factory**: `PhaseFactory` crea instancias de agentes según tipo
- **Strategy**: Cada agente implementa interfaz `Agent` con método `execute()`
- **Repository**: Almacena artefactos (prompts, tokens, salidas) de forma agnóstica
- **Builder**: `WorkflowBuilder` para configurar workflows complejos

---

## 2. Estructura de Módulos

```
claude_iterative/
├── core/
│   ├── workflow.py           # IterativeWorkflow (orquestador principal)
│   ├── phase.py              # Clase base Phase + fases concretas
│   ├── agent.py              # Interfaz Agent + agentes específicos
│   └── state_manager.py      # Estado compartido entre fases
│
├── agents/
│   ├── analyst.py            # ANALYST agent
│   ├── architect.py          # ARCHITECT agent
│   ├── implementer.py        # IMPLEMENTER agent
│   ├── test_writer.py        # TEST_WRITER agent
│   ├── synthesizer.py        # SYNTHESIZER agent
│   ├── committer.py          # COMMITTER agent
│   └── base.py               # Clase base para todos
│
├── execution/
│   ├── executor.py           # Ejecuta tareas (secuencial/paralelo)
│   ├── git_manager.py        # Operaciones Git
│   ├── file_manager.py       # Lectura/escritura de archivos
│   └── process_manager.py    # Ejecución de comandos shell
│
├── models/
│   ├── task.py               # TaskDefinition dataclass
│   ├── result.py             # PhaseResult dataclass
│   └── config.py             # WorkflowConfig dataclass
│
├── utils/
│   ├── logger.py             # Logging estructurado
│   ├── token_manager.py      # Gestión de tokens API
│   ├── validators.py         # Validadores de tareas/fases
│   └── enums.py              # PhaseType, AgentType, etc.
│
└── cli/
    ├── __main__.py           # Punto de entrada (claude-iterative)
    └── commands.py           # Subcomandos (init, run, resume, etc.)

tests/
├── unit/
│   ├── test_workflow.py      # Tests para orquestador
│   ├── test_phases.py        # Tests para cada fase
│   ├── test_agents.py        # Tests para agentes base
│   ├── test_state_manager.py # Tests para estado
│   └── test_validators.py    # Tests para validadores
│
├── integration/
│   ├── test_workflow_phases.py       # E2E: fase 0→5
│   ├── test_parallel_execution.py    # E2E: paralelismo
│   └── test_git_operations.py        # E2E: operaciones git
│
└── fixtures/
    ├── sample_tasks.py       # Tasks de prueba
    ├── mock_agents.py        # Agentes mock
    └── temp_repos.py         # Manejo de repos temporales
```

---

## 3. Interfaces Públicas

### 3.1 Clase Principal: `IterativeWorkflow`

```python
class IterativeWorkflow:
    """Orquestador de fases automáticas."""

    def __init__(self, config: WorkflowConfig):
        """Inicializa con configuración."""

    def execute(self, task: TaskDefinition) -> WorkflowResult:
        """Ejecuta workflow completo.

        Retorna resultado con todas las fases.
        Lanza WorkflowException si falla precondición.
        """

    def execute_phase(self, phase_name: str) -> PhaseResult:
        """Ejecuta una fase específica."""

    def resume(self, session_id: str) -> WorkflowResult:
        """Reanuda workflow interrumpido."""

    def validate_prerequisites(self, task: TaskDefinition) -> bool:
        """Valida que ambiente tenga todo lo requerido."""

    @property
    def current_phase(self) -> Phase:
        """Fase actual en ejecución."""

    @property
    def state(self) -> WorkflowState:
        """Estado global (tareas, decisiones, artefactos)."""
```

### 3.2 Interfaz Agent: `Agent`

```python
class Agent(ABC):
    """Agente IA ejecutable."""

    @abstractmethod
    async def execute(
        self,
        task: TaskDefinition,
        state: WorkflowState,
        prompt_template: str
    ) -> AgentResult:
        """
        Ejecuta acción del agente.

        Args:
            task: Definición de tarea
            state: Estado compartido con otros agentes
            prompt_template: Template de prompt del agente

        Returns:
            Resultado con salida IA y artefactos
        """

    def validate_output(self, output: str) -> bool:
        """Valida que output del agente sea válido."""

    @property
    def required_context(self) -> Set[str]:
        """Contexto que necesita del estado."""
```

### 3.3 Clase Phase: `Phase`

```python
class Phase(ABC):
    """Fase de ejecución."""

    @abstractmethod
    def execute(self, task: TaskDefinition, state: WorkflowState) -> PhaseResult:
        """Ejecuta lógica de la fase."""

    @property
    def name(self) -> str:
        """Nombre de la fase (ej: PHASE-1)."""

    @property
    def agents(self) -> List[Agent]:
        """Agentes que usa esta fase."""

    def can_execute(self, state: WorkflowState) -> bool:
        """Valida precondiciones."""
```

### 3.4 Modelos: `TaskDefinition` y `WorkflowResult`

```python
@dataclass
class TaskDefinition:
    """Define una tarea a ejecutar."""
    type: TaskType                    # feature, bugfix, refactor
    title: str
    description: str
    coverage_target: float = 0.8      # 0.0 a 1.0
    auto_mode: bool = False           # Sin pausas interactivas
    parallel_impl: bool = False       # Paralelizar fase 3

    def validate(self) -> bool:
        """Valida contenido."""

@dataclass
class WorkflowResult:
    """Resultado de ejecución."""
    success: bool
    phases: Dict[str, PhaseResult]
    artifacts: Dict[str, Any]        # Archivos creados, commits, etc.
    duration_seconds: float
    session_id: str                  # Para resume

    @property
    def code_coverage(self) -> float:
        """Cobertura lograda."""
```

### 3.5 Estado Compartido: `WorkflowState`

```python
class WorkflowState:
    """Estado mutable compartido entre fases."""

    def __init__(self):
        self._data: Dict[str, Any] = {}
        self._lock = asyncio.Lock()

    async def set(self, key: str, value: Any) -> None:
        """Set thread-safe."""

    async def get(self, key: str) -> Any:
        """Get thread-safe."""

    async def add_artifact(self, name: str, path: str) -> None:
        """Registra archivo generado."""

    def branch_name(self) -> str:
        """Genera nombre de rama."""

    def session_id(self) -> str:
        """ID de sesión para resumir."""
```

---

## 4. Decisiones de Diseño

### 4.1 Separación de Concerns
- **core/**: Lógica de orquestación, agnóstica de IA
- **agents/**: Implementación específica de cada agente
- **execution/**: Operaciones del sistema (git, archivos, procesos)
- **models/**: Estructuras de datos puras

**Beneficio**: Tests pueden mockear `execution` sin afectar `core`.

### 4.2 Async-First Architecture
- Fases paralelas (FASE-1: 3 agentes) ejecutan con `asyncio`
- Non-blocking I/O para git, archivos, APIs
- StateManager con locks para evitar race conditions

**Beneficio**: 3x más rápido en paralelo. Tests deterministas con `pytest-asyncio`.

### 4.3 Factory + Registry Pattern
```python
class PhaseFactory:
    _phases = {
        PhaseType.SETUP: PhaseSetup,
        PhaseType.PARALLEL: PhaseParallel,
        PhaseType.SYNTHESIS: PhaseSynthesis,
        ...
    }

    @classmethod
    def create(cls, phase_type: PhaseType) -> Phase:
        return cls._phases[phase_type]()
```

**Beneficio**: Fácil agregar nuevas fases. Tests pueden registrar fases mock.

### 4.4 Repository Pattern para Artefactos
```python
class ArtifactRepository:
    def save(self, artifact: Artifact) -> str:     # path
    def load(self, artifact_id: str) -> Artifact:
    def list_by_phase(self, phase: str) -> List[Artifact]:
```

**Beneficio**: Desacopla dónde se guardan artefactos (disco, S3, BD). Tests usan memoria.

### 4.5 Validadores Separados
```python
class TaskValidator:
    def validate_schema(self, task: TaskDefinition) -> List[ValidationError]

class PhaseValidator:
    def validate_preconditions(self, phase: Phase, state: WorkflowState) -> bool

class AgentValidator:
    def validate_output(self, output: str, agent_type: AgentType) -> bool
```

**Beneficio**: Lógica de validación testeable independiente. Reutilizable.

### Trade-offs

| Decisión | Pro | Con | Mitigación |
|----------|-----|-----|-----------|
| Async-first | Paralelismo real | Complejidad | Abstractos con `State.execute()` |
| Factory pattern | Extensible | Boilerplate | Decoradores para registro auto |
| Repository agnóstico | Flexible | Overhead | Cache in-memory |
| Dataclasses | Simple, tipado | Python 3.7+ | Requerido: 3.10+ |

---

## 5. Estrategia de Testeo (80% Coverage)

### 5.1 Pirámide de Tests

```
              📦 E2E Tests (5%)
         ▲ workflow completo + git real
        /─\
       /   \  🧪 Integration Tests (15%)
      /     \ fases 0→5, paralelismo,
     /───────\ git operations, file I/O
    /         \
   /           \  🧬 Unit Tests (80%)
  /─────────────\ clases, métodos,
 ╱               ╲ validadores
/                 \
───────────────────
  núcleo testeable
```

### 5.2 Cobertura por Módulo (80% global)

| Módulo | Target | Estrategia |
|--------|--------|-----------|
| `core/workflow.py` | 95% | Test todas las transiciones de fase |
| `core/phase.py` | 90% | Tests para precondiciones, postcondiciones |
| `core/agent.py` | 85% | Tests interface + agentes mock |
| `core/state_manager.py` | 100% | Tests race conditions con threading |
| `agents/analyst.py` | 75% | Mocks de API IA |
| `agents/architect.py` | 75% | Mocks de API IA |
| `execution/git_manager.py` | 80% | Tests en repo temporal |
| `execution/file_manager.py` | 85% | Tests con `tmp_path` fixture |
| `utils/validators.py` | 95% | Todos los casos de validación |
| `cli/commands.py` | 70% | Mocks de I/O, argparse testing |

**Total esperado**: ~82% de cobertura

### 5.3 Estructura de Tests

```python
# tests/unit/test_workflow.py
class TestIterativeWorkflow:
    @pytest.fixture
    def mock_state(self):
        return MagicMock(spec=WorkflowState)

    @pytest.fixture
    def workflow(self, mock_state):
        return IterativeWorkflow(config=WorkflowConfig())

    async def test_execute_phase_0_creates_branch(self, workflow):
        """Verifica que PHASE-0 crea rama feature/*"""

    async def test_execute_phase_1_runs_parallel(self, workflow):
        """Verifica que PHASE-1 ejecuta 3 agentes en paralelo"""

    async def test_resume_from_interrupted_session(self, workflow):
        """Verifica que resume() continúa desde último estado válido"""

# tests/integration/test_workflow_phases.py
@pytest.mark.integration
class TestWorkflowE2E:
    @pytest.fixture
    def temp_git_repo(self, tmp_path):
        """Repo temporal con git init"""

    async def test_phases_0_to_5_complete_successfully(self, temp_git_repo):
        """Verifica workflow completo sin intervención"""
```

---

## 6. Consideraciones de Implementación

### 6.1 Dependencias Externas (Minimizadas)
```
core:
  - dataclasses (stdlib)
  - asyncio (stdlib)

execution:
  - gitpython
  - pydantic (validación)

agents:
  - anthropic (SDK IA)

cli:
  - click / typer (CLI)

tests:
  - pytest
  - pytest-asyncio
  - pytest-cov
  - pytest-mock
```

### 6.2 Seguridad
- **Tokens**: Leer de env vars, nunca loguear
- **Comandos Git**: Sanitizar branch names con regex
- **APIs IA**: Timeout y rate limiting
- **Archivos**: Path traversal validation

### 6.3 Observabilidad
```python
# Logging estructurado
logger.info("phase_started", extra={
    "phase": "PHASE-1",
    "task_id": task.id,
    "agents": len(phase.agents)
})

# Métricas
metrics.counter("workflow_executed", tags={"status": "success"})
metrics.histogram("phase_duration_ms", value=elapsed_ms)
```

---

## 7. Roadmap de Implementación

**Fase 1**: Core (~200 líneas testeable)
- `core/workflow.py`
- `core/state_manager.py`
- `models/*.py`

**Fase 2**: Agents (~500 líneas)
- `agents/base.py`
- `agents/analyst.py`, `architect.py`, etc.

**Fase 3**: Execution (~300 líneas)
- `execution/git_manager.py`
- `execution/file_manager.py`

**Fase 4**: CLI (~150 líneas)
- `cli/commands.py`

**Fase 5**: Tests (→ 80% coverage)
- Unit tests
- Integration tests

---

## Resumido

| Aspecto | Decisión |
|---------|----------|
| **Patrón** | Pipeline + Factory + Strategy |
| **Async** | Sí, para paralelismo real |
| **Modulación** | 8 módulos independientes |
| **Testabilidad** | Inversión de dependencias + mocks |
| **Cobertura** | 80% = 1200+ líneas de test / 1500 líneas código |
| **Extensibilidad** | Factory registry para nuevas fases/agentes |
