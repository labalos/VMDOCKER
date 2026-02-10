// scanProjectSmart.js - versión súper inteligente
const fs = require("fs");
const path = require("path");

const BASE_DIR = path.resolve(__dirname);

// Categorías clave
const KEY_TYPES = {
  models: /models/i,
  routes: /routes/i,
  controllers: /controllers/i,
  services: /services/i,
  middleware: /middleware/i,
  config: /config/i,
  frontend: /frontend|client|react|vite|next/i,
  tests: /test|spec/i
};

// Posibles frameworks y DB
const DB_SERVICES = ["mongodb", "mongoose", "mysql", "pg", "postgresql", "redis", "firebase"];
const FRONTEND_FRAMEWORKS = ["react", "vite", "next", "vue", "angular"];
const BACKEND_FRAMEWORKS = ["express", "fastify", "koa", "nest"];

// Escaneo recursivo
function scanDir(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(BASE_DIR, fullPath);

    if (entry.isDirectory()) {
      result.push({ type: "dir", name: entry.name, path: relPath, children: scanDir(fullPath) });
    } else {
      result.push({ type: "file", name: entry.name, path: relPath });
    }
  }
  return result;
}

// Extraer archivos clave y categorizar
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
      node.children.forEach(traverse);
    }
  }
  tree.forEach(traverse);
  return keys;
}

// Detectar dependencias
function detectDependencies(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) return [];
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
}

// Detectar frameworks y DB
function detectServices(dependencies) {
  const detected = { backendFrameworks: [], frontendFrameworks: [], databases: [] };
  dependencies.forEach(dep => {
    const depLower = dep.toLowerCase();
    if (BACKEND_FRAMEWORKS.includes(depLower)) detected.backendFrameworks.push(dep);
    if (FRONTEND_FRAMEWORKS.includes(depLower)) detected.frontendFrameworks.push(dep);
    if (DB_SERVICES.includes(depLower)) detected.databases.push(dep);
  });
  return detected;
}

// Detectar contenedores
function detectContainers(tree) {
  const containers = [];
  function traverse(node) {
    if (node.type === "file") {
      if (/dockerfile/i.test(node.name)) containers.push("Dockerfile");
      if (/docker-compose\.ya?ml/i.test(node.name)) containers.push("docker-compose");
    } else if (node.type === "dir") {
      node.children.forEach(traverse);
    }
  }
  tree.forEach(traverse);
  return Array.from(new Set(containers));
}

// Crear mapa de arquitectura
function createArchitectureMap(tree, keyFiles, services, containers) {
  return {
    backend: {
      frameworks: services.backendFrameworks,
      databases: services.databases,
      models: keyFiles.models || [],
      routes: keyFiles.routes || [],
      controllers: keyFiles.controllers || [],
      services: keyFiles.services || [],
      middleware: keyFiles.middleware || [],
      config: keyFiles.config || []
    },
    frontend: {
      frameworks: services.frontendFrameworks,
      files: keyFiles.frontend || []
    },
    tests: keyFiles.tests || [],
    containers
  };
}

// Contar archivos
function countFiles(tree) {
  let count = 0;
  for (const node of tree) {
    if (node.type === "file") count++;
    else count += countFiles(node.children);
  }
  return count;
}

// ===== EJECUCIÓN =====
console.log(`🔎 Escaneando proyecto en: ${BASE_DIR}\n`);

const tree = scanDir(BASE_DIR);
const keyFiles = extractKeyFiles(tree);
const packageJsonPath = path.join(BASE_DIR, "package.json");
const dependencies = detectDependencies(packageJsonPath);
const services = detectServices(dependencies);
const containers = detectContainers(tree);
const architectureMap = createArchitectureMap(tree, keyFiles, services, containers);

// Mostrar resumen en consola
console.log("🌳 Estructura de proyecto (resumen):");
console.log(`Total archivos: ${countFiles(tree)}`);
console.log(`Contenedores detectados: ${containers.join(", ") || "Ninguno"}`);
console.log("\n⚙️ Frameworks y servicios detectados:");
console.log(JSON.stringify(services, null, 2));
console.log("\n🗂 Archivos clave por categoría:");
console.log(JSON.stringify(keyFiles, null, 2));
console.log("\n📐 Mapa de arquitectura:");
console.log(JSON.stringify(architectureMap, null, 2));

// Guardar reporte completo
const reportPath = path.join(BASE_DIR, "projectSmartReport.json");
fs.writeFileSync(reportPath, JSON.stringify({ tree, dependencies, architectureMap }, null, 2), "utf-8");

console.log(`\n✅ Reporte inteligente guardado en ${reportPath}`);
