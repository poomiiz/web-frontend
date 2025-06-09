import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../../../components/Layout';

export default function EditCardPage() {
  const router = useRouter();
  const { deckId, cardId } = router.query;
  const [deck, setDeck] = useState<any>(null);

  // Card fields
  const [number, setNumber] = useState<number>(0);
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [travel, setTravel] = useState('');
  const [flaws, setFlaws] = useState('');
  const [keywords, setKeywords] = useState('');
  const [meanings, setMeanings] = useState('');

  // Positions by topic
  const [workPast, setWorkPast] = useState('');
  const [workPresent, setWorkPresent] = useState('');
  const [workFuture, setWorkFuture] = useState('');
  const [financePast, setFinancePast] = useState('');
  const [financePresent, setFinancePresent] = useState('');
  const [financeFuture, setFinanceFuture] = useState('');
  const [lovePast, setLovePast] = useState('');
  const [lovePresent, setLovePresent] = useState('');
  const [loveFuture, setLoveFuture] = useState('');
  const [healthPast, setHealthPast] = useState('');
  const [healthPresent, setHealthPresent] = useState('');
  const [healthFuture, setHealthFuture] = useState('');

  // Image preview
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (deckId && cardId) {
      (async () => {
        const res = await fetch(`/api/decks/${deckId}`);
        const d = await res.json();
        const c = d.cards.find((c: any) => c.id === cardId);
        setDeck(d);
        // load fields
        setNumber(c.number || 0);
        setName(c.name || '');
        setImage(c.imageUrl || '');
        setPersonality(c.personality || '');
        setTravel(c.travel || '');
        setFlaws(c.flaws || '');
        setKeywords(c.keywords || '');
        setMeanings(c.meanings || '');
        // load positions
        setWorkPast((c.positions_by_topic?.work?.Past || []).join('\n'));
        setWorkPresent((c.positions_by_topic?.work?.Present || []).join('\n'));
        setWorkFuture((c.positions_by_topic?.work?.Future || []).join('\n'));
        setFinancePast((c.positions_by_topic?.finance?.Past || []).join('\n'));
        setFinancePresent((c.positions_by_topic?.finance?.Present || []).join('\n'));
        setFinanceFuture((c.positions_by_topic?.finance?.Future || []).join('\n'));
        setLovePast((c.positions_by_topic?.love?.Past || []).join('\n'));
        setLovePresent((c.positions_by_topic?.love?.Present || []).join('\n'));
        setLoveFuture((c.positions_by_topic?.love?.Future || []).join('\n'));
        setHealthPast((c.positions_by_topic?.health?.Past || []).join('\n'));
        setHealthPresent((c.positions_by_topic?.health?.Present || []).join('\n'));
        setHealthFuture((c.positions_by_topic?.health?.Future || []).join('\n'));
      })();
    }
  }, [deckId, cardId]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const save = async () => {
    if (!deckId || !deck) return;
    const positions_by_topic = {
      work: {
        Past: workPast.split('\n').map(l => l.trim()).filter(l => l),
        Present: workPresent.split('\n').map(l => l.trim()).filter(l => l),
        Future: workFuture.split('\n').map(l => l.trim()).filter(l => l),
      },
      finance: {
        Past: financePast.split('\n').map(l => l.trim()).filter(l => l),
        Present: financePresent.split('\n').map(l => l.trim()).filter(l => l),
        Future: financeFuture.split('\n').map(l => l.trim()).filter(l => l),
      },
      love: {
        Past: lovePast.split('\n').map(l => l.trim()).filter(l => l),
        Present: lovePresent.split('\n').map(l => l.trim()).filter(l => l),
        Future: loveFuture.split('\n').map(l => l.trim()).filter(l => l),
      },
      health: {
        Past: healthPast.split('\n').map(l => l.trim()).filter(l => l),
        Present: healthPresent.split('\n').map(l => l.trim()).filter(l => l),
        Future: healthFuture.split('\n').map(l => l.trim()).filter(l => l),
      },
    };

    const updatedCards = deck.cards.map((c: any) =>
      c.id !== cardId
        ? c
        : { ...c, number, name, imageUrl: image, personality, travel, flaws, keywords, meanings, positions_by_topic }
    );

    await fetch(`/api/decks/${deckId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deck.name, cards: updatedCards }),
    });
    router.back();
  };

  if (!deck) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">แก้ไขการ์ด: {name}</h1>

        {/* ชั้นแรก: ซ้าย - รูป, ขวา - ข้อมูลหลัก */}
        <div className="flex gap-6 mb-8 ">
          <div className="w-1/5 pr-4">
            {image && <img src={image} className="w-full h-auto rounded mb-2" alt="preview" />}
            <input type="file" accept="image/*" onChange={onFile} className="block" />
          </div>
          <div className="w-4/5 pl-4 space-y-4 ">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Deck</label>
                <p className="mt-1 p-2 border bg-gray-100 rounded">{deck.name}</p>
              </div>

            </div>
            <input
              className="border p-2 w-[350] "
              placeholder="ชื่อการ์ด"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <textarea
              className="border p-2 w-[350] h-[50]"
              placeholder="personality"
              value={personality}
              onChange={e => setPersonality(e.target.value)}
            />
            <textarea
              className="border p-2 w-[350] h-[50]"
              placeholder="travel"
              value={travel}
              onChange={e => setTravel(e.target.value)}
            />
            <textarea
              className="border p-2 w-[350] h-[50]"
              placeholder="flaws"
              value={flaws}
              onChange={e => setFlaws(e.target.value)}
            />
            <textarea
              className="border p-2 w-[350] h-[50]"
              placeholder="keywords"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
            />
            <textarea
              className="border p-2 w-[350] h-[50]"
              placeholder="meanings"
              value={meanings}
              onChange={e => setMeanings(e.target.value)}
            />
          </div>
        </div>

        {/* ชั้นสอง: Positions by topic แสดงเต็มความกว้าง */}
        <div className="space-y-6 text-center" >
          {['work', 'finance', 'love', 'health'].map(topic => (
            <div key={topic} className="border p-4 rounded">
              <h2 className="text-lg font-semibold capitalize mb-2 ">{topic}</h2>
              <textarea
                className="border p-2 w-[260] h-[200] text-center"
                placeholder="Past (แต่ละบรรทัด)"
                value={eval(`${topic}Past`)}
                onChange={e => eval(`set${capitalize(topic)}Past`)(e.target.value)}
              />
              <textarea
                className="border p-2 w-[260] h-[200] text-center"
                placeholder="Present"
                value={eval(`${topic}Present`)}
                onChange={e => eval(`set${capitalize(topic)}Present`)(e.target.value)}
              />
              <textarea
                className="border p-2 w-[260] h-[200] text-center"
                placeholder="Future"
                value={eval(`${topic}Future`)}
                onChange={e => eval(`set${capitalize(topic)}Future`)(e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-8">
          <button onClick={save} className="flex-1 bg-green-500 text-white py-2 rounded">บันทึก</button>
          <button onClick={() => router.back()} className="flex-1 border py-2 rounded">ยกเลิก</button>
        </div>
      </div>
    </Layout>
  );
}

// Helper to capitalize topic names
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
