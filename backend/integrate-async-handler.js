#!/usr/bin/env node

/**
 * Script para integrar asyncHandler em todas as rotas
 * Uso: node integrate-async-handler.js
 */

const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, 'src/routes');
const MIDDLEWARE_IMPORT = "const { asyncHandler, validateSchema, AppError } = require('../middleware/globalErrorHandler');";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  // Pular se já tem o import
  if (content.includes('asyncHandler')) {
    console.log(`✓ ${filename} já possui asyncHandler`);
    return false;
  }

  // Encontrar a linha de require e adicionar import após ela
  const requireMatch = content.match(/const express = require\('express'\);/);
  if (!requireMatch) {
    console.log(`✗ ${filename} - não encontrado require('express')`);
    return false;
  }

  // Adicionar import
  content = content.replace(
    "const express = require('express');",
    "const express = require('express');\n" + MIDDLEWARE_IMPORT
  );

  // Processar handlers
  let modified = 0;
  
  // Pattern 1: router.post('/path', authenticateToken, (req, res) => {
  content = content.replace(
    /router\.(post|put|patch|delete)\('([^']+)',\s*([^,]+),\s*\((req,\s*res)\]\s*=>\s*{/g,
    (match, method, path, middleware, params) => {
      modified++;
      return `router.${method}('${path}', ${middleware}, asyncHandler(async (${params}) => {`;
    }
  );

  // Pattern 2: router.post('/path', (req, res) => {
  content = content.replace(
    /router\.(post|put|patch|delete)\('([^']+)',\s*\((req,\s*res)\]\s*=>\s*{/g,
    (match, method, path, params) => {
      modified++;
      return `router.${method}('${path}', asyncHandler(async (${params}) => {`;
    }
  );

  // Pattern 3: router.get('/path', authenticateToken, (req, res) => {
  content = content.replace(
    /router\.(get)\('([^']+)',\s*([^,]+),\s*\((req,\s*res)\]\s*=>\s*{/g,
    (match, method, path, middleware, params) => {
      modified++;
      return `router.${method}('${path}', ${middleware}, asyncHandler(async (${params}) => {`;
    }
  );

  // Pattern 4: router.get('/path', (req, res) => {
  content = content.replace(
    /router\.(get)\('([^']+)',\s*\((req,\s*res)\]\s*=>\s*{/g,
    (match, method, path, params) => {
      modified++;
      return `router.${method}('${path}', asyncHandler(async (${params}) => {`;
    }
  );

  // Adicionar closing
  content = content.replace(
    /}(?=\s*\);?\s*\/\*|}\s*router\.(?:get|post|put|patch|delete))/g,
    '}));'
  );

  if (modified > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ ${filename} - ${modified} handlers atualizados`);
    return true;
  }
  
  return false;
}

// Processar todos os arquivos
function run() {
  if (!fs.existsSync(ROUTES_DIR)) {
    console.error('Diretório de rotas não encontrado:', ROUTES_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(ROUTES_DIR)
    .filter(f => f.endsWith('.js') && !f.includes('swagger'))
    .map(f => path.join(ROUTES_DIR, f));

  console.log(`\n📝 Processando ${files.length} arquivos de rota...\n`);

  let updated = 0;
  files.forEach(file => {
    if (processFile(file)) {
      updated++;
    }
  });

  console.log(`\n✅ Atualização completa! ${updated} arquivos modificados\n`);
}

run();
