#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';

function log(msg) { console.error(msg); }

function commandExists(cmd) {
  try {
    if (isWindows) {
      const result = spawnSync('where', [cmd], { stdio: 'ignore' });
      return result.status === 0;
    } else {
      const result = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' });
      return result.status === 0;
    }
  } catch { return false; }
}

function getCommandOutput(cmd, args) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch { return null; }
}

log('========================================');
log('Installing Vercel CLI...');
log('========================================');
log('');

if (commandExists('vercel')) {
  const version = getCommandOutput('vercel', ['--version']) || 'unknown';
  log(`Vercel CLI already installed: ${version}`);
  process.exit(0);
}

const pkgManager = commandExists('pnpm') ? 'pnpm' : commandExists('yarn') ? 'yarn' : commandExists('npm') ? 'npm' : null;

if (!pkgManager) {
  log('Error: No package manager found');
  process.exit(1);
}

log(`Using package manager: ${pkgManager}`);
log('');

const cmd = pkgManager === 'yarn' ? 'yarn' : pkgManager;
const args = pkgManager === 'yarn' ? ['global', 'add', 'vercel'] : pkgManager === 'pnpm' ? ['add', '-g', 'vercel'] : ['install', '-g', 'vercel'];

log(`Running: ${cmd} ${args.join(' ')}`);
log('');

const result = spawnSync(cmd, args, { stdio: 'inherit', shell: isWindows });

if (result.status === 0) {
  log('');
  log('✅ Vercel CLI installed successfully!');
} else {
  log('');
  log('❌ Installation failed');
  process.exit(1);
}
