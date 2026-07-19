import { squareRequest } from '../lib/square.js';
import { sendSms } from '../lib/sms.js';
import { firstDelivery, verifySquareWebhook } from '../lib/webhook.js';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function findOrderId(event) {
  return (
    event?.data?.object?.order_updated?.order_id ||
    event?.data?.object?.order_fulfillment_updated?.order_id ||
    event?.data?.id ||
    null
  );
}

function messageForState(state) {
  if (state === 'RESERVED') {
    return 'Habibi Grill: We received your order and started preparing it. 🔥';
  }
  if (state === 'PREPARED') {
    return 'Habibi Grill: Your food is ready for pickup! ✅ See you soon at 39th & Farnam.';
  }
  if (state === 'COMPLETED') {
    return 'Habibi Grill: Sahtein! Enjoy your meal, King 👑 Thanks for choosing Habibi Grill!';
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers['x-square-hmacsha256-signature'];
    const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
    if (!notificationUrl) throw new Error('Missing SQUARE_WEBHOOK_NOTIFICATION_URL.');
    if (!verifySquareWebhook({ rawBody, signature, notificationUrl })) {
      return res.status(403).json({ error: 'Invalid webhook signature.' });
    }

    const event = JSON.parse(rawBody);
    if (!['order.updated', 'order.fulfillment.updated'].includes(event.type)) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    const orderId = findOrderId(event);
    if (!orderId) return res.status(200).json({ ok: true, ignored: true });

    const result = await squareRequest(`/v2/orders/${encodeURIComponent(orderId)}`);
    const order = result.order;
    const fulfillment = order?.fulfillments?.[0];
    const state = fulfillment?.state;
    const note = fulfillment?.pickup_details?.note || '';
    const phone = fulfillment?.pickup_details?.recipient?.phone_number;
    const message = messageForState(state);

    if (!phone || !message || !note.includes('SMS:YES')) {
      return res.status(200).json({ ok: true, ignored: true, state });
    }

    if (!(await firstDelivery(`habibi:${orderId}:${state}`))) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    await sendSms({ to: phone, body: message });
    return res.status(200).json({ ok: true, state });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
