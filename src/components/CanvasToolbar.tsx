import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MousePointer2, Hand, ZoomIn, ZoomOut, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tool = 'select' | 'pan';

interface CanvasToolbarProps {
  activeTool: Tool;
  zoom: number;
  onToolChange: (tool: Tool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExport: () => void;
}

export const CanvasToolbar = ({
  activeTool,
  zoom,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
}: CanvasToolbarProps) => {
  return (
    <Card className="p-2">
      <div className="flex items-center gap-1">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onToolChange('select')}
          title="Select Tool (V)"
        >
          <MousePointer2 className="w-4 h-4" />
        </Button>

        <Button
          variant={activeTool === 'pan' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onToolChange('pan')}
          title="Pan Tool (H)"
        >
          <Hand className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <span className="text-xs px-2 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onResetView}
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          title="Export"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
