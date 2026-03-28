# Prompts de claude-workflow

Edita cada archivo `.md` para personalizar el prompt del agente correspondiente.

**Importante:** Conserva todos los `{placeholders}` listados a continuación. Si falta alguno, se emitirá una advertencia pero el prompt seguirá cargándose.

Ejecuta `claude-iterative --init` de nuevo para restaurar archivos faltantes (no sobreescribe existentes).

## Placeholders por archivo

| Archivo | Placeholders requeridos |
|---|---|
| `ANALYST.md` | `{output}`, `{task}` |
| `ARCHITECT.md` | `{output}`, `{task}` |
| `QA_PLANNER.md` | `{output}`, `{task}` |
| `SYNTHESIZER.md` | `{analyst_file}`, `{architect_file}`, `{coverage}`, `{plan_file}`, `{qa_file}`, `{task}` |
| `IMPLEMENTER.md` | `{architect_file}`, `{log_file}`, `{plan_file}`, `{task}` |
| `TEST_WRITER.md` | `{coverage}`, `{impl_log}`, `{log_file}`, `{plan_file}`, `{qa_file}`, `{task}` |
| `TEST_WRITER_MULTI.md` | `{coverage}`, `{impl_logs}`, `{log_file}`, `{plan_file}`, `{qa_file}`, `{task}` |
| `COORDINATOR.md` | `{log_file}`, `{n_agents}`, `{plan_file}`, `{task}`, `{tasks_dir}` |
| `DEV_AGENT.md` | `{architect_file}`, `{index}`, `{log_file}`, `{n_agents}`, `{task}`, `{task_file}` |
| `INTEGRATOR.md` | `{agents_dir}`, `{backend_dir}`, `{coverage}`, `{log_file}`, `{max_attempts}`, `{task}` |
| `COMMITTER.md` | `{branch}`, `{coverage}`, `{integrator_log}`, `{plan_file}`, `{task}` |
