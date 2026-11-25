#!/usr/bin/env bash
# Uso: ./publicar.sh ruta/al/catalogo-libros-1.0.0.apk   → genera index.html con tamaño y SHA-256 del APK
set -euo pipefail
APK="$1"; DIR="$(cd "$(dirname "$0")" && pwd)"
SHA=$(sha256sum "$APK" | cut -d' ' -f1); TAM=$(du -h "$APK" | cut -f1)
sed -e "s|{{VERSION}}|1.0.0|" -e "s|{{TAMANO}}|$TAM|" -e "s|{{FECHA}}|$(date +%d/%m/%Y)|" \
    -e "s|{{ARCHIVO}}|$(basename "$APK")|" -e "s|{{SHA256}}|$SHA|" "$DIR/plantilla_index.html" > "$DIR/index.html"
echo "APK: $(basename "$APK")  tamaño: $TAM  sha256: $SHA"
