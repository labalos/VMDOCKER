#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS AUTO-FIXER v2.0 (Más agresivo)
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

// MAPEOS EXTENDIDOS

const colorMapping = {
  // Primarios
  '#1A73E8': 'var(--color-primary)', '#1a73e8': 'var(--color-primary)',
  '#1557b0': 'var(--color-primary-hover)', '#1557B0': 'var(--color-primary-hover)',
  '#e8f4fd': 'var(--color-primary-light)', '#E8F4FD': 'var(--color-primary-light)',
  '#0d5cb6': 'var(--color-primary-hover)',
  
  // Secundarios
  '#F6A623': 'var(--color-secondary)', '#f6a623': 'var(--color-secondary)',
  '#d48a1a': 'var(--color-secondary-hover)', '#D48A1A': 'var(--color-secondary-hover)',
  '#fff8e8': 'var(--color-secondary-light)',
  
  // Neutros
  '#1a1a1a': 'var(--color-dark)', '#1A1A1A': 'var(--color-dark)',
  '#2e2e2e': 'var(--color-gray-800)', '#2E2E2E': 'var(--color-gray-800)',
  '#666666': 'var(--color-gray-600)', '#666': 'var(--color-gray-600)',
  '#888888': 'var(--color-gray-400)', '#888': 'var(--color-gray-400)',
  '#cccccc': 'var(--color-gray-300)', '#CCCCCC': 'var(--color-gray-300)', '#ccc': 'var(--color-gray-300)',
  '#e0e0e0': 'var(--color-gray-200)', '#E0E0E0': 'var(--color-gray-200)',
  '#f5f5f5': 'var(--color-gray-100)', '#F5F5F5': 'var(--color-gray-100)',
  '#f8f8f8': 'var(--color-light)', '#F8F8F8': 'var(--color-light)',
  '#ffffff': 'var(--color-white)', '#FFFFFF': 'var(--color-white)', '#fff': 'var(--color-white)', '#FFF': 'var(--color-white)',
  
  // Estados
  '#38a169': 'var(--color-success)', '#38A169': 'var(--color-success)',
  '#f0fff4': 'var(--color-success-light)',
  '#e53e3e': 'var(--color-error)', '#E53E3E': 'var(--color-error)',
  '#fff5f5': 'var(--color-error-light)',
  '#ff0000': 'var(--color-error)', '#FF0000': 'var(--color-error)', '#f00': 'var(--color-error)', '#F00': 'var(--color-error)',
  
  // Otros comunes
  '#000000': 'var(--color-dark)', '#000': 'var(--color-dark)',
  '#333333': 'var(--color-gray-800)', '#333': 'var(--color-gray-800)',
  '#999999': 'var(--color-gray-400)', '#999': 'var(--color-gray-400)',
  '#dddddd': 'var(--color-gray-200)', '#DDDDDD': 'var(--color-gray-200)', '#ddd': 'var(--color-gray-200)',
  '#eeeeee': 'var(--color-gray-100)', '#EEEEEE': 'var(--color-gray-100)', '#eee': 'var(--color-gray-100)',
  '#222222': 'var(--color-dark)', '#222': 'var(--color-dark)',
  '#444444': 'var(--color-gray-800)', '#444': 'var(--color-gray-800)',
  '#555555': 'var(--color-gray-800)', '#555': 'var(--color-gray-800)',
  '#777777': 'var(--color-gray-600)', '#777': 'var(--color-gray-600)',
  '#aaaaaa': 'var(--color-gray-400)', '#AAAAAA': 'var(--color-gray-400)', '#aaa': 'var(--color-gray-400)',
  '#bbbbbb': 'var(--color-gray-300)', '#BBBBBB': 'var(--color-gray-300)', '#bbb': 'var(--color-gray-300)',
};

const spacingMapping = {
  '0': '0',
  '1px': '1px', // Mantener 1px para bordes finos
  '2px': 'var(--space-1)',
  '4px': 'var(--space-1)',
  '6px': 'var(--space-2)',
  '8px': 'var(--space-2)',
  '10px': 'var(--space-3)',
  '12px': 'var(--space-3)',
  '14px': 'var(--space-3)',
  '15px': 'var(--space-4)', // Aproximado
  '16px': 'var(--space-4)',
  '18px': 'var(--space-4)',
  '20px': 'var(--space-5)',
  '24px': 'var(--space-6)',
  '25px': 'var(--space-6)',
  '28px': 'var(--space-6)',
  '30px': 'var(--space-8)',
  '32px': 'var(--space-8)',
  '36px': 'var(--space-8)',
  '40px': 'var(--space-10)',
  '44px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '50px': 'var(--space-12)',
  '56px': 'var(--space-12)',
  '60px': 'var(--space-12)',
  '64px': 'var(--space-16)',
  '72px': 'var(--space-16)',
  '80px': 'var(--space-20)',
  '96px': 'var(--space-24)',
  '100px': 'var(--space-24)',
  '120px': 'var(--space-24)',
};

