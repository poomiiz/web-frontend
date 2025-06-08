import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PromptTestPanelProps {
  model: string;
  setModel: (val: string) => void;
  candidatePrompt: string;
  setCandidatePrompt: (val: string) => void;
  testQuestion: string;
  setTestQuestion: (val: string) => void;
  onSubmit: () => void;
  responseText: string;
}

export function PromptTestPanel({
  model,
  setModel,
  candidatePrompt,
  setCandidatePrompt,
  testQuestion,
  setTestQuestion,
  onSubmit,
  responseText,
}: PromptTestPanelProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">🎯 Test Candidate Prompt</h2>

        <div className="grid gap-2">
          <Label>Model</Label>
          <select
            className="border p-2 rounded-md"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="groq-llama-8k">Groq LLaMA 8k</option>
            <option value="llama-3-70b">LLaMA 3 70B</option>
            <option value="deepseek-r1-70b">DeepSeek R1 70B</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label>Prompt Text</Label>
          <Textarea
            rows={4}
            value={candidatePrompt}
            onChange={(e) => setCandidatePrompt(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Test Question</Label>
          <Input
            value={testQuestion}
            onChange={(e) => setTestQuestion(e.target.value)}
          />
        </div>

        <Button onClick={onSubmit}>Run Test</Button>

        {responseText && (
          <div className="mt-4">
            <Separator className="my-2" />
            <Label>🧠 AI Response</Label>
            <pre className="text-sm mt-2 p-2 bg-gray-100 whitespace-pre-wrap rounded-md">
              {responseText}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
