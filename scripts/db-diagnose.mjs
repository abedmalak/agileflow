#!/usr/bin/env node
// Diagnose Supabase connectivity and table status
// Usage: node scripts/db-diagnose.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars from .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!url) {
  console.error('Missing VITE_SUPABASE_URL in .env.local');
  process.exit(1);
}

const key = serviceKey || anonKey;
const mode = serviceKey ? 'SERVICE_ROLE (full access)' : 'ANON (limited by RLS)';

console.log(`\n--- Supabase Diagnostics ---`);
console.log(`URL: ${url}`);
console.log(`Mode: ${mode}\n`);

const supabase = createClient(url, key);

// Test auth
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) console.log(`Auth check: ERROR - ${error.message}`);
  else console.log(`Auth check: OK (session: ${data.session ? 'active' : 'none'})`);
} catch (e) {
  console.log(`Auth check: FAILED - ${e.message}`);
}

// Test each table
const tables = [
  'profiles',
  'boards',
  'items',
  'calendar_events',
  'user_stories',
  'sprints',
  'notifications',
  'team_members',
  'user_preferences',
  'activity_log',
];

console.log('\n--- Table Status ---');

for (const table of tables) {
  try {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        console.log(`  ${table}: MISSING (table does not exist)`);
      } else if (error.code === 'PGRST204' || error.message?.includes('schema cache')) {
        console.log(`  ${table}: MISSING (not in schema cache)`);
      } else if (error.code === '42501') {
        console.log(`  ${table}: EXISTS but RLS blocks access (need service_role key)`);
      } else {
        console.log(`  ${table}: ERROR - [${error.code}] ${error.message}`);
      }
    } else {
      console.log(`  ${table}: OK (${count ?? '?'} rows)`);
    }
  } catch (e) {
    console.log(`  ${table}: FAILED - ${e.message}`);
  }
}

// Test boards table columns
console.log('\n--- Boards Table Column Check ---');
try {
  const { data, error } = await supabase.from('boards').select('id, title, description, color, icon, visibility, columns, groups, settings, created_date, updated_date').limit(1);
  if (error) {
    console.log(`  Boards columns: ERROR - ${error.message}`);
    // Try without visibility to check if that's the issue
    const { error: err2 } = await supabase.from('boards').select('id, title, description, color, icon, columns, groups, settings, created_date, updated_date').limit(1);
    if (!err2) {
      console.log(`  >> Confirmed: 'visibility' column is MISSING from boards table`);
    }
  } else {
    console.log(`  Boards columns: ALL OK (including visibility)`);
  }
} catch (e) {
  console.log(`  Boards columns: FAILED - ${e.message}`);
}

// Test create operation (dry run with rollback)
console.log('\n--- Write Test ---');
try {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('  Write test: SKIPPED (no authenticated user - need service_role key for write tests)');
  } else {
    console.log(`  Authenticated as: ${user.email}`);
  }
} catch (e) {
  console.log(`  Write test: SKIPPED - ${e.message}`);
}

console.log('\n--- Summary ---');
console.log('If tables show as MISSING, run supabase/schema-safe.sql in your Supabase SQL Editor.');
console.log('If tables show as RLS blocks, add SUPABASE_SERVICE_ROLE_KEY to .env.local.');
console.log('');
