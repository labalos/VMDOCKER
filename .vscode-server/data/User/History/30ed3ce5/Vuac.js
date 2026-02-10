// scanProject.js
const fs = require("fs");
const path = require("path");

// Carpeta base a escanear (puedes cambiar si quieres)
const BASE_DIR = path.resolve(__dirname);

// Tipos de archivos clave a buscar
const KEY_TYPES = {
  models: /models/i,
  routes: /routes/i,
  controllers: /controllers/i,
  services: /services/i,
  config: /config/i,
  middleware: /middleware/i,
  frontend: /frontend|client|react|vite/i
};

// Detectar frameworks/librerías por package.json
function detectDependencies(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) return [];
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
}

// Escanear carpetas y archivos recursivamente
function scanDir(dir, depth = 0) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(BASE_DIR, fullPath);

    if (entry.isDirectory()) {
      result.push({ type: "dir", name: entry.name, path: relPath, children: scanDir(fullPath, depth + 1) });
    } else {
      result.push({ type: "file", name: entry.name, path: relPath });
    }
  }

  return result;
}

// Extraer archivos importantes según KEY_TYPES
function extractKeyFiles(tree) {
  const keys = {};
  
  function traverse(node) {
    if (node.type === "file") {
      for (const [key, regex] of Object.entries(KEY_TYPES)) {
        if (regex.test(node.path)) {
          if (!keys[key]) keys[key] = [];
          keys[key].push(node.path);
        }
      }
    } else if (node.type === "dir") {
      for (const child of node.children) traverse(child);
    }
  }

  for (const node of tree) traverse(node);
  return keys;
}

// Mostrar estructura de forma legible
function printTree(tree, prefix = "") {
  for (const node of tree) {
    if (node.type === "dir") {
      console.log(`${prefix}📁 ${node.name}/`);
      printTree(node.children, prefix + "  ");
    } else {
      console.log(`${prefix}📄 ${node.name}`);
    }
  }
}

// Generar resumen final
function generateReport(tree, keyFiles, dependencies) {
  return {
    baseDir: BASE_DIR,
    totalFiles: countFiles(tree),
    keyFiles,
    detectedDependencies: dependencies,
  };
}

function countFiles(tree) {
  let count = 0;
  for (const node of tree) {
    if (node.type === "file") count++;
    else if (node.type === "dir") count += countFiles(node.children);
  }
  return count;
}

// ======= EJECUCIÓN =======
console.log(`🔎 Escaneando proyecto en: ${BASE_DIR}\n`);

const tree = scanDir(BASE_DIR);
const keyFiles = extractKeyFiles(tree);
const packageJsonPath = path.join(BASE_DIR, "package.json");
const dependencies = detectDependencies(packageJsonPath);

console.log("🌳 Estructura de proyecto:\n");
printTree(tree);

console.log("\n🗂 Archivos clave detectados:");
console.log(JSON.stringify(keyFiles, null, 2));

console.log("\n📦 Dependencias detectadas en package.json:");
console.log(dependencies.join(", "));

console.log("\n✅ Resumen generado. Puedes usar esta info para documentación o análisis.");
