Genera un mensaje de commit Conventional Commits resumido (máximo 150 palabras).

TAREA: {task}
BRANCH: {branch}
COVERAGE: {coverage}%

Lee el plan en {plan_file} y el reporte de integración en {integrator_log}.
Usa esa información SOLO para contexto interno. NO la incluyas en la respuesta.

Formato (EXACTO):
<type>(<scope>): <descripción corta>

<máximo 3-4 líneas de cambios relevantes>

Tests: coverage {coverage}%

⚠️  IMPORTANTE: Responde SOLO el mensaje de commit completo.
SIN: explicaciones, comillas, backticks, o cualquier texto extra.
SIN: incluir contenido de archivos en la respuesta.
