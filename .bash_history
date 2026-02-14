sudo apt update
sudo apt upgrade -y
sudo apt install ca-certificates curl gnupg -y
sudo install -m [1~ -d /etc/apt/keyrings
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo mount /dev/cdrom /mnt
sudo /mnt/VBoxLinuxAdditions.run
sudo reboot
sudo apt update
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable"   | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
sudo usermod -aG docker $USER
exit
ls
ls
cd frontend/
mkdir src
ip a
ssh leo@192.168.1.28
leo@ServerDocker:~/frontend$ ssh leo@192.168.1.28
The authenticity of host '192.168.1.28 (192.168.1.28)' can't be established.
ED25519 key fingerprint is SHA256:EsShnrObuLIiMP21bRNcHl4PalSBmm6SWlI8R2BPs6Q.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
echo "hola"
tar --version
df -h
/home/leo/.vscode-server/
mkdir -p ~/.vscode-server
mkdir -p ~/.vscode-server/bin
ls -ld ~/.vscode-server
curl -X POST http://localhost:3000/proyectos   -H "Content-Type: application/json"   -d '{
    "titulo": "Casa de campo",
    "descripcion": "Construcción de vivienda rural",
    "imagen": "https://ejemplo.com/casa.jpg",
    "categoria": "Residencial",
    "fecha": "2024-10-01",
    "ubicacion": "Boyacá, Colombia"
  }'
ls
cd backend/
ls
nano server.js
nano database.js
docker pa
docker ps
ls
cd routes/
ls
nano proyectos.js 
cd ..
ls
cd models/
ls
nano Proyecto.js 
cd ..
ls
nano server.js 
cd routes/
ls
nano proyectos.js 
curl http://localhost:3000/proyectos
curl -X POST http://localhost:3000/proyectos   -H "Content-Type: application/json"   -d '{
    "titulo": "Casa moderna",
    "descripcion": "Proyecto de vivienda urbana",
    "imagen": "https://ejemplo.com/casa.jpg",
    "categoria": "Residencial",
    "fecha": "2024-10-01",
    "ubicacion": "Medellín, Colombia"
  }'
curl http://localhost:3000/proyectos
curl http://localhost:3000/proyectos/698232f61244f227ec1b0696
nano proyectos.js 
ls
cd ..
ls
nano proyectos.js 
cd ..
nano server.js
ls
cd backend/
ls
nano server.js 
cd routes/
ls
nano proyectos.js 
cd ..
ls
curl http://localhost:3000/proyectos/698232f61244f227ec1b0696
curl -X PUT http://localhost:3000/proyectos/TU_ID_AQUI   -H "Content-Type: application/json"   -d '{
    "titulo": "Título actualizado desde PUT"
  }'
curl -X PUT http://localhost:3000/proyectos/TU_ID_AQUI   -H "Conten//curl -X PUT http://localhost:3000/proyectos/TU_ID_AQUI \lication/json"   -d '{
    "titulo": "Título actualizado desde PUT"
  }'
curl -X PUT http://localhost:3000/proyectos/TU_ID_AQUI   -H "Content-Type: application/json"   -d '{
    "titulo": "Título actualizado desde PUT"
curl -X PUT http://localhost:3000/proyectos/TU_ID_AQUI   -H "Content-Type: application/json"   -d '{
    "titulo": "Título actualizado desde PUT"
curl -X PUT http://localhost:3000/proyectos/698232f61244f227ec1b0696   -H "Content-Type: application/json"   -d '{
    "titulo": "Título actualizado desde PUT"
  }'
curl -X DELETE http://localhost:3000/proyectos/698232f61244f227ec1b0696
cd ..
ls
npm create vite@latest frontend --template react
lsb_release -a
uname -m
docker ps
docker compose version
mkdir backend
cd backend/
ls
npm init -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
node -v
which node
which npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
npm install express
nano server.js
node server.js
npm install mongoose
nano database.js
nano server.js
sudo systemctl status mongod
curl -fsSL https://pgp.mongodb.com/server-7.0.asc |   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg   --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" |   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo apt purge mongodb mongodb-org* -y
lsb_release -a
sudo rm /etc/apt/sources.list.d/mongodb-org-7.0.list
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl disable mongod
sudo apt purge mongodb mongodb-org* -y
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
sudo rm /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo rm /usr/share/keyrings/mongodb-server-7.0.gpg
which mongod
docker run -d   --name mongodb   -p 27017:27017   -v mongodb_data:/data/db   mongo:7
docker ps
docker ps -a
docker logs mongodb
docker rm mongodb
docker run -d   --name mongodb   -p 27017:27017   -v mongodb_data:/data/db   mongo:4.4
docker ps
nano database.js
mkdir models
cd models/
nano Proyecto.js
cd ..
mkdir routes
ls
cd routes
ls
cd ..
ls
cd models/
ls
cd ..
ls
cd routes/
ls
nano proyectos.js
nano server.js
ls
cd ..
ls
nano server.js 
node server.js
nano server.js 
node server.js
nano server.js 
node server.js
nano database.js
node server.js
ls
cd routes/
ls
nano proyectos.js 
cd ..
sudo snap install postman
postman
curl -X POST http://localhost:3000/proyectos   -H "Content-Type: application/json"   -d '{
    "titulo": "Casa de campo",
    "descripcion": "Construcción de vivienda rural",
    "imagen": "https://ejemplo.com/casa.jpg",
    "categoria": "Residencial",
    "fecha": "2024-10-01",
    "ubicacion": "Boyacá, Colombia"
  }'
