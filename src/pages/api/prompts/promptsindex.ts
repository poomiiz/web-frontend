import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const goRes = await fetch('http://localhost:8080/admin/prompts')
  const data = await goRes.json()
  res.status(goRes.status).json(data)
}
