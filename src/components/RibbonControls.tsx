import { RibbonConfig } from '@/types/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RibbonControlsProps {
  config: RibbonConfig;
  onChange: (config: RibbonConfig) => void;
}

export const RibbonControls = ({ config, onChange }: RibbonControlsProps) => {
  return (
    <div className="space-y-4">
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
          <div>
            <Label>Ribbon Style</Label>
            <Select
              value={config.style}
              onValueChange={(value: 'arc' | 'badge') =>
                onChange({ ...config, style: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arc">Arc (Curved)</SelectItem>
                <SelectItem value="badge">Badge (Pill)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ribbon Color</Label>
            <div className="flex gap-2">
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
                placeholder="#57C785"
              />
            </div>
          </div>

          {config.style === 'badge' && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="use-gradient">Use Gradient</Label>
                <Switch
                  id="use-gradient"
                  checked={config.useGradient}
                  onCheckedChange={(useGradient) => onChange({ ...config, useGradient })}
                />
              </div>

              {config.useGradient && (
                <div className="space-y-2">
                  <Label>Edge Fade: {config.gradientFadePercent}%</Label>
                  <Slider
                    value={[config.gradientFadePercent]}
                    onValueChange={([value]) => onChange({ ...config, gradientFadePercent: value })}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Badge Rotation: {config.badgeRotation}°</Label>
                <Slider
                  value={[config.badgeRotation]}
                  onValueChange={([value]) => onChange({ ...config, badgeRotation: value })}
                  min={-45}
                  max={45}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Vertical Position: {config.badgeOffsetY}px</Label>
                <Slider
                  value={[config.badgeOffsetY]}
                  onValueChange={([value]) => onChange({ ...config, badgeOffsetY: value })}
                  min={200}
                  max={400}
                  step={5}
                />
              </div>
            </>
          )}

          {config.style === 'arc' && (
            <>
              <div className="space-y-2">
                <Label>Thickness: {config.thickness}%</Label>
                <Slider
                  value={[config.thickness]}
                  onValueChange={([value]) => onChange({ ...config, thickness: value })}
                  min={5}
                  max={40}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Start Angle: {config.startAngle}°</Label>
                <Slider
                  value={[config.startAngle]}
                  onValueChange={([value]) => onChange({ ...config, startAngle: value })}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Arc Width: {config.arcWidth}°</Label>
                <Slider
                  value={[config.arcWidth]}
                  onValueChange={([value]) => onChange({ ...config, arcWidth: value })}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Shadow Blur: {config.shadowBlur}px</Label>
            <Slider
              value={[config.shadowBlur]}
              onValueChange={([value]) => onChange({ ...config, shadowBlur: value })}
              min={0}
              max={30}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Shadow Opacity: {Math.round(config.shadowOpacity * 100)}%</Label>
            <Slider
              value={[config.shadowOpacity * 100]}
              onValueChange={([value]) => onChange({ ...config, shadowOpacity: value / 100 })}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </>
      )}
    </div>
  );
};
