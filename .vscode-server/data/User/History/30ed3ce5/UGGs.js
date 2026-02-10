// scanProject.js - versión avanzada
const fs = require("fs");
const path = require("path");

const BASE_DIR = path.resolve(__dirname);

// Tipos de archivos clave
const KEY_TYPES = {
  models: /models/i,
  routes: /routes/i,
  controllers: /controllers/i,
  services: /services/i,
  config: /config/i,
  middleware: /middleware/i,
  frontend: /frontend|client|react|vite|next/i
};

// Posibles servicios y DB a detectar
const DB_SERVICES = ["mongodb", "mongoose", "mysql", "pg", "postgresql", "redis", "firebase"];
const FRONTEND_FRAMEWORKS = ["react", "vite", "next", "vue", "angular"];
const BACKEND_FRAMEWORKS = ["express", "fastify", "koa", "nest"];

// Escanear directorios recursivamente
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

// Extraer archivos clave
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

// Detectar dependencias de package.json
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

// Imprimir árbol legible
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

// Mostrar árbol de proyecto
console.log("🌳 Estructura de proyecto:\n");
printTree(tree);

// Mostrar archivos clave
console.log("\n🗂 Archivos clave detectados:");
console.log(JSON.stringify(keyFiles, null, 2));

// Dependencias
console.log("\n📦 Dependencias detectadas en package.json:");
console.log(dependencies.join(", "));

// Frameworks y bases de datos
console.log("\n⚙️ Frameworks y servicios detectados:");
console.log(JSON.stringify(services, null, 2));

// Contenedores
console.log("\n🐳 Contenedores detectados:");
console.log(containers.join(", ") || "Ninguno detectado");

// Resumen final
const report = {
  baseDir: BASE_DIR,
  totalFiles: countFiles(tree),
  keyFiles,
  dependencies,
  services,
  containers
};

fs.writeFileSync(path.join(BASE_DIR, "projectScanReport.json"), JSON.stringify(report, null, 2), "utf-8");
console.log("\n✅ Reporte completo guardado en projectScanReport.json");
