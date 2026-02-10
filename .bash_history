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
