#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS AUTO-FIXER (CommonJS)
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Colores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Mapeo de colores HEX a variables
const colorMapping = {
  '#1A73E8': 'var(--color-primary)',
  '#1a73e8': 'var(--color-primary)',
  '#1557b0': 'var(--color-primary-hover)',
  '#e8f4fd': 'var(--color-primary-light)',
  '#F6A623': 'var(--color-secondary)',
  '#f6a623': 'var(--color-secondary)',
  '#d48a1a': 'var(--color-secondary-hover)',
  '#fff8e8': 'var(--color-secondary-light)',
  '#1a1a1a': 'var(--color-dark)',
  '#2e2e2e': 'var(--color-gray-800)',
  '#666666': 'var(--color-gray-600)',
  '#888888': 'var(--color-gray-400)',
  '#cccccc': 'var(--color-gray-300)',
  '#e0e0e0': 'var(--color-gray-200)',
  '#f5f5f5': 'var(--color-gray-100)',
  '#f8f8f8': 'var(--color-light)',
  '#FFFFFF': 'var(--color-white)',
  '#ffffff': 'var(--color-white)',
  '#38a169': 'var(--color-success)',
  '#f0fff4': 'var(--color-success-light)',
  '#e53e3e': 'var(--color-error)',
  '#fff5f5': 'var(--color-error-light)',
  '#ff0000': 'var(--color-error)',
  '#FF0000': 'var(--color-error)',
  '#000000': 'var(--color-dark)',
  '#000': 'var(--color-dark)',
  '#333333': 'var(--color-gray-800)',
  '#333': 'var(--color-gray-800)',
  '#999999': 'var(--color-gray-400)',
  '#999': 'var(--color-gray-400)',
};

// Mapeo de espaciado
const spacingMapping = {
  '4px': 'var(--space-1)',
  '8px': 'var(--space-2)',
  '12px': 'var(--space-3)',
  '16px': 'var(--space-4)',
  '20px': 'var(--space-5)',
  '24px': 'var(--space-6)',
  '32px': 'var(--space-8)',
  '40px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '64px': 'var(--space-16)',
  '80px': 'var(--space-20)',
  '96px': 'var(--space-24)',
};

// Mapeo de border-radius
const radiusMapping = {
  '3px': 'var(--radius-sm)',
  '6px': 'var(--radius-md)',
  '8px': 'var(--radius-lg)',
  '12px': 'var(--radius-xl)',
  '16px': 'var(--radius-2xl)',
  '5px': 'var(--radius-sm)',
  '4px': 'var(--radius-sm)',
  '10px': 'var(--radius-md)',
};

// Mapeo de font-size
const fontSizeMapping = {
  '11px': 'var(--text-xs)',
  '12px': 'var(--text-xs)',
  '13px': 'var(--text-base)',
  '14px': 'var(--text-md)',
  '16px': 'var(--text-lg)',
  '18px': 'var(--text-xl)',
  '20px': 'var(--text-2xl)',
  '24px': 'var(--text-3xl)',
  '32px': 'var(--text-4xl)',
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

function fixContent(content, filepath) {
  let fixed = content;
  let changes = [];
  let hasImport = content.includes('@import') && (content.includes('variables.css') || content.includes('utilities.css'));
  
  // Agregar import si no existe
  if (!hasImport) {
    // Determinar la ruta relativa correcta
    const depth = filepath.split(path.sep).filter(p => p.startsWith('src')).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '../';
    const importLine = `@import '${prefix}styles/variables.css';`;
    
    fixed = `${importLine}\n\n${fixed}`;
    changes.push(`Agregado: ${importLine}`);
  }
  
  // Reemplazar colores HEX (evitar reemplazar dentro de url() o comentarios)
  Object.entries(colorMapping).forEach(([hex, variable]) => {
    // Regex que evita reemplazar dentro de url() o comillas
    const regex = new RegExp(`(color|background|background-color|border|border-color|border-bottom|border-top|border-left|border-right)\\s*:\\s*${hex.replace('#', '\\#')}\\s*;`, 'gi');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `$1: ${variable};`);
      changes.push(`${hex} → ${variable}`);
    }
  });
  
  // Reemplazar padding
  Object.entries(spacingMapping).forEach(([px, variable]) => {
    const paddingRegex = new RegExp(`padding\\s*:\\s*${px}\\s*;`, 'g');
    if (paddingRegex.test(fixed)) {
      fixed = fixed.replace(paddingRegex, `padding: ${variable};`);
      changes.push(`padding: ${px} → ${variable}`);
    }
    
    // Padding específico (top, right, bottom, left)
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`padding-${side}\\s*:\\s*${px}\\s*;`, 'g');
      if (sideRegex.test(fixed)) {
        fixed = fixed.replace(sideRegex, `padding-${side}: ${variable};`);
        changes.push(`padding-${side}: ${px} → ${variable}`);
      }
    });
  });
  
  // Reemplazar margin
  Object.entries(spacingMapping).forEach(([px, variable]) => {
    const marginRegex = new RegExp(`margin\\s*:\\s*${px}\\s*;`, 'g');
    if (marginRegex.test(fixed)) {
      fixed = fixed.replace(marginRegex, `margin: ${variable};`);
      changes.push(`margin: ${px} → ${variable}`);
    }
    
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const sideRegex = new RegExp(`margin-${side}\\s*:\\s*${px}\\s*;`, 'g');
      if (sideRegex.test(fixed)) {
        fixed = fixed.replace(sideRegex, `margin-${side}: ${variable};`);
        changes.push(`margin-${side}: ${px} → ${variable}`);
      }
    });
  });
  
  // Reemplazar border-radius
  Object.entries(radiusMapping).forEach(([px, variable]) => {
    const regex = new RegExp(`border-radius\\s*:\\s*${px}\\s*;`, 'g');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `border-radius: ${variable};`);
      changes.push(`border-radius: ${px} → ${variable}`);
    }
  });
  
  // Reemplazar font-size
  Object.entries(fontSizeMapping).forEach(([px, variable]) => {
    const regex = new RegExp(`font-size\\s*:\\s*${px}\\s*;`, 'g');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, `font-size: ${variable};`);
      changes.push(`font-size: ${px} → ${variable}`);
    }
  });
  
  return { content: fixed, changes };
}

async function main() {
  console.log(`${colors.cyan}🔧 BuildPro CSS Auto-Fixer${colors.reset}\n`);
  
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
      changes.forEach(change => {
        console.log(`   ${colors.green}✓${colors.reset} ${change}`);
      });
      console.log('');
      totalChanges += changes.length;
      fixedFiles++;
    }
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (fixedFiles > 0) {
    console.log(`${colors.green}✅ Completado: ${fixedFiles} archivos modificados, ${totalChanges} correcciones${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Ejecuta 'npm run css:verify' para verificar queda${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ No se encontraron problemas corregibles automáticamente${colors.reset}`);
  }
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});