import { useEffect, useRef, useState } from 'react';
import { CanvasManager } from '@/lib/canvas-manager';
import { AnyLayer, TextLayer, RibbonLayer } from '@/types/layer';
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

  const formatText = (text: string, textCase: 'upper' | 'title' | 'lower'): string => {
    switch (textCase) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      default:
        return text;
    }
  };

  const textLayer = layers.find(l => l.type === 'text') as TextLayer | undefined;
  const ribbonLayer = layers.find(l => l.type === 'ribbon') as RibbonLayer | undefined;

  return (
    <div className="flex items-center justify-center w-full h-full bg-[hsl(var(--canvas-bg))] rounded-lg border overflow-hidden">
      <div className="relative" style={{ maxHeight: '600px' }}>
        <canvas
          ref={canvasRef}
          className={`max-w-full h-auto rounded-lg shadow-xl ${getCursorStyle()}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        {textLayer && ribbonLayer && textLayer.visible && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            style={{ maxHeight: '600px' }}
          >
            <defs>
              <path
                id="circlePath"
                d={(() => {
                  const centerX = canvasSize / 2;
                  const centerY = canvasSize / 2;
                  const radius = textLayer.data.ribbonRadius || canvasSize / 2;
                  const adjustedRadius = radius - textLayer.data.radialOffset;
                  const startAngle = ((ribbonLayer.data.startAngle - 90) * Math.PI) / 180;
                  const endAngle = ((ribbonLayer.data.startAngle + ribbonLayer.data.arcWidth - 90) * Math.PI) / 180;
                  
                  // For inside text, we draw from end to start (reverse direction)
                  const startX = centerX + adjustedRadius * Math.cos(endAngle);
                  const startY = centerY + adjustedRadius * Math.sin(endAngle);
                  const endX = centerX + adjustedRadius * Math.cos(startAngle);
                  const endY = centerY + adjustedRadius * Math.sin(startAngle);
                  
                  const largeArcFlag = ribbonLayer.data.arcWidth > 180 ? 1 : 0;
                  
                  // Sweep flag 0 for counter-clockwise (inside text orientation)
                  return `M ${startX} ${startY} A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 0 ${endX} ${endY}`;
                })()}
              />
            </defs>
            <text
              fill={textLayer.data.color}
              fontSize={textLayer.data.fontSize}
              fontFamily={textLayer.data.fontFamily}
              fontWeight="bold"
              textAnchor="middle"
              letterSpacing={textLayer.data.letterSpacing}
              stroke={textLayer.data.strokeWidth > 0 ? textLayer.data.strokeColor : 'none'}
              strokeWidth={textLayer.data.strokeWidth * 2}
              paintOrder="stroke"
            >
              <textPath href="#circlePath" startOffset="50%">
                {formatText(textLayer.data.content, textLayer.data.textCase)}
              </textPath>
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
