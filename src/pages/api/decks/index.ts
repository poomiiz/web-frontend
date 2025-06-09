import type { NextApiRequest, NextApiResponse } from 'next';
// (ถ้ายังไม่เชื่อม DB) ลบบรรทัดนี้ออก หรือ mock data
import { db } from '../../../lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // === GET /api/decks ===
  if (req.method === 'GET') {
    // ถ้า mock ก็ใช้: return res.status(200).json([]);
    const snap = await db.collection('decks').get();
    const decks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json(decks);
  }

  // === POST /api/decks ===
  if (req.method === 'POST') {
    const { name, cards } = req.body;
    const ref = await db.collection('decks').add({ name, cards: cards || [] });
    return res.status(201).json({ id: ref.id });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
