import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { key: 'logs',    label: 'Logs'    },
  { key: 'prompts', label: 'Prompts' },
  { key: 'config',  label: 'Config'  },
  { key: 'decks',   label: 'Decks'   },
];

export default function AdminDashboard() {
  const [active, setActive] = useState<'logs'|'prompts'|'config'|'decks'>('logs');
  const [dataMap, setDataMap] = useState<Record<string, any[]>>({
    logs: [], prompts: [], config: [], decks: []
  });
  const [selectedDeck, setSelectedDeck] = useState<string|null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [pretty, setPretty] = useState(true);

  // ฟังก์ชัน fetch ทั่วไป
  const fetchData = async (key: string) => {
    const res = await fetch(`/api/admin/${key}`);
    const json = await res.json();
    setDataMap(prev => ({ ...prev, [key]: json }));
  };

  // fetch cards ของ deck ที่เลือก
  const fetchDeckCards = async (deckId: string) => {
    const res = await fetch(`/api/admin/decks/${deckId}/cards`);
    setCards(await res.json());
  };

  // เมื่อเปลี่ยน tab
  useEffect(() => {
    setSelectedDeck(null);
    if (active === 'decks') {
      fetchData('decks');
    } else {
      fetchData(active);
    }
  }, [active]);

  // render ชุดทั่วไป
  const renderDefault = (entries: any[]) => (
    <div className="grid grid-cols-1 gap-4">
      {entries.map((e,i)=>(
        <Card key={i} className="bg-gray-50 hover:bg-gray-100 transition">
          <CardContent className="p-4 text-sm font-mono whitespace-pre-wrap">
            { pretty ? <pre>{JSON.stringify(e,null,2)}</pre> : JSON.stringify(e) }
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // render หน้า Decks + detail ของ Cards
  const renderDecks = () => (
    <div>
      <h2 className="text-lg font-semibold mb-2">Decks ({dataMap.decks.length})</h2>
      <ul className="space-y-1">
        {dataMap.decks.map(deck=>(
          <li key={deck.id}>
            <Button
              variant={selectedDeck===deck.id?'default':'ghost'}
              onClick={()=>{
                setSelectedDeck(deck.id);
                fetchDeckCards(deck.id);
              }}
            >
              {deck.name} ({deck.cardCount})
            </Button>
          </li>
        ))}
      </ul>
      {selectedDeck && (
        <div className="mt-6">
          <Separator className="mb-4"/>
          <h3 className="text-xl font-semibold mb-2">Cards in “{selectedDeck}”</h3>
          <div className="grid grid-cols-1 gap-4">
            {cards.map((c,i)=>(
              <Card key={i} className="bg-gray-50 hover:bg-gray-100 transition">
                <CardContent className="p-4 text-sm font-mono whitespace-pre-wrap">
                  { pretty ? <pre>{JSON.stringify(c,null,2)}</pre> : JSON.stringify(c) }
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <h2 className="text-xl font-semibold">Admin Menu</h2>
        <Separator className="my-2"/>
        <nav>
          {MENU_ITEMS.map(item=>(
            <Button
              key={item.key}
              variant={active===item.key?'default':'ghost'}
              className="w-full text-left"
              onClick={()=>setActive(item.key as any)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="mt-6 flex items-center">
          <Input
            id="pretty-print"
            type="checkbox"
            checked={pretty}
            onChange={()=>setPretty(p=>!p)}
            className="mr-2"
          />
          <Label htmlFor="pretty-print">Pretty-print</Label>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">{MENU_ITEMS.find(m=>m.key===active)?.label}</h1>
        <Separator className="mb-6"/>
        {active==='decks' ? renderDecks() : renderDefault(dataMap[active])}
      </main>
    </div>
  );
}
