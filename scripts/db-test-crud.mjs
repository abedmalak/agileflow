#!/usr/bin/env node
// Test CRUD operations against Supabase
// Usage: node scripts/db-test-crud.mjs

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
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!serviceKey) {
  console.error('Need SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Service role client (bypasses RLS)
const admin = createClient(url, serviceKey);
// Anon client (uses RLS)
const anon = createClient(url, anonKey);

console.log('--- Testing CRUD Operations ---\n');

// Get existing users
const { data: profiles } = await admin.from('profiles').select('id, email, full_name');
console.log(`Users in system: ${profiles?.length || 0}`);
profiles?.forEach(p => console.log(`  - ${p.email} (${p.full_name || 'no name'}) [${p.id}]`));

if (!profiles?.length) {
  console.log('\nNo users found. Cannot test authenticated operations.');
  process.exit(0);
}

const testUserId = profiles[0].id;
console.log(`\nTesting with user: ${profiles[0].email}\n`);

// Test 1: Create a board (service role, impersonating user)
console.log('Test 1: CREATE board (service role)...');
try {
  const { data, error } = await admin.from('boards').insert({
    user_id: testUserId,
    title: 'Test Board',
    description: 'Testing CRUD',
    color: '#0073EA',
    visibility: 'private',
    columns: [
      { id: 'task', title: 'Task', type: 'text', width: 250 },
      { id: 'status', title: 'Status', type: 'status', width: 150 }
    ],
    groups: [{ id: 'group1', title: 'Default', color: '#0073EA', collapsed: false }]
  }).select().single();

  if (error) {
    console.log(`  FAILED: ${error.message}`);
    console.log(`  Code: ${error.code}`);
    console.log(`  Details: ${error.details}`);
  } else {
    console.log(`  SUCCESS: Board created with id=${data.id}`);

    // Test 2: Read it back
    console.log('\nTest 2: READ board...');
    const { data: read, error: readErr } = await admin.from('boards').select('*').eq('id', data.id).single();
    if (readErr) console.log(`  FAILED: ${readErr.message}`);
    else console.log(`  SUCCESS: ${read.title} (visibility=${read.visibility})`);

    // Test 3: Create an item on the board
    console.log('\nTest 3: CREATE item on board...');
    const { data: item, error: itemErr } = await admin.from('items').insert({
      board_id: data.id,
      group_id: 'group1',
      title: 'Test Task',
      data: { status: 'Not Started', priority: 'medium' }
    }).select().single();
    if (itemErr) {
      console.log(`  FAILED: ${itemErr.message}`);
      console.log(`  Code: ${itemErr.code}`);
    } else {
      console.log(`  SUCCESS: Item created with id=${item.id}`);
    }

    // Test 4: List boards (anon key, needs auth session to work via RLS)
    console.log('\nTest 4: LIST boards (service role)...');
    const { data: boards, error: listErr } = await admin.from('boards').select('*').eq('user_id', testUserId);
    if (listErr) console.log(`  FAILED: ${listErr.message}`);
    else console.log(`  SUCCESS: ${boards.length} board(s) found`);

    // Test 5: List items
    console.log('\nTest 5: LIST items (service role)...');
    const { data: items, error: itemsErr } = await admin.from('items').select('*').eq('board_id', data.id);
    if (itemsErr) console.log(`  FAILED: ${itemsErr.message}`);
    else console.log(`  SUCCESS: ${items.length} item(s) found`);

    // Cleanup
    console.log('\nCleaning up test data...');
    if (item) await admin.from('items').delete().eq('id', item.id);
    await admin.from('boards').delete().eq('id', data.id);
    console.log('  Cleaned up.');
  }
} catch (e) {
  console.log(`  ERROR: ${e.message}`);
}

// Test 6: Check RLS with anon key (no session = should return empty, not error)
console.log('\nTest 6: LIST boards (anon key, no session)...');
const { data: anonBoards, error: anonErr } = await anon.from('boards').select('*');
if (anonErr) {
  console.log(`  ERROR: ${anonErr.message}`);
  if (anonErr.message.includes('recursion')) {
    console.log('  >> RLS RECURSION STILL EXISTS! Run supabase/fix-rls-recursion.sql');
  }
} else {
  console.log(`  OK: ${anonBoards.length} boards (expected 0 with no auth session)`);
}

console.log('\n--- Done ---');
