import { useState } from 'react';
import { AvatarConfig, defaultAvatarConfig, presets } from '@/types/avatar';
import { AvatarUploader } from '@/components/AvatarUploader';
import { RibbonControls } from '@/components/RibbonControls';
import { TextControls } from '@/components/TextControls';
import { PresetList } from '@/components/PresetList';
import { CanvasPreview } from '@/components/CanvasPreview';
import { ExportPanel } from '@/components/ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [config, setConfig] = useState<AvatarConfig>(defaultAvatarConfig);

  const handleImageSelect = (imageUrl: string) => {
    setConfig((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleImageTransform = (scale: number, x: number, y: number) => {
    setConfig((prev) => ({ ...prev, imageScale: scale, imageX: x, imageY: y }));
  };

  const handleRibbonChange = (ribbon: AvatarConfig['ribbon']) => {
    setConfig((prev) => ({ ...prev, ribbon }));
  };

  const handleTextChange = (text: AvatarConfig['text']) => {
    setConfig((prev) => ({ ...prev, text }));
  };

  const handlePresetSelect = (index: number) => {
    const preset = presets[index];
    setConfig((prev) => ({
      ...prev,
      ribbon: { ...prev.ribbon, ...preset.config.ribbon },
      text: { ...prev.text, ...preset.config.text },
    }));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--editor-panel))]">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Avatar Ribbon Editor</h1>
              <p className="text-sm text-muted-foreground">
                Create professional profile avatars with customizable ribbons
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[320px_1fr_320px] gap-6">
          {/* Left Panel - Controls */}
          <Card className="bg-[hsl(var(--control-bg))] h-fit">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="p-6 space-y-6">
                <AvatarUploader
                  onImageSelect={handleImageSelect}
                  currentImage={config.image}
                  imageScale={config.imageScale}
                  imageX={config.imageX}
                  imageY={config.imageY}
                  onImageTransform={handleImageTransform}
                />

                <Separator />

                <Tabs defaultValue="ribbon" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="ribbon">Ribbon</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ribbon" className="mt-6">
                    <RibbonControls config={config.ribbon} onChange={handleRibbonChange} />
                  </TabsContent>
                  <TabsContent value="text" className="mt-6">
                    <TextControls config={config.text} onChange={handleTextChange} />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </Card>

          {/* Center Panel - Preview */}
          <div className="flex flex-col gap-4">
            <Card className="flex-1 p-6">
              <CanvasPreview config={config} size={600} />
            </Card>
            {!config.image && (
              <div className="text-center text-sm text-muted-foreground">
                Upload an image to get started
              </div>
            )}
          </div>

          {/* Right Panel - Presets & Export */}
          <div className="space-y-4">
            <Card className="p-6 bg-[hsl(var(--control-bg))]">
              <PresetList onSelectPreset={handlePresetSelect} />
            </Card>
            <ExportPanel config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
