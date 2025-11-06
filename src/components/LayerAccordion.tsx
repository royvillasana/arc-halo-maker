import { AnyLayer } from '@/types/layer';
import { AvatarConfig } from '@/types/avatar';
import { AvatarUploader } from './AvatarUploader';
import { BackgroundControls } from './BackgroundControls';
import { RibbonControls } from './RibbonControls';
import { TextControls } from './TextControls';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Eye, EyeOff, Lock, Unlock, Image, Type, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayerAccordionProps {
  layers: AnyLayer[];
  config: AvatarConfig;
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onImageSelect: (imageUrl: string) => void;
  onImageTransform: (scale: number, x: number, y: number) => void;
  onRibbonChange: (ribbon: AvatarConfig['ribbon']) => void;
  onTextChange: (text: AvatarConfig['text']) => void;
  onBackgroundChange: (background: AvatarConfig['background']) => void;
  onEyedropperClick: () => void;
}

export const LayerAccordion = ({
  layers,
  config,
  selectedLayerId,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onImageSelect,
  onImageTransform,
  onRibbonChange,
  onTextChange,
  onBackgroundChange,
  onEyedropperClick,
}: LayerAccordionProps) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'ribbon':
        return <Circle className="h-4 w-4" />;
      case 'background':
        return <Circle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderLayerControls = (layer: AnyLayer) => {
    switch (layer.type) {
      case 'image':
        return (
          <AvatarUploader
            onImageSelect={onImageSelect}
            currentImage={config.image}
            imageScale={config.imageScale}
            imageX={config.imageX}
            imageY={config.imageY}
            onImageTransform={onImageTransform}
          />
        );
      case 'background':
        return (
          <BackgroundControls
            config={config.background}
            onChange={onBackgroundChange}
            onEyedropperClick={onEyedropperClick}
            currentImage={config.image}
          />
        );
      case 'ribbon':
        return <RibbonControls config={config.ribbon} onChange={onRibbonChange} />;
      case 'text':
        return <TextControls config={config.text} onChange={onTextChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg px-4 pt-4">Layers</h3>
      <Accordion type="single" collapsible value={selectedLayerId || undefined} onValueChange={onLayerSelect}>
        {layers.map((layer) => (
          <AccordionItem key={layer.id} value={layer.id} className="border-b">
            <div className="flex items-center gap-2 px-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerToggleVisibility(layer.id);
                }}
              >
                {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerToggleLock(layer.id);
                }}
              >
                {layer.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  {getLayerIcon(layer.type)}
                  <span className="font-medium">{layer.name}</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-4 pb-4">
              {renderLayerControls(layer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
