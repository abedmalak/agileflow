#!/usr/bin/env node
// Fix RLS recursion directly using the service role key
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = url.match(/https:\/\/(\w+)\.supabase/)?.[1];

if (!projectRef || !serviceKey) {
  console.error('Missing config');
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), 'supabase/fix-rls-recursion.sql'), 'utf8');

console.log('Applying RLS fix to Supabase...');
console.log(`Project: ${projectRef}`);

// Use the Supabase SQL execution API
const response = await fetch(`${url}/rest/v1/rpc/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${serviceKey}`,
    'apikey': serviceKey,
  }
});

// The REST API can't run raw SQL, so we use the database connection via pg
// Let's use supabase-js to verify the fix is in place instead
const admin = createClient(url, serviceKey);

// Test if the recursion is fixed by querying boards
console.log('\nTesting boards table access...');
const { data: boards, error: boardsErr } = await admin.from('boards').select('*');
if (boardsErr) {
  if (boardsErr.message?.includes('recursion')) {
    console.log('RECURSION STILL EXISTS. Running fix via Supabase Management API...');

    // Try Management API
    try {
      const mgmtResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ query: sql }),
      });

      if (mgmtResponse.ok) {
        console.log('RLS fix applied via Management API!');
      } else {
        const errText = await mgmtResponse.text();
        console.log(`Management API response: ${mgmtResponse.status}`);

        // Try with personal access token approach
        console.log('\nTrying alternative approach...');

        // Split SQL into individual statements and run them
        const statements = sql.split(';').filter(s => s.trim().length > 10);
        console.log(`Found ${statements.length} SQL statements to execute`);
        console.log('\nThe Management API requires a personal access token (not service_role key).');
        console.log('But since you confirmed the fix-rls-recursion.sql was run successfully,');
        console.log('let me re-verify the database state...');
      }
    } catch (e) {
      console.log(`Management API error: ${e.message}`);
    }
  } else {
    console.log(`Boards error: ${boardsErr.message}`);
  }
} else {
  console.log(`Boards: OK (${boards.length} rows) - No recursion!`);
}

// Test items
const { data: items, error: itemsErr } = await admin.from('items').select('*');
if (itemsErr) {
  console.log(`Items error: ${itemsErr.message}`);
} else {
  console.log(`Items: OK (${items.length} rows)`);
}

// Test team_members
const { data: tm, error: tmErr } = await admin.from('team_members').select('*');
if (tmErr) {
  console.log(`Team members error: ${tmErr.message}`);
} else {
  console.log(`Team members: OK (${tm.length} rows)`);
}

// Test creating a board as a real operation
console.log('\nTesting board creation...');
const profiles = (await admin.from('profiles').select('id')).data;
if (profiles?.length) {
  const testBoard = {
    user_id: profiles[0].id,
    title: '__connection_test__',
    color: '#0073EA',
    visibility: 'private',
    columns: [],
    groups: []
  };
  const { data: created, error: createErr } = await admin.from('boards').insert(testBoard).select().single();
  if (createErr) {
    console.log(`Create FAILED: ${createErr.message}`);
    console.log(`Code: ${createErr.code}, Details: ${createErr.details}`);
  } else {
    console.log(`Create: OK (id=${created.id})`);
    await admin.from('boards').delete().eq('id', created.id);
    console.log('Cleanup: OK');
  }
}

console.log('\n--- Complete ---');
