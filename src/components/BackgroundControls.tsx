import { BackgroundConfig } from '@/types/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pipette } from 'lucide-react';

interface BackgroundControlsProps {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
  onEyedropperClick: () => void;
  currentImage: string | null;
}

export const BackgroundControls = ({
  config,
  onChange,
  onEyedropperClick,
  currentImage,
}: BackgroundControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Background Type</Label>
        <Select
          value={config.type}
          onValueChange={(value: 'transparent' | 'solid' | 'gradient') =>
            onChange({ ...config, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transparent">Transparent</SelectItem>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.type === 'solid' && (
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                type="color"
                value={config.color}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.color}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
            {currentImage && (
              <Button
                variant="outline"
                size="icon"
                onClick={onEyedropperClick}
                title="Pick color from image"
              >
                <Pipette className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {config.type === 'gradient' && (
        <>
          <div className="space-y-2">
            <Label>Gradient Start</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.gradientStart}
                onChange={(e) => onChange({ ...config, gradientStart: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.gradientStart}
                onChange={(e) => onChange({ ...config, gradientStart: e.target.value })}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gradient End</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.gradientEnd}
                onChange={(e) => onChange({ ...config, gradientEnd: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.gradientEnd}
                onChange={(e) => onChange({ ...config, gradientEnd: e.target.value })}
                className="flex-1"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
