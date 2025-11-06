import { RibbonConfig } from '@/types/avatar';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface RibbonControlsProps {
  config: RibbonConfig;
  onChange: (config: RibbonConfig) => void;
}

export const RibbonControls = ({ config, onChange }: RibbonControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="ribbon-visible">Show Ribbon</Label>
        <Switch
          id="ribbon-visible"
          checked={config.visible}
          onCheckedChange={(visible) => onChange({ ...config, visible })}
        />
      </div>

      {config.visible && (
        <>
          <div className="space-y-2">
            <Label htmlFor="ribbon-color">Ribbon Color</Label>
            <div className="flex gap-2">
              <Input
                id="ribbon-color"
                type="color"
                value={config.color}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={config.color}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ribbon-thickness">Thickness</Label>
              <span className="text-sm text-muted-foreground">{config.thickness}%</span>
            </div>
            <Slider
              id="ribbon-thickness"
              min={10}
              max={40}
              step={1}
              value={[config.thickness]}
              onValueChange={([thickness]) => onChange({ ...config, thickness })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ribbon-start">Start Angle</Label>
              <span className="text-sm text-muted-foreground">{config.startAngle}°</span>
            </div>
            <Slider
              id="ribbon-start"
              min={0}
              max={360}
              step={1}
              value={[config.startAngle]}
              onValueChange={([startAngle]) => onChange({ ...config, startAngle })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ribbon-width">Arc Width</Label>
              <span className="text-sm text-muted-foreground">{config.arcWidth}°</span>
            </div>
            <Slider
              id="ribbon-width"
              min={90}
              max={270}
              step={1}
              value={[config.arcWidth]}
              onValueChange={([arcWidth]) => onChange({ ...config, arcWidth })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="border-color">Border Color</Label>
            <div className="flex gap-2">
              <Input
                id="border-color"
                type="color"
                value={config.borderColor}
                onChange={(e) => onChange({ ...config, borderColor: e.target.value })}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={config.borderColor}
                onChange={(e) => onChange({ ...config, borderColor: e.target.value })}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="border-width">Border Width</Label>
              <span className="text-sm text-muted-foreground">{config.borderWidth}px</span>
            </div>
            <Slider
              id="border-width"
              min={0}
              max={10}
              step={1}
              value={[config.borderWidth]}
              onValueChange={([borderWidth]) => onChange({ ...config, borderWidth })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="shadow-blur">Shadow Blur</Label>
              <span className="text-sm text-muted-foreground">{config.shadowBlur}px</span>
            </div>
            <Slider
              id="shadow-blur"
              min={0}
              max={30}
              step={1}
              value={[config.shadowBlur]}
              onValueChange={([shadowBlur]) => onChange({ ...config, shadowBlur })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="shadow-opacity">Shadow Opacity</Label>
              <span className="text-sm text-muted-foreground">
                {(config.shadowOpacity * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              id="shadow-opacity"
              min={0}
              max={100}
              step={1}
              value={[config.shadowOpacity * 100]}
              onValueChange={([opacity]) => onChange({ ...config, shadowOpacity: opacity / 100 })}
            />
          </div>
        </>
      )}
    </div>
  );
};
