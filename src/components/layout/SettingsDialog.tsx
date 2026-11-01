import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LLM_PROVIDERS } from "@/lib/app-data";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [provider, setProvider] = useState(LLM_PROVIDERS[0].id);
  const [model, setModel] = useState(LLM_PROVIDERS[0].models[0]);
  const [temperature, setTemperature] = useState([0.4]);
  const [streaming, setStreaming] = useState(true);
  const [autoCanvas, setAutoCanvas] = useState(true);

  const current = LLM_PROVIDERS.find((p) => p.id === provider) ?? LLM_PROVIDERS[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Choose the model that powers your workspace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>LLM provider</Label>
            <Select
              value={provider}
              onValueChange={(v) => {
                setProvider(v);
                const next = LLM_PROVIDERS.find((p) => p.id === v);
                if (next) setModel(next.models[0]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {current.models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <span className="text-xs text-muted-foreground">{temperature[0].toFixed(1)}</span>
            </div>
            <Slider value={temperature} onValueChange={setTemperature} min={0} max={1} step={0.1} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <div>
              <div className="text-sm font-medium">Stream responses</div>
              <div className="text-xs text-muted-foreground">Show tokens as they arrive</div>
            </div>
            <Switch checked={streaming} onCheckedChange={setStreaming} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <div>
              <div className="text-sm font-medium">Auto-open canvas</div>
              <div className="text-xs text-muted-foreground">Reveal the canvas on submit</div>
            </div>
            <Switch checked={autoCanvas} onCheckedChange={setAutoCanvas} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
