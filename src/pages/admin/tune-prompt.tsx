// pages/admin/tune-prompt.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Variant {
  model: string;
  promptText: string;
  score: number;
}

interface TuneResponse {
  variants: Variant[];
}

export default function TunePromptPage() {
  const [tuneId, setTuneId] = useState<string>("default");
  const [model, setModel] = useState<string>("gpt-4o");
  const [candidatePrompt, setCandidatePrompt] = useState<string>("");
  const [testQuestion, setTestQuestion] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    // โหลด variants เดิมจาก Firestore ผ่าน API ของ Go-Backend
    axios
      .get<TuneResponse>(`/api/admin/prompt_tunes/${tuneId}`)
      .then((res) => {
        setVariants(res.data.variants);
      })
      .catch((err) => {
        console.error("Failed to fetch variants:", err);
      });
  }, [tuneId]);

  const handleTest = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ generatedResponse: string }>(
        "/ai/tune_prompt",
        {
          tuneId,
          model,
          candidatePrompt,
          testQuestion,
        }
      );
      setResponseText(res.data.generatedResponse);

      // รีเฟรช variants list ใหม่
      const updated = await axios.get<TuneResponse>(
        `/api/admin/prompt_tunes/${tuneId}`
      );
      setVariants(updated.data.variants);
    } catch (err) {
      console.error("Error testing prompt:", err);
    }
  };

  const handleSaveVariant = async (variant: Variant) => {
    try {
      await axios.post(`/api/admin/prompt_tunes/${tuneId}/approve`, {
        model: variant.model,
        promptText: variant.promptText,
      });
      alert("Variant saved!");
    } catch (err) {
      console.error("Error saving variant:", err);
    }
  };

  return (
    <div>
      <h1>Prompt Tuning (ID: {tuneId})</h1>

      <form onSubmit={handleTest}>
        <div>
          <label>Model:</label>
          <select
            value={model}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setModel(e.target.value)
            }
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
            <option value="groq-llama-8k">groq llama 8k</option>
            <option value="llama-3-70b">Llama 3 70B</option>
            <option value="deepseek-r1-70b">DeepSeek R1 70B</option>
          </select>
        </div>

        <div>
          <label>Candidate Prompt:</label>
          <textarea
            value={candidatePrompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setCandidatePrompt(e.target.value)
            }
            rows={4}
            cols={50}
          />
        </div>

        <div>
          <label>Test Question:</label>
          <input
            type="text"
            value={testQuestion}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTestQuestion(e.target.value)
            }
          />
        </div>

        <button type="submit">Run Test</button>
      </form>

      {responseText && (
        <div>
          <h3>AI Response:</h3>
          <pre>{responseText}</pre>
        </div>
      )}

      <hr />

      <h2>Existing Variants</h2>
      <ul>
        {variants.map((v, idx) => (
          <li key={idx}>
            <b>{v.model}</b> (score: {v.score})
            <pre>{v.promptText}</pre>
            <button onClick={() => handleSaveVariant(v)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
