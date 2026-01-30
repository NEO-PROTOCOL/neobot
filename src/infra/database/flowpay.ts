/**
 * FlowPay SQLite Database Manager
 * NEØ Protocol - Sovereign Local Storage
 *
 * No cloud, no accounts, full control.
 */

import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database paths
const DATA_DIR = path.join(process.cwd(), "data", "flowpay");
const DB_PATH = path.join(DATA_DIR, "flowpay.db");
const SCHEMA_PATH = path.join(DATA_DIR, "schema.sql");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    // Initialize schema if needed
    initializeSchema();
  }

  return db;
}

function initializeSchema(): void {
  if (!db) return;

  // Check if schema is initialized
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'")
    .all();

  if (tables.length === 0) {
    console.log("[FlowPay DB] Initializing schema...");
    const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
    db.exec(schema);
    console.log("[FlowPay DB] Schema initialized ✓");
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// ════════════════════════════════════════
// ORDER OPERATIONS
// ════════════════════════════════════════

export interface Order {
  id?: number;
  charge_id: string;
  amount_brl: number;
  amount_usdt?: number;
  exchange_rate?: number;
  product_ref: string;
  product_name?: string;
  product_price?: number;
  customer_ref: string;
  customer_wallet?: string;
  customer_metadata?: string;
  status: OrderStatus;
  pix_qr?: string;
  pix_copy_paste?: string;
  checkout_url?: string;
  paid_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  settled_at?: string;
  tx_hash?: string;
  network?: string;
  receipt_cid?: string;
  receipt_ipfs_url?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: string;
}

export type OrderStatus =
  | "CREATED"
  | "PIX_PAID"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "SETTLED"
  | "COMPLETED"
  | "REJECTED"
  | "REFUNDED";

export function createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): number {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO orders (
      charge_id, amount_brl, amount_usdt, exchange_rate,
      product_ref, product_name, product_price,
      customer_ref, customer_wallet, customer_metadata,
      status, pix_qr, pix_copy_paste, checkout_url,
      metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    order.charge_id,
    order.amount_brl,
    order.amount_usdt || null,
    order.exchange_rate || null,
    order.product_ref,
    order.product_name || null,
    order.product_price || null,
    order.customer_ref,
    order.customer_wallet || null,
    order.customer_metadata || null,
    order.status,
    order.pix_qr || null,
    order.pix_copy_paste || null,
    order.checkout_url || null,
    order.metadata || null,
  );

  return result.lastInsertRowid as number;
}

export function getOrder(charge_id: string): Order | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM orders WHERE charge_id = ?");
  return stmt.get(charge_id) as Order | null;
}

export function updateOrderStatus(
  charge_id: string,
  status: OrderStatus,
  extra?: Partial<Order>,
): void {
  const db = getDatabase();

  let fields = ["status = ?", "updated_at = CURRENT_TIMESTAMP"];
  let values: any[] = [status];

  if (extra) {
    if (extra.paid_at) {
      fields.push("paid_at = ?");
      values.push(extra.paid_at);
    }
    if (extra.reviewed_at) {
      fields.push("reviewed_at = ?", "reviewed_by = ?");
      values.push(extra.reviewed_at, extra.reviewed_by);
    }
    if (extra.settled_at) {
      fields.push("settled_at = ?", "tx_hash = ?", "network = ?");
      values.push(extra.settled_at, extra.tx_hash, extra.network);
    }
    if (extra.receipt_cid) {
      fields.push("receipt_cid = ?", "receipt_ipfs_url = ?");
      values.push(extra.receipt_cid, extra.receipt_ipfs_url);
    }
  }

  values.push(charge_id);

  const stmt = db.prepare(`
    UPDATE orders 
    SET ${fields.join(", ")}
    WHERE charge_id = ?
  `);

  stmt.run(...values);
}

export function listOrdersPendingReview(): Order[] {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM v_orders_pending_review");
  return stmt.all() as Order[];
}

// ════════════════════════════════════════
// RECEIPT OPERATIONS
// ════════════════════════════════════════

export interface Receipt {
  id?: number;
  receipt_id: string;
  order_id: number;
  charge_id: string;
  paid_at: string;
  customer_ref: string;
  product_ref: string;
  amount_brl: number;
  permissions: string; // JSON array
  access_url?: string;
  unlock_token: string;
  issuer: string;
  signature: string;
  ipfs_cid?: string;
  ipfs_url?: string;
  pinned?: boolean;
  pinned_at?: string;
  created_at?: string;
  metadata?: string;
}

export function createReceipt(receipt: Omit<Receipt, "id" | "created_at">): number {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO receipts (
      receipt_id, order_id, charge_id, paid_at,
      customer_ref, product_ref, amount_brl,
      permissions, access_url, unlock_token,
      issuer, signature, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    receipt.receipt_id,
    receipt.order_id,
    receipt.charge_id,
    receipt.paid_at,
    receipt.customer_ref,
    receipt.product_ref,
    receipt.amount_brl,
    receipt.permissions,
    receipt.access_url || null,
    receipt.unlock_token,
    receipt.issuer,
    receipt.signature,
    receipt.metadata || null,
  );

  return result.lastInsertRowid as number;
}

export function getReceipt(receipt_id: string): Receipt | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM receipts WHERE receipt_id = ?");
  return stmt.get(receipt_id) as Receipt | null;
}

export function updateReceiptIPFS(receipt_id: string, ipfs_cid: string, ipfs_url: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE receipts
    SET ipfs_cid = ?, ipfs_url = ?, pinned = 1, pinned_at = CURRENT_TIMESTAMP
    WHERE receipt_id = ?
  `);
  stmt.run(ipfs_cid, ipfs_url, receipt_id);
}

// ════════════════════════════════════════
// PRODUCT OPERATIONS
// ════════════════════════════════════════

export interface Product {
  id?: number;
  ref: string;
  name: string;
  description?: string;
  price_brl: number;
  currency: string;
  permissions: string; // JSON array
  access_url?: string;
  access_duration_days?: number;
  active: boolean;
  category?: string;
  tags?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: string;
}

export function getProduct(ref: string): Product | null {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM products WHERE ref = ? AND active = 1");
  return stmt.get(ref) as Product | null;
}

export function listProducts(): Product[] {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM products WHERE active = 1 ORDER BY price_brl ASC");
  return stmt.all() as Product[];
}

// ════════════════════════════════════════
// AUDIT LOG
// ════════════════════════════════════════

export function logAudit(
  event_type: string,
  actor: string,
  action: string,
  details?: any,
  order_id?: number,
): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO audit_log (event_type, actor, action, details, order_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(event_type, actor, action, details ? JSON.stringify(details) : null, order_id || null);
}
