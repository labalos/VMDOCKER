// scanProjectUltraV3_1.js
const fs = require("fs");
const path = require("path");

const BASE_DIR = path.resolve(__dirname);

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

const DB_SERVICES = ["mongodb", "mongoose", "mysql", "pg", "postgresql", "redis", "firebase"];
const FRONTEND_FRAMEWORKS = ["react", "vite", "next", "vue", "angular"];
const BACKEND_FRAMEWORKS = ["express", "fastify", "koa", "nest"];

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

function detectDependencies(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) return [];
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
}

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

function analyzeRoutes(routesFiles, modelsFiles) {
  const routeMap = [];
  routesFiles.forEach(routeFile => {
    const fullPath = path.join(BASE_DIR, routeFile);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split(/\r?\n/);
    let modelsUsed = [];

    modelsFiles.forEach(model => {
      const modelName = path.basename(model, path.extname(model));
      const regex = new RegExp(`require\\(['"\`].*${modelName}['"\`]\\)|import .*${modelName}.*from`, "i");
      if (regex.test(content)) modelsUsed.push(modelName);
    });

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

function createPlantUML(routeAnalysis) {
  let uml = "@startuml\nskinparam arrowColor DeepSkyBlue\nskinparam classAttributeIconSize 0\n\n";
  const models = new Set();
  const routes = new Set();

  routeAnalysis.forEach(route => {
    const routeName = `${route.method} ${route.path}`;
    routes.add(routeName);
    route.modelsUsed.forEach(m => models.add(m));
  });

  models.forEach(m => uml += `class ${m} {\n}\n`);
  routes.forEach(r => uml += `class "${r}" as ${r.replace(/[^a-zA-Z0-9_]/g, "_")} <<Route>> {\n}\n`);

  routeAnalysis.forEach(route => {
    const routeName = `${route.method} ${route.path}`;
    route.modelsUsed.forEach(m => {
      const routeClass = routeName.replace(/[^a-zA-Z0-9_]/g, "_");
      uml += `${routeClass} --> ${m}\n`;
    });
  });

  uml += "\n@enduml";
  return uml;
}

function countFiles(tree) {
  let count = 0;
  for (const node of tree) {
    if (node.type === "file") count++;
    else count += countFiles(node.children);
  }
  return count;
}

// ===================
// EJECUCIÓN
// ===================
console.log(`🔎 Escaneando proyecto en: ${BASE_DIR}\n`);

const tree = scanDir(BASE_DIR);
const keyFiles = extractKeyFiles(tree);
const packageJsonPath = path.join(BASE_DIR, "package.json");
const dependencies = detectDependencies(packageJsonPath);
const services = detectServices(dependencies);
const containers = detectContainers(tree);
const routeAnalysis = analyzeRoutes(keyFiles.routes || [], keyFiles.models || []);
const plantUML = createPlantUML(routeAnalysis);

console.log("🌳 Resumen de proyecto:");
console.log(`Total archivos: ${countFiles(tree)}`);
console.log(`Contenedores detectados: ${containers.join(", ") || "Ninguno"}`);
console.log("\n⚙️ Servicios detectados:");
console.log(JSON.stringify(services, null, 2));
console.log("\n📐 Diagrama PlantUML generado (guarda en .puml para visualizar):\n");
console.log(plantUML);

const reportPath = path.join(BASE_DIR, "projectUltraV3_1Report.json");
fs.writeFileSync(reportPath, JSON.stringify({
  tree,
  dependencies,
  services,
  routeAnalysis,
  plantUML
}, null, 2), "utf-8");

fs.writeFileSync(path.join(BASE_DIR, "projectDiagram.puml"), plantUML, "utf-8");

console.log(`\n✅ Reporte guardado en ${reportPath}`);
console.log(`✅ Diagrama PlantUML guardado en projectDiagram.puml`);
