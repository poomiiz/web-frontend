import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

interface ModelConfig {
  name: string
  enabled: boolean
  temperature: number
  max_tokens: number
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [dirty, setDirty] = useState(false)

  // โหลด config จาก go-backend
  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(setModels)
  }, [dirty])

  const updateModel = async (m: ModelConfig) => {
    await fetch(`/api/models/${m.name}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(m)
    })
    setDirty(!dirty) // รีโหลด list
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">ตั้งค่า AI Models</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Model</th>
            <th className="border px-2 py-1">Enabled</th>
            <th className="border px-2 py-1">Temp</th>
            <th className="border px-2 py-1">Max Tokens</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {models.map(m => (
            <tr key={m.name}>
              <td className="border px-2 py-1">{m.name}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={m.enabled}
                  onChange={e => setModels(ms =>
                    ms.map(x => x.name===m.name ? {...x, enabled: e.target.checked}: x)
                  )}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  step="0.1"
                  value={m.temperature}
                  onChange={e => setModels(ms =>
                    ms.map(x => x.name===m.name ? {...x, temperature: +e.target.value}: x)
                  )}
                  className="w-16 border p-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={m.max_tokens}
                  onChange={e => setModels(ms =>
                    ms.map(x => x.name===m.name ? {...x, max_tokens: +e.target.value}: x)
                  )}
                  className="w-20 border p-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => updateModel(m)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></>
  )
}
