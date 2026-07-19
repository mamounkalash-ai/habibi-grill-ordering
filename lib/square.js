import crypto from 'crypto';

export const environment =
  process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

const squareBaseUrl =
  environment === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

const squareVersion = '2026-05-20';

export function requireSquareConfig() {
  const required = [
    'SQUARE_APPLICATION_ID',
    'SQUARE_LOCATION_ID',
    'SQUARE_ACCESS_TOKEN'
  ];

  const missing = required.filter(
    (key) => !process.env[key] || process.env[key].startsWith('REPLACE_')
  );

  if (missing.length > 0) {
    const error = new Error(`Missing Square configuration: ${missing.join(', ')}`);
    error.status = 503;
    throw error;
  }
}

export async function squareRequest(apiPath, options = {}) {
  requireSquareConfig();

  const response = await fetch(`${squareBaseUrl}${apiPath}`, {
    ...options,
    headers: {
      'Square-Version': squareVersion,
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.errors?.map((item) => item.detail || item.code).join('; ') ||
      'Square request failed';
    const error = new Error(message);
    error.status = response.status;
    error.square = data;
    throw error;
  }

  return data;
}

export function createIdempotencyKey() {
  return crypto.randomUUID();
}
