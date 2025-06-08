// web-frontend/src/pages/api/admin/decks/[deckId]/cards.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { deckId } = req.query;
  const url = `${process.env.BACKEND_URL}/admin/decks/${deckId}/cards`;
  try {
    const backendRes = await fetch(url as string, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: ['GET','HEAD'].includes(req.method||'') 
        ? undefined 
        : JSON.stringify(req.body),
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } catch (e) {
    console.error('proxy error', e);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
