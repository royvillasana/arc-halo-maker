import { AvatarConfig } from '@/types/avatar';

export const renderAvatar = (
  canvas: HTMLCanvasElement,
  config: AvatarConfig,
  size: number = 800
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Draw background
  if (config.background.type !== 'transparent') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (config.background.type === 'solid') {
      ctx.fillStyle = config.background.color;
      ctx.fillRect(0, 0, size, size);
    } else if (config.background.type === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 0, size);
      gradient.addColorStop(0, config.background.gradientStart);
      gradient.addColorStop(1, config.background.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.restore();
  }

  // Draw avatar image
  if (config.image) {
    const img = new Image();
    img.src = config.image;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const scale = config.imageScale;
    const offsetX = config.imageX;
    const offsetY = config.imageY;
    const imgSize = size * scale;
    const x = centerX - imgSize / 2 + offsetX;
    const y = centerY - imgSize / 2 + offsetY;

    ctx.drawImage(img, x, y, imgSize, imgSize);
    ctx.restore();
  }

  // Draw ribbon
  if (config.ribbon.visible) {
    const ribbonRadius = radius - (radius * config.ribbon.thickness) / 100;
    const ribbonThickness = (radius * config.ribbon.thickness) / 100;
    const startAngle = (config.ribbon.startAngle * Math.PI) / 180;
    const endAngle = ((config.ribbon.startAngle + config.ribbon.arcWidth) * Math.PI) / 180;

    ctx.save();

    // Shadow
    if (config.ribbon.shadowBlur > 0) {
      ctx.shadowBlur = config.ribbon.shadowBlur;
      ctx.shadowColor = `rgba(0, 0, 0, ${config.ribbon.shadowOpacity})`;
      ctx.shadowOffsetY = 2;
    }

    if (config.ribbon.useGradient) {
      // Draw ribbon with gradient fade effect
      const fadePercent = config.ribbon.gradientFadePercent / 100;
      const arcLength = config.ribbon.arcWidth;
      const fadeAngle = arcLength * fadePercent;
      const segments = 100; // Number of segments for smooth gradient
      
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const currentAngle = startAngle + (endAngle - startAngle) * progress;
        const nextAngle = startAngle + (endAngle - startAngle) * (i + 1) / segments;
        
        // Calculate opacity based on position
        let opacity = 1;
        const angleFromStart = (currentAngle - startAngle) * (180 / Math.PI);
        const angleFromEnd = (endAngle - currentAngle) * (180 / Math.PI);
        
        if (angleFromStart < fadeAngle) {
          // Fade in at start
          opacity = angleFromStart / fadeAngle;
        } else if (angleFromEnd < fadeAngle) {
          // Fade out at end
          opacity = angleFromEnd / fadeAngle;
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness / 2, currentAngle, nextAngle);
        ctx.lineWidth = ribbonThickness;
        ctx.strokeStyle = hexToRgba(config.ribbon.color, opacity);
        ctx.stroke();
      }
    } else {
      // Draw solid ribbon arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness / 2, startAngle, endAngle);
      ctx.lineWidth = ribbonThickness;
      ctx.strokeStyle = config.ribbon.color;
      ctx.stroke();
    }

    // Draw ribbon border
    if (config.ribbon.borderWidth > 0) {
      ctx.shadowBlur = 0;
      
      // Outer border
      ctx.beginPath();
      ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness, startAngle, endAngle);
      ctx.lineWidth = config.ribbon.borderWidth;
      ctx.strokeStyle = config.ribbon.borderColor;
      ctx.stroke();

      // Inner border
      ctx.beginPath();
      ctx.arc(centerX, centerY, ribbonRadius, startAngle, endAngle);
      ctx.lineWidth = config.ribbon.borderWidth;
      ctx.strokeStyle = config.ribbon.borderColor;
      ctx.stroke();
    }

    ctx.restore();

    // Draw text on ribbon
    if (config.text.content) {
      drawCurvedText(ctx, config, centerX, centerY, ribbonRadius + ribbonThickness / 2);
    }
  }
};

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const drawCurvedText = (
  ctx: CanvasRenderingContext2D,
  config: AvatarConfig,
  centerX: number,
  centerY: number,
  textRadius: number
) => {
  const text = formatText(config.text.content, config.text.textCase);
  const fontSize = config.text.fontSize;
  const letterSpacing = config.text.letterSpacing;
  const adjustedRadius = textRadius - config.text.radialOffset;

  ctx.save();
  ctx.font = `bold ${fontSize}px ${config.text.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate angles based on text config
  const startAngle = ((config.text.startAngle - 90) * Math.PI) / 180;
  const endAngle = ((config.text.startAngle + config.text.arcWidth - 90) * Math.PI) / 180;
  
  // Calculate character widths
  const charWidths = text.split('').map((char) => ctx.measureText(char).width + letterSpacing);
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0);
  
  // Calculate arc angle for text
  const anglePerPixel = 1 / adjustedRadius;
  const totalAngle = totalWidth * anglePerPixel;
  
  // Center text on the arc (drawing from end to start for inside orientation)
  const arcCenter = startAngle + (endAngle - startAngle) / 2;
  let currentAngle = arcCenter + totalAngle / 2;

  // Draw each character from right to left (for inside text)
  for (let i = text.length - 1; i >= 0; i--) {
    const char = text[i];
    const charAngle = charWidths[i] * anglePerPixel;
    currentAngle -= charAngle;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle + charAngle / 2 - Math.PI / 2);
    ctx.translate(0, -adjustedRadius);

    // Draw text stroke
    if (config.text.strokeWidth > 0) {
      ctx.strokeStyle = config.text.strokeColor;
      ctx.lineWidth = config.text.strokeWidth * 2;
      ctx.strokeText(char, 0, 0);
    }

    // Draw text fill
    ctx.fillStyle = config.text.color;
    ctx.fillText(char, 0, 0);

    ctx.restore();
  }

  ctx.restore();
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

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string, format: 'png' | 'jpg' = 'png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
  link.click();
};
