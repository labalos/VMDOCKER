// splitJSON.js
// Uso: node splitJSON.js projectScan.json 1000
// 1000 = número máximo de líneas por fragmento

const fs = require("fs");
const path = require("path");

const [,, filePath, linesPerChunk = 500] = process.argv;

if (!filePath) {
  console.error("❌ Uso: node splitJSON.js <archivo.json> [líneas por fragmento]");
  process.exit(1);
}

const absPath = path.resolve(filePath);

if (!fs.existsSync(absPath)) {
  console.error(`❌ Archivo no encontrado: ${absPath}`);
  process.exit(1);
}

const content = fs.readFileSync(absPath, "utf-8");
const lines = content.split("\n");
const totalLines = lines.length;
const chunkSize = parseInt(linesPerChunk, 10);

console.log(`ℹ️ Total de líneas: ${totalLines}, Fragmento cada ${chunkSize} líneas`);

let chunkIndex = 1;
for (let i = 0; i < totalLines; i += chunkSize) {
  const chunkLines = lines.slice(i, i + chunkSize);
  const chunkFileName = `fragment_${chunkIndex}.json`;
  fs.writeFileSync(chunkFileName, chunkLines.join("\n"));
  console.log(`✅ Fragmento ${chunkIndex} guardado: ${chunkFileName}`);
  chunkIndex++;
}

console.log("🎉 Proceso completado. Ahora puedes copiar los fragmentos para enviármelos.");
