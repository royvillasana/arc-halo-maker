import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AvatarConfig } from '@/types/avatar';
import { renderAvatar, downloadCanvas } from '@/lib/canvas-utils';
import { toast } from 'sonner';

interface ExportPanelProps {
  config: AvatarConfig;
}

const exportSizes = [
  { label: '400×400', value: 400 },
  { label: '800×800', value: 800 },
  { label: '1080×1080', value: 1080 },
  { label: '1200×1200', value: 1200 },
];

export const ExportPanel = ({ config }: ExportPanelProps) => {
  const [selectedSize, setSelectedSize] = useState(800);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');

  const handleExport = () => {
    if (!config.image) {
      toast.error('Please upload an image first');
      return;
    }

    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      renderAvatar(canvas, config, selectedSize);
      const filename = `avatar-${selectedSize}x${selectedSize}.${format}`;
      downloadCanvas(canvas, filename, format);
      toast.success(`Exported ${filename}`);
    };
    
    img.src = config.image;
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">Export</h3>
      
      <div className="space-y-2">
        <Label htmlFor="export-size">Size</Label>
        <Select
          value={selectedSize.toString()}
          onValueChange={(value) => setSelectedSize(parseInt(value))}
        >
          <SelectTrigger id="export-size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {exportSizes.map((size) => (
              <SelectItem key={size.value} value={size.value.toString()}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="export-format">Format</Label>
        <Select value={format} onValueChange={(value: 'png' | 'jpg') => setFormat(value)}>
          <SelectTrigger id="export-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG (Transparent)</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleExport} className="w-full" size="lg">
        <Download className="mr-2 h-4 w-4" />
        Download Avatar
      </Button>
    </Card>
  );
};
