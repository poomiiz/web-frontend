import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../../../components/Layout';

export default function EditCardPage() {
  const router = useRouter();
  const { deckId, cardId } = router.query;
  const [deck, setDeck] = useState<any>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (deckId && cardId) {
      (async () => {
        const d = await (await fetch(`/api/decks/${deckId}`)).json();
        const c = d.cards.find((c: any) => c.id === cardId);
        setDeck(d);
        setName(c.name);
        setImage(c.imageUrl || '');
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
    const updated = deck.cards.map((c: any) =>
      c.id === cardId ? { ...c, name, imageUrl: image } : c
    );
    await fetch(`/api/decks/${deckId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deck.name, cards: updated }),
    });
    router.back();
  };

  if (!deck) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl mb-4">แก้ไข {name}</h1>
        <input
          className="border p-2 w-full mb-2"
          placeholder="ชื่อการ์ด"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={onFile} className="mb-4" />
        {image && <img src={image} className="h-32 mb-4" alt="preview" />}
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="flex-1 border px-4 py-2">
            ยกเลิก
          </button>
          <button onClick={save} className="flex-1 bg-green-500 text-white px-4 py-2">
            บันทึก
          </button>
        </div>
      </div>
    </Layout>
  );
}
