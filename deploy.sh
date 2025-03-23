#!/bin/bash

# ? Asegúrate de estar en master
echo "Cambiando a la rama master..."
git checkout master

# ? Elimina build anterior
echo "Eliminando carpeta dist anterior..."
rm -rf dist

# ? Compila el proyecto
echo "Generando build de producción..."
npm run build

# ? Elimina rama gh-pages remota (opcional, solo si quieres forzar limpieza)
echo "Eliminando rama gh-pages remota (si existe)..."
git push origin --delete gh-pages

# ? Publica usando subtree
echo "Publicando en gh-pages..."
git subtree push --prefix dist origin gh-pages

echo "? Deploy completado. Verifica en GitHub Pages."

# ? Vuelve a master (por seguridad)
git checkout master
