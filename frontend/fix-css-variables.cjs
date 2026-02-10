#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS AUTO-FIXER v3.0 (Ultra agresivo)
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
  gray: '\x1b[90m',
  bright: '\x1b[1m'
};

// MAPEO COMPLETO DE COLORES (incluye Flat UI y otros comunes)
const colorMapping = {
  // Tu sistema BuildPro
  '#1A73E8': 'var(--color-primary)', '#1a73e8': 'var(--color-primary)',
  '#1557b0': 'var(--color-primary-hover)',
  '#e8f4fd': 'var(--color-primary-light)',
  '#F6A623': 'var(--color-secondary)', '#f6a623': 'var(--color-secondary)',
  '#d48a1a': 'var(--color-secondary-hover)',
  '#fff8e8': 'var(--color-secondary-light)',
  '#1a1a1a': 'var(--color-dark)',
  '#2e2e2e': 'var(--color-gray-800)',
  '#666666': 'var(--color-gray-600)', '#666': 'var(--color-gray-600)',
  '#888888': 'var(--color-gray-400)', '#888': 'var(--color-gray-400)',
  '#cccccc': 'var(--color-gray-300)', '#ccc': 'var(--color-gray-300)',
  '#e0e0e0': 'var(--color-gray-200)',
  '#f5f5f5': 'var(--color-gray-100)',
  '#f8f8f8': 'var(--color-light)',
  '#ffffff': 'var(--color-white)', '#fff': 'var(--color-white)',
  '#38a169': 'var(--color-success)',
  '#e53e3e': 'var(--color-error)',
  
  // FLAT UI COLORS (mapeo inteligente)
  '#2c3e50': 'var(--color-dark)',      // Midnight Blue → Dark
  '#34495e': 'var(--color-gray-800)',  // Wet Asphalt → Gray-800
  '#7f8c8d': 'var(--color-gray-600)',  // Asbestos → Gray-600
  '#95a5a6': 'var(--color-gray-400)',  // Concrete → Gray-400
  '#bdc3c7': 'var(--color-gray-300)',  // Silver → Gray-300
  '#ecf0f1': 'var(--color-gray-100)',  // Clouds → Gray-100
  '#f8f9fa': 'var(--color-light)',     // Light gray → Light
  
  // Blues
  '#3498db': 'var(--color-primary)',   // Peter River → Primary
  '#2980b9': 'var(--color-primary-hover)', // Belize Hole → Primary Hover
  '#1a2980': 'var(--color-primary)',   // Dark blue → Primary
  
  // Greens
  '#27ae60': 'var(--color-success)',   // Nephritis → Success
  '#2ecc71': 'var(--color-success)',   // Emerald → Success
  '#25D366': 'var(--color-success)',   // WhatsApp green → Success
  '#1da851': 'var(--color-success)',   // Dark green → Success
  '#e8f7ef': 'var(--color-success-light)',
  
  // Reds
  '#c0392b': 'var(--color-error)',     // Pomegranate → Error
  '#e74c3c': 'var(--color-error)',     // Alizarin → Error
  '#ffeaea': 'var(--color-error-light)',
  
  // Otros comunes
  '#5a6268': 'var(--color-gray-600)',
  '#ddd': 'var(--color-gray-300)', '#dddddd': 'var(--color-gray-300)',
  '#eee': 'var(--color-gray-100)', '#eeeeee': 'var(--color-gray-100)',
  '#f0f0f0': 'var(--color-gray-100)',
  '#000': 'var(--color-dark)', '#000000': 'var(--color-dark)',
  '#333': 'var(--color-gray-800)', '#333333': 'var(--color-gray-800)',
  '#999': 'var(--color-gray-400)', '#999999': 'var(--color-gray-400)',
};

// MAPEO DE ESPACIADO (px y rem)
const spacingMapping = {
  // Píxeles
  '2px': 'var(--space-1)',
  '4px': 'var(--space-1)',
  '6px': 'var(--space-2)',
  '8px': 'var(--space-2)',
  '10px': 'var(--space-3)',
  '12px': 'var(--space-3)',
  '14px': 'var(--space-3)',
  '15px': 'var(--space-4)',
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
  '45px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '50px': 'var(--space-12)',
  '64px': 'var(--space-16)',
  '80px': 'var(--space-20)',
  '96px': 'var(--space-24)',
  
  // REM (basado en 16px = 1rem)
  '0.25rem': 'var(--space-1)',
  '0.5rem': 'var(--space-2)',
  '0.75rem': 'var(--space-3)',
  '1rem': 'var(--space-4)',
  '1.25rem': 'var(--space-5)',
  '1.5rem': 'var(--space-6)',
  '2rem': 'var(--space-8)',
  '2.5rem': 'var(--space-10)',
  '3rem': 'var(--space-12)',
  '4rem': 'var(--space-16)',
  '5rem': 'var(--space-20)',
  '6rem': 'var(--space-24)',
};

