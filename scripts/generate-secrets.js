#!/usr/bin/env node

/**
 * JWT Secret Generator
 * 
 * Generates cryptographically secure random secrets for JWT signing.
 * Run this to generate new secrets for production deployment.
 * 
 * Usage:
 *   npm run generate:secrets
 *   node scripts/generate-secrets.js
 *   node scripts/generate-secrets.js --output .env.production
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ===== CONFIGURATION =====
const SECRET_LENGTH = 64;  // 64 bytes = 512 bits
const SECRETS = {
  JWT_SECRET: 'JWT signing key (access tokens)',
  JWT_REFRESH_SECRET: 'JWT refresh token key (7 days)',
  ENCRYPTION_KEY: 'Data encryption key (passwords, sensitive data)',
};

// ===== HELPER FUNCTIONS =====

/**
 * Generate a cryptographically secure random secret
 * @param {number} length - Length in bytes
 * @returns {string} Base64-encoded secret
 */
function generateSecret(length = SECRET_LENGTH) {
  return crypto.randomBytes(length).toString('base64');
}

/**
 * Format secrets for environment file
 * @param {object} secrets - Object with secret names and descriptions
 * @returns {string} Formatted env content
 */
function formatSecretsForEnv(secrets) {
  let content = '# ===== GENERATED SECRETS - KEEP SAFE! =====\n';
  content += `# Generated: ${new Date().toISOString()}\n`;
  content += '# ⚠️  NEVER commit these to git!\n';
  content += '# ⚠️  Only share with authorized team members\n\n';

  Object.entries(secrets).forEach(([key, value]) => {
    content += `# ${value}\n`;
    content += `${key}=${value}\n\n`;
  });

  return content;
}

/**
 * Display secrets in terminal (with warnings)
 */
function displaySecrets(secrets) {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║          🔐 GENERATED SECRETS                       ║');
  console.log('║                                                    ║');
  console.log('║  ⚠️  SAVE THESE IN A SECURE LOCATION!             ║');
  console.log('║  ⚠️  ONLY SHARE WITH AUTHORIZED TEAM!             ║');
  console.log('║  ⚠️  NEVER COMMIT TO GIT!                         ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const generatedSecrets = {};
  Object.entries(secrets).forEach(([key, description]) => {
    const value = generateSecret();
    generatedSecrets[key] = value;
    console.log(`${key}:`);
    console.log(`  ${value}\n`);
  });

  return generatedSecrets;
}

/**
 * Save secrets to file with secure permissions
 * @param {string} filePath - File path to save to
 * @param {string} content - Content to write
 */
function saveSecretsToFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, { mode: 0o600 });
    console.log(`\n✅ Secrets saved to: ${filePath}`);
    console.log('📝 File permissions set to 0600 (secure)\n');
  } catch (err) {
    console.error(`❌ Failed to save to ${filePath}:`, err.message);
    process.exit(1);
  }
}

/**
 * Add secrets to existing .env file
 * @param {string} filePath - Path to .env file
 * @param {object} secrets - Secrets to add
 */
function addToExistingFile(filePath, secrets) {
  try {
    let existing = fs.readFileSync(filePath, 'utf8');
    const content = formatSecretsForEnv(secrets);
    
    if (existing.includes('JWT_SECRET')) {
      console.log('⚠️  JWT_SECRET already exists in file');
      console.log('   Remove old values first, then add new ones manually');
      return;
    }

    existing += '\n' + content;
    fs.writeFileSync(filePath, existing, { mode: 0o600 });
    console.log(`✅ Secrets appended to: ${filePath}\n`);
  } catch (err) {
    console.error(`❌ Error updating ${filePath}:`, err.message);
  }
}

// ===== MAIN EXECUTION =====

async function main() {
  console.log('\n🔐 JWT Secret Generator\n');

  const args = process.argv.slice(2);
  const outputFile = args.includes('--output') 
    ? args[args.indexOf('--output') + 1] 
    : null;

  // Generate secrets
  console.log('🔄 Generating cryptographically secure secrets...\n');
  const generatedSecrets = displaySecrets(SECRETS);

  // Formatting options
  console.log('📋 Formatting options:\n');
  console.log('1. Copy to .env file');
  console.log('2. Copy to new file\n');

  // If output file specified, save there
  if (outputFile) {
    const content = formatSecretsForEnv(generatedSecrets);
    saveSecretsToFile(outputFile, content);
    console.log(`Next step: Update your production .env with these values\n`);
    return;
  }

  // Default: show save instructions
  console.log('📝 Manual steps:\n');
  console.log('1. Open backend/.env (or your production config)');
  console.log('2. Replace or add these values:');
  console.log('   JWT_SECRET=[copypaste value above]');
  console.log('   JWT_REFRESH_SECRET=[copypaste value above]');
  console.log('   ENCRYPTION_KEY=[copypaste value above]\n');
  console.log('3. Do NOT commit .env to git');
  console.log('4. Verify secrets are set before deploying\n');

  // Verification guide
  console.log('✅ Verification:\n');
  console.log('To verify secrets are set:');
  console.log('  echo $JWT_SECRET');
  console.log('  echo $JWT_REFRESH_SECRET');
  console.log('  echo $ENCRYPTION_KEY\n');

  // Test generation performance
  console.log('⏱️  Performance test:\n');
  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    generateSecret();
  }
  const time = Date.now() - start;
  console.log(`  Generated 100 secrets in ${time}ms`);
  console.log(`  Average: ${(time / 100).toFixed(2)}ms per secret\n`);

  // Best practices
  console.log('🛡️  Security Best Practices:\n');
  console.log('1. ✅ Rotate secrets regularly (monthly)');
  console.log('2. ✅ Use different secrets for each environment');
  console.log('3. ✅ Store secrets in secure vault (not git)');
  console.log('4. ✅ Never log or print secrets in production');
  console.log('5. ✅ Audit secret access');
  console.log('6. ✅ Update all instances when rotating');
  console.log('7. ✅ Monitor for unauthorized access\n');

  // Token expiration
  console.log('⏳ Token Expiration Strategy:\n');
  console.log('  Access Token (JWT_SECRET):');
  console.log('    - Expiration: 1 hour');
  console.log('    - Used by: API endpoints');
  console.log('    - Leakage impact: Medium (7 days until full compromise)');
  console.log('');
  console.log('  Refresh Token (JWT_REFRESH_SECRET):');
  console.log('    - Expiration: 7 days');
  console.log('    - Used by: Token refresh endpoint');
  console.log('    - Leakage impact: High (7-day window)');
  console.log('');
  console.log('  Encryption Key (ENCRYPTION_KEY):');
  console.log('    - Expiration: Never (static)');
  console.log('    - Used by: Data encryption/decryption');
  console.log('    - Leakage impact: Critical (compromises all encrypted data)');
  console.log('');
}

// Run the generator
main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
