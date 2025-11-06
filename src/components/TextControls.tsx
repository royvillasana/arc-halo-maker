import { TextConfig } from '@/types/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextControlsProps {
  config: TextConfig;
  onChange: (config: TextConfig) => void;
}

const fontOptions = [
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
];

export const TextControls = ({ config, onChange }: TextControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text-content">Text</Label>
        <Input
          id="text-content"
          value={config.content}
          onChange={(e) => onChange({ ...config, content: e.target.value })}
          placeholder="Enter text..."
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-case">Text Case</Label>
        <Select value={config.textCase} onValueChange={(textCase: 'upper' | 'title' | 'lower') => onChange({ ...config, textCase })}>
          <SelectTrigger id="text-case">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upper">UPPERCASE</SelectItem>
            <SelectItem value="title">Title Case</SelectItem>
            <SelectItem value="lower">lowercase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-family">Font</Label>
        <Select value={config.fontFamily} onValueChange={(fontFamily) => onChange({ ...config, fontFamily })}>
          <SelectTrigger id="font-family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="font-size">Font Size</Label>
          <span className="text-sm text-muted-foreground">{config.fontSize}px</span>
        </div>
        <Slider
          id="font-size"
          min={12}
          max={32}
          step={1}
          value={[config.fontSize]}
          onValueChange={([fontSize]) => onChange({ ...config, fontSize })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="letter-spacing">Letter Spacing</Label>
          <span className="text-sm text-muted-foreground">{config.letterSpacing}px</span>
        </div>
        <Slider
          id="letter-spacing"
          min={0}
          max={10}
          step={0.5}
          value={[config.letterSpacing]}
          onValueChange={([letterSpacing]) => onChange({ ...config, letterSpacing })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="start-angle">Start Angle</Label>
          <span className="text-sm text-muted-foreground">{config.startAngle}°</span>
        </div>
        <Slider
          id="start-angle"
          min={0}
          max={360}
          step={1}
          value={[config.startAngle]}
          onValueChange={([startAngle]) => onChange({ ...config, startAngle })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="arc-width">Arc Width</Label>
          <span className="text-sm text-muted-foreground">{config.arcWidth}°</span>
        </div>
        <Slider
          id="arc-width"
          min={0}
          max={360}
          step={1}
          value={[config.arcWidth]}
          onValueChange={([arcWidth]) => onChange({ ...config, arcWidth })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="radial-offset">Radial Offset</Label>
          <span className="text-sm text-muted-foreground">{config.radialOffset}px</span>
        </div>
        <Slider
          id="radial-offset"
          min={-100}
          max={100}
          step={1}
          value={[config.radialOffset]}
          onValueChange={([radialOffset]) => onChange({ ...config, radialOffset })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-color">Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="text-color"
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
        <Label htmlFor="stroke-color">Stroke Color</Label>
        <div className="flex gap-2">
          <Input
            id="stroke-color"
            type="color"
            value={config.strokeColor}
            onChange={(e) => onChange({ ...config, strokeColor: e.target.value })}
            className="w-20 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={config.strokeColor}
            onChange={(e) => onChange({ ...config, strokeColor: e.target.value })}
            className="flex-1 font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="stroke-width">Stroke Width</Label>
          <span className="text-sm text-muted-foreground">{config.strokeWidth}px</span>
        </div>
        <Slider
          id="stroke-width"
          min={0}
          max={5}
          step={0.5}
          value={[config.strokeWidth]}
          onValueChange={([strokeWidth]) => onChange({ ...config, strokeWidth })}
        />
      </div>
    </div>
  );
};
