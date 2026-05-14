#!/usr/bin/env node
// Run SQL migrations against Supabase
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
// Usage: node scripts/db-migrate.mjs <sql-file-or-inline-sql>
// Examples:
//   node scripts/db-migrate.mjs supabase/schema-safe.sql
//   node scripts/db-migrate.mjs "ALTER TABLE boards ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private'"

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing required env vars in .env.local:');
  if (!url) console.error('  - VITE_SUPABASE_URL');
  if (!serviceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY (find in Supabase > Settings > API > service_role)');
  process.exit(1);
}

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/db-migrate.mjs <sql-file-or-inline-sql>');
  process.exit(1);
}

// Determine if input is a file path or inline SQL
let sql;
try {
  const filePath = resolve(process.cwd(), input);
  sql = readFileSync(filePath, 'utf8');
  console.log(`Running SQL from file: ${input}`);
} catch {
  sql = input;
  console.log(`Running inline SQL: ${sql.substring(0, 100)}...`);
}

// Execute via Supabase REST API (pg_net or direct SQL)
const restUrl = `${url}/rest/v1/rpc/`;

// Try using the SQL execution endpoint
try {
  const response = await fetch(`${url}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Fallback: try the management API SQL endpoint
    const projectRef = url.match(/https:\/\/(\w+)\.supabase/)?.[1];
    if (projectRef) {
      const mgmtResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ query: sql }),
      });

      if (mgmtResponse.ok) {
        const result = await mgmtResponse.json();
        console.log('Migration completed successfully.');
        if (result.length) console.log('Result:', JSON.stringify(result, null, 2));
      } else {
        const err = await mgmtResponse.text();
        console.error(`Migration API returned ${mgmtResponse.status}: ${err}`);
        console.log('\nFallback: Copy and paste the SQL into Supabase SQL Editor.');
        console.log('Or use: npx supabase db execute --project-ref', projectRef);
      }
    }
  } else {
    const result = await response.json();
    console.log('Migration completed successfully.');
    if (result) console.log('Result:', JSON.stringify(result, null, 2));
  }
} catch (error) {
  console.error('Migration failed:', error.message);
  console.log('\nAlternative: Use Supabase CLI:');
  console.log('  npx supabase login');
  const projectRef = url.match(/https:\/\/(\w+)\.supabase/)?.[1];
  if (projectRef) {
    console.log(`  npx supabase link --project-ref ${projectRef}`);
  }
  console.log('  npx supabase db execute --file supabase/schema-safe.sql');
}
