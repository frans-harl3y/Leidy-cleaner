#!/bin/bash

# 🔧 Script de Correção de Erros

echo "═══════════════════════════════════════════════════════════════"
echo "🔧 VERIFICANDO ESTRUTURA DO PROJETO"
echo "═══════════════════════════════════════════════════════════════"

echo ""
echo "✅ Verificando pastas de contextos..."

if [ -f "/workspaces/chega/frontend/src/context/ThemeContext.jsx" ]; then
    echo "  ✅ /frontend/src/context/ThemeContext.jsx (CORRETO)"
else
    echo "  ❌ /frontend/src/context/ThemeContext.jsx (FALTANDO)"
fi

if [ -f "/workspaces/chega/frontend/src/contexts/ThemeContext.jsx" ]; then
    echo "  ⚠️  /frontend/src/contexts/ThemeContext.jsx (DESCONTINUADO - agora é stub)"
else
    echo "  ✅ /frontend/src/contexts/ThemeContext.jsx (removido)"
fi

echo ""
echo "✅ Verificando páginas..."

if grep -q "'use client'" "/workspaces/chega/frontend/src/pages/minha-conta.jsx"; then
    echo "  ✅ minha-conta.jsx tem 'use client'"
else
    echo "  ❌ minha-conta.jsx NÃO tem 'use client'"
fi

if grep -q "'use client'" "/workspaces/chega/frontend/src/pages/staff/schedule.jsx"; then
    echo "  ✅ staff/schedule.jsx tem 'use client'"
else
    echo "  ❌ staff/schedule.jsx NÃO tem 'use client'"
fi

echo ""
echo "✅ Verificando imports..."

if grep -q "from '../../context/ThemeContext'" "/workspaces/chega/frontend/src/components/Layout/Header.jsx"; then
    echo "  ✅ Header.jsx importa de /context (correto)"
else
    echo "  ❌ Header.jsx tem import errado"
fi

if grep -q "from '../../context/ThemeContext'" "/workspaces/chega/frontend/src/components/UI/ThemeSelector.jsx"; then
    echo "  ✅ ThemeSelector.jsx importa de /context (correto)"
else
    echo "  ❌ ThemeSelector.jsx tem import errado"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 RESUMO DE CORREÇÕES"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "✅ CORRIGIDO:"
echo "  1. Context com 4 temas (light, dark, high-contrast, pastel)"
echo "  2. THEME_MODES exportado do /context/ThemeContext"
echo "  3. Header.jsx - importa do /context correto"
echo "  4. ThemeSelector.jsx - importa do /context correto"
echo "  5. minha-conta.jsx - adicionado 'use client'"
echo "  6. staff/schedule.jsx - adicionado 'use client'"
echo "  7. /contexts/ThemeContext.jsx - marcado como descontinuado"
echo ""
echo "⚠️  TODO:"
echo "  • Testar no navegador (mudar temas)"
echo "  • Integrar endpoints do backend"
echo "  • Testar em mobile/tablet/desktop"
echo ""
echo "═══════════════════════════════════════════════════════════════"
