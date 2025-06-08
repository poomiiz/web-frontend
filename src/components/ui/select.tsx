// components/ui/select.tsx
import * as React from "react"
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select"
import { cn } from "@/lib/utils"

export const Select = ({ value, onValueChange, options }: {
  value: string,
  onValueChange: (v: string) => void,
  options: { label: string, value: string }[]
}) => (
  <RadixSelect value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select option" />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </RadixSelect>
)

