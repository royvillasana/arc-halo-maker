import { useEffect, useRef } from 'react';
import { AvatarConfig } from '@/types/avatar';
import { renderAvatar } from '@/lib/canvas-utils';

interface CanvasPreviewProps {
  config: AvatarConfig;
  size?: number;
}

export const CanvasPreview = ({ config, size = 600 }: CanvasPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Wait for image to load if present
    if (config.image) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          renderAvatar(canvasRef.current, config, size);
        }
      };
      img.src = config.image;
    } else {
      renderAvatar(canvasRef.current, config, size);
    }
  }, [config, size]);

  return (
    <div className="flex items-center justify-center p-8 bg-[hsl(var(--canvas-bg))] rounded-lg border">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-xl"
        style={{ maxHeight: '600px' }}
      />
    </div>
  );
};
