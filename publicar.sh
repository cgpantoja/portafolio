#!/usr/bin/env bash
# ---------------------------------------------------------------
# Publica el portafolio en GitHub Pages.
#
# Uso:
#   ./publicar.sh                      # mensaje automático
#   ./publicar.sh "Ajusta la galería"  # mensaje propio
#
# Copia solo los archivos del sitio (deja fuera los de trabajo),
# hace commit en ~/portafolio-web y sube a GitHub. Pages tarda
# alrededor de un minuto en mostrarlo.
# ---------------------------------------------------------------
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${PORTAFOLIO_REPO:-$HOME/portafolio-web}"
MSG="${1:-Actualiza el sitio}"

if [[ ! -d "$REPO/.git" ]]; then
  echo "No encuentro el repositorio en $REPO" >&2
  exit 1
fi

rsync -a --delete \
  --exclude '.git/' \
  --exclude 'README.md' \
  --exclude '.nojekyll' \
  --exclude 'servir.sh' \
  --exclude 'COMO-EDITAR.md' \
  --exclude 'crear-pagina.mjs' \
  --exclude '_plantilla.html' \
  --exclude 'demo.html' \
  --exclude 'alicia-tipografica.*' \
  --exclude 'menu-de-leonisa.svg' \
  --exclude 'proceso.svg' \
  --exclude '.DS_Store' \
  --exclude 'Thumbs.db' \
  "$SRC/" "$REPO/"

cd "$REPO"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Sin cambios: lo publicado ya está al día."
  exit 0
fi

git add -A
git commit -q -m "$MSG"
git push -q origin main

echo "Publicado: https://cgpantoja.github.io/portafolio/"
git --no-pager log --oneline -1
git status -sb | head -1
