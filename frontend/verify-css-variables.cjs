#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS VARIABLES VERIFIER
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Configuración
const CONFIG = {
  scanDirs: ['src/components', 'src/pages', 'src/styles'],
  extensions: ['.css', '.module.css'],
  ignoreFiles: ['variables.css', 'utilities.css', 'index.css'],
  
  validVariables: [
    '--color-primary', '--color-primary-hover', '--color-primary-light',
    '--color-secondary', '--color-secondary-hover', '--color-secondary-light',
    '--color-dark', '--color-gray-800', '--color-gray-600', '--color-gray-400',
    '--color-gray-300', '--color-gray-200', '--color-gray-100', '--color-light', '--color-white',
    '--color-success', '--color-success-light', '--color-error', '--color-error-light', '--color-warning',
    '--font-main',
    '--text-xs', '--text-sm', '--text-base', '--text-md', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl',
    '--font-normal', '--font-medium', '--font-semibold', '--font-bold', '--font-extrabold',
    '--leading-tight', '--leading-normal', '--leading-relaxed',
    '--tracking-tight', '--tracking-normal', '--tracking-wide', '--tracking-wider', '--tracking-widest',
    '--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6',
    '--space-8', '--space-10', '--space-12', '--space-16', '--space-20', '--space-24',
    '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-full',
    '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl',
    '--transition-fast', '--transition-normal', '--transition-slow',
    '--z-dropdown', '--z-sticky', '--z-fixed', '--z-modal-backdrop', '--z-modal', '--z-popover', '--z-tooltip'
  ],
  
  prohibitedPatterns: [
    { regex: /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/, name: 'Color HEX hardcodeado', severity: 'error' },
    { regex: /font-size:\s*(?!var\()[0-9]+(px|rem|em)/, name: 'Tamaño de fuente hardcodeado', severity: 'warning' },
    { regex: /padding:\s*(?!var\()[0-9]+px/, name: 'Padding en px hardcodeado', severity: 'warning' },
    { regex: /margin:\s*(?!var\()[0-9]+px/, name: 'Margin en px hardcodeado', severity: 'warning' },
    { regex: /border-radius:\s*(?!var\()[0-9]+px/, name: 'Border-radius hardcodeado', severity: 'warning' }
  ]
};

const results = {
  filesChecked: 0,
  filesWithErrors: 0,
  filesWithWarnings: 0,
  totalErrors: 0,
  totalWarnings: 0,
  summary: { valid: [], invalid: [] }
};

async function getCssFiles(dir, files = []) {
  try {
    const items = await readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      if (itemStat.isDirectory()) {
        await getCssFiles(fullPath, files);
      } else {
        const isValidExt = CONFIG.extensions.some(ext => item.endsWith(ext));
        if (isValidExt && !CONFIG.ignoreFiles.includes(item)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {}
  return files;
}

function checkImports(content) {
  const hasVariablesImport = content.includes("@import") && 
    (content.includes("variables.css") || content.includes("utilities.css"));
  
  if (!hasVariablesImport) {
    return { type: 'error', message: 'No importa variables.css o utilities.css', line: null };
  }
  return null;
}

function findHardcodedValues(content) {
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) return;
    if (line.trim().startsWith('@import') || line.trim().startsWith('@media')) return;
    if (line.includes('url(') || line.includes('http')) return;
    
    CONFIG.prohibitedPatterns.forEach(pattern => {
      if (pattern.regex.test(line) && !/var\([^)]*\)/.test(line)) {
        issues.push({
          type: pattern.severity,
          message: `${pattern.name}: ${line.trim().substring(0, 50)}`,
          line: index + 1
        });
      }
    });
  });
  
  return issues;
}

async function analyzeFile(filepath) {
  const content = await readFile(filepath, 'utf8');
  const filename = path.basename(filepath);
  const relativePath = path.relative(process.cwd(), filepath);
  
  results.filesChecked++;
  const fileIssues = [];
  
  const importIssue = checkImports(content);
  if (importIssue) fileIssues.push(importIssue);
  
  const hardcodedIssues = findHardcodedValues(content);
  fileIssues.push(...hardcodedIssues);
  
  const errors = fileIssues.filter(i => i.type === 'error');
  const warnings = fileIssues.filter(i => i.type === 'warning');
  
  if (errors.length > 0) results.filesWithErrors++;
  if (warnings.length > 0) results.filesWithWarnings++;
  results.totalErrors += errors.length;
  results.totalWarnings += warnings.length;
  
  if (fileIssues.length === 0) {
    results.summary.valid.push(relativePath);
  } else {
    results.summary.invalid.push({ file: relativePath, issues: fileIssues });
  }
}

function printResults() {
  console.log(`\n${colors.bright}========================================${colors.reset}`);
  console.log(`${colors.bright}   BUILDPRO CSS VERIFIER RESULTS${colors.reset}`);
  console.log(`${colors.bright}========================================${colors.reset}\n`);
  
  console.log(`${colors.cyan}📊 RESUMEN:${colors.reset}`);
  console.log(`   Archivos verificados: ${results.filesChecked}`);
  console.log(`   ${colors.green}✓ Válidos: ${results.summary.valid.length}${colors.reset}`);
  console.log(`   ${colors.red}✗ Con errores: ${results.filesWithErrors}${colors.reset}`);
  console.log(`   ${colors.yellow}⚠ Con advertencias: ${results.filesWithWarnings}${colors.reset}`);
  console.log(`   Total errores: ${results.totalErrors}`);
  console.log(`   Total advertencias: ${results.totalWarnings}\n`);
  
  if (results.summary.invalid.length > 0) {
    console.log(`${colors.bright}🔍 DETALLES DE PROBLEMAS:${colors.reset}\n`);
    results.summary.invalid.forEach(({ file, issues }) => {
      console.log(`${colors.bright}${file}${colors.reset}`);
      issues.forEach(issue => {
        const icon = issue.type === 'error' ? `${colors.red}✗${colors.reset}` : `${colors.yellow}⚠${colors.reset}`;
        const type = issue.type === 'error' ? `${colors.red}[ERROR]${colors.reset}` : `${colors.yellow}[WARN]${colors.reset}`;
        console.log(`  ${icon} ${type} Línea ${issue.line || '?'}: ${issue.message}`);
      });
      console.log('');
    });
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (results.totalErrors === 0 && results.totalWarnings === 0) {
    console.log(`${colors.green}🎉 ¡Todos los archivos cumplen con el sistema!${colors.reset}`);
    process.exit(0);
  } else if (results.totalErrors === 0) {
    console.log(`${colors.yellow}⚠ Revisar advertencias${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Se encontraron errores. Corregir antes de commit.${colors.reset}`);
    process.exit(1);
  }
}

async function main() {
  console.log(`${colors.cyan}🔍 BuildPro CSS Variables Verifier${colors.reset}`);
  console.log(`${colors.gray}Escaneando archivos CSS...${colors.reset}\n`);
  
  let allFiles = [];
  for (const dir of CONFIG.scanDirs) {
    const files = await getCssFiles(dir);
    allFiles.push(...files);
  }
  allFiles = [...new Set(allFiles)];
  
  if (allFiles.length === 0) {
    console.log(`${colors.yellow}⚠ No se encontraron archivos CSS${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`${colors.blue}📁 Encontrados ${allFiles.length} archivos CSS${colors.reset}\n`);
  
  for (const file of allFiles) {
    await analyzeFile(file);
  }
  
  printResults();
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});