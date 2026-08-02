import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type FieldType = "text" | "textarea" | "number" | "switch" | "select" | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  full?: boolean;
};

export type Values = Record<string, unknown>;

export function ResourceEditor({
  fields,
  value,
  onSubmit,
  onCancel,
  saving,
}: {
  fields: Field[];
  value: Values;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [values, setValues] = useState<Values>(value);
  useEffect(() => setValues(value), [value]);

  const set = (name: string, next: unknown) =>
    setValues((prev) => ({ ...prev, [name]: next }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="grid gap-5 border border-hairline bg-card p-5 md:grid-cols-2"
    >
      {fields.map((field) => {
        const raw = values[field.name];
        return (
          <div
            key={field.name}
            className={field.full || field.type === "textarea" ? "md:col-span-2" : ""}
          >
            <Label htmlFor={field.name} className="technical-label">
              {field.label}
            </Label>
            <div className="mt-2">
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 6}
                  value={String(raw ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="font-mono text-sm"
                />
              )}
              {field.type === "text" && (
                <Input
                  id={field.name}
                  value={String(raw ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "list" && (
                <Input
                  id={field.name}
                  value={Array.isArray(raw) ? raw.join(", ") : String(raw ?? "")}
                  placeholder={field.placeholder ?? "comma, separated, values"}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  value={raw === null || raw === undefined ? "" : String(raw)}
                  onChange={(e) =>
                    set(field.name, e.target.value === "" ? null : Number(e.target.value))
                  }
                />
              )}
              {field.type === "switch" && (
                <Switch
                  id={field.name}
                  checked={Boolean(raw)}
                  onCheckedChange={(checked) => set(field.name, checked)}
                />
              )}
              {field.type === "select" && (
                <Select
                  value={String(raw ?? field.options?.[0]?.value ?? "")}
                  onValueChange={(next) => set(field.name, next)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}