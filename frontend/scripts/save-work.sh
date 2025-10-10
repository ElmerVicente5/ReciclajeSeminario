#!/usr/bin/env bash
# Uso: ejecutar este script desde la carpeta frontend para guardar trabajo local rápido.
# EDITA la variable BRANCH si quieres otro nombre de rama temporal.

BRANCH="temp/save-work-$(date +%Y%m%d%H%M)"

echo "1) Estado actual:"
git status --short

echo
echo "2) Crear rama temporal y commitear (recomendado)..."
git checkout -b "$BRANCH"
git add -A
git commit -m "WIP: guardar cambios locales antes de cambiar de rama" || echo "No hay cambios para commitear"
echo "Rama temporal creada: $BRANCH"
echo "Si quieres subirla: git push origin $BRANCH"
echo

echo "3) Alternativa (si prefieres stash en vez de commit):"
echo "  git stash push -m 'WIP: cambios locales'"

echo
echo "Comandos rápidos para continuar (no ejecutados por el script):"
echo "  git fetch origin"
echo "  git checkout devBackend"
echo "O para copiar sólo una carpeta desde devBackend a devFrontend:"
echo "  git checkout devFrontend"
echo "  git checkout origin/devBackend -- ruta/a/la/carpeta"
echo "  git add ruta/a/la/carpeta && git commit -m 'Importar carpeta desde origin/devBackend' && git push origin devFrontend"
