/**
 * FlowPay Buy Skill
 * Creates PIX charge and returns payment details
 * 
 * Model B: PIX → Access Unlock
 * Token as ledger (secondary)
 */

export const metadata = {
  name: 'flowpay:buy',
  description: 'Create PIX charge for product/service purchase',
  category: 'flowpay',
  tags: ['payment', 'pix', 'checkout', 'revenue'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'critical'
};

interface BuyInput {
  amount_brl: number;
  product_ref: string;
  customer_ref: string; // phone, email, instagram handle
  wallet_address?: string; // optional for future token
  callback_url?: string; // webhook destination
  metadata?: Record<string, any>;
}

interface BuyOutput {
  success: boolean;
  charge_id: string;
  pix_qr: string; // QR code data URL
  pix_copy_paste: string; // PIX copia-e-cola
  checkout_url: string; // Full checkout page
  amount_brl: number;
  expires_at: string; // ISO 8601
  status: 'CREATED' | 'PENDING';
  error?: string;
}

export async function execute(ctx: any, input: BuyInput): Promise<BuyOutput> {
  const { amount_brl, product_ref, customer_ref, wallet_address, callback_url, metadata } = input;

  // Validation
  if (!amount_brl || amount_brl <= 0) {
    return {
      success: false,
      error: 'Invalid amount_brl (must be > 0)'
    } as BuyOutput;
  }

  if (!product_ref || !customer_ref) {
    return {
      success: false,
      error: 'Missing required fields: product_ref, customer_ref'
    } as BuyOutput;
  }

  try {
    // Check if product exists in local DB
    const { getProduct } = await import('../../src/infra/database/flowpay.js');
    const product = getProduct(product_ref);
    
    if (!product) {
      return {
        success: false,
        error: `Product not found: ${product_ref}`
      } as BuyOutput;
    }

    // Call FlowPay API (Woovi/OpenPix)
    const flowpayUrl = process.env.FLOWPAY_API_URL || 'https://flowpaypix.netlify.app/api';
    const apiKey = process.env.FLOWPAY_API_KEY || process.env.OPENPIX_API_KEY;

    if (!apiKey) {
      throw new Error('FLOWPAY_API_KEY or OPENPIX_API_KEY not configured');
    }

    const response = await fetch(`${flowpayUrl}/charges/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        value: Math.round(amount_brl * 100), // cents
        correlationID: `${product_ref}-${Date.now()}`,
        comment: `NEØ Protocol - ${product_ref}`,
        customer: {
          name: customer_ref,
          taxID: customer_ref // or phone
        },
        additionalInfo: [
          { key: 'product_ref', value: product_ref },
          { key: 'customer_ref', value: customer_ref },
          { key: 'wallet_address', value: wallet_address || 'none' },
          { key: 'source', value: 'neobot' }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`FlowPay API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform to our standard format
    const result: BuyOutput = {
      success: true,
      charge_id: data.correlationID || data.txid,
      pix_qr: data.brcode || data.qrCodeImage,
      pix_copy_paste: data.brcode,
      checkout_url: data.paymentLinkUrl || `${flowpayUrl}/../checkout?charge=${data.correlationID}`,
      amount_brl,
      expires_at: data.expiresDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'CREATED'
    };

    // Store in local SQLite database
    const { createOrder, logAudit } = await import('../../src/infra/database/flowpay.js');
    
    const orderId = createOrder({
      charge_id: result.charge_id,
      amount_brl,
      product_ref,
      product_name: product.name,
      product_price: product.price_brl,
      customer_ref,
      customer_wallet: wallet_address,
      customer_metadata: metadata ? JSON.stringify(metadata) : undefined,
      status: 'CREATED',
      pix_qr: result.pix_qr,
      pix_copy_paste: result.pix_copy_paste,
      checkout_url: result.checkout_url
    });

    // Audit log
    logAudit('charge_created', 'user', 'flowpay:buy', {
      charge_id: result.charge_id,
      product_ref,
      customer_ref,
      amount_brl
    }, orderId);

    console.log(`[flowpay:buy] Order #${orderId} created for ${customer_ref}`);

    // Store in Neobot ledger (if available)
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'flowpay',
        action: 'charge_created',
        data: {
          order_id: orderId,
          charge_id: result.charge_id,
          product_ref,
          customer_ref,
          amount_brl
        }
      });
    }

    return result;

  } catch (error: any) {
    console.error('[flowpay:buy] Error:', error);
    return {
      success: false,
      error: error.message
    } as BuyOutput;
  }
}

/**
 * Usage example:
 * 
 * ```bash
 * moltbot flowpay:buy \
 *   --amount_brl 99.90 \
 *   --product_ref "smart-factory-basic" \
 *   --customer_ref "+5562983231110"
 * ```
 * 
 * Returns:
 * - PIX QR code
 * - Copy-paste code
 * - Checkout URL
 * - Charge ID (for status tracking)
 */
