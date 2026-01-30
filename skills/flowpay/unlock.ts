/**
 * FlowPay Unlock Skill
 * Transform PAID status into ACCESS
 * 
 * This is the CORE of Model B:
 * Payment → Access Unlock (not token)
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export const metadata = {
  name: 'flowpay:unlock',
  description: 'Issue access unlock after payment confirmation',
  category: 'flowpay',
  tags: ['unlock', 'access', 'auth', 'receipt'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'critical'
};

interface UnlockInput {
  charge_id: string;
  force?: boolean; // skip payment check (admin override)
}

interface UnlockReceipt {
  receipt_id: string;
  charge_id: string;
  paid_at: string;
  customer_ref: string;
  product_ref: string;
  amount_brl: number;
  permissions: string[];
  access_url: string;
  unlock_token: string; // JWT or signed payload
  issuer: 'FlowPay' | 'Neobot';
  signature: string;
  metadata?: Record<string, any>;
  blockchain_anchor?: {
    tx_hash?: string;
    network?: string;
    token_id?: string;
  };
}

interface UnlockOutput {
  success: boolean;
  receipt?: UnlockReceipt;
  message?: string;
  error?: string;
}

export async function execute(ctx: any, input: UnlockInput): Promise<UnlockOutput> {
  const { charge_id, force } = input;

  if (!charge_id) {
    return {
      success: false,
      error: 'Missing required field: charge_id'
    };
  }

  try {
    // Step 1: Verify payment status (unless forced)
    if (!force) {
      const statusCheck = await ctx.skills?.execute('flowpay:status', { charge_id });
      
      if (!statusCheck || statusCheck.status !== 'PAID') {
        return {
          success: false,
          error: `Payment not confirmed. Status: ${statusCheck?.status || 'unknown'}`
        };
      }
    }

    // Step 2: Get payment details
    // (In real implementation, fetch from FlowPay API or cache)
    const paymentDetails = {
      charge_id,
      paid_at: new Date().toISOString(),
      customer_ref: '+5562983231110', // TODO: fetch real
      product_ref: 'smart-factory-basic', // TODO: fetch real
      amount_brl: 99.90 // TODO: fetch real
    };

    // Step 3: Determine permissions based on product
    const permissions = getPermissionsForProduct(paymentDetails.product_ref);

    // Step 4: Generate unlock token (JWT-like)
    const unlockToken = generateUnlockToken(paymentDetails.customer_ref, permissions);

    // Step 5: Determine access URL
    const accessUrl = getAccessUrlForProduct(paymentDetails.product_ref);

    // Step 6: Create UNLOCK_RECEIPT
    const receipt: UnlockReceipt = {
      receipt_id: crypto.randomUUID(),
      charge_id: paymentDetails.charge_id,
      paid_at: paymentDetails.paid_at,
      customer_ref: paymentDetails.customer_ref,
      product_ref: paymentDetails.product_ref,
      amount_brl: paymentDetails.amount_brl,
      permissions,
      access_url: accessUrl,
      unlock_token: unlockToken,
      issuer: 'Neobot',
      signature: generateSignature(paymentDetails)
    };

    // Step 7: Store receipt (file log for MVP)
    await storeReceipt(receipt);

    // Step 8: Log in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'system',
        channel: 'flowpay',
        action: 'access_unlocked',
        data: {
          receipt_id: receipt.receipt_id,
          charge_id,
          customer_ref: receipt.customer_ref,
          product_ref: receipt.product_ref
        }
      });
    }

    console.log(`[flowpay:unlock] Access unlocked for ${receipt.customer_ref}`);

    return {
      success: true,
      receipt,
      message: `Access granted! Receipt ID: ${receipt.receipt_id}`
    };

  } catch (error: any) {
    console.error('[flowpay:unlock] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper functions

function getPermissionsForProduct(product_ref: string): string[] {
  const productMap: Record<string, string[]> = {
    'smart-factory-basic': ['member', 'dashboard', 'api:mint'],
    'smart-factory-pro': ['member', 'dashboard', 'api:mint', 'api:verify', 'support'],
    'wod-pro-membership': ['member', 'arena', 'validator'],
    'fluxx-dao-stake': ['member', 'governance', 'treasury:view']
  };

  return productMap[product_ref] || ['member'];
}

function getAccessUrlForProduct(product_ref: string): string {
  const urlMap: Record<string, string> = {
    'smart-factory-basic': 'https://smart-ui-delta.vercel.app/members/dashboard',
    'smart-factory-pro': 'https://smart-ui-delta.vercel.app/members/pro',
    'wod-pro-membership': 'https://wodxpro.com/arena',
    'fluxx-dao-stake': 'https://fluxx-dao.vercel.app/governance'
  };

  return urlMap[product_ref] || 'https://neoprotocol.space/members';
}

function generateUnlockToken(customer_ref: string, permissions: string[]): string {
  // In production: use proper JWT library
  // For MVP: simple signed token
  const payload = {
    sub: customer_ref,
    permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
  };

  const secret = process.env.FLOWPAY_JWT_SECRET || 'neo-protocol-secret-change-me';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

function generateSignature(data: any): string {
  const secret = process.env.FLOWPAY_SIGNATURE_SECRET || 'neo-protocol-sig-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');
}

async function storeReceipt(receipt: UnlockReceipt): Promise<void> {
  // MVP: Store in file system
  // Future: IPFS, AGENT-FULL (Kwil DB), or blockchain
  
  const receiptsDir = path.join(process.cwd(), 'data', 'flowpay', 'receipts');
  
  // Ensure directory exists
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const filename = `${receipt.receipt_id}.json`;
  const filepath = path.join(receiptsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(receipt, null, 2), 'utf-8');

  console.log(`[flowpay:unlock] Receipt stored: ${filepath}`);
}

/**
 * Usage example:
 * 
 * ```bash
 * # After payment confirmed
 * moltbot flowpay:unlock \
 *   --charge_id "woovi_abc123"
 * ```
 * 
 * Returns:
 * - UNLOCK_RECEIPT (sovereign receipt)
 * - unlock_token (JWT for auth)
 * - access_url (where to go)
 * - permissions (what user can do)
 * 
 * Receipt stored in:
 * data/flowpay/receipts/{receipt_id}.json
 */
