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
  selectedLayerId: string | null;
  eyedropperMode: boolean;
  onPanChange: (x: number, y: number) => void;
  onImageTransform: (x: number, y: number) => void;
  onColorPick: (color: string) => void;
}

export const PhotoshopCanvas = ({
  layers,
  canvasSize,
  zoom,
  panX,
  panY,
  activeTool,
  selectedLayerId,
  eyedropperMode,
  onPanChange,
  onImageTransform,
  onColorPick,
}: PhotoshopCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageStartPos, setImageStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!managerRef.current) {
      managerRef.current = new CanvasManager(canvasRef.current, canvasSize);
    }

    managerRef.current.setLayers(layers);
    managerRef.current.setZoom(zoom);
    managerRef.current.setPan(panX, panY);
  }, [layers, canvasSize, zoom, panX, panY]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasSize / rect.width;
    const scaleY = canvasSize / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (eyedropperMode) {
      // Pick color from canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const pixel = ctx.getImageData(coords.x, coords.y, 1, 1).data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
          onColorPick(hex);
        }
      }
      return;
    }

    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    } else if (activeTool === 'select' && selectedLayerId === 'image') {
      // Check if clicking on image layer
      const imageLayer = layers.find(l => l.id === 'image' && l.type === 'image');
      if (imageLayer && imageLayer.type === 'image') {
        setIsDragging(true);
        setImageStartPos({ x: imageLayer.data.x, y: imageLayer.data.y });
        setDragStart({ x: coords.x, y: coords.y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    if (activeTool === 'pan') {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onPanChange(newX, newY);
    } else if (activeTool === 'select' && selectedLayerId === 'image') {
      const coords = getCanvasCoordinates(e);
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;
      
      const newX = imageStartPos.x + deltaX;
      const newY = imageStartPos.y + deltaY;
      
      onImageTransform(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Wheel zoom will be handled by parent component
  };

  const getCursorStyle = () => {
    if (eyedropperMode) {
      return 'cursor-crosshair';
    }
    if (activeTool === 'pan') {
      return isDragging ? 'cursor-grabbing' : 'cursor-grab';
    }
    if (activeTool === 'select' && selectedLayerId === 'image') {
      return isDragging ? 'cursor-grabbing' : 'cursor-move';
    }
    return 'cursor-default';
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-[hsl(var(--canvas-bg))] rounded-lg border overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`max-w-full h-auto rounded-lg shadow-xl ${getCursorStyle()}`}
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
