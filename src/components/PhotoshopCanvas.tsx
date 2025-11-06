import { useEffect, useRef, useState } from 'react';
import { CanvasManager } from '@/lib/canvas-manager';
import { AnyLayer } from '@/types/layer';
import { Tool } from './CanvasToolbar';

interface PhotoshopCanvasProps {
  layers: AnyLayer[];
  canvasSize: number;
  zoom: number;
  panX: number;
  panY: number;
  activeTool: Tool;
  onPanChange: (x: number, y: number) => void;
}

export const PhotoshopCanvas = ({
  layers,
  canvasSize,
  zoom,
  panX,
  panY,
  activeTool,
  onPanChange,
}: PhotoshopCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!managerRef.current) {
      managerRef.current = new CanvasManager(canvasRef.current, canvasSize);
    }

    managerRef.current.setLayers(layers);
    managerRef.current.setZoom(zoom);
    managerRef.current.setPan(panX, panY);
  }, [layers, canvasSize, zoom, panX, panY]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && activeTool === 'pan') {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onPanChange(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Wheel zoom will be handled by parent component
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-[hsl(var(--canvas-bg))] rounded-lg border overflow-hidden">
      <canvas
        ref={canvasRef}
        className={cn(
          'max-w-full h-auto rounded-lg shadow-xl',
          activeTool === 'pan' && 'cursor-grab',
          isDragging && activeTool === 'pan' && 'cursor-grabbing'
        )}
        style={{ maxHeight: '600px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