const radiusMapping = {
  '0': '0',
  '1px': 'var(--radius-sm)',
  '2px': 'var(--radius-sm)',
  '3px': 'var(--radius-sm)',
  '4px': 'var(--radius-sm)',
  '5px': 'var(--radius-sm)',
  '6px': 'var(--radius-md)',
  '7px': 'var(--radius-md)',
  '8px': 'var(--radius-lg)',
  '9px': 'var(--radius-lg)',
  '10px': 'var(--radius-lg)',
  '11px': 'var(--radius-xl)',
  '12px': 'var(--radius-xl)',
  '14px': 'var(--radius-xl)',
  '15px': 'var(--radius-xl)',
  '16px': 'var(--radius-2xl)',
  '20px': 'var(--radius-2xl)',
  '24px': 'var(--radius-2xl)',
  '50%': 'var(--radius-full)',
};

const fontSizeMapping = {
  '10px': 'var(--text-xs)',
  '11px': 'var(--text-xs)',
  '12px': 'var(--text-xs)',
  '13px': 'var(--text-base)',
  '14px': 'var(--text-md)',
  '15px': 'var(--text-md)',
  '16px': 'var(--text-lg)',
  '17px': 'var(--text-lg)',
  '18px': 'var(--text-xl)',
  '19px': 'var(--text-xl)',
  '20px': 'var(--text-2xl)',
  '22px': 'var(--text-2xl)',
  '24px': 'var(--text-3xl)',
  '26px': 'var(--text-3xl)',
  '28px': 'var(--text-3xl)',
  '30px': 'var(--text-3xl)',
  '32px': 'var(--text-4xl)',
  '36px': 'var(--text-4xl)',
  '40px': 'var(--text-4xl)',
  '48px': 'var(--text-4xl)',
};

