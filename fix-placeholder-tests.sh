#!/bin/bash
# Script para corrigir testes com __PLACEHOLDER
# Substitui db.run.__PLACEHOLDER por jest.spyOn(db, 'run').mockImplementation

cd /workspaces/chega/backend

# Lista arquivos problemáticos
files=$(find src/__tests__ -name "*.js" -type f -exec grep -l "__PLACEHOLDER" {} \;)

echo "Encontrados $(echo "$files" | wc -l) arquivos com __PLACEHOLDER"
echo ""

# Para cada arquivo, mostrar preview
for file in $files; do
  echo "=== $file ==="
  grep -n "__PLACEHOLDER" "$file" | head -3
  echo ""
done
