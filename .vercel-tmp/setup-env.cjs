#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const isWindows = os.platform() === 'win32';

const PROJECT_DIR = process.cwd();

function log(msg) { console.error(msg); }

function runVercelEnvAdd(name, value, environments = ['production', 'preview', 'development']) {
  log(`\n📝 Configuring: ${name}`);
  
  // Read env value from .env.local if not provided
  let envValue = value;
  if (!envValue) {
    const envFile = path.join(PROJECT_DIR, '.env.local');
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      const match = content.match(new RegExp(`^${name}=["']?([^"'\r\n]+)["']?`, 'm'));
      if (match) {
        envValue = match[1];
        log(`  ✓ Read from .env.local`);
      }
    }
  }
  
  if (!envValue) {
    log(`  ⚠️  Skipping (no value found)`);
    return false;
  }
  
  // Add environment variable to Vercel
  for (const env of environments) {
    const result = spawnSync('vercel', ['env', 'add', name, env, '--yes', envValue], {
      cwd: PROJECT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: isWindows
    });
    
    if (result.status === 0) {
      log(`  ✓ Added to ${env}`);
    } else {
      log(`  ⚠️  Failed for ${env}: ${result.stderr?.trim() || result.stdout?.trim()}`);
    }
  }
  
  return true;
}

async function main() {
  log('========================================');
  log('Configuring Vercel Environment Variables');
  log('========================================');
  log('');
  
  // Check if logged in
  const whoami = spawnSync('vercel', ['whoami'], { 
    encoding: 'utf8', 
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWindows 
  });
  
  if (whoami.status !== 0 || whoami.stdout.includes('Error')) {
    log('❌ Not logged in to Vercel');
    log('Please run login first');
    process.exit(1);
  }
  
  log(`✓ Logged in as: ${whoami.stdout.trim()}`);
  log('');
  
  const variables = [
    { name: 'NEXT_PUBLIC_SITE_URL', value: 'https://stepmotech.online' },
    { name: 'NEXTAUTH_URL', value: 'https://stepmotech.online' },
    { name: 'EMAIL_FROM', value: 'STEPMOTECH <noreply@stepmotech.online>' },
    { name: 'DATABASE_URL', value: null }, // Will read from .env.local
    { name: 'AUTH_SECRET', value: null },
    { name: 'RESEND_API_KEY', value: null },
    { name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', value: 'G-XXXXXXXXXX' },
    { name: 'STRIPE_SECRET_KEY', value: 'sk_test_your_stripe_secret_key_here' },
    { name: 'STRIPE_PUBLISHABLE_KEY', value: 'pk_test_your_stripe_publishable_key_here' },
    { name: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_your_stripe_webhook_secret_here' },
    { name: 'ALIYUN_OSS_ACCESS_KEY_ID', value: null },
    { name: 'ALIYUN_OSS_ACCESS_KEY_SECRET', value: null },
    { name: 'ALIYUN_OSS_BUCKET', value: null },
    { name: 'ALIYUN_OSS_ENDPOINT', value: null },
    { name: 'ALIYUN_OSS_REGION', value: null },
    { name: 'ALIYUN_OSS_DOMAIN', value: null },
  ];
  
  let successCount = 0;
  
  for (const variable of variables) {
    if (runVercelEnvAdd(variable.name, variable.value)) {
      successCount++;
    }
  }
  
  log('');
  log('========================================');
  log(`✅ Configuration Complete!`);
  log(`   ${successCount}/${variables.length} variables configured`);
  log('========================================');
  log('');
  log('⚠️  Important:');
  log('1. Update placeholder values in Vercel Dashboard');
  log('2. Set real Stripe keys from https://dashboard.stripe.com');
  log('3. Set real GA4 Measurement ID from https://analytics.google.com');
  log('4. Verify DATABASE_URL is correct');
  log('');
  log('Dashboard: https://vercel.com/dashboard');
}

main();
