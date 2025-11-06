import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AvatarConfig } from '@/types/avatar';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

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
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!config.image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsExporting(true);
    try {
      // Find the canvas container
      const canvasContainer = document.getElementById('avatar-canvas-container') as HTMLElement;
      if (!canvasContainer) {
        toast.error('Canvas not found');
        setIsExporting(false);
        return;
      }

      // Capture the canvas with html2canvas at the selected size
      const canvas = await html2canvas(canvasContainer, {
        backgroundColor: null,
        scale: selectedSize / 800, // Scale to desired export size
        logging: false,
        useCORS: true,
        width: 800,
        height: 800,
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `avatar-${selectedSize}x${selectedSize}.${format}`;
      link.href = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 1.0);
      link.click();

      toast.success(`Avatar exported as ${format.toUpperCase()} (${selectedSize}x${selectedSize})`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export avatar');
    } finally {
      setIsExporting(false);
    }
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

      <Button onClick={handleExport} className="w-full" size="lg" disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Download Avatar'}
      </Button>
    </Card>
  );
};
