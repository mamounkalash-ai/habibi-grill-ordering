import { environment, requireSquareConfig } from '../lib/square.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    requireSquareConfig();
    return res.status(200).json({
      environment,
      applicationId: process.env.SQUARE_APPLICATION_ID,
      locationId: process.env.SQUARE_LOCATION_ID
    });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}