async function getCssFiles(dir, files = []) {
  try {
    const items = await readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      if (itemStat.isDirectory()) {
        await getCssFiles(fullPath, files);
      } else if (item.endsWith('.css') || item.endsWith('.module.css')) {
        if (!['variables.css', 'utilities.css', 'index.css'].includes(item)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {}
  return files;
}

function calculateRelativePath(filepath) {
  // Determinar cuántos niveles de profundidad tiene el archivo desde src
  const parts = filepath.split(path.sep);
  const srcIndex = parts.indexOf('src');
  if (srcIndex === -1) return '../styles/variables.css';
  
  const depthFromSrc = parts.length - srcIndex - 1; // -1 por el nombre del archivo
  
  if (depthFromSrc === 1) {
    return './styles/variables.css'; // Está en src/components/ o src/pages/
  } else if (depthFromSrc === 2) {
    return '../styles/variables.css'; // Está en src/components/subcarpeta/
  } else {
    return '../../styles/variables.css'; // Más profundo
  }
}

function fixContent(content, filepath) {
  let fixed = content;
  let changes = [];
  
  // Verificar si ya tiene import
  const hasImport = content.includes('@import') && 
    (content.includes('variables.css') || content.includes('utilities.css'));
  
  // Agregar import si no existe
  if (!hasImport) {
    const importPath = calculateRelativePath(filepath);
    const importLine = `@import '${importPath}';`;
    
    // Insertar al inicio, antes de cualquier otro contenido
    fixed = `${importLine}\n\n${fixed.trim()}`;
    changes.push(`Agregado import: ${importLine}`);
  }
  
  // Función auxiliar para reemplazar preservando comentarios y strings
  function safeReplace(regex, replacement, description) {
    const original = fixed;
    fixed = fixed.replace(regex, replacement);
    if (fixed !== original) {
      changes.push(description);
      return true;
    }
    return false;
  }
  
  // REEMPLAZAR COLORES HEX (evitar url() y comentarios)
  Object.entries(colorMapping).forEach(([hex, variable]) => {
    // Patrón que captura propiedades CSS con colores HEX
    // Evita reemplazar dentro de url() o comillas
    const escapedHex = hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Para propiedades estándar
    const propRegex = new RegExp(`(\\s*)(background|background-color|color|border|border-color|border-top|border-right|border-bottom|border-left|outline|outline-color|fill|stroke)\\s*:\\s*${escapedHex}\\s*;`, 'gi');
    safeReplace(propRegex, `$1$2: ${variable};`, `${hex} → ${variable}`);
  });
  
  // REEMPLAZAR ESPACIADO (padding, margin, gap)
  Object.entries(spacingMapping).forEach(([px, variable]) => {
    if (px === '0' || px === '1px') return; // Saltar valores especiales
    
    // Padding general
    const paddingRegex = new RegExp(`(\\s*)padding\\s*:\\s*${px}\\s*;`, 'g');
    safeReplace(paddingRegex, `$1padding: ${variable};`, `padding: ${px} → ${variable}`);
    
    // Padding específico
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`(\\s*)padding-${side}\\s*:\\s*${px}\\s*;`, 'g');
      safeReplace(sideRegex, `$1padding-${side}: ${variable};`, `padding-${side}: ${px} → ${variable}`);
    });
    
    // Margin general
    const marginRegex = new RegExp(`(\\s*)margin\\s*:\\s*${px}\\s*;`, 'g');
    safeReplace(marginRegex, `$1margin: ${variable};`, `margin: ${px} → ${variable}`);
    
    // Margin específico
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`(\\s*)margin-${side}\\s*:\\s*${px}\\s*;`, 'g');
      safeReplace(sideRegex, `$1margin-${side}: ${variable};`, `margin-${side}: ${px} → ${variable}`);
    });
    
    // Gap
    const gapRegex = new RegExp(`(\\s*)gap\\s*:\\s*${px}\\s*;`, 'g');
    safeReplace(gapRegex, `$1gap: ${variable};`, `gap: ${px} → ${variable}`);
  });
  
  // REEMPLAZAR BORDER-RADIUS
  Object.entries(radiusMapping).forEach(([px, variable]) => {
    if (px === '0') return;
    const regex = new RegExp(`(\\s*)border-radius\\s*:\\s*${px}\\s*;`, 'g');
    safeReplace(regex, `$1border-radius: ${variable};`, `border-radius: ${px} → ${variable}`);
  });
  
  // REEMPLAZAR FONT-SIZE
  Object.entries(fontSizeMapping).forEach(([px, variable]) => {
    const regex = new RegExp(`(\\s*)font-size\\s*:\\s*${px}\\s*;`, 'g');
    safeReplace(regex, `$1font-size: ${variable};`, `font-size: ${px} → ${variable}`);
  });
  
  return { content: fixed, changes };
}

async function main() {
  console.log(`${colors.cyan}🔧 BuildPro CSS Auto-Fixer v2.0${colors.reset}\n`);
  
  const files = await getCssFiles('src');
  let totalChanges = 0;
  let fixedFiles = 0;
  
  if (files.length === 0) {
    console.log(`${colors.yellow}⚠ No se encontraron archivos CSS${colors.reset}`);
    return;
  }
  
  console.log(`${colors.cyan}📁 Procesando ${files.length} archivos...${colors.reset}\n`);
  
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const { content: newContent, changes } = fixContent(content, file);
    
    if (changes.length > 0) {
      await writeFile(file, newContent, 'utf8');
      console.log(`${colors.yellow}📄 ${path.relative(process.cwd(), file)}${colors.reset}`);
      // Mostrar solo primeros 5 cambios si hay muchos
      const displayChanges = changes.slice(0, 5);
      displayChanges.forEach(change => {
        console.log(`   ${colors.green}✓${colors.reset} ${change}`);
      });
      if (changes.length > 5) {
        console.log(`   ${colors.gray}... y ${changes.length - 5} cambios más${colors.reset}`);
      }
      console.log('');
      totalChanges += changes.length;
      fixedFiles++;
    }
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (fixedFiles > 0) {
    console.log(`${colors.green}✅ Completado:${colors.reset}`);
    console.log(`   ${colors.green}•${colors.reset} ${fixedFiles} archivos modificados`);
    console.log(`   ${colors.green}•${colors.reset} ${totalChanges} correcciones aplicadas`);
    console.log(`\n${colors.yellow}⚠️  Ejecuta 'node verify-css-variables.cjs' para verificar qué queda${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ No se encontraron problemas corregibles automáticamente${colors.reset}`);
  }
  console.log(`${colors.bright}========================================${colors.reset}`);
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});