const radiusMapping = {
  '3px': 'var(--radius-sm)',
  '4px': 'var(--radius-sm)',
  '5px': 'var(--radius-sm)',
  '6px': 'var(--radius-md)',
  '8px': 'var(--radius-lg)',
  '10px': 'var(--radius-lg)',
  '12px': 'var(--radius-xl)',
  '16px': 'var(--radius-2xl)',
};

const fontSizeMapping = {
  // PX
  '11px': 'var(--text-xs)',
  '12px': 'var(--text-xs)',
  '13px': 'var(--text-base)',
  '14px': 'var(--text-md)',
  '16px': 'var(--text-lg)',
  '18px': 'var(--text-xl)',
  '20px': 'var(--text-2xl)',
  '24px': 'var(--text-3xl)',
  '32px': 'var(--text-4xl)',
  '48px': 'var(--text-4xl)',
  
  // REM
  '0.6875rem': 'var(--text-xs)',
  '0.75rem': 'var(--text-sm)',
  '0.8125rem': 'var(--text-base)',
  '0.875rem': 'var(--text-md)',
  '1rem': 'var(--text-lg)',
  '1.125rem': 'var(--text-xl)',
  '1.25rem': 'var(--text-2xl)',
  '1.5rem': 'var(--text-3xl)',
  '2rem': 'var(--text-3xl)',      // 2rem ≈ 32px
  '3rem': 'var(--text-4xl)',      // 3rem ≈ 48px
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

function calculateImportPath(filepath) {
  const parts = filepath.split(path.sep);
  const srcIndex = parts.indexOf('src');
  if (srcIndex === -1) return '../styles/variables.css';
  
  const depth = parts.length - srcIndex - 1;
  if (depth === 1) return './styles/variables.css';
  if (depth === 2) return '../styles/variables.css';
  return '../../styles/variables.css';
}

function fixContent(content, filepath) {
  let fixed = content;
  let changes = [];
  
  // Agregar import si falta
  const hasImport = content.includes('variables.css') || content.includes('utilities.css');
  if (!hasImport) {
    const importPath = calculateImportPath(filepath);
    fixed = `@import '${importPath}';\n\n${fixed.trim()}`;
    changes.push(`Import agregado`);
  }
  
  // REEMPLAZAR COLORES (propiedad: valor;)
  Object.entries(colorMapping).forEach(([hex, variable]) => {
    const escaped = hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Patrón: propiedad: #color;
    const regex = new RegExp(`(\\s*)([\\w-]+)\\s*:\\s*${escaped}\\s*;`, 'gi');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `$1$2: ${variable};`);
      changes.push(`${hex} → ${variable}`);
    }
    
    // Patrón: propiedad: #color !important;
    const regexImp = new RegExp(`(\\s*)([\\w-]+)\\s*:\\s*${escaped}\\s*!important\\s*;`, 'gi');
    if (regexImp.test(fixed)) {
      fixed = fixed.replace(regexImp, `$1$2: ${variable} !important;`);
      changes.push(`${hex} → ${variable} (!important)`);
    }
  });
  
  // REEMPLAZAR EN BORDES COMPLEJOS (ej: border: 2px solid #color;)
  Object.entries(colorMapping).forEach(([hex, variable]) => {
    const escaped = hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // border: 2px solid #color;
    const borderRegex = new RegExp(`(border\\s*:\\s*\\d+px\\s+solid\\s+)${escaped}\\s*;`, 'gi');
    if (borderRegex.test(fixed)) {
      fixed = fixed.replace(borderRegex, `$1${variable};`);
      changes.push(`border solid ${hex} → ${variable}`);
    }
    
    // border-left/right/top/bottom: 4px solid #color;
    const borderSideRegex = new RegExp(`(border-[\\w-]+\\s*:\\s*\\d+px\\s+solid\\s+)${escaped}\\s*;`, 'gi');
    if (borderSideRegex.test(fixed)) {
      fixed = fixed.replace(borderSideRegex, `$1${variable};`);
      changes.push(`border-X solid ${hex} → ${variable}`);
    }
  });
  
  // REEMPLAZAR ESPACIADO CON SHORTHAND (ej: padding: 10px 20px;)
  Object.entries(spacingMapping).forEach(([val, variable]) => {
    const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Padding con 2 valores (vertical horizontal)
    const pad2Regex = new RegExp(`(padding\\s*:\\s*)${escaped}\\s+([\\dpxrem]+)\\s*;`, 'gi');
    if (pad2Regex.test(fixed)) {
      fixed = fixed.replace(pad2Regex, (match, p1, p2) => {
        const var2 = spacingMapping[p2] || p2;
        return `${p1}${variable} ${var2};`;
      });
      changes.push(`padding: ${val} X → variable`);
    }
    
    // Padding con 4 valores
    const pad4Regex = new RegExp(`(padding\\s*:\\s*)${escaped}\\s+([\\dpxrem]+)\\s+([\\dpxrem]+)\\s+([\\dpxrem]+)\\s*;`, 'gi');
    if (pad4Regex.test(fixed)) {
      fixed = fixed.replace(pad4Regex, (match, p1, p2, p3, p4) => {
        const v2 = spacingMapping[p2] || p2;
        const v3 = spacingMapping[p3] || p3;
        const v4 = spacingMapping[p4] || p4;
        return `${p1}${variable} ${v2} ${v3} ${v4};`;
      });
      changes.push(`padding: ${val} X X X → variable`);
    }
    
    // Padding simple
    const padRegex = new RegExp(`(padding\\s*:\\s*)${escaped}\\s*;`, 'g');
    if (padRegex.test(fixed)) {
      fixed = fixed.replace(padRegex, `$1${variable};`);
      changes.push(`padding: ${val} → ${variable}`);
    }
    
    // Padding específico (top, right, bottom, left)
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`(padding-${side}\\s*:\\s*)${escaped}\\s*;`, 'g');
      if (sideRegex.test(fixed)) {
        fixed = fixed.replace(sideRegex, `$1${variable};`);
        changes.push(`padding-${side}: ${val} → ${variable}`);
      }
    });
    
    // Margin (similar)
    const margRegex = new RegExp(`(margin\\s*:\\s*)${escaped}\\s*;`, 'g');
    if (margRegex.test(fixed)) {
      fixed = fixed.replace(margRegex, `$1${variable};`);
      changes.push(`margin: ${val} → ${variable}`);
    }
    
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`(margin-${side}\\s*:\\s*)${escaped}\\s*;`, 'g');
      if (sideRegex.test(fixed)) {
        fixed = fixed.replace(sideRegex, `$1${variable};`);
        changes.push(`margin-${side}: ${val} → ${variable}`);
      }
    });
  });
  
  // REEMPLAZAR FONT-SIZE
  Object.entries(fontSizeMapping).forEach(([val, variable]) => {
    const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(font-size\\s*:\\s*)${escaped}\\s*;`, 'gi');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `$1${variable};`);
      changes.push(`font-size: ${val} → ${variable}`);
    }
  });
  
  // REEMPLAZAR BORDER-RADIUS
  Object.entries(radiusMapping).forEach(([val, variable]) => {
    const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(border-radius\\s*:\\s*)${escaped}\\s*;`, 'g');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `$1${variable};`);
      changes.push(`border-radius: ${val} → ${variable}`);
    }
  });
  
  return { content: fixed, changes };
}

async function main() {
  console.log(`${colors.cyan}🔧 BuildPro CSS Auto-Fixer v3.0${colors.reset}\n`);
  
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
      
      // Agrupar cambios similares
      const uniqueChanges = [...new Set(changes)].slice(0, 8);
      uniqueChanges.forEach(change => {
        console.log(`   ${colors.green}✓${colors.reset} ${change}`);
      });
      
      if (changes.length > 8) {
        console.log(`   ${colors.gray}... y ${changes.length - 8} cambios más${colors.reset}`);
      }
      console.log('');
      totalChanges += changes.length;
      fixedFiles++;
    }
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (fixedFiles > 0) {
    console.log(`${colors.green}✅ COMPLETADO:${colors.reset}`);
    console.log(`   ${colors.green}•${colors.reset} ${fixedFiles} archivos modificados`);
    console.log(`   ${colors.green}•${colors.reset} ${totalChanges} correcciones totales`);
    console.log(`\n${colors.yellow}⚠️  Ejecuta: node verify-css-variables.cjs${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Sin cambios necesarios${colors.reset}`);
  }
  console.log(`${colors.bright}========================================${colors.reset}`);
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});