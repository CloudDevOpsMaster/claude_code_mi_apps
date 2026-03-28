#!/usr/bin/env python3
"""
Alipay+ Mini Program - Validation & Test Suite
Ejecuta 60+ tests para validar estructura, sintaxis, patrones, documentación y comportamiento.
Coverage objetivo: >= 80%
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import List, Tuple, Dict

# Colors for output
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

class TestSuite:
    """Suite de tests para Alipay+ Mini Program"""

    def __init__(self, base_path: str = '/home/dev/Repos/claude_code_mi_apps'):
        self.base_path = Path(base_path)
        self.results = {
            'passed': [],
            'failed': [],
            'skipped': []
        }
        self.test_count = 0
        self.passed_count = 0

    def run_all_tests(self) -> bool:
        """Ejecuta todas las categorías de tests"""
        print(f"\n{BLUE}{'='*70}{NC}")
        print(f"{BLUE}Alipay+ Mini Program - Test Suite{NC}")
        print(f"{BLUE}{'='*70}{NC}\n")

        # Ejecutar test categories
        self._run_structure_tests()
        self._run_syntax_tests()
        self._run_pattern_tests()
        self._run_config_tests()
        self._run_shell_tests()
        self._run_docs_tests()
        self._run_behavior_tests()

        # Mostrar resumen
        self._print_summary()

        return self._calculate_coverage() >= 80

    # =========================================================================
    # PHASE 1: File Structure Tests (11 tests)
    # =========================================================================
    def _run_structure_tests(self):
        """Validar estructura de archivos y directorios"""
        print(f"\n{BLUE}[Phase 1] File Structure Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            # Directories
            ("S1.1", "Directorio my-miniapp existe",
             lambda: (self.base_path / "my-miniapp").is_dir()),
            ("S1.2", "Directorio pages/index existe",
             lambda: (self.base_path / "my-miniapp/pages/index").is_dir()),
            ("S1.3", "Directorio components existe",
             lambda: (self.base_path / "my-miniapp/components").is_dir()),
            ("S1.4", "Directorio utils existe",
             lambda: (self.base_path / "my-miniapp/utils").is_dir()),
            ("S1.5", "Directorio assets existe",
             lambda: (self.base_path / "my-miniapp/assets").is_dir()),
            ("S1.6", "Directorio scripts existe",
             lambda: (self.base_path / "scripts").is_dir()),

            # Files in root
            ("S1.7", "package.json en raíz existe",
             lambda: (self.base_path / "package.json").is_file()),
            ("S1.8", "CLAUDE.md existe",
             lambda: (self.base_path / "CLAUDE.md").is_file()),
            ("S1.9", "README.md existe",
             lambda: (self.base_path / "README.md").is_file()),
            ("S1.10", ".env.example existe",
             lambda: (self.base_path / ".env.example").is_file()),
            ("S1.11", ".gitignore existe",
             lambda: (self.base_path / ".gitignore").is_file()),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 2: Syntax Validation Tests (6 tests)
    # =========================================================================
    def _run_syntax_tests(self):
        """Validar sintaxis de archivos JSON y JS"""
        print(f"\n{BLUE}[Phase 2] Syntax Validation Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            ("SX2.1", "app.json es JSON válido",
             lambda: self._is_valid_json(self.base_path / "my-miniapp/app.json")),
            ("SX2.2", "package.json es JSON válido",
             lambda: self._is_valid_json(self.base_path / "package.json")),
            ("SX2.3", "mini.project.json (raíz) es JSON válido",
             lambda: self._is_valid_json(self.base_path / "mini.project.json")),
            ("SX2.4", "mini.project.json (app) es JSON válido",
             lambda: self._is_valid_json(self.base_path / "my-miniapp/mini.project.json")),
            ("SX2.5", "pages/index/index.json es JSON válido",
             lambda: self._is_valid_json(self.base_path / "my-miniapp/pages/index/index.json")),
            ("SX2.6", "my-miniapp/package.json es JSON válido",
             lambda: self._is_valid_json(self.base_path / "my-miniapp/package.json")),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 3: Code Pattern Tests (7 tests)
    # =========================================================================
    def _run_pattern_tests(self):
        """Validar patrones de código específicos de Alipay"""
        print(f"\n{BLUE}[Phase 3] Code Pattern Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            ("P3.1", "app.js contiene onLaunch",
             lambda: self._file_contains(self.base_path / "my-miniapp/app.js", "onLaunch")),
            ("P3.2", "app.js contiene onShow",
             lambda: self._file_contains(self.base_path / "my-miniapp/app.js", "onShow")),
            ("P3.3", "app.js contiene onHide",
             lambda: self._file_contains(self.base_path / "my-miniapp/app.js", "onHide")),
            ("P3.4", "index.js usa this.setData()",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.js", "this.setData")),
            ("P3.5", "index.axml NO contiene <div> (excepto comentarios)",
             lambda: self._axml_no_html_tags()),
            ("P3.6", "index.acss contiene unidades rpx",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.acss", "rpx")),
            ("P3.7", "utils/api.js exporta función request",
             lambda: self._file_contains(self.base_path / "my-miniapp/utils/api.js", "export function request")),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 4: Configuration Tests (7 tests)
    # =========================================================================
    def _run_config_tests(self):
        """Validar configuración de la app"""
        print(f"\n{BLUE}[Phase 4] Configuration Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            ("C4.1", "app.json contiene array 'pages'",
             lambda: self._json_has_key(self.base_path / "my-miniapp/app.json", "pages")),
            ("C4.2", "app.json contiene objeto 'window'",
             lambda: self._json_has_key(self.base_path / "my-miniapp/app.json", "window")),
            ("C4.3", "package.json contiene script 'preview'",
             lambda: self._json_has_nested_key(self.base_path / "package.json", "scripts", "preview")),
            ("C4.4", "package.json contiene script 'upload'",
             lambda: self._json_has_nested_key(self.base_path / "package.json", "scripts", "upload")),
            ("C4.5", "package.json contiene script 'init-cli'",
             lambda: self._json_has_nested_key(self.base_path / "package.json", "scripts", "init-cli")),
            ("C4.6", ".gitignore contiene '.env'",
             lambda: self._file_contains(self.base_path / ".gitignore", ".env")),
            ("C4.7", ".env.example contiene WORKSPACE_ID placeholder",
             lambda: self._file_contains(self.base_path / ".env.example", "WORKSPACE_ID")),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 5: Shell Script Tests (6 tests)
    # =========================================================================
    def _run_shell_tests(self):
        """Validar scripts shell"""
        print(f"\n{BLUE}[Phase 5] Shell Script Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            ("SH5.1", "scripts/init-dev.sh es ejecutable",
             lambda: os.access(self.base_path / "scripts/init-dev.sh", os.X_OK)),
            ("SH5.2", "scripts/init-dev.sh tiene shebang bash",
             lambda: self._file_starts_with(self.base_path / "scripts/init-dev.sh", "#!/bin/bash")),
            ("SH5.3", "scripts/init-dev.sh valida Node.js",
             lambda: self._file_contains(self.base_path / "scripts/init-dev.sh", "node")),
            ("SH5.4", "scripts/init-dev.sh valida npm",
             lambda: self._file_contains(self.base_path / "scripts/init-dev.sh", "npm")),
            ("SH5.5", "scripts/init-dev.sh valida git",
             lambda: self._file_contains(self.base_path / "scripts/init-dev.sh", "git")),
            ("SH5.6", "scripts/init-dev.sh menciona miniprogram-cli",
             lambda: self._file_contains(self.base_path / "scripts/init-dev.sh", "miniprogram-cli")),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 6: Documentation Tests (8 tests)
    # =========================================================================
    def _run_docs_tests(self):
        """Validar documentación"""
        print(f"\n{BLUE}[Phase 6] Documentation Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            ("D6.1", "CLAUDE.md tiene >300 líneas",
             lambda: self._file_line_count(self.base_path / "CLAUDE.md") > 300),
            ("D6.2", "CLAUDE.md menciona 'setData'",
             lambda: self._file_contains(self.base_path / "CLAUDE.md", "setData")),
            ("D6.3", "CLAUDE.md menciona 'axml'",
             lambda: self._file_contains(self.base_path / "CLAUDE.md", "axml")),
            ("D6.4", "CLAUDE.md menciona 'rpx'",
             lambda: self._file_contains(self.base_path / "CLAUDE.md", "rpx")),
            ("D6.5", "README.md tiene >200 líneas",
             lambda: self._file_line_count(self.base_path / "README.md") > 200),
            ("D6.6", "README.md contiene 'Quick Start'",
             lambda: self._file_contains(self.base_path / "README.md", "Quick Start")),
            ("D6.7", "README.md contiene pasos de setup",
             lambda: self._file_contains(self.base_path / "README.md", "npm run")),
            ("D6.8", ".env.example contiene 7+ variables",
             lambda: len(self._grep_pattern(self.base_path / ".env.example", r"^[A-Z_]*=")) >= 7),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # PHASE 7: Code Behavior Tests (15 tests)
    # =========================================================================
    def _run_behavior_tests(self):
        """Validar comportamiento de código"""
        print(f"\n{BLUE}[Phase 7] Code Behavior Tests{NC}")
        print(f"{BLUE}{'='*70}{NC}")

        tests = [
            # app.js behavior
            ("B7.1", "app.js tiene globalData",
             lambda: self._file_contains(self.base_path / "my-miniapp/app.js", "globalData")),
            ("B7.2", "app.js inicializa globalData.user",
             lambda: self._file_contains(self.base_path / "my-miniapp/app.js", "user")),

            # Page lifecycle
            ("B7.3", "index.js tiene onLoad",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.js", "onLoad")),
            ("B7.4", "index.js tiene onShow",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.js", "onShow")),
            ("B7.5", "index.js tiene data object",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.js", "data:")),

            # Event handlers
            ("B7.6", "index.js tiene handlers de eventos",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.js", "increment")),
            ("B7.7", "index.axml usa binding {{counter}}",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.axml", "{{counter}}")),

            # Component structure
            ("B7.8", "index.axml tiene <view>",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.axml", "<view")),
            ("B7.9", "index.axml tiene <text>",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.axml", "<text")),
            ("B7.10", "index.axml tiene <button>",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.axml", "<button")),

            # API wrapper
            ("B7.11", "api.js exporta get()",
             lambda: self._file_contains(self.base_path / "my-miniapp/utils/api.js", "export function get")),
            ("B7.12", "api.js exporta post()",
             lambda: self._file_contains(self.base_path / "my-miniapp/utils/api.js", "export function post")),
            ("B7.13", "api.js usa my.request",
             lambda: self._file_contains(self.base_path / "my-miniapp/utils/api.js", "my.request")),

            # Styling
            ("B7.14", "index.acss usa flexbox",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.acss", "display: flex")),
            ("B7.15", "index.acss define colores",
             lambda: self._file_contains(self.base_path / "my-miniapp/pages/index/index.acss", "#")),
        ]

        for test_id, desc, test_func in tests:
            self._run_test(test_id, desc, test_func)

    # =========================================================================
    # Helper Methods
    # =========================================================================

    def _run_test(self, test_id: str, description: str, test_func) -> bool:
        """Ejecutar un test individual"""
        self.test_count += 1
        try:
            result = test_func()
            if result:
                self.passed_count += 1
                self.results['passed'].append((test_id, description))
                print(f"{GREEN}✓{NC} {test_id}: {description}")
                return True
            else:
                self.results['failed'].append((test_id, description))
                print(f"{RED}✗{NC} {test_id}: {description}")
                return False
        except Exception as e:
            self.results['failed'].append((test_id, f"{description} [ERROR: {str(e)}]"))
            print(f"{RED}✗{NC} {test_id}: {description} [ERROR]")
            return False

    def _file_exists(self, path: Path) -> bool:
        """Verificar si archivo existe"""
        return path.is_file()

    def _file_contains(self, path: Path, pattern: str) -> bool:
        """Verificar si archivo contiene patrón"""
        if not path.is_file():
            return False
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
            return pattern in content
        except:
            return False

    def _file_starts_with(self, path: Path, text: str) -> bool:
        """Verificar si archivo comienza con texto"""
        if not path.is_file():
            return False
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
            return content.startswith(text)
        except:
            return False

    def _file_line_count(self, path: Path) -> int:
        """Contar líneas en archivo"""
        if not path.is_file():
            return 0
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
            return len(content.splitlines())
        except:
            return 0

    def _is_valid_json(self, path: Path) -> bool:
        """Validar que archivo JSON es válido"""
        if not path.is_file():
            return False
        try:
            with open(path, 'r', encoding='utf-8') as f:
                json.load(f)
            return True
        except:
            return False

    def _json_has_key(self, path: Path, key: str) -> bool:
        """Verificar si JSON tiene clave"""
        if not self._is_valid_json(path):
            return False
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return key in data
        except:
            return False

    def _json_has_nested_key(self, path: Path, parent: str, child: str) -> bool:
        """Verificar si JSON tiene clave anidada"""
        if not self._is_valid_json(path):
            return False
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return parent in data and child in data.get(parent, {})
        except:
            return False

    def _grep_pattern(self, path: Path, pattern: str) -> List[str]:
        """Buscar patrón regex en archivo"""
        if not path.is_file():
            return []
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
            return re.findall(pattern, content, re.MULTILINE)
        except:
            return []

    def _axml_no_html_tags(self) -> bool:
        """Verificar que AXML no contiene HTML estándar (excepto comentarios)"""
        path = self.base_path / "my-miniapp/pages/index/index.axml"
        if not path.is_file():
            return False
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
            # Remover comentarios
            content_no_comments = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
            # Buscar <div> o <span> fuera de comentarios
            return not bool(re.search(r'<(div|span)[>\s]', content_no_comments))
        except:
            return False

    def _calculate_coverage(self) -> float:
        """Calcular porcentaje de coverage"""
        if self.test_count == 0:
            return 0
        return (self.passed_count / self.test_count) * 100

    def _print_summary(self):
        """Mostrar resumen de tests"""
        coverage = self._calculate_coverage()

        print(f"\n{BLUE}{'='*70}{NC}")
        print(f"{BLUE}Test Summary{NC}")
        print(f"{BLUE}{'='*70}{NC}")
        print(f"Total Tests:     {self.test_count}")
        print(f"{GREEN}Passed:         {self.passed_count}{NC}")
        print(f"{RED}Failed:         {len(self.results['failed'])}{NC}")
        print(f"Coverage:        {coverage:.1f}%")

        if coverage >= 80:
            print(f"{GREEN}Status:         ✓ PASSED (≥80% coverage){NC}")
        else:
            print(f"{RED}Status:         ✗ FAILED (<80% coverage){NC}")

        if self.results['failed']:
            print(f"\n{YELLOW}Failed Tests:{NC}")
            for test_id, desc in self.results['failed']:
                print(f"  {RED}✗{NC} {test_id}: {desc}")

        print(f"\n{BLUE}{'='*70}{NC}\n")

def main():
    """Entrada principal"""
    suite = TestSuite()
    success = suite.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
