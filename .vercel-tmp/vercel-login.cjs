#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const isWindows = os.platform() === 'win32';

const LOG_FILE = path.join(process.cwd(), '.vercel-tmp', 'login.log');

function log(msg) { console.error(msg); }

function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error')) {
      log(`✅ Already logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

function startLogin() {
  log('');
  log('Starting Vercel login...');
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    shell: isWindows
  });
  child.unref();
  log(`Login process started (PID: ${child.pid})`);
  return child.pid;
}

async function waitForUrl() {
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+/);
        if (match) return match[0];
      }
    } catch {}
  }
  return null;
}

async function main() {
  log('========================================');
  log('Vercel Login');
  log('========================================');
  log('');

  if (checkLoginStatus()) {
    process.exit(0);
  }

  startLogin();
  log('Waiting for authorization URL...');

  const url = await waitForUrl();
  
  if (url) {
    log('');
    log('========================================');
    log('Authorization required');
    log('========================================');
    log('');
    log('Please open this URL in your browser and click "Allow":');
    log('');
    log(`👉 [${url}](${url})`);
    log('');
    log('After completing authorization, tell me and I will configure the environment variables.');
  } else {
    log('Failed to get authorization URL');
    process.exit(1);
  }
}

main();
