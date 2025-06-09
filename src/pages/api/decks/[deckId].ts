import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { deckId } = req.query;
  const ref = db.collection('decks').doc(deckId as string);

  // === GET /api/decks/:deckId ===
  if (req.method === 'GET') {
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  }

  // === PUT /api/decks/:deckId ===
  if (req.method === 'PUT') {
    await ref.update(req.body);
    return res.status(200).json({ success: true });
  }

  // === DELETE /api/decks/:deckId ===
  if (req.method === 'DELETE') {
    await ref.delete();
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
