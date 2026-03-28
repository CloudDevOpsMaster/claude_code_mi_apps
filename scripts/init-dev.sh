#!/bin/bash

###############################################################################
# Alipay+ Mini Program - Development Environment Initialization Script
#
# Propósito: Configurar el ambiente de desarrollo completo para Alipay+ MiniProgram
#
# Requisitos:
#   - Node.js 18+
#   - npm 8+
#   - git 2.20+
#   - miniprogram-cli (se instala globalmente)
#
# Uso:
#   bash scripts/init-dev.sh
#   bash scripts/init-dev.sh --help
#   bash scripts/init-dev.sh --skip-validation
###############################################################################

set -e  # Exit on error

###############################################################################
# Validation Functions - verify prerequisites and initialization
###############################################################################

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'  # No Color

# Banderas
SKIP_VALIDATION=false
HELP=false

# Parse argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-validation)
      SKIP_VALIDATION=true
      shift
      ;;
    --help|-h)
      HELP=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      HELP=true
      shift
      ;;
  esac
done

# Mostrar ayuda
show_help() {
  cat << EOF
${BLUE}Alipay+ Mini Program Dev Setup${NC}

Uso: bash scripts/init-dev.sh [OPTIONS]

Opciones:
  --help              Mostrar este mensaje
  --skip-validation   Saltar validaciones de prerequisitos

Descripción:
  Inicializa el ambiente de desarrollo completo para Alipay+ Mini Programs:
  1. Valida Node.js 18+ está instalado
  2. Valida npm 8+ está instalado
  3. Valida git 2.20+ está instalado
  4. Instala/valida miniprogram-cli globalmente
  5. Guía al usuario a obtener y configurar credentials

Después de ejecutar este script:
  1. Copia .env.example a .env
  2. Completa .env con tus credenciales de Alipay
  3. Ejecuta: npm run preview

Documentación:
  Ver README.md para pasos detallados

EOF
  exit 0
}

if [ "$HELP" = true ]; then
  show_help
fi

###############################################################################
# VALIDACIÓN 1: Node.js 18+
###############################################################################
echo -e "${BLUE}[1/5] Validando Node.js 18+...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js no está instalado${NC}"
  echo "  Instala Node.js 18+ desde: https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}✗ Node.js versión 18+ requerida, tienes v${NODE_VERSION}${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

###############################################################################
# VALIDACIÓN 2: npm 8+
###############################################################################
echo -e "${BLUE}[2/5] Validando npm 8+...${NC}"

if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm no está instalado${NC}"
  exit 1
fi

NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 8 ]; then
  echo -e "${RED}✗ npm versión 8+ requerida, tienes $(npm -v)${NC}"
  exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v)${NC}"

###############################################################################
# VALIDACIÓN 3: git 2.20+
###############################################################################
echo -e "${BLUE}[3/5] Validando git 2.20+...${NC}"

if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ git no está instalado${NC}"
  echo "  Instala git desde: https://git-scm.com/download"
  exit 1
fi

GIT_VERSION=$(git --version | awk '{print $3}' | cut -d'.' -f1,2)
echo -e "${GREEN}✓ git ${GIT_VERSION}${NC}"

###############################################################################
# VALIDACIÓN 4: miniprogram-cli
###############################################################################
echo -e "${BLUE}[4/5] Validando/Instalando miniprogram-cli...${NC}"

if ! command -v miniprogram-cli &> /dev/null; then
  echo -e "${YELLOW}⚠ miniprogram-cli no está instalado. Instalando globalmente...${NC}"

  if npm install -g @alipay/miniprogram-cli 2>/dev/null; then
    echo -e "${GREEN}✓ miniprogram-cli instalado correctamente${NC}"
  else
    echo -e "${RED}✗ Error instalando miniprogram-cli${NC}"
    echo "  Intenta manualmente:"
    echo "  npm install -g @alipay/miniprogram-cli"
    echo ""
    echo "  Si eso falla, verifica:"
    echo "  - Tienes conexión a internet"
    echo "  - npm está correctamente configurado"
    echo "  - Tienes permisos suficientes"
    exit 1
  fi
else
  CLI_VERSION=$(miniprogram-cli --version 2>/dev/null || echo "unknown")
  echo -e "${GREEN}✓ miniprogram-cli ${CLI_VERSION}${NC}"
fi

###############################################################################
# VALIDACIÓN 5: Configuración de Credenciales
###############################################################################
echo -e "${BLUE}[5/5] Configuración de Credenciales...${NC}"

# Verificar si .env existe
if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠ Archivo .env no encontrado${NC}"
  echo ""
  echo "  Pasos para obtener credenciales:"
  echo "  1. Ve a Alipay Mini Program Platform"
  echo "  2. Selecciona tu Workspace"
  echo "  3. Ve a Settings > API Credentials"
  echo "  4. Copia los siguientes valores:"
  echo "     - WORKSPACE_ID"
  echo "     - SUPER_APP_ID"
  echo "     - MINI_PROGRAM_ID"
  echo "     - CLI_ACCESS_KEY_ID"
  echo "     - CLI_SECRET_ACCESS_KEY"
  echo ""
  echo "  Luego:"
  echo "  cp .env.example .env"
  echo "  # Edita .env y completa los valores"
  echo ""
else
  # Verificar que .env tiene valores (no solo placeholders)
  WORKSPACE=$(grep "WORKSPACE_ID=" .env | grep -v "your_workspace" || true)
  if [ -z "$WORKSPACE" ]; then
    echo -e "${YELLOW}⚠ .env existe pero no está completado${NC}"
    echo "  Completa las variables en .env:"
    echo "  nano .env  # o tu editor favorito"
  else
    echo -e "${GREEN}✓ .env configurado${NC}"
  fi
fi

###############################################################################
# Resumen Final
###############################################################################
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Validaciones completadas${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. cp .env.example .env"
echo "  2. Edita .env con tus credenciales de Alipay"
echo "  3. npm run preview    (para iniciar preview en el dispositivo)"
echo "  4. Escanea el QR con tu app de Alipay+"
echo ""
echo "Para más info, ver README.md"
echo ""
