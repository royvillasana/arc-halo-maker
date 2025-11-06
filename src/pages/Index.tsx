import { useState, useEffect, useRef } from 'react';
import { AvatarConfig, defaultAvatarConfig, presets } from '@/types/avatar';
import { AnyLayer, ImageLayer, RibbonLayer, TextLayer, BackgroundLayer } from '@/types/layer';
import { PresetList } from '@/components/PresetList';
import { PhotoshopCanvas } from '@/components/PhotoshopCanvas';
import { ExportPanel } from '@/components/ExportPanel';
import { LayerAccordion } from '@/components/LayerAccordion';
import { CanvasToolbar, Tool } from '@/components/CanvasToolbar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          zIndex: 10,
          data: {
            content: config.text.content,
            textCase: config.text.textCase,
            fontFamily: config.text.fontFamily,
            fontSize: config.text.fontSize,
            letterSpacing: config.text.letterSpacing,
            radialOffset: config.text.radialOffset,
            startAngle: config.text.startAngle,
            arcWidth: config.text.arcWidth,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Validate minimum size
        if (img.width < 512 || img.height < 512) {
          toast.error('Image must be at least 512x512 pixels');
          return;
        }
        handleImageSelect(event.target?.result as string);
        toast.success('Image uploaded successfully');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
        {/* Left Panel - Layer Accordion */}
        <div className="w-80 border-r bg-[hsl(var(--editor-panel))] overflow-auto">
          <LayerAccordion
            layers={layers}
            config={config}
            selectedLayerId={selectedLayerId}
            onLayerSelect={handleLayerSelect}
            onLayerToggleVisibility={handleLayerToggleVisibility}
            onLayerToggleLock={handleLayerToggleLock}
            onImageSelect={handleImageSelect}
            onImageTransform={handleImageTransform}
            onRibbonChange={handleRibbonChange}
            onTextChange={handleTextChange}
            onBackgroundChange={handleBackgroundChange}
            onEyedropperClick={handleEyedropperClick}
          />
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 flex items-center justify-center overflow-auto min-h-0">
            <div className="w-full h-full flex items-center justify-center p-4">
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
                <Card className="w-full max-w-[800px] aspect-square flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image
                  </Button>
                  <p className="text-sm">Upload an image to get started</p>
                </Card>
              )}
            </div>
          </div>
          
          {/* Toolbar - Below canvas */}
          {config.image && (
            <div className="flex justify-center p-4 border-t bg-background">
              <div className="bg-card border rounded-lg shadow-md p-2">
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
            </div>
          )}
        </div>

        {/* Right Panel - Export */}
        <div className="w-80 border-l bg-[hsl(var(--editor-panel))] overflow-auto">
          <div className="p-4 space-y-4">
            <PresetList onSelectPreset={handlePresetSelect} />

            <Separator />

            <ExportPanel config={config} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
