// src/pages/admin/decks/index.tsx
import { useEffect, useState, ChangeEvent } from 'react';
import Link from 'next/link';

interface Card { id: string; name: string; imageUrl?: string; }
interface Deck { id: string; name: string; cards: Card[]; }

export default function AdminDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardImage, setNewCardImage] = useState<string>('');
// โหลด Decks ครั้งแรก
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/decks');
      const data = await res.json();
      setDecks(data);
    })();
  }, []);


  // เลือก Deck
  const selectDeck = async (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDeckId(id);
    setShowNewCard(false);
    if (!id) {
      setCards([]);
      return;
    }
    const deckRes = await fetch(`/api/decks/${id}`);
    const deck = await deckRes.json();
    setCards(deck.cards);
  };


  const createDeck = async () => {
    if (!newDeckName.trim()) return;
    const res = await fetch('/api/decks', {
      method: 'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: newDeckName, cards: [] })
    });
    const { id } = await res.json();
    setDecks([...decks, { id, name: newDeckName, cards: [] }]);
    setNewDeckName('');
  };

  const saveDeck = async () => {
    if (!selectedDeckId) return;
    await fetch(`/api/decks/${selectedDeckId}`, {
      method: 'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        name: decks.find(d=>d.id===selectedDeckId)!.name,
        cards
      })
    });
    alert('บันทึกเรียบร้อย');
  };

  const deleteDeck = async () => {
    if (!selectedDeckId||!confirm('ลบ Deck นี้?')) return;
    await fetch(`/api/decks/${selectedDeckId}`,{method:'DELETE'});
    setDecks(decks.filter(d=>d.id!==selectedDeckId));
    setSelectedDeckId(''); setCards([]);
  };

  const deleteCard = (cardId: string) => {
    if (!confirm('ลบการ์ดนี้?')) return;
    setCards(cards.filter(c=>c.id!==cardId));
  };

  // ฟังก์ชันเพิ่มการ์ดจาก inline form
  const addCard = () => {
    if (!newCardName.trim()) return;
    const id = Date.now().toString();
    setCards([...cards, { id, name: newCardName, imageUrl: newCardImage }]);
    // รีเซ็ต
    setNewCardName('');
    setNewCardImage('');
    setShowNewCard(false);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ()=>setNewCardImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">จัดการ Deck & Cards</h1>
        {/* สร้าง Deck ใหม่ */}
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 w-1/4"
            placeholder="ชื่อ Deck ใหม่"
            value={newDeckName}
            onChange={e=>setNewDeckName(e.target.value)}
          />
          <button onClick={createDeck} className="bg-green-500 text-white px-4 py-2 rounded ml-[10px]">
            สร้าง Deck
          </button>
        </div>
<br />
        {/* เลือก/บันทึก/ลบ Deck */}
        <div className="flex gap-2 mb-6 ">
          <select
            className="border p-2 w-1/4"
            value={selectedDeckId}
            onChange={selectDeck}
          >
            <option value="">-- เลือก Deck --</option>
            {decks.map(d=>(
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {selectedDeckId && (
            <>
              <button onClick={saveDeck} className="bg-blue-500 text-white px-4 py-2 rounded ml-[10px]">
                บันทึก Deck
              </button>
              <button onClick={deleteDeck} className="bg-red-500 text-white px-4 py-2 rounded ml-[10px]">
                ลบ Deck
              </button>
            </>
          )}
        </div>
<br />
        {/* Grid ของการ์ด */}
        {selectedDeckId && (
          <>
            <div className="grid grid-cols-5 gap-4 mb-4 ">
              {cards.map((card, idx) => (
                <div key={card.id} className="border rounded p-2 text-center ">
                  <div className="mt-1 text-xs text-gray-500">#{idx+1}</div>
                  {card.imageUrl
                    ? <img src={card.imageUrl} className="w-[80px] h-auto rounded border object-cover " alt={card.name}/>
                    : <div className="h-32 bg-gray-200 "/>
                  }
                  <p className="mt-2 text-sm">{card.name}</p>
                  <div className="mt-1 flex justify-evenly ">
                    {/* ลิงก์ไปหน้าแก้ไขรายละเอียดการ์ด */}
                    <Link href={`/admin/decks/${selectedDeckId}/cards/${card.id}`}>
                      <button className="text-blue-500 text-sm ">แก้ไข</button>
                    </Link>
                    <button onClick={()=>deleteCard(card.id)} className="text-red-500 text-sm">
                      ลบ
                    </button>
                  </div>
                  <br />
                </div>
              ))}

              {/* ปุ่ม เพิ่มการ์ด (toggle ฟอร์ม) */}

              <button
                onClick={()=>setShowNewCard(!showNewCard)}
                className="border border-gray-300 w-[130px] h-[260px] rounded p-2 ml-[10px] flex items-center justify-center text-base font-medium text-gray-700 h-36 hover:bg-gray-100 cursor-pointer"
              >
                เพิ่มไพ่
              </button>
            </div> 
            {/* ฟอร์มเพิ่มการ์ดใหม่ */}
            {showNewCard && (
              <div className="border-t pt-4 ">
                <h2 className="font-semibold mb-2">เพิ่มการ์ดใหม่</h2>
                <div className="flex gap-6">
                  {/* คอลัมน์ซ้าย: รูป */}
                  <div className="w-1/3 flex justify-center items-center">
                    {newCardImage
                      ? (
                        <img
                          src={newCardImage}
                          alt="preview"
                          className="w-[150px] h-auto rounded border"
                        />
                      ) : (
                        <div className="w-[150px] h-[200px] bg-gray-100 rounded border flex items-center justify-center">
                          ยังไม่มีรูป
                        </div>
                      )
                    }
                  </div>
                  {/* คอลัมน์ขวา: ชื่อ + ไฟล์ + ปุ่ม */}
                  <div className="w-2/3 flex flex-col gap-4" >
                    <input
                      type="text"
                      className="border p-2 w-2/4"
                      placeholder="ชื่อการ์ด"
                      value={newCardName}
                      onChange={e => setNewCardName(e.target.value)}
                    /><br />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFile}
                      className="bg-green-500 text-white border p-2 w-1/5 "
                    /><br />
                    <div className="w-3/5 flex  gap-4" >
                      <button
                        onClick={addCard}
                        className="bg-green-500 text-white border py-1 w-2/5 "
                      >
                        บันทึกการ์ด
                      </button>
                      <br/><br/><button
                        onClick={() => {
                          setShowNewCard(false);
                          setNewCardName('');
                          setNewCardImage('');
                        }}
                        className="bg-green-500 text-white border p-2 w-2/5 ml-[10px]"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div><br />
              </div>
            )}
          </>
        )}
      </div>
  );
}