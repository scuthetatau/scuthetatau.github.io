export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const email = req.body?.email;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Vercel provides the IP in x-forwarded-for header
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';

  // Log to Vercel Runtime Logs
  console.log(`[USER VISIT] Email: ${email}, IP: ${ip}`);

  res.status(200).json({ success: true });
} 