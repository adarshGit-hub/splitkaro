import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load .env.local if present, else .env
let envFile = '.env.local';
if (!fs.existsSync(envFile)) {
  envFile = '.env';
}

const envContent = fs.readFileSync(envFile, 'utf-8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    dbUrl = trimmed.substring('DATABASE_URL='.length).trim();
    if ((dbUrl.startsWith('"') && dbUrl.endsWith('"')) || (dbUrl.startsWith("'") && dbUrl.endsWith("'"))) {
      dbUrl = dbUrl.slice(1, -1);
    }
  }
}

if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]')) {
  console.error('\n❌ DATABASE_URL is missing or contains [YOUR-PASSWORD] in ' + envFile);
  console.error('Please add your real database password to DATABASE_URL in ' + envFile + ':\n');
  console.error('DATABASE_URL=postgresql://postgres:your_actual_password@db.rdyzflhpclnwifzkwpuj.supabase.co:5432/postgres\n');
  process.exit(1);
}

console.log('🚀 Pushing migrations to remote Supabase database...');
try {
  execSync(`npx supabase db push --db-url "${dbUrl}"`, { stdio: 'inherit' });
  console.log('\n✅ Database schema successfully synchronized!');
} catch (err) {
  console.error('\n❌ Failed to push migrations:', err.message);
  process.exit(1);
}
