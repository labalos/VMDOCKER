const fs = require("fs");
const path = require("path");

// Configuración: carpeta raíz del proyecto
const ROOT_DIR = process.argv[2] || "."; // ./ si no se pasa argumento
const MAX_PREVIEW_LINES = 10; // Líneas que se tomarán como vista previa

// Tipos de archivos que vamos a analizar profundamente
const ANALYZE_EXTENSIONS = [".js", ".ts", ".jsx", ".tsx"];

// Función para leer contenido de archivo de manera segura
function readFilePreview(filePath, maxLines = 10) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/).slice(0, maxLines);
    return lines.join("\n");
  } catch (err) {
    return "";
  }
}

// Analiza tipo de contenido según extensión y keywords
function analyzeContent(filePath) {
  const ext = path.extname(filePath);
  const preview = readFilePreview(filePath, MAX_PREVIEW_LINES);

  const info = { preview, type: "unknown", exports: [], imports: [] };

  if (ANALYZE_EXTENSIONS.includes(ext)) {
    const content = fs.readFileSync(filePath, "utf-8");

    // Detectar exports
    const exportRegex = /(export\s+(default\s+)?(class|function|const|let|var)|module\.exports\s*=)/g;
    const exportsFound = [];
    let match;
    while ((match = exportRegex.exec(content))) exportsFound.push(match[0]);
    info.exports = exportsFound;

    // Detectar imports
    const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
    const importsFound = [];
    while ((match = importRegex.exec(content))) importsFound.push(match[1]);
    info.imports = importsFound;

    // Detectar clases y funciones
    if (/class\s+\w+/.test(content)) info.type = "class";
    else if (/function\s+\w+/.test(content) || /=>/.test(content)) info.type = "function";

    // Detectar Mongoose schemas
    if (/mongoose\.Schema/.test(content)) info.type = "mongoose_schema";

    // Detectar React components
    if (/React/.test(content) || /\.jsx?$/.test(ext)) {
      if (/return\s*\(.*<.*>.*\)/s.test(content)) info.isReactComponent = true;
    }
  }

  return info;
}

// Función recursiva para recorrer carpetas
function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const stats = fs.statSync(fullPath);

    if (item.isDirectory()) {
      result.push({
        name: item.name,
        path: fullPath,
        type: "directory",
        children: scanDirectory(fullPath),
      });
    } else {
      const fileInfo = {
        name: item.name,
        path: fullPath,
        type: "file",
        size: stats.size,
        extension: path.extname(item.name),
        content: analyzeContent(fullPath),
      };
      result.push(fileInfo);
    }
  }

  return result;
}

// Ejecutar
const projectTree = scanDirectory(ROOT_DIR);

// Guardar JSON
const outputFile = path.join(process.cwd(), "project_structure.json");
fs.writeFileSync(outputFile, JSON.stringify(projectTree, null, 2), "utf-8");

console.log(`✅ Project scan completed. JSON saved at: ${outputFile}`);
