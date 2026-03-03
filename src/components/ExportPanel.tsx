import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AvatarConfig } from '@/types/avatar';
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
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!config.image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsExporting(true);
    try {
      const canvasContainer = document.getElementById('avatar-canvas-container') as HTMLElement;
      if (!canvasContainer) {
        toast.error('Canvas not found');
        setIsExporting(false);
        return;
      }

      // Get the source canvas element directly (already has rendered content at 800x800)
      const sourceCanvas = canvasContainer.querySelector('canvas') as HTMLCanvasElement;
      if (!sourceCanvas) {
        toast.error('Canvas element not found');
        setIsExporting(false);
        return;
      }

      // Create output canvas at desired export size
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = selectedSize;
      outputCanvas.height = selectedSize;
      const ctx = outputCanvas.getContext('2d');

      if (!ctx) {
        toast.error('Failed to create output canvas');
        setIsExporting(false);
        return;
      }

      const centerX = selectedSize / 2;
      const centerY = selectedSize / 2;
      const radius = selectedSize / 2;

      // Apply circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw the source canvas (scales from 800x800 to selectedSize)
      ctx.drawImage(sourceCanvas, 0, 0, selectedSize, selectedSize);

      // Render SVG text overlay onto the export canvas
      const svgElement = canvasContainer.querySelector('svg');
      if (svgElement) {
        // Clone SVG and ensure proper attributes for standalone rendering
        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgClone.setAttribute('width', String(selectedSize));
        svgClone.setAttribute('height', String(selectedSize));

        // Inline font styles to ensure they render in the exported image
        const textEl = svgClone.querySelector('text');
        if (textEl) {
          const computedStyle = window.getComputedStyle(svgElement.querySelector('text')!);
          textEl.style.fontFamily = computedStyle.fontFamily;
        }

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, selectedSize, selectedSize);
            URL.revokeObjectURL(svgUrl);
            resolve();
          };
          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            console.warn('SVG text rendering failed, exporting without text');
            resolve();
          };
          img.src = svgUrl;
        });
      }

      ctx.restore();

      // Download the image
      const link = document.createElement('a');
      link.download = `avatar-${selectedSize}x${selectedSize}.${format}`;
      link.href = outputCanvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 1.0);
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
