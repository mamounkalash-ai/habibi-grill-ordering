function requireValue(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing SMS configuration: ${name}`);
  return value;
}

export async function sendSms({ to, body }) {
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  const from = requireValue('SMS_FROM_NUMBER');

  if (provider === 'webhook') {
    const url = requireValue('SMS_WEBHOOK_URL');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.SMS_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` }
          : {})
      },
      body: JSON.stringify({ from, to, body })
    });
    if (!response.ok) throw new Error(`SMS webhook failed (${response.status}).`);
    return;
  }

  if (provider !== 'twilio') throw new Error(`Unsupported SMS provider: ${provider}`);

  const accountSid = requireValue('TWILIO_ACCOUNT_SID');
  const authToken = requireValue('TWILIO_AUTH_TOKEN');
  const params = new URLSearchParams({ From: from, To: to, Body: body });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `SMS send failed (${response.status}).`);
}
