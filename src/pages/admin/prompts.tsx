//web-frontend/src/pages/admin/prompts.tsx
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import PromptVariantList from '../../components/admin/PromptVariantList'

interface PromptTemplate {
  id: string
  description: string
  model: string
  prompt: string
}

export default function AdminPromptsPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selected, setSelected] = useState<PromptTemplate|null>(null)
  const [response, setResponse] = useState<string>('')
  const [models, setModels] = useState<string[]>([]) 
  useEffect(() => {
    fetch('/api/prompts').then(r=>r.json()).then(setTemplates)
  }, [])
  
  useEffect(() => {
    fetch('/api/models').then(r=>r.json()).then(setModels)
  }, [])

  const saveTemplate = async (t: PromptTemplate) => {
    await fetch(`/api/prompts/${t.id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(t)
    })
    setTemplates(ts => ts.map(x=> x.id===t.id? t:x))
  }

  const preview = async (promptText: string, model: string) => {
    const res = await fetch('/api/ai/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({user_id: 'admin', model, prompt: promptText})
    })
    const data = await res.json()
    setResponse(data.reply)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Prompt Templates</h1>
      <div className="grid grid-cols-3 gap-4">
        <ul className="col-span-1 space-y-2">
          {templates.map(t => (
            <li key={t.id}>
              <button
                onClick={()=>{ setSelected(t); setResponse('') }}
                className="block w-full text-left px-2 py-1 border rounded hover:bg-gray-100"
              >
                {t.id}
              </button>
            </li>
          ))}
        </ul>
        {selected && (
          <div className="col-span-2 space-y-4">
           <div>
          <label className="block font-medium mb-1">Model</label>
          <select
            className="border p-2 w-full"
            value={selected.model}
            onChange={e => setSelected({...selected, model: e.target.value})}
          >
            <option value="" disabled>-- เลือกโมเดล --</option>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
            <div>
              <label>Prompt</label>
              <textarea
                value={selected.prompt}
                onChange={e => setSelected({...selected, prompt:e.target.value})}
                className="border p-1 w-full h-32"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={()=> saveTemplate(selected)}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Save Template
              </button>
              <button
                onClick={()=> preview(selected.prompt, selected.model)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Preview
              </button>
            </div>
            {response && (
              <div className="p-2 border bg-gray-50">
                <strong>Response:</strong>
                <pre>{response}</pre>
              </div>
            )}
            {/* ถ้าต้องการแสดง variants จาก tuning */}
            <PromptVariantList variants={[]} onApprove={() => {}} />
          </div>
        )}
      </div></>
  )
}
