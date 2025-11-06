import { AnyLayer } from '@/types/layer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Lock, Unlock, Trash2, Image, Type, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerPanelProps {
  layers: AnyLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
}

export const LayerPanel = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerDelete,
  onLayerReorder,
}: LayerPanelProps) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'ribbon':
        return <Circle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  // Sort layers by zIndex (highest first for display)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Layers</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {sortedLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors',
                  selectedLayerId === layer.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card hover:bg-muted border-border'
                )}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getLayerIcon(layer.type)}
                  <span className="text-sm truncate">{layer.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggleVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggleLock(layer.id);
                    }}
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>

                  {layer.type !== 'background' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDelete(layer.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
