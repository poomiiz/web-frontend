import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Variant {
  model: string;
  promptText: string;
  score: number;
}

interface PromptVariantListProps {
  variants: Variant[];
  onApprove: (v: Variant) => void;
}

export function PromptVariantList({ variants, onApprove }: PromptVariantListProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">🧪 Prompt Variants</h2>
        {variants.length === 0 ? (
          <p className="text-gray-500">No variants found.</p>
        ) : (
          variants.map((v, idx) => (
            <div key={idx} className="border p-4 rounded-md bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">{v.model}</div>
                <span className="text-sm text-gray-600">score: {v.score}</span>
              </div>
              <pre className="text-sm whitespace-pre-wrap mb-2">{v.promptText}</pre>
              <Button onClick={() => onApprove(v)}>✅ Approve</Button>
              {idx < variants.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
