import crypto from 'crypto';

export function verifySquareWebhook({ rawBody, signature, notificationUrl }) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) throw new Error('Missing SQUARE_WEBHOOK_SIGNATURE_KEY.');
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', key)
    .update(`${notificationUrl}${rawBody}`)
    .digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function firstDelivery(key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return true;
  const response = await fetch(`${url}/set/${encodeURIComponent(key)}/1?nx=true&ex=604800`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json().catch(() => ({}));
  return data.result === 'OK';
}