node server.js
ls
cd ..
ls
cd frontend/
ls
npm install
npm run dev
cd ..
ls
cd backend/
ls
npm install
npm start
cd ..
ls
cd frontend/
ls
npm install
npm run dev
npm run dev -- --host
vite.config.js
mongo
ls
cd backend/
mongo
ls
nano server.js
ls
npm install cors
const cors = require('cors');
nano server.js
ls
cd ..
ls
cd frontend/
ls
cd src/
ls
nano Proyectos.jsx 
ls
cd frontend/
ls
nano vite.config.js 
npm run dev
ls
cd frontend/
l
ls
cd ..
ls
cd backend/
ls
npm run dev
npm start
node server.js
ls
cd backend/
ls
ls
cd backend/
ls
nodo server.js
node server.js 
ls
cd backend/
ls
node server.js 
ls /home/leo/backend
ls /home/leo/backend/routes
ls
cd routes
ls
nano proyectos.js 
node server.js 
cd ..
node server.js 
ls
node server.js 
ls
cd ..
ls
cd frontend/
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
ls -l
npx tailwindcss init -p
ls node_modules/.bin
rm -rf node_modules package-lock.json
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx tailwindcss init 
touch tailwind.config.js
nano tailwind.config.js
touch postcss.config.js
nano postcss.config.js
nano src/index.css
npm run dev
npm run dev
ls
npm run dev
npm start
ls
cd backend/
ls
node migrarImagenes.js
npm run dev
npm install -D @tailwindcss/postcss
nano postcss.config.js
npm run dev
ls node_modules | grep tailwind
postcss.config.js
ls
nano postcss.config.js
nano tailwind.config.js
frontend/src/index.css
cd frontend/src/index.css
ls
cd src/
ls
ls src
cd ..
ls src
grep -R "background-color" -n src
npm run dev
src/index.css
ls
cd src
nano index.css
ls
nano Proyectos.jsx 
npm run dev
ls
cd ..
ls
nano postcss.config.js 
npm run dev
ls
mv postcss.config.js postcss.config.cjs
nano postcss.config.cjs
npm run dev
ls
cd src
ls
nano Proyectos.jsx 
npm run dev
ls -l
cd ..
ls -l
nano postcss.config.cjs
npm install autoprefixer
nano postcss.config.cjs
npm run dev
ls src
find . -name index.css
ls
cd src/
ls
nano App.jsx 
nano src/main.jsx
ls
nano main.jsx 
npm run dev
nano index.html
ls
cd ..
ls
nano index.html 
ls -l src
nano src/main.jsx
npm run dev
ls
cd src/
ls
nano App.jsx 
nano src/main.jsx
nano 
nano App.jsx 
nano main.jsx 
nano index.css 
nano custom.css
import './custom.css'
nano main.jsx
cd ..
npm run dev
ls
cd src/
ls
nano App.
nano App.jsx 
cd ..
npm run dev
npm uninstall tailwindcss postcss autoprefixer
tailwind.config.js
postcss.config.cjs
postcss.config.js
rm tailwind.config.js
rm postcss.config.cjs
rm postcss.config.js
nano src/index.css
rm src/custom.css
npm install bootstrap
nano src/main.jsx
ls
cd src/
ls
nano main.jsx 
nano src/App.jsx
ls
nano App.jsx 
cd ..
ls
npm run dev
ls
cd src/
ls
nano App.jsx 
npm run dev
ls 
cd backend/
ls
npn start
npm start
npm run dev
cd ..
npm start
ls
cd backend/
npm start
ls
npm install cloudinary multer multer-storage-cloudinary
ls
npm start
npm install uuid
npm start
npm install dotenv
npm start
ls
npm start
npm install sharp
npm start
cl
clear
npm start
hostname -I
npm start
PWD
pwd
npm install bcryptjs
npm install jsonwebtoken
npm start
npm list bcryptjs
bcryptjs@2.4.3
npm start
ls
cd backend/
ls
cd routes/
ls
cd ..
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{"username": "nuevoUsuario", "email": "usuario@ejemplo.com", "password": "miClaveSegura123"}'
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{"username": "nuevoUsuario", "email": "usuario@ejemplo.com", "password": "miClaveSegura123"}'
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{"email":"admin@miweb.com","password":"123456"}'
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@miweb.com","password":"123456"}'
curl -X POST http://192.168.1.28:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@miweb.com","password":"123456"}'
curl -X POST http://192.168.1.28:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@miweb.com","password":"123456"}'
cd ..
ls
cd frontend
LS
ls
code .
xdg-open index.html
firefox index.html
google-chrome index.html
ls
cd frontend/
pm run dev
npm run dev
ls
cd frontend/
npm list react-router-dom
npm install react-router-dom
ls
cd frontend/
npm run dev
cd backend/
ps aux | grep "node server.js"
sudo systemctl start mongod
docker start mongo
cd ..
docker start mongo
docker ps -a
docker start mongodb
docker ps
pkill -f "node server.js"
cd /home/leo/backend
node server.js
ls
cd back
cd backend/
npm start
cp verify-css-variables.js /home/leo/frontend/
cd ..
ls
cd frontend/
ls
clear
ls
cat > verify-css-variables.js << 'EOF'
#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS VARIABLES VERIFIER
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const CONFIG = {
  scanDirs: ['src/components', 'src/pages', 'src/styles'],
  extensions: ['.css', '.module.css'],
  ignoreFiles: ['variables.css', 'utilities.css', 'index.css'],
  
  validVariables: [
    '--color-primary', '--color-primary-hover', '--color-primary-light',
    '--color-secondary', '--color-secondary-hover', '--color-secondary-light',
    '--color-dark', '--color-gray-800', '--color-gray-600', '--color-gray-400',
    '--color-gray-300', '--color-gray-200', '--color-gray-100', '--color-light', '--color-white',
    '--color-success', '--color-success-light', '--color-error', '--color-error-light', '--color-warning',
    '--font-main',
    '--text-xs', '--text-sm', '--text-base', '--text-md', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl',
    '--font-normal', '--font-medium', '--font-semibold', '--font-bold', '--font-extrabold',
    '--leading-tight', '--leading-normal', '--leading-relaxed',
    '--tracking-tight', '--tracking-normal', '--tracking-wide', '--tracking-wider', '--tracking-widest',
    '--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6',
    '--space-8', '--space-10', '--space-12', '--space-16', '--space-20', '--space-24',
    '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-full',
    '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl',
    '--transition-fast', '--transition-normal', '--transition-slow',
    '--z-dropdown', '--z-sticky', '--z-fixed', '--z-modal-backdrop', '--z-modal', '--z-popover', '--z-tooltip'
  ],
  
  prohibitedPatterns: [
    { regex: /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/, name: 'Color HEX hardcodeado', severity: 'error' },
    { regex: /font-size:\s*(?!var\()[0-9]+(px|rem|em)/, name: 'Tamaño de fuente hardcodeado', severity: 'warning' },
    { regex: /padding:\s*(?!var\()[0-9]+px/, name: 'Padding en px hardcodeado', severity: 'warning' },
    { regex: /margin:\s*(?!var\()[0-9]+px/, name: 'Margin en px hardcodeado', severity: 'warning' },
    { regex: /border-radius:\s*(?!var\()[0-9]+px/, name: 'Border-radius hardcodeado', severity: 'warning' },
    { regex: /box-shadow:\s*(?!var\()[0-9]+px/, name: 'Box-shadow hardcodeado', severity: 'warning' }
  ]
};

const results = {
  filesChecked: 0,
  filesWithErrors: 0,
  filesWithWarnings: 0,
  totalErrors: 0,
  totalWarnings: 0,
  summary: { valid: [], invalid: [] }
};

async function getCssFiles(dir, files = []) {
  try {
    const items = await readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      if (itemStat.isDirectory()) {
        await getCssFiles(fullPath, files);
      } else {
        const isValidExt = CONFIG.extensions.some(validExt => item.endsWith(validExt));
        if (isValidExt && !CONFIG.ignoreFiles.includes(item)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {}
  return files;
}

function checkImports(content) {
  const hasVariablesImport = content.includes("@import") && 
    (content.includes("variables.css") || content.includes("utilities.css"));
  
  if (!hasVariablesImport) {
    return { type: 'error', message: 'No importa variables.css o utilities.css', line: null };
  }
  return null;
}

function findHardcodedValues(content) {
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) return;
    if (line.trim().startsWith('@import') || line.trim().startsWith('@media')) return;
    if (line.includes('url(') || line.includes('http')) return;
    
    CONFIG.prohibitedPatterns.forEach(pattern => {
      if (pattern.regex.test(line)) {
        const varRegex = /var\([^)]*\)/;
        if (!varRegex.test(line)) {
          issues.push({
            type: pattern.severity,
            message: `${pattern.name}: ${line.trim()}`,
            line: index + 1,
            code: line.trim()
          });
        }
      }
    });
  });
  
  return issues;
}

function checkVariableUsage(content) {
  const lines = content.split('\n');
  const issues = [];
  const varRegex = /var\((--[a-zA-Z0-9-]+)/g;
  let match;
  const usedVariables = new Set();
  
  while ((match = varRegex.exec(content)) !== null) {
    usedVariables.add(match[1]);
  }
  
  usedVariables.forEach(variable => {
    if (!CONFIG.validVariables.includes(variable)) {
      let lineNum = 1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(variable)) {
          lineNum = i + 1;
          break;
        }
      }
      issues.push({
        type: 'error',
        message: `Variable no definida: ${variable}`,
        line: lineNum,
        code: lines[lineNum - 1]?.trim()
      });
    }
  });
  
  return issues;
}

async function analyzeFile(filepath) {
  const content = await readFile(filepath, 'utf8');
  const filename = path.basename(filepath);
  const relativePath = path.relative(process.cwd(), filepath);
  
  results.filesChecked++;
  const fileIssues = [];
  
  const importIssue = checkImports(content);
  if (importIssue) fileIssues.push(importIssue);
  
  const hardcodedIssues = findHardcodedValues(content);
  fileIssues.push(...hardcodedIssues);
  
  const variableIssues = checkVariableUsage(content);
  fileIssues.push(...variableIssues);
  
  const errors = fileIssues.filter(i => i.type === 'error');
  const warnings = fileIssues.filter(i => i.type === 'warning');
  
  if (errors.length > 0) results.filesWithErrors++;
  if (warnings.length > 0) results.filesWithWarnings++;
  results.totalErrors += errors.length;
  results.totalWarnings += warnings.length;
  
  if (fileIssues.length === 0) {
    results.summary.valid.push(relativePath);
  } else {
    results.summary.invalid.push({ file: relativePath, issues: fileIssues });
  }
  
  return { file: relativePath, issues: fileIssues };
}

function printResults() {
  console.log(`\n${colors.bright}========================================${colors.reset}`);
  console.log(`${colors.bright}   BUILDPRO CSS VERIFIER RESULTS${colors.reset}`);
  console.log(`${colors.bright}========================================${colors.reset}\n`);
  
  console.log(`${colors.cyan}📊 RESUMEN:${colors.reset}`);
  console.log(`   Archivos verificados: ${results.filesChecked}`);
  console.log(`   ${colors.green}✓ Válidos: ${results.summary.valid.length}${colors.reset}`);
  console.log(`   ${colors.red}✗ Con errores: ${results.filesWithErrors}${colors.reset}`);
  console.log(`   ${colors.yellow}⚠ Con advertencias: ${results.filesWithWarnings}${colors.reset}`);
  console.log(`   Total errores: ${results.totalErrors}`);
  console.log(`   Total advertencias: ${results.totalWarnings}\n`);
  
  if (results.summary.invalid.length > 0) {
    console.log(`${colors.bright}🔍 DETALLES:${colors.reset}\n`);
    results.summary.invalid.forEach(({ file, issues }) => {
      console.log(`${colors.bright}${file}${colors.reset}`);
      issues.forEach(issue => {
        const icon = issue.type === 'error' ? `${colors.red}✗${colors.reset}` : `${colors.yellow}⚠${colors.reset}`;
        const type = issue.type === 'error' ? `${colors.red}[ERROR]${colors.reset}` : `${colors.yellow}[WARN]${colors.reset}`;
        console.log(`  ${icon} ${type} Línea ${issue.line || '?'}: ${issue.message}`);
        if (issue.code) console.log(`     ${colors.gray}→ ${issue.code}${colors.reset}`);
      });
      console.log('');
    });
  }
  
  if (results.summary.valid.length > 0) {
    console.log(`${colors.green}✓ ARCHIVOS VÁLIDOS (${results.summary.valid.length}):${colors.reset}`);
    results.summary.valid.slice(0, 5).forEach(file => {
      console.log(`   ${colors.green}✓${colors.reset} ${file}`);
    });
    if (results.summary.valid.length > 5) {
      console.log(`   ... y ${results.summary.valid.length - 5} más`);
    }
    console.log('');
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (results.totalErrors === 0 && results.totalWarnings === 0) {
    console.log(`${colors.green}🎉 ¡Todos los archivos cumplen con el sistema!${colors.reset}`);
    process.exit(0);
  } else if (results.totalErrors === 0) {
    console.log(`${colors.yellow}⚠ Revisar advertencias${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Se encontraron errores. Corregir antes de commit.${colors.reset}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  
  console.log(`${colors.cyan}🔍 BuildPro CSS Variables Verifier${colors.reset}`);
  console.log(`${colors.gray}Escaneando archivos CSS...${colors.reset}\n`);
  
  let allFiles = [];
  for (const dir of CONFIG.scanDirs) {
    const files = await getCssFiles(dir);
    allFiles.push(...files);
  }
  allFiles = [...new Set(allFiles)];
  
  if (allFiles.length === 0) {
    console.log(`${colors.yellow}⚠ No se encontraron archivos CSS${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`${colors.blue}📁 Encontrados ${allFiles.length} archivos CSS${colors.reset}\n`);
  
  for (const file of allFiles) {
    await analyzeFile(file);
  }
  
  printResults();
  
  if (jsonOutput) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: results.filesChecked,
        validFiles: results.summary.valid.length,
        invalidFiles: results.summary.invalid.length,
        totalErrors: results.totalErrors,
        totalWarnings: results.totalWarnings
      },
      validFiles: results.summary.valid,
      invalidFiles: results.summary.invalid
    };
    fs.writeFileSync('css-verifier-report.json', JSON.stringify(report, null, 2));
    console.log(`${colors.cyan}📄 Reporte JSON: css-verifier-report.json${colors.reset}`);
  }
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
EOF

chmod +x verify-css-variables.jscat > verify-css-variables.js << 'EOF'
#!/usr/bin/env node
/**
 * ============================================================
 * BUILDPRO CSS VARIABLES VERIFIER
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const CONFIG = {
  scanDirs: ['src/components', 'src/pages', 'src/styles'],
  extensions: ['.css', '.module.css'],
  ignoreFiles: ['variables.css', 'utilities.css', 'index.css'],
  
  validVariables: [
    '--color-primary', '--color-primary-hover', '--color-primary-light',
    '--color-secondary', '--color-secondary-hover', '--color-secondary-light',
    '--color-dark', '--color-gray-800', '--color-gray-600', '--color-gray-400',
    '--color-gray-300', '--color-gray-200', '--color-gray-100', '--color-light', '--color-white',
    '--color-success', '--color-success-light', '--color-error', '--color-error-light', '--color-warning',
    '--font-main',
    '--text-xs', '--text-sm', '--text-base', '--text-md', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl',
    '--font-normal', '--font-medium', '--font-semibold', '--font-bold', '--font-extrabold',
    '--leading-tight', '--leading-normal', '--leading-relaxed',
    '--tracking-tight', '--tracking-normal', '--tracking-wide', '--tracking-wider', '--tracking-widest',
    '--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6',
    '--space-8', '--space-10', '--space-12', '--space-16', '--space-20', '--space-24',
    '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-full',
    '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl',
    '--transition-fast', '--transition-normal', '--transition-slow',
    '--z-dropdown', '--z-sticky', '--z-fixed', '--z-modal-backdrop', '--z-modal', '--z-popover', '--z-tooltip'
  ],
  
  prohibitedPatterns: [
    { regex: /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/, name: 'Color HEX hardcodeado', severity: 'error' },
    { regex: /font-size:\s*(?!var\()[0-9]+(px|rem|em)/, name: 'Tamaño de fuente hardcodeado', severity: 'warning' },
    { regex: /padding:\s*(?!var\()[0-9]+px/, name: 'Padding en px hardcodeado', severity: 'warning' },
    { regex: /margin:\s*(?!var\()[0-9]+px/, name: 'Margin en px hardcodeado', severity: 'warning' },
    { regex: /border-radius:\s*(?!var\()[0-9]+px/, name: 'Border-radius hardcodeado', severity: 'warning' },
    { regex: /box-shadow:\s*(?!var\()[0-9]+px/, name: 'Box-shadow hardcodeado', severity: 'warning' }
  ]
};

const results = {
  filesChecked: 0,
  filesWithErrors: 0,
  filesWithWarnings: 0,
  totalErrors: 0,
  totalWarnings: 0,
  summary: { valid: [], invalid: [] }
};

async function getCssFiles(dir, files = []) {
  try {
    const items = await readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemStat = await stat(fullPath);
      if (itemStat.isDirectory()) {
        await getCssFiles(fullPath, files);
      } else {
        const isValidExt = CONFIG.extensions.some(validExt => item.endsWith(validExt));
        if (isValidExt && !CONFIG.ignoreFiles.includes(item)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {}
  return files;
}

function checkImports(content) {
  const hasVariablesImport = content.includes("@import") && 
    (content.includes("variables.css") || content.includes("utilities.css"));
  
  if (!hasVariablesImport) {
    return { type: 'error', message: 'No importa variables.css o utilities.css', line: null };
  }
  return null;
}

function findHardcodedValues(content) {
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) return;
    if (line.trim().startsWith('@import') || line.trim().startsWith('@media')) return;
    if (line.includes('url(') || line.includes('http')) return;
    
    CONFIG.prohibitedPatterns.forEach(pattern => {
      if (pattern.regex.test(line)) {
        const varRegex = /var\([^)]*\)/;
        if (!varRegex.test(line)) {
          issues.push({
            type: pattern.severity,
            message: `${pattern.name}: ${line.trim()}`,
            line: index + 1,
            code: line.trim()
          });
        }
      }
    });
  });
  
  return issues;
}

function checkVariableUsage(content) {
  const lines = content.split('\n');
  const issues = [];
  const varRegex = /var\((--[a-zA-Z0-9-]+)/g;
  let match;
  const usedVariables = new Set();
  
  while ((match = varRegex.exec(content)) !== null) {
    usedVariables.add(match[1]);
  }
  
  usedVariables.forEach(variable => {
    if (!CONFIG.validVariables.includes(variable)) {
      let lineNum = 1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(variable)) {
          lineNum = i + 1;
          break;
        }
      }
      issues.push({
        type: 'error',
        message: `Variable no definida: ${variable}`,
        line: lineNum,
        code: lines[lineNum - 1]?.trim()
      });
    }
  });
  
  return issues;
}

async function analyzeFile(filepath) {
  const content = await readFile(filepath, 'utf8');
  const filename = path.basename(filepath);
  const relativePath = path.relative(process.cwd(), filepath);
  
  results.filesChecked++;
  const fileIssues = [];
  
  const importIssue = checkImports(content);
  if (importIssue) fileIssues.push(importIssue);
  
  const hardcodedIssues = findHardcodedValues(content);
  fileIssues.push(...hardcodedIssues);
  
  const variableIssues = checkVariableUsage(content);
  fileIssues.push(...variableIssues);
  
  const errors = fileIssues.filter(i => i.type === 'error');
  const warnings = fileIssues.filter(i => i.type === 'warning');
  
  if (errors.length > 0) results.filesWithErrors++;
  if (warnings.length > 0) results.filesWithWarnings++;
  results.totalErrors += errors.length;
  results.totalWarnings += warnings.length;
  
  if (fileIssues.length === 0) {
    results.summary.valid.push(relativePath);
  } else {
    results.summary.invalid.push({ file: relativePath, issues: fileIssues });
  }
  
  return { file: relativePath, issues: fileIssues };
}

function printResults() {
  console.log(`\n${colors.bright}========================================${colors.reset}`);
  console.log(`${colors.bright}   BUILDPRO CSS VERIFIER RESULTS${colors.reset}`);
  console.log(`${colors.bright}========================================${colors.reset}\n`);
  
  console.log(`${colors.cyan}📊 RESUMEN:${colors.reset}`);
  console.log(`   Archivos verificados: ${results.filesChecked}`);
  console.log(`   ${colors.green}✓ Válidos: ${results.summary.valid.length}${colors.reset}`);
  console.log(`   ${colors.red}✗ Con errores: ${results.filesWithErrors}${colors.reset}`);
  console.log(`   ${colors.yellow}⚠ Con advertencias: ${results.filesWithWarnings}${colors.reset}`);
  console.log(`   Total errores: ${results.totalErrors}`);
  console.log(`   Total advertencias: ${results.totalWarnings}\n`);
  
  if (results.summary.invalid.length > 0) {
    console.log(`${colors.bright}🔍 DETALLES:${colors.reset}\n`);
    results.summary.invalid.forEach(({ file, issues }) => {
      console.log(`${colors.bright}${file}${colors.reset}`);
      issues.forEach(issue => {
        const icon = issue.type === 'error' ? `${colors.red}✗${colors.reset}` : `${colors.yellow}⚠${colors.reset}`;
        const type = issue.type === 'error' ? `${colors.red}[ERROR]${colors.reset}` : `${colors.yellow}[WARN]${colors.reset}`;
        console.log(`  ${icon} ${type} Línea ${issue.line || '?'}: ${issue.message}`);
        if (issue.code) console.log(`     ${colors.gray}→ ${issue.code}${colors.reset}`);
      });
      console.log('');
    });
  }
  
  if (results.summary.valid.length > 0) {
    console.log(`${colors.green}✓ ARCHIVOS VÁLIDOS (${results.summary.valid.length}):${colors.reset}`);
    results.summary.valid.slice(0, 5).forEach(file => {
      console.log(`   ${colors.green}✓${colors.reset} ${file}`);
    });
    if (results.summary.valid.length > 5) {
      console.log(`   ... y ${results.summary.valid.length - 5} más`);
    }
    console.log('');
  }
  
  console.log(`${colors.bright}========================================${colors.reset}`);
  if (results.totalErrors === 0 && results.totalWarnings === 0) {
    console.log(`${colors.green}🎉 ¡Todos los archivos cumplen con el sistema!${colors.reset}`);
    process.exit(0);
  } else if (results.totalErrors === 0) {
    console.log(`${colors.yellow}⚠ Revisar advertencias${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Se encontraron errores. Corregir antes de commit.${colors.reset}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  
  console.log(`${colors.cyan}🔍 BuildPro CSS Variables Verifier${colors.reset}`);
  console.log(`${colors.gray}Escaneando archivos CSS...${colors.reset}\n`);
  
  let allFiles = [];
  for (const dir of CONFIG.scanDirs) {
    const files = await getCssFiles(dir);
    allFiles.push(...files);
  }
  allFiles = [...new Set(allFiles)];
  
  if (allFiles.length === 0) {
    console.log(`${colors.yellow}⚠ No se encontraron archivos CSS${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`${colors.blue}📁 Encontrados ${allFiles.length} archivos CSS${colors.reset}\n`);
  
  for (const file of allFiles) {
    await analyzeFile(file);
  }
  
  printResults();
  
  if (jsonOutput) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: results.filesChecked,
        validFiles: results.summary.valid.length,
        invalidFiles: results.summary.invalid.length,
        totalErrors: results.totalErrors,
        totalWarnings: results.totalWarnings
      },
      validFiles: results.summary.valid,
      invalidFiles: results.summary.invalid
    };
    fs.writeFileSync('css-verifier-report.json', JSON.stringify(report, null, 2));
    console.log(`${colors.cyan}📄 Reporte JSON: css-verifier-report.json${colors.reset}`);
  }
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
EOF

chmod +x verify-css-variables.js
ls
chmod +x verify-css-variables.js
node verify-css-variables.js
ls
clear
ls
mv verify-css-variables.js verify-css-variables.cjs
node verify-css-variables.cjs
chmod +x fix-css-variables.cjs
node fix-css-variables.cjs
node verify-css-variables.cjs
npm run css:fix
npm run css:verify
clear
node fix-css-variables.cjs
node verify-css-variables.cjs
node fix-css-variables.cjs
node verify-css-variables.cjs
node fix-gradients.cjs
node verify-css-variables.cjs
node fix-gradients.cjs
node verify-css-variables.cjs
# Buscar todos los gradientes en los archivos problemáticos
grep -n "linear-gradient" src/components/Formulario.module.css
grep -n "linear-gradient" src/components/Login.module.css
grep -n "40px" src/components/AdminSolicitudes.module.css
node verify-css-variables.cjs
📊 RESUMEN:
npm install husky lint-staged --save-dev
npx husky-init
ls -la src/components/
clear
mkdir -p src/components/ui
head -100 src/components/Formulario.jsx
grep -l "bootstrap\|className.*container\|className.*row\|className.*col-\|className.*btn\|className.*form-" src/components/*.jsx src/*.jsx 2>/dev/null || echo "No se encontraron clases de Bootstrap"
ls
cd src/
ls
cd components/
ls
sed -i 's|const endpoint = "/api/solicitudes";|const endpoint = BACKEND_URL + "/api/solicitudes";|' src/components/Formulario.jsx
curl http://localhost:3000/api/solicitudes
clear
sed -i 's|const endpoint = "/api/solicitudes";|const endpoint = BACKEND_URL + "/api/solicitudes";|' src/components/Formulario.jsx
cds ..
cd ..
ls
cd ..
sed -i 's|const endpoint = "/api/solicitudes";|const endpoint = BACKEND_URL + "/api/solicitudes";|' Formulario.jsx
grep -n "endpoint" src/components/Formulario.jsx
ls -la src/components/Formulario.jsx src/components/Formulario.module.css
ls -la src/components/ui/
npm uninstall bootstrap
npm run build 2>&1 | head -20
ls -la src/App.css src/styles/variables.css
cat src/App.css
cat > src/App.css << 'EOF'
@import './styles/variables.css';

#root {
  width: 100%;
  min-height: 100vh;
}
EOF

npm run build
head -10 src/components/Hero.jsx
curl http://localhost:5173 2>/dev/null | head -5
cat src/components/Hero.module.css
npm run dev -- --host
npm run dev
ls
exir
exit
ls
cd backend/
npm start
cd frontend/
npm run dev 2>&1 | tail -30
cat src/components/Hero.jsx
clear
cd ..
ls
cd backend/
ls
npm start
ls
cd backend/
ls
npm start
ls
cd backend/
ls
npm start
docker ps -a | grep mongo
docker-compose ps 2>/dev/null || echo "No hay docker-compose activo"
docker-compose up -d mongo
docker start mongodb
docker ps | grep mongo
docker exec -it mongodb mongosh
clear
docker exec -it mongodb mongo
npm start
cd frontend/
git log --oneline -10 2>/dev/null || echo "No es un repositorio git"
ls -lt src/components/*.jsx | head -5
ls -lt src/components/*.css | head -5
npm run dev
const usuario = await Usuario.findOne({ email });
cd backend/
const usuario = await Usuario.findOne({ email });
ls
db.proyectos.find() exit
curl http://localhost:3001/api/proyectos
git init
git add .
git commit -m "Initial commit: Full Stack project"
git config --global user.email "abainf@gmail.com"
git config --global user.name "Leonardo"
git commit -m "Initial commit: Full Stack project"
git branch -m main
git remote add origin https://github.com/labalos/nombre-repo.git
git push -u origin main
curl http://localhost:3001/api/proyectos
curl -X POST http://localhost:3001/api/proyectos -H "Content-Type: application/json" -d '{"titulo": "Proyecto 1", "descripcion": "Descripción del proyecto", "categoria": "Categoría 1"}'
curl -X PUT http://localhost:3001/api/proyectos/<ID_DEL_PROYECTO> -H "Content-Type: application/json" -d '{"titulo": "Proyecto actualizado"}'
curl -X DELETE http://localhost:3001/api/proyectos/<ID_DEL_PROYECTO>
use <nombre_de_tu_base_de_datos>
db.proyectos.find()
cd frontend/
ls
curl http://localhost:3001/health
npm run dev
cd backend/
ls
npm start
npm install morgan
npm start# MongoDB
MONGO_URI=mongodb://localhost:27017/portafolio
# Puerto del backend
PORT=3001
NODE_ENV=development
# Cloudinary
CLOUDINARY_CLOUD_NAME=dz5f818wn
CLOUDINARY_API_KEY=225351326824431
CLOUDINARY_API_SECRET=_4MfOqWviAceCrGzYsR85-oIk44
# JWT
JWT_SECRET=unasecretomuylargo123
# Email
EMAIL_USER=abainf@gmail.com
EMAIL_PASS=eokbnkjiwdnrofoz
npm start
sed -i "s|require('../models/Proyecto')|require('../../models/Proyecto')|g" routes/admin/proyectos.js
sed -i "s|require(\"../middleware/auth\")|require(\"../../middleware/auth\")|g" routes/admin/proyectos.js
sed -i "s|require(\"../middleware/upload\")|require(\"../../middleware/upload\")|g" routes/admin/proyectos.js
cat routes/admin/proyectos.js | head -10
npm start
clear
npm start
mongod
docker run -d -p 27017:27017 --name mongodb mongo:latest
npm start
ps aux | grep mongod
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker start mongodb
docker ps | grep mongo
npm start
docker ps | grep mongo
docker start mongodb
sleep 20
npm start
docker logs mongodb
docker stop mongodb
docker rm mongodb
docker run -d -p 27017:27017 --name mongodb mongo:4.4
sleep 15
npm start
curl http://localhost:3001/health
curl http://localhost:3001/
curl http://localhost:3001/api/debug/auth
lsof -i :3001
pkill -f "node server.js"
npm start
curl http://localhost:3001/api/proyecto
npm start
clear
npm start
use <nombre_de_tu_base_de_datos>
db.proyectos.find()
clear
cd frontend/
npm run dev
ls
cd ..
ls
cd backend/
ls
clear
npm start
ss -ltnp | grep 3001
clear
node /home/leo/backend/scripts/create_admin.js
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"123456"}'
curl -i http://localhost:3001/health
node /home/leo/backend/scripts/create_admin.js
curl -i http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"123456"}'
cd ..
cd frontend/
ls
npm run dev
npm start
cd c
cd backend/
npm start
curl -X POST http://localhost:3001/api/proyectos -H "Content-Type: application/json" -d '{"titulo": "Proyecto 1", "descripcion": "Descripción del proyecto", "categoria": "Categoría 1"}'
npm start
curl http://localhost:3001/api/admin/proyectos
npm start
curl -i http://localhost:3001/api/proyectos
npm start
pkill -f "node server.js"
npm start
pkill -f "node server.js" || true
npm start
pkill -f "node server.js" || true
npm start
# Respaldar
cp /home/leo/backend/middleware/auth.js /home/leo/backend/middleware/auth.js.bak
# Eliminar cualquier línea que contenga 'router.'
sed -i '/router\./d' /home/leo/backend/middleware/auth.js
# Opcional: eliminar todo lo que esté después del cierre del middleware
awk 'BEGIN{p=1}/^};/{print; exit} p{print}' /home/leo/backend/middleware/auth.js > /home/leo/backend/middleware/auth.clean.js && mv /home/leo/backend/middleware/auth.clean.js /home/leo/backend/middleware/auth.js
pkill -f "node server.js" || true
npm start
curl -i http://localhost:3001/api/proyectos
npm start
pkill -f "node server.js" || true
npm start
curl -s http://localhost:3001/api/debug/db
npm start
mongosh
use proyectos_db
show collections
db.proyectos.countDocuments() db.proyectos.find().pretty()
curl -s http://localhost:3001/api/debug/db | jq
curl -s http://localhost:3001/api/debug/db/counts
npm start
clear
npm run start || node server.js
npm start
node /home/leo/backend/scripts/create_admin.js
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"123456"}'
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"123456"}'
cd /home/leo/backend
npm run start || node server.js
curl -i http://localhost:3001/health
cd /home/leo/backend
npm run start || node server.js
cd /home/leo
find frontend backend -mtime -1 -type f
cd /home/leo/frontend && rm -rf node_modules && npm ci
cd /home/leo/backend && rm -rf node_modules && npm ci
cd /home/leo/backend && node server.js
cd /home/leo/frontend && npm run dev
cd ..
cd backend/
cat .env | grep -E "(MONGO|DB|DATABASE)"
grep -r "MONGO" /home/leo/backend/*.js 2>/dev/null | grep -v node_modules
sed -i '/^MONGO_URI=/d' .env
sudo systemctl start mongod 2>/dev/null || docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo:latest
npm start
cd backend/
mongosh
echo $MONGODB_URI
curl -i "http://localhost:3001/api/proyectos"
curl -i "http://localhost:3001/api/proyectos?search=Demo&page=1&limit=5"
'/home/leo/backend/routes/solicitudes.js'clear
clear
curl -i "http://localhost:3001/api/proyectos"
curl -i "http://localhost:3001/api/proyectos?search=Demo&page=1&limit=5"
curl -i "http://localhost:3001/api/proyectos"
curl -i "http://localhost:3001/api/proyectos?search=Demo&page=1&limit=5"
use portafolio
show collections
db.proyectos.countDocuments() db.proyectos.find().pretty()
mongosh
npm start
curl -s http://localhost:3001/api/debug/db
npm start
curl -s http://localhost:3001/api/debug/db
curl -s http://localhost:3001/api/debug/db | jq
db.proyectos.find().pretty()
mongosh "mongodb://localhost:27017/proyectos_db"
npm start
grep -Rni "useNewUrlParser\|useUnifiedTopology" /home/leo/backend
npm start
curl -s http://localhost:3001/health
curl -s http://localhost:3001/api/debug/db
pkill -f "node server.js" || true
npm start
npm ls mongoose
grep -Rni "useNewUrlParser\|useUnifiedTopology" /home/leo/backend
pkill -f "node server.js" || true
npm start
curl -s http://localhost:3001/health
sed -i '/useNewUrlParser/d' /home/leo/backend/server.js
sed -i '/useUnifiedTopology/d' /home/leo/backend/server.js
sed -i "/mongoose\.set(.*useNewUrlParser.*)/d" /home/leo/backend/server.js
sed -i "/mongoose\.set(.*useUnifiedTopology.*)/d" /home/leo/backend/server.js
sed -i "s/mongoose\.connect(.*process\.env\.MONGO.*)/mongoose.connect(MONGODB_URI)/" /home/leo/backend/server.js
echo "Verificando líneas obsoletas:"
grep -Rni "useNewUrlParser\|useUnifiedTopology" /home/leo/backend/server.js || echo "OK: server.js limpio"
pkill -f "node server.js" || true
npm start
node /home/leo/backend/scripts/seed_proyectos.js
curl -s http://localhost:3001/api/debug/db/counts
curl -i http://localhost:3001/api/proyectos
clear
use proyectos_db
mongosh
curl -s http://localhost:3001/api/debug/db/counts
# Backend
npm start
# Frontend
cd /home/leo/frontend && npm run dev
npm run dev
clear
cd ..
ls
cd backend/
# Backend
cd /home/leo/backend
npm run start || node server.js
# Verifica que escucha
ss -ltnp | grep 3001
curl -i http://localhost:3001/health
curl -i http://192.168.1.28:3001/health
clear
npm run start || node server.js
ss -ltnp | grep 3001
curl -i http://localhost:3001/health
curl -i http://192.168.1.28:3001/health
curl -i http://localhost:3001/health
curl -i http://192.168.1.28:3001/health
curl -i http://localhost:3001/api/proyectos
curl -i http://192.168.1.28:3001/api/proyectos
cd /home/leo/frontend
npm run dev
cd /home/leo/frontend
npm run dev
cd ..
cd backend/
lsof -i -P | grep 30903
# Ver qué está haciendo el proceso ahora
strace -p 30903 -e trace=network 2>&1 | head -20
# Ver logs del proceso
cat /proc/30903/fd/1 2>/dev/null || echo "No hay logs accesibles"# Ver logs del proceso
cat /proc/30903/fd/1 2>/dev/null || echo "No hay logs accesibles"
ss -lntp | grep 3001 || lsof -i :3001
curl -i http://localhost:3001/health
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN>"
ss -tlnp | grep 3001
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: TU_TOKEN_AQUI"
grep -r "router\." /home/leo/backend/routes/ | grep -E "(get|post|put|patch|delete)" | head -20
curl http://localhost:3001/api/proyectos
clear
curl http://localhost:3001/api/admin/proyectos
curl "http://localhost:3001/api/admin/proyectos?search=proyecto&categoria=tecnologia"
curl http://localhost:3001/api/admin/proyectos
curl "http://localhost:3001/api/admin/proyectos?search=proyecto&categoria=tecnologia"
curl -X GET http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN_VALIDO>"
mongo
mongo --version
curl -i http://localhost:3001/api/proyectos
curl -X POST http://localhost:3001/api/proyectos -H "Content-Type: application/json" -d '{"titulo":"Demo","descripcion":"Proyecto demo","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
curl -X POST http://localhost:3001/api/admin/proyectos -H "Content-Type: application/json" -H "x-token: <TOKEN_VALIDO>" -d '{"titulo":"Admin Demo","descripcion":"Proyecto admin","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
clear
cd backend/
cd services/
cd ..
cd scripts
ls
node /home/leo/backend/scripts/seed_proyectos.js
curl -i http://localhost:3001/api/proyectos
node /home/leo/backend/scripts/seed_proyectos.js
mkdir -p /home/leo/backend/scripts
node /home/leo/backend/scripts/seed_proyectos.js
curl -i http://localhost:3001/api/proyectos
curl -X POST http://localhost:3001/api/proyectos -H "Content-Type: application/json" -d '{"titulo":"Demo","descripcion":"Proyecto demo","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
curl -X POST http://localhost:3001/api/proyectos -H "Content-Type: application/json" -H "x-token: <TOKEN_VALIDO>" -d '{"titulo":"Demo","descripcion":"Proyecto demo","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"nombre":"Admin","email":"admin@gmail.com","password":"123456"}'
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"123456"}'
curl -X POST http://localhost:3001/api/admin/proyectos -H "Content-Type: application/json" -H "x-token: <TOKEN_VALIDO>" -d '{"titulo":"Demo","descripcion":"Proyecto demo","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
curl -i http://localhost:3001/api/proyectos
node /home/leo/backend/scripts/seed_proyectos.js
curl -i http://localhost:3001/api/proyectos
curl -X POST http://localhost:3001/api/admin/proyectos -H "Content-Type: application/json" -H "x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGJhODRlY2NkYmE3MGIxN2RhNDVmMCIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzcwNzYwMjk5LCJleHAiOjE3NzA4NDY2OTl9.ZQNMHS3IFuhrH6hgMRqcYEZGuRT6GZWm6VUg573_ua0" -d '{"titulo":"Demo","descripcion":"Proyecto demo","categoria":"General","ubicacion":"CDMX","imagenes":[]}'
curl -i http://localhost:3001/api/proyectos
curl -i http://localhost:3001/api/proyectos/698ba89dccdba70b17da45f6
clear
curl -i http://localhost:3001/api/proyectos/698ba89dccdba70b17da45f6
curl -X PUT http://localhost:3001/api/proyectos/698ba89dccdba70b17da45f6 -H "Content-Type: application/json" -d '{"descripcion":"Proyecto demo actualizado"}'
curl -X PUT http://localhost:3001/api/admin/proyectos/698ba89dccdba70b17da45f6 -H "Content-Type: application/json" -H "x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -d '{"descripcion":"Proyecto demo actualizado"}'
pkill -f "node server.js" || true
npm start
curl -i http://localhost:3001/api/proyectos
curl -X GET http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN_VALIDO>"
curl -i http://localhost:3001/api/proyectos
curl -X GET http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN_VALIDO>"
curl -i http://localhost:3001/api/proyectos
curl -X GET http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN_VALIDO>"
mongosh "mongodb://localhost:27017/portafolio"
curl -s http://localhost:3001/api/debug/db
mongosh "mongodb://localhost:27017/portafolio"
use portafolio
show collections
db.proyectos.countDocuments() db.proyectos.find().pretty()
ss -ltnp | grep 27017
curl -s http://localhost:3001/api/debug/db
mongosh "mongodb://localhost:27017/portafolio"
mongosh
curl -i http://192.168.1.28:3001/api/proyectos
curl -i http://localhost:3001/health
curl -i http://192.168.1.28:3001/health
cd /home/leo/frontend
npm run dev
pkill -f "node server.js" || true
npm start
ss -ltnp | grep 3001
curl -i http://localhost:3001/health
curl -i http://192.168.1.28:3001/health
clear
cd ..
cd backend/
ls
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"tu_password"}'
clear
curl -s http://localhost:3001/api/debug/db/counts
clear
use proyectos_db
mongosh
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $(jq -r .token <<< '{"token":"'"$(localStorageToken)"'"}')"
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN>"
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"123456"}'
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN>"
cd /home/leo
git init
git add frontend backend
git commit -m "Estado estable"
cd backend/
npm start
curl -i http://localhost:3001/health
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN>"
curl -i http://localhost:3001/health
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: <TOKEN>"
ps aux | grep node
netstat -tlnp | grep 3001
ss -tlnp | grep 3001
cd /home/leo/backend && npm start 2>&1 | head -30
cd /home/leo/backend && npm start
ls
cd backend/
npm start
docker update --restart=always mongodb
docker inspect mongodb | grep -A 5 "RestartPolicy"
sudo reboot
ls
cd backend/
ls
npm start
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl start mongod
sudo systemctl status mongod
# Intenta arrancar backend y captura errores
cd /home/leo/backend && npm start 2>&1 | head -50
# Intenta arrancar frontend y captura errores
cd /home/leo/frontend && npm run dev 2>&1 | head -30
grep -r "Solicitud" /home/leo/backend/routes/ --include="*.js"
head -20 /home/leo/backend/models/Solicitudes.js
mv /home/leo/backend/models/Solicitudes.js /home/leo/backend/models/Solicitud.js
clear
cd ..
cd backend/
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: <TOKEN>"
ps aux | grep node
ls -la /home/leo/backend/models/
# Ejecuta estos comandos para cambiar Solicitudes a Solicitud
sed -i "s|models/Solicitudes|models/Solicitud|g" /home/leo/backend/routes/solicitudes.js
sed -i "s|models/Solicitudes|models/Solicitud|g" /home/leo/backend/routes/admin/solicitudes.js
# Verifica cambios
grep "require.*models" /home/leo/backend/routes/solicitudes.js
grep "require.*models" /home/leo/backend/routes/admin/solicitudes.js
cd /home/leo/backend
npm start
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: <TOKEN>"
# Puerto en .env
cat /home/leo/backend/.env | grep -i port
# Puerto en el que Node escucha
sudo ss -tlnp | grep node
ps aux | grep node
# Arranca MongoDB si no está
docker ps | grep mongo || docker run -d --name mongodb -p 27017:27017 -v /home/leo/mongo-data:/data/db mongo:6
# Levanta backend
cd /home/leo/backend
npm start
docker start mongodb
docker ps | grep mongo
cd /home/leo/backend && npm start
cd frontend/
npm run dev
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $TOKEN"
cd backend/
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $TOKEN"
echo "$TOKEN"
printf "%q\n" "$TOKEN"
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $TOKEN"
echo "$TOKEN"
const token = jwt.sign(
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
echo $JWT_SECRET
cd /home/leo/backend && npm start
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
curl -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
cleear
curl -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
curl -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"test":"hola"}'
cd /home/leo/backend && npm start
curl -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
grep -i JWT_SECRET /home/leo/backend/.env
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
docker exec -it mongodb mongosh proyectos_db --eval 'db.usuarios.find({email:"abainf@gmail.com"},{email:1,password:1,rol:1}).pretty()'
# Ver usuarios (host Linux, red host)
docker run --rm -it --network host mongodb/mongosh:2.2.6   mongosh "mongodb://localhost:27017/proyectos_db"   --eval 'db.usuarios.find({email:"abainf@gmail.com"},{email:1,password:1,rol:1}).pretty()'
# Promover a admin
docker run --rm -it --network host mongodb/mongosh:2.2.6   mongosh "mongodb://localhost:27017/proyectos_db"   --eval 'db.usuarios.updateOne({email:"abainf@gmail.com"},{$set:{rol:"admin"}})'
cd frontend/
npm run dev
cd /home/leo/backend && npm start
cd /home/leo/frontend && npm run dev
cd ba
cd..
cd fr
cd ..
cd bs
ba
cd backend/
clear
export TOKEN="$(curl -s http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"email":"abainf@gmail.com","password":"123456"}' | jq -r .token)"
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: $TOKEN"
curl -i http://localhost:3001/api/auth/me -H "x-token: $TOKEN"
curl -i http://localhost:3001/proyectos -H "x-token: $TOKEN"
curl -i http://localhost:3001/api/proyectos
GET http://localhost:3001/api/proyectos
# públicos
curl -i http://localhost:3001/api/proyectos
curl -i -X POST http://localhost:3001/api/solicitudes -H "Content-Type: application/json" -d '{"nombre":"Test","telefono":"555","service":"Pintura"}'
# auth y admin
TOKEN=$(curl -s http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"123456"}' | jq -r .token)
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $TOKEN"
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: $TOKEN"
mongosh
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
clear
cd backend/
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
cd /home/leo/backend && npm start
curl -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
curl -i -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"abainf@gmail.com","password":"abalos"}'
docker ps | grep mongo
cd /home/leo/backend && npm start
export TOKEN="eyJhbGciOi..."   # pega el token real del login
curl -i http://localhost:3001/api/admin/proyectos -H "x-token: $TOKEN"
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: $TOKEN"
ss -tlnp | grep 3001
docker ps | grep mongodb || docker start mongodb || docker run -d --name mongodb -p 27017:27017 -v /home/leo/mongo-data:/data/db mongo:6
cd /home/leo/backend
npm start
curl -i http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"abainf@gmail.com","password":"abalos"}'
# ¿Está escuchando?
ss -tlnp | grep 3001
# Arranca backend
cd /home/leo/backend
npm start
ss -tlnp | grep 3001
curl -X POST http://localhost:3001/api/solicitudes   -H "Content-Type: application/json"   -d '{"nombre":"Test User","telefono":"1234567890","service":"Instalación"}'
cd /home/leo/backend
npm start
curl -X POST http://localhost:3001/api/solicitudes   -H "Content-Type: application/json"   -d '{"nombre":"Otra Prueba","telefono":"0987654321","service":"Pintura"}'
TOKEN=<tu_token_jwt>
curl -i http://localhost:3001/api/admin/solicitudes -H "x-token: $TOKEN"
curl http://localhost:3001/api/admin/solicitudes   -H "x-token: TU_TOKEN_JWT"
cd /home/leo/backend && npm start
cd /home/leo/frontend && npm run dev
ls 
cd ..
ls
ls leo
cd leo
ls
clear
ls
cd backend/
ls
exit
ls
cd backend/
ls
npm start
docker compose down
docker compose up --build
npm start
docker compose down
docker compose pull
[200~docker compose down
docker compose down
mongodb  | {"t":{"$date":"..."},"s":"I", ... "msg":"Waiting for connections"}
curl http://localhost:3001/api/proyectos
docker compose restart frontend
docker compose down
docker compose up -d --build
grep -R "/api" -n frontend/src
cd backend/
curl -X POST http://localhost:3001/api/proyectos   -H "Content-Type: application/json"   -d '{
    "titulo": "Proyecto Test",
    "descripcion": "Este es un proyecto de prueba",
    "categoria": "General"
  }'
cd backend/
docker exec -it backend sh
docker ps -a
docker compose down -v
docker compose build --no-cache
docker ps
docker compose up
sudo lsof -i :5173
sudo kill -9 2399
sudo lsof -i :5173
docker compose up -d
docker ps
npm start
docker compose restart backend
curl -X POST http://localhost:3001/api/proyectos   -H "Content-Type: application/json"   -d '{"titulo":"Proyecto Test","descripcion":"Demo","categoria":"General"}'
docker exec -it backend sh
docker compose down
docker compose build --no-cache backend
docker compose up -d
docker compose down
docker compose build --no-cache backend
docker compose up -d
curl -X POST http://localhost:3001/api/proyectos   -H "Content-Type: application/json"   -d '{"titulo":"Proyecto Test","descripcion":"Demo","categoria":"General"}'
clear
grep -R "/api" -n frontend/src
Soy GitHub Copilot.
Tu Login.jsx ya está correcto usando import.meta.env.VITE_API_BASE. Falta actualizar las páginas que aún usan rutas “/api”.
Aplica estos cambios:
```jsx
// ...existing code...
import { fetchWithAuth } from '../helpers/fetchWithAuth';
// ...existing code...
async function cargarProtegida() {
  try {
    const res = await fetchWithAuth('/protegida', { method: 'GET' });
    // ...existing code...
  } catch (e) {
    // ...existing code...
  }
}
// ...existing code...
```
```jsx
// ...existing code...
useEffect(() => {
  const url = `${import.meta.env.VITE_API_BASE}/proyectos`;
  fetch(url)
    .then(r => {
      return r.json();
    })
    .then(setItems)
    .catch(e => alert(e.message));
}, []);
// ...existing code...
```
Reconstruye el frontend para cargar las env vars:
- docker compose down
- docker compose up --build -d
- docker logs -f frontend
Verifica que no quedan “/api” hardcodeados:
- grep -R "/api" -n frontend/src
clear
- grep -R "/api" -n frontend/src
grep -R "/api" -n frontend/src
npm run dev
cd frontend/
npm run dev
clear
npm run dev
rm -rf node_modules/.vite
clear
cd backend/\
ls
npm start
docker compose up -d
docker compose up -d frontend
docker logs frontend
docker compose down -v
own 5/5
docker compose down -v
docker compose up -d --build
docker ps -a
docker logs frontend
docker compose down -v
docker compose build --no-cache
docker compose up -d
docker ps
docker logs frontend
cd ..
cd frontend/
cd ..
cd backend/
docker compose up -d frontend
curl http://localhost:3001/api/proyectos
docker exec -it mongodb mongosh
docker exec -it mongodb mongo
docker ps
ls
cd ..
ls
docker compose down
docker compose up -d
docker ps
docker compose restart frontend
clear
docker compose down
docker compose up --build -d
docker logs -f frontend
ls
