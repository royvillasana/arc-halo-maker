import { presets } from '@/types/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface PresetListProps {
  onSelectPreset: (index: number) => void;
}

const presetColors: Record<string, string> = {
  OpenToWork: 'bg-accent',
  Hiring: 'bg-primary',
  Freelance: 'bg-purple-600',
  Available: 'bg-orange-600',
};

export const PresetList = ({ onSelectPreset }: PresetListProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Presets</h3>
      </div>
      <div className="grid gap-2">
        {presets.map((preset, index) => (
          <Card key={preset.name} className="p-3 hover:shadow-md transition-shadow">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto hover:bg-transparent hover:text-foreground"
              onClick={() => onSelectPreset(index)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-full ${presetColors[preset.name]}`} />
                <div className="text-left">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {preset.config.text?.content}
                  </div>
                </div>
              </div>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
