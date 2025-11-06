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
    }

    // Draw ribbon arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness / 2, startAngle, endAngle);
    ctx.lineWidth = ribbonThickness;
    ctx.strokeStyle = config.ribbon.color;
    ctx.stroke();

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

  ctx.save();
  ctx.font = `bold ${fontSize}px ${config.text.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate total text width including letter spacing
  const charWidths = text.split('').map((char) => ctx.measureText(char).width + letterSpacing);
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0);

  // Calculate arc angle for the text
  const anglePerPixel = 1 / textRadius;
  const totalAngle = totalWidth * anglePerPixel;

  // Start angle (centered on ribbon)
  const startAngle =
    (config.ribbon.startAngle * Math.PI) / 180 + 
    (config.ribbon.arcWidth * Math.PI) / 360 -
    totalAngle / 2;

  // Draw each character
  let currentAngle = startAngle;
  text.split('').forEach((char, i) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle + (charWidths[i] * anglePerPixel) / 2);
    ctx.translate(0, -textRadius - config.text.radialOffset);

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
    currentAngle += charWidths[i] * anglePerPixel;
  });

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
