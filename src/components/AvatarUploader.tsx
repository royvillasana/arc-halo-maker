import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage: string | null;
  imageScale: number;
  imageX: number;
  imageY: number;
  onImageTransform: (scale: number, x: number, y: number) => void;
}

export const AvatarUploader = ({ 
  onImageSelect, 
  currentImage, 
  imageScale, 
  imageX, 
  imageY, 
  onImageTransform 
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onImageSelect(event.target?.result as string);
        toast.success('Image uploaded successfully');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label>Avatar Image</Label>
      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={handleButtonClick}
          variant={currentImage ? 'secondary' : 'default'}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {currentImage ? 'Change Image' : 'Upload Image'}
        </Button>
        {currentImage && (
          <>
            <div className="rounded-lg border bg-muted p-2">
              <img
                src={currentImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Zoom</Label>
                <Slider
                  value={[imageScale]}
                  onValueChange={([value]) => onImageTransform(value, imageX, imageY)}
                  min={0.5}
                  max={2}
                  step={0.01}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {Math.round(imageScale * 100)}%
                </div>
              </div>

              <div className="space-y-2">
                <Label>Position X</Label>
                <Slider
                  value={[imageX]}
                  onValueChange={([value]) => onImageTransform(imageScale, value, imageY)}
                  min={-200}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Position Y</Label>
                <Slider
                  value={[imageY]}
                  onValueChange={([value]) => onImageTransform(imageScale, imageX, value)}
                  min={-200}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
