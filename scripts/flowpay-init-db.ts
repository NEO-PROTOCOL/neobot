#!/usr/bin/env node
/**
 * FlowPay Database Initialization Script
 * NEØ Protocol - Initialize SQLite database
 */

import { getDatabase, listProducts, closeDatabase } from '../src/infra/database/flowpay.js';

console.log('════════════════════════════════════════');
console.log('  FlowPay Database Initialization');
console.log('  NEØ Protocol · SQLite Setup');
console.log('════════════════════════════════════════\n');

try {
  // Initialize database (creates schema if needed)
  const db = getDatabase();
  
  console.log('✅ Database initialized successfully');
  console.log(`   Location: data/flowpay/flowpay.db\n`);
  
  // List initial products
  const products = listProducts();
  
  console.log(`📦 Products loaded: ${products.length}`);
  products.forEach(p => {
    console.log(`   - ${p.ref}: ${p.name} (R$ ${p.price_brl})`);
  });
  
  console.log('\n✅ FlowPay database ready!');
  console.log('   Run: moltbot flowpay:buy --help\n');
  
  closeDatabase();
  process.exit(0);
  
} catch (error: any) {
  console.error('❌ Error initializing database:');
  console.error(error.message);
  process.exit(1);
}
