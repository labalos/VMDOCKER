#!/usr/bin/env node
/**
 * Fixer específico para gradientes CSS
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/Formulario.module.css',
  'src/components/Login.module.css',
  'src/components/AdminSolicitudes.module.css'
];

const gradientMappings = [
  // Formulario.module.css
  {
    file: 'src/components/Formulario.module.css',
    search: /linear-gradient\(135deg,\s*#f5f7fa\s*0%,\s*#c3cfe2\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-gray-100) 0%, var(--color-gray-200) 100%)'
  },
  {
    file: 'src/components/Formulario.module.css',
    search: /linear-gradient\(135deg,\s*#3498db\s*0%,\s*#2c3e50\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark) 100%)'
  },
  {
    file: 'src/components/Formulario.module.css',
    search: /linear-gradient\(135deg,\s*#2ecc71\s*0%,\s*#27ae60\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-success) 0%, var(--color-success) 100%)'
  },
  {
    file: 'src/components/Formulario.module.css',
    search: /linear-gradient\(135deg,\s*#e74c3c\s*0%,\s*#c0392b\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-error) 0%, var(--color-error) 100%)'
  },
  
  // Login.module.css
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(135deg,\s*#1a2980\s*0%,\s*#26d0ce\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(135deg,\s*#3498db\s*0%,\s*#2c3e50\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark) 100%)'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(135deg,\s*#2c3e50\s*0%,\s*#34495e\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-dark) 0%, var(--color-gray-800) 100%)'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(to\s+right,\s*#ffeaea,\s*#fff5f5\)/g,
    replace: 'linear-gradient(to right, var(--color-error-light), var(--color-error-light))'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(to\s+right,\s*#e8f7ef,\s*#d1f2eb\)/g,
    replace: 'linear-gradient(to right, var(--color-success-light), var(--color-success-light))'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(135deg,\s*#3498db\s*0%,\s*#2980b9\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)'
  },
  {
    file: 'src/components/Login.module.css',
    search: /linear-gradient\(135deg,\s*#f8f9fa\s*0%,\s*#e9ecef\s*100%\)/g,
    replace: 'linear-gradient(135deg, var(--color-light) 0%, var(--color-gray-100) 100%)'
  }
];

// Fix específico para padding con !important
const paddingFixes = [
  {
    file: 'src/components/AdminSolicitudes.module.css',
    search: /padding:\s*40px\s*!important;/g,
    replace: 'padding: var(--space-10) !important;'
  }
];

console.log('🔧 Corrigiendo gradientes y padding...\n');

let totalFixed = 0;

[...gradientMappings, ...paddingFixes].forEach(({ file, search, replace }) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(search, replace);
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`✅ ${file}`);
      console.log(`   Reemplazado: ${search.toString().substring(0, 50)}...`);
      totalFixed++;
    }
  } catch (err) {
    console.error(`❌ Error en ${file}: ${err.message}`);
  }
});

console.log(`\n✅ Completado: ${totalFixed} reemplazos`);