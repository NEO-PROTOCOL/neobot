/**
 * FlowPay Status Skill
 * Check payment status for a charge
 */

export const metadata = {
  name: 'flowpay:status',
  description: 'Check PIX payment status',
  category: 'flowpay',
  tags: ['payment', 'pix', 'status', 'tracking'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'critical'
};

interface StatusInput {
  charge_id: string;
}

type PaymentStatus = 'CREATED' | 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED';

interface StatusOutput {
  success: boolean;
  charge_id: string;
  status: PaymentStatus;
  amount_brl: number;
  customer_ref: string;
  product_ref?: string;
  paid_at?: string; // ISO 8601
  expires_at?: string;
  error?: string;
}

export async function execute(ctx: any, input: StatusInput): Promise<StatusOutput> {
  const { charge_id } = input;

  if (!charge_id) {
    return {
      success: false,
      error: 'Missing required field: charge_id'
    } as StatusOutput;
  }

  try {
    const flowpayUrl = process.env.FLOWPAY_API_URL || 'https://flowpaypix.netlify.app/api';
    const apiKey = process.env.FLOWPAY_API_KEY || process.env.OPENPIX_API_KEY;

    if (!apiKey) {
      throw new Error('FLOWPAY_API_KEY or OPENPIX_API_KEY not configured');
    }

    const response = await fetch(`${flowpayUrl}/charges/status?charge_id=${charge_id}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`FlowPay API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map Woovi/OpenPix status to our standard
    let status: PaymentStatus = 'PENDING';
    if (data.status === 'COMPLETED' || data.status === 'CONFIRMED') {
      status = 'PAID';
    } else if (data.status === 'EXPIRED') {
      status = 'EXPIRED';
    } else if (data.status === 'CANCELED') {
      status = 'CANCELED';
    } else if (data.status === 'ACTIVE') {
      status = 'PENDING';
    }

    const result: StatusOutput = {
      success: true,
      charge_id,
      status,
      amount_brl: data.value ? data.value / 100 : 0,
      customer_ref: data.customer?.name || data.customer?.taxID || 'unknown',
      product_ref: data.additionalInfo?.find((i: any) => i.key === 'product_ref')?.value,
      paid_at: data.paidAt || undefined,
      expires_at: data.expiresDate || undefined
    };

    // Log status check
    console.log(`[flowpay:status] Charge ${charge_id} status: ${status}`);

    // If PAID, trigger unlock (future enhancement)
    if (status === 'PAID' && ctx.skills) {
      console.log(`[flowpay:status] Payment confirmed! Triggering unlock...`);
      // await ctx.skills.execute('flowpay:unlock', { charge_id });
    }

    return result;

  } catch (error: any) {
    console.error('[flowpay:status] Error:', error);
    return {
      success: false,
      error: error.message
    } as StatusOutput;
  }
}

/**
 * Usage example:
 * 
 * ```bash
 * moltbot flowpay:status \
 *   --charge_id "woovi_abc123"
 * ```
 * 
 * Returns:
 * - Current status (CREATED, PENDING, PAID, etc)
 * - Payment details
 * - Timestamps
 */
