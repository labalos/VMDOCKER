// scanProjectUltra.js - versión 3.0
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

// =====================
// FUNCIONES PRINCIPALES
// =====================

// Escaneo recursivo de directorios
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

// Extraer archivos clave por categoría
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

// Detectar dependencias desde package.json
function detectDependencies(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) return [];
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
}

// Detectar frameworks y servicios
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

// Escanear rutas y detectar métodos + modelo usado
function analyzeRoutes(routesFiles, modelsFiles) {
  const routeMap = [];

  routesFiles.forEach(routeFile => {
    const fullPath = path.join(BASE_DIR, routeFile);
    if (!fs.existsSync(fullPath)) return;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split(/\r?\n/);

    let currentRoute = null;
    let modelsUsed = [];

    // Detectar modelos requeridos
    modelsFiles.forEach(model => {
      const modelName = path.basename(model, path.extname(model));
      const regex = new RegExp(`require\\(['"\`].*${modelName}['"\`]\\)|import .*${modelName}.*from`, "i");
      if (regex.test(content)) modelsUsed.push(modelName);
    });

    // Detectar métodos HTTP y rutas
    const methodRegex = /(router|app)\.(get|post|put|delete|patch|all)\s*\(\s*['"`]([^'"`]+)['"`]/i;
    lines.forEach(line => {
      const match = methodRegex.exec(line);
      if (match) {
        routeMap.push({
          file: routeFile,
          method: match[2].toUpperCase(),
          path: match[3],
          modelsUsed
        });
      }
    });
  });

  return routeMap;
}

// Contar archivos totales
function countFiles(tree) {
  let count = 0;
  for (const node of tree) {
    if (node.type === "file") count++;
    else count += countFiles(node.children);
  }
  return count;
}

// Crear mapa de arquitectura completo
function createArchitectureMap(tree, keyFiles, services, containers, routeAnalysis) {
  return {
    backend: {
      frameworks: services.backendFrameworks,
      databases: services.databases,
      models: keyFiles.models || [],
      routes: keyFiles.routes || [],
      controllers: keyFiles.controllers || [],
      services: keyFiles.services || [],
      middleware: keyFiles.middleware || [],
      config: keyFiles.config || [],
      routeAnalysis
    },
    frontend: {
      frameworks: services.frontendFrameworks,
      files: keyFiles.frontend || []
    },
    tests: keyFiles.tests || [],
    containers
  };
}

// =====================
// EJECUCIÓN PRINCIPAL
// =====================
console.log(`🔎 Escaneando proyecto en: ${BASE_DIR}\n`);

const tree = scanDir(BASE_DIR);
const keyFiles = extractKeyFiles(tree);
const packageJsonPath = path.join(BASE_DIR, "package.json");
const dependencies = detectDependencies(packageJsonPath);
const services = detectServices(dependencies);
const containers = detectContainers(tree);
const routeAnalysis = analyzeRoutes(keyFiles.routes || [], keyFiles.models || []);
const architectureMap = createArchitectureMap(tree, keyFiles, services, containers, routeAnalysis);

// ======= MOSTRAR EN CONSOLA =======
console.log("🌳 Estructura de proyecto (resumen):");
console.log(`Total archivos: ${countFiles(tree)}`);
console.log(`Contenedores detectados: ${containers.join(", ") || "Ninguno"}`);
console.log("\n⚙️ Frameworks y servicios detectados:");
console.log(JSON.stringify(services, null, 2));
console.log("\n🗂 Archivos clave por categoría:");
console.log(JSON.stringify(keyFiles, null, 2));
console.log("\n📐 Diagrama de rutas + modelos:");
console.log(JSON.stringify(routeAnalysis, null, 2));
console.log("\n📂 Mapa de arquitectura completo:");
console.log(JSON.stringify(architectureMap, null, 2));

// ======= GUARDAR REPORTE COMPLETO =======
const reportPath = path.join(BASE_DIR, "projectUltraReport.json");
fs.writeFileSync(reportPath, JSON.stringify({ tree, dependencies, architectureMap }, null, 2), "utf-8");

console.log(`\n✅ Reporte ultra inteligente guardado en ${reportPath}`);
