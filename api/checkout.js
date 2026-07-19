import { createIdempotencyKey, squareRequest } from '../lib/square.js';

const TAX_PERCENTAGE = '9.68';
const ALLOWED_TIPS = new Set([0, 5, 10, 15, 20]);

function normalizeUsPhone(value = '') {
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const {
      sourceId,
      cart,
      customer = {},
      pickupTime,
      tipPercent = 0,
      smsConsent = true,
      paymentMethod = 'card'
    } = req.body || {};

    if (!sourceId) return res.status(400).json({ error: 'Missing payment token.' });
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const selectedTip = Number(tipPercent);
    if (!ALLOWED_TIPS.has(selectedTip)) {
      return res.status(400).json({ error: 'Invalid tip percentage.' });
    }

    const phone = normalizeUsPhone(customer.phone);
    if (!customer.name || !phone) {
      return res.status(400).json({ error: 'Please enter a valid name and US phone number.' });
    }

    let subtotalCents = 0;
    const lineItems = cart.map((item, index) => {
      const amount = Math.round(Number(item.final) * 100);
      const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
      if (!item.n || !Number.isInteger(amount) || amount < 0 || !Number.isFinite(quantity)) {
        throw new Error(`Invalid item at position ${index + 1}.`);
      }
      subtotalCents += amount * quantity;
      const notes = Array.isArray(item.custom) ? item.custom.filter(Boolean).join(' • ') : '';
      return {
        name: String(item.n).slice(0, 255),
        quantity: String(quantity),
        base_price_money: { amount, currency: 'USD' },
        ...(notes ? { note: notes.slice(0, 500) } : {})
      };
    });

    const pickupDetails = {
      recipient: {
        display_name: String(customer.name).slice(0, 255),
        phone_number: phone,
        ...(customer.email ? { email_address: String(customer.email).slice(0, 255) } : {})
      },
      note: `Website pickup order | SMS:${smsConsent ? 'YES' : 'NO'} | Pay:${String(paymentMethod).slice(0, 30)}`
    };

    if (pickupTime) {
      const scheduledDate = new Date(pickupTime);
      if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
        return res.status(400).json({ error: 'Please select a valid future pickup time.' });
      }
      pickupDetails.schedule_type = 'SCHEDULED';
      pickupDetails.pickup_at = scheduledDate.toISOString();
    } else {
      pickupDetails.schedule_type = 'ASAP';
    }

    const orderResult = await squareRequest('/v2/orders', {
      method: 'POST',
      body: JSON.stringify({
        idempotency_key: createIdempotencyKey(),
        order: {
          location_id: process.env.SQUARE_LOCATION_ID,
          source: { name: 'Habibi Grill Website' },
          ticket_name: `WEB-${Date.now().toString().slice(-6)}`,
          line_items: lineItems,
          taxes: [{
            uid: 'HABIBI-SALES-TAX',
            name: 'Sales Tax 9.68%',
            percentage: TAX_PERCENTAGE,
            scope: 'ORDER'
          }],
          fulfillments: [{ type: 'PICKUP', state: 'PROPOSED', pickup_details: pickupDetails }]
        }
      })
    });

    const order = orderResult.order;
    const orderTotalCents = order?.total_money?.amount;
    const taxCents = order?.total_tax_money?.amount ?? Math.round(subtotalCents * 0.0968);
    if (!order?.id || !Number.isInteger(orderTotalCents)) {
      throw new Error('Square did not return a valid order total.');
    }

    const tipCents = Math.round(subtotalCents * (selectedTip / 100));
    const paymentTotalCents = orderTotalCents + tipCents;

    const paymentResult = await squareRequest('/v2/payments', {
      method: 'POST',
      body: JSON.stringify({
        idempotency_key: createIdempotencyKey(),
        source_id: sourceId,
        // Square requires amount_money to equal the order total. The tip is added separately.
        amount_money: { amount: orderTotalCents, currency: 'USD' },
        ...(tipCents > 0 ? { tip_money: { amount: tipCents, currency: 'USD' } } : {}),
        order_id: order.id,
        location_id: process.env.SQUARE_LOCATION_ID,
        autocomplete: true,
        ...(customer.email ? { buyer_email_address: String(customer.email).slice(0, 255) } : {}),
        note: `Habibi Grill website order for ${String(customer.name).slice(0, 120)}`
      })
    });

    return res.status(200).json({
      ok: true,
      orderId: order.id,
      paymentId: paymentResult.payment?.id,
      status: paymentResult.payment?.status,
      receiptUrl: paymentResult.payment?.receipt_url || null,
      subtotal: subtotalCents,
      tax: taxCents,
      tip: tipCents,
      total: paymentTotalCents
    });
  } catch (error) {
    console.error(error.square || error);
    return res.status(error.status || 500).json({
      error: error.message,
      details: error.square?.errors || undefined
    });
  }
}
