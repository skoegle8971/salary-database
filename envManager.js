// envManager.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = 'mongodb://localhost:27017/envmanager';

const envSchema = new mongoose.Schema({
  repoName: { type: String, required: true, unique: true },
  type: { type: String, enum: ['next', 'node'], required: true },
  envs: { type: Object },
  client: { type: Object },
  server: { type: Object }
});
const Env = mongoose.model('Env', envSchema);

function writeEnv(envObj, filePath) {
  const content = Object.entries(envObj).map(([k, v]) => `${k}=${v}`).join('\n');
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created: ${filePath}`);
}

function detectType(clientPath) {
  const pkgPath = path.join(clientPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (pkg.dependencies?.next || pkg.devDependencies?.next) {
      return 'next';
    }
  }
  return 'node';
}

async function run() {
  const basePath = process.cwd();
  const clientPath = path.join(basePath, 'client');
  const serverPath = path.join(basePath, 'server');

  if (!fs.existsSync(clientPath)) return console.error('❌ Missing ./client');
  if (!fs.existsSync(serverPath)) return console.error('❌ Missing ./server');

  const repoName = path.basename(basePath);
  const type = detectType(clientPath);
  console.log(`🔍 Detected repo: "${repoName}" (type: ${type})`);

  await mongoose.connect(MONGO_URI);
  const envData = await Env.findOne({ repoName });
  if (!envData) {
    console.error(`❌ No envs found in DB for "${repoName}"`);
    await mongoose.disconnect();
    return;
  }

  if (type === 'next') {
    if (envData.envs && Object.keys(envData.envs).length > 0) {
      writeEnv(envData.envs, path.join(basePath, '.env.local'));
    } else {
      console.warn('⚠️ No envs found for next project.');
    }
  } else {
    if (envData.client && Object.keys(envData.client).length > 0) {
      writeEnv(envData.client, path.join(clientPath, '.env'));
    }
    if (envData.server && Object.keys(envData.server).length > 0) {
      writeEnv(envData.server, path.join(serverPath, '.env'));
    }
  }

  await mongoose.disconnect();
  console.log('✅ Env files created.');
}

run().catch(console.error);
