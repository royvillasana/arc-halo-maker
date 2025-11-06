import { useState, useEffect } from 'react';
import { AvatarConfig, defaultAvatarConfig, presets } from '@/types/avatar';
import { AnyLayer, ImageLayer, RibbonLayer, TextLayer, BackgroundLayer } from '@/types/layer';
import { AvatarUploader } from '@/components/AvatarUploader';
import { RibbonControls } from '@/components/RibbonControls';
import { TextControls } from '@/components/TextControls';
import { BackgroundControls } from '@/components/BackgroundControls';
import { PresetList } from '@/components/PresetList';
import { PhotoshopCanvas } from '@/components/PhotoshopCanvas';
import { ExportPanel } from '@/components/ExportPanel';
import { LayerPanel } from '@/components/LayerPanel';
import { CanvasToolbar, Tool } from '@/components/CanvasToolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Index = () => {
  const [config, setConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [layers, setLayers] = useState<AnyLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [eyedropperMode, setEyedropperMode] = useState(false);
  const canvasSize = 800;

  // Convert config to layers
  useEffect(() => {
    const newLayers: AnyLayer[] = [];

    // Background layer
    const bgLayer: BackgroundLayer = {
      id: 'background',
      name: 'Background',
      type: 'background',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 0,
      data: {
        bgType: config.background.type,
        color: config.background.color,
        gradientStart: config.background.gradientStart,
        gradientEnd: config.background.gradientEnd,
      },
    };
    newLayers.push(bgLayer);

    // Image layer
    if (config.image) {
      const imgLayer: ImageLayer = {
        id: 'image',
        name: 'Avatar Image',
        type: 'image',
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: 1,
        data: {
          imageUrl: config.image,
          scale: config.imageScale,
          x: config.imageX,
          y: config.imageY,
        },
      };
      newLayers.push(imgLayer);
    }

    // Ribbon layer
    if (config.ribbon.visible) {
      const ribbonLayer: RibbonLayer = {
        id: 'ribbon',
        name: 'Ribbon',
        type: 'ribbon',
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: 2,
        data: {
          color: config.ribbon.color,
          thickness: config.ribbon.thickness,
          startAngle: config.ribbon.startAngle,
          arcWidth: config.ribbon.arcWidth,
          borderColor: config.ribbon.borderColor,
          borderWidth: config.ribbon.borderWidth,
          shadowBlur: config.ribbon.shadowBlur,
          shadowOpacity: config.ribbon.shadowOpacity,
          style: config.ribbon.style,
          badgeRotation: config.ribbon.badgeRotation,
          badgeOffsetY: config.ribbon.badgeOffsetY,
          useGradient: config.ribbon.useGradient,
          gradientFadePercent: config.ribbon.gradientFadePercent,
        },
      };
      newLayers.push(ribbonLayer);

      // Text layer (depends on ribbon)
      if (config.text.content) {
        const radius = canvasSize / 2;
        const ribbonRadius = radius - (radius * config.ribbon.thickness) / 100;
        const ribbonThickness = (radius * config.ribbon.thickness) / 100;

        const textLayer: TextLayer = {
          id: 'text',
          name: 'Text',
          type: 'text',
          visible: true,
          locked: false,
          opacity: 1,
          zIndex: 3,
          data: {
            content: config.text.content,
            textCase: config.text.textCase,
            fontFamily: config.text.fontFamily,
            fontSize: config.text.fontSize,
            letterSpacing: config.text.letterSpacing,
            radialOffset: config.text.radialOffset,
            color: config.text.color,
            strokeColor: config.text.strokeColor,
            strokeWidth: config.text.strokeWidth,
            ribbonRadius: ribbonRadius + ribbonThickness / 2,
          },
        };
        newLayers.push(textLayer);
      }
    }

    setLayers(newLayers);
  }, [config, canvasSize]);

  const handleImageSelect = (imageUrl: string) => {
    setConfig((prev) => ({ ...prev, image: imageUrl }));
    // Auto-select image layer for immediate dragging
    setSelectedLayerId('image');
  };

  const handleImageTransform = (scale: number, x: number, y: number) => {
    setConfig((prev) => ({ ...prev, imageScale: scale, imageX: x, imageY: y }));
    
    // Update layer directly for real-time preview
    setLayers(prev => prev.map(layer => 
      layer.id === 'image' && layer.type === 'image'
        ? { ...layer, data: { ...layer.data, scale, x, y } }
        : layer
    ));
  };

  const handleCanvasImageDrag = (x: number, y: number) => {
    setConfig((prev) => ({ ...prev, imageX: x, imageY: y }));
    
    // Update layer directly for real-time preview
    setLayers(prev => prev.map(layer => 
      layer.id === 'image' && layer.type === 'image'
        ? { ...layer, data: { ...layer.data, x, y } }
        : layer
    ));
  };

  const handleRibbonChange = (ribbon: AvatarConfig['ribbon']) => {
    setConfig((prev) => ({ ...prev, ribbon }));
  };

  const handleTextChange = (text: AvatarConfig['text']) => {
    setConfig((prev) => ({ ...prev, text }));
  };

  const handleBackgroundChange = (background: AvatarConfig['background']) => {
    setConfig((prev) => ({ ...prev, background }));
  };

  const handleEyedropperClick = () => {
    setEyedropperMode(true);
    toast.info('Click on the image to pick a color');
  };

  const handleColorPick = (color: string) => {
    setConfig((prev) => ({ 
      ...prev, 
      background: { ...prev.background, color, type: 'solid' } 
    }));
    setEyedropperMode(false);
    toast.success(`Color picked: ${color}`);
  };

  const handlePresetSelect = (index: number) => {
    const preset = presets[index];
    setConfig((prev) => ({
      ...prev,
      ribbon: { ...prev.ribbon, ...preset.config.ribbon },
      text: { ...prev.text, ...preset.config.text },
    }));
  };

  // Layer management
  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const handleLayerToggleVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleLayerToggleLock = (layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const handleLayerDelete = (layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    toast.success('Layer deleted');
  };

  const handleLayerReorder = (layerId: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const index = prev.findIndex(l => l.id === layerId);
      if (index === -1) return prev;

      const newLayers = [...prev];
      const targetIndex = direction === 'up' ? index + 1 : index - 1;
      
      if (targetIndex < 0 || targetIndex >= newLayers.length) return prev;

      [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
      return newLayers;
    });
  };

  // Canvas controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleExport = () => {
    // Export functionality handled by ExportPanel
    toast.info('Use the Export panel on the right');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold">Photoshop-Style Avatar Editor</h1>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] flex">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r bg-[hsl(var(--editor-panel))] overflow-auto">
          <div className="p-4">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload">Image</TabsTrigger>
                <TabsTrigger value="background">BG</TabsTrigger>
                <TabsTrigger value="ribbon">Ribbon</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                <TabsContent value="upload" className="space-y-4">
                  <AvatarUploader
                    onImageSelect={handleImageSelect}
                    currentImage={config.image}
                    imageScale={config.imageScale}
                    imageX={config.imageX}
                    imageY={config.imageY}
                    onImageTransform={handleImageTransform}
                  />

                  <Separator />

                  <PresetList onSelectPreset={handlePresetSelect} />
                </TabsContent>

                <TabsContent value="background" className="space-y-4">
                  <BackgroundControls 
                    config={config.background} 
                    onChange={handleBackgroundChange}
                    onEyedropperClick={handleEyedropperClick}
                    currentImage={config.image}
                  />
                </TabsContent>

                <TabsContent value="ribbon" className="space-y-4">
                  <RibbonControls config={config.ribbon} onChange={handleRibbonChange} />
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <TextControls config={config.text} onChange={handleTextChange} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-card">
            <CanvasToolbar
              activeTool={activeTool}
              zoom={zoom}
              onToolChange={setActiveTool}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={handleResetView}
              onExport={handleExport}
            />
          </div>
          
          <div className="flex-1 p-4">
            {config.image ? (
              <PhotoshopCanvas
                layers={layers}
                canvasSize={canvasSize}
                zoom={zoom}
                panX={panX}
                panY={panY}
                activeTool={activeTool}
                selectedLayerId={selectedLayerId}
                eyedropperMode={eyedropperMode}
                onPanChange={(x, y) => {
                  setPanX(x);
                  setPanY(y);
                }}
                onImageTransform={handleCanvasImageDrag}
                onColorPick={handleColorPick}
              />
            ) : (
              <Card className="w-full h-full flex items-center justify-center text-center text-muted-foreground">
                <p>Upload an image to get started</p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Layers & Export */}
        <div className="w-80 border-l bg-[hsl(var(--editor-panel))] overflow-auto">
          <div className="p-4 space-y-4">
            <LayerPanel
              layers={layers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={handleLayerSelect}
              onLayerToggleVisibility={handleLayerToggleVisibility}
              onLayerToggleLock={handleLayerToggleLock}
              onLayerDelete={handleLayerDelete}
              onLayerReorder={handleLayerReorder}
            />

            <Separator />

            <ExportPanel config={config} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
