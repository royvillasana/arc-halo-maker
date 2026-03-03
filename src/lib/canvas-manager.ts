import { AnyLayer, ImageLayer, RibbonLayer, TextLayer, BackgroundLayer } from '@/types/layer';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: AnyLayer[] = [];
  private canvasSize: number;
  private zoom: number = 1;
  private panX: number = 0;
  private panY: number = 0;

  constructor(canvas: HTMLCanvasElement, canvasSize: number = 800) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvasSize = canvasSize;
    this.setupCanvas();
  }

  private setupCanvas() {
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
  }

  setLayers(layers: AnyLayer[]) {
    this.layers = layers;
    this.render();
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
    this.render();
  }

  setPan(x: number, y: number) {
    this.panX = x;
    this.panY = y;
    this.render();
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    
    // Apply zoom and pan
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoom, this.zoom);

    // Sort layers by zIndex
    const sortedLayers = [...this.layers].sort((a, b) => a.zIndex - b.zIndex);

    // Render each visible layer
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;

      this.ctx.save();
      this.ctx.globalAlpha = layer.opacity;

      switch (layer.type) {
        case 'background':
          this.renderBackgroundLayer(layer as BackgroundLayer);
          break;
        case 'image':
          this.renderImageLayer(layer as ImageLayer);
          break;
        case 'ribbon':
          this.renderRibbonLayer(layer as RibbonLayer);
          break;
        case 'text':
          // Text is now rendered via SVG overlay, skip canvas rendering
          break;
      }

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  private renderBackgroundLayer(layer: BackgroundLayer) {
    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;
    const radius = this.canvasSize / 2;

    if (layer.data.bgType === 'transparent') return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.clip();

    if (layer.data.bgType === 'solid') {
      this.ctx.fillStyle = layer.data.color;
      this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    } else if (layer.data.bgType === 'gradient') {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasSize);
      gradient.addColorStop(0, layer.data.gradientStart);
      gradient.addColorStop(1, layer.data.gradientEnd);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    }

    this.ctx.restore();
  }

  private renderImageLayer(layer: ImageLayer) {
    const img = new Image();
    img.src = layer.data.imageUrl;
    
    if (!img.complete) {
      img.onload = () => this.render();
      return;
    }

    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;
    const radius = this.canvasSize / 2;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.clip();

    const scale = layer.data.scale;
    const offsetX = layer.data.x;
    const offsetY = layer.data.y;

    // Calculate dimensions to fill horizontally while maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const circleSize = this.canvasSize;
    
    // Always fill width (horizontally), let height adjust to maintain aspect ratio
    const drawWidth = circleSize * scale;
    const drawHeight = drawWidth / imgAspect;

    const x = centerX - drawWidth / 2 + offsetX;
    const y = centerY - drawHeight / 2 + offsetY;

    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
    this.ctx.restore();
  }

  private renderRibbonLayer(layer: RibbonLayer) {
    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;
    const radius = this.canvasSize / 2;

    this.ctx.save();
    this.renderArcStyle(layer, centerX, centerY, radius);
    this.ctx.restore();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private renderArcStyle(layer: RibbonLayer, centerX: number, centerY: number, radius: number) {
    const ribbonRadius = radius - (radius * layer.data.thickness) / 100;
    const ribbonThickness = (radius * layer.data.thickness) / 100;
    const startAngle = (layer.data.startAngle * Math.PI) / 180;
    const endAngle = ((layer.data.startAngle + layer.data.arcWidth) * Math.PI) / 180;

    this.ctx.save();

    // Shadow
    if (layer.data.shadowBlur > 0) {
      this.ctx.shadowBlur = layer.data.shadowBlur;
      this.ctx.shadowColor = `rgba(0, 0, 0, ${layer.data.shadowOpacity})`;
      this.ctx.shadowOffsetY = 2;
    }

    if (layer.data.useGradient) {
      const fadePercent = layer.data.gradientFadePercent / 100;
      const totalArcRad = endAngle - startAngle;
      const fadeRad = totalArcRad * fadePercent;
      const arcRadius = ribbonRadius + ribbonThickness / 2;

      // 1. Draw solid middle section (single arc, no segments = no lines)
      const solidStart = startAngle + fadeRad;
      const solidEnd = endAngle - fadeRad;
      if (solidEnd > solidStart) {
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, arcRadius, solidStart, solidEnd);
        this.ctx.lineWidth = ribbonThickness;
        this.ctx.strokeStyle = layer.data.color;
        this.ctx.stroke();
      }

      // 2. Draw start fade (many small segments with increasing globalAlpha)
      const fadeSegments = 40;
      for (let i = 0; i < fadeSegments; i++) {
        const t = i / fadeSegments;
        const nextT = (i + 1) / fadeSegments;
        const a0 = startAngle + fadeRad * t;
        const a1 = startAngle + fadeRad * nextT + 0.002; // tiny overlap

        this.ctx.save();
        this.ctx.globalAlpha = layer.opacity * (t * t); // quadratic ease-in for smoother fade
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, arcRadius, a0, a1);
        this.ctx.lineWidth = ribbonThickness;
        this.ctx.strokeStyle = layer.data.color;
        this.ctx.stroke();
        this.ctx.restore();
      }

      // 3. Draw end fade (many small segments with decreasing globalAlpha)
      for (let i = 0; i < fadeSegments; i++) {
        const t = i / fadeSegments;
        const nextT = (i + 1) / fadeSegments;
        const a0 = endAngle - fadeRad + fadeRad * t;
        const a1 = endAngle - fadeRad + fadeRad * nextT + 0.002;

        this.ctx.save();
        this.ctx.globalAlpha = layer.opacity * ((1 - nextT) * (1 - nextT)); // quadratic ease-out
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, arcRadius, a0, a1);
        this.ctx.lineWidth = ribbonThickness;
        this.ctx.strokeStyle = layer.data.color;
        this.ctx.stroke();
        this.ctx.restore();
      }
    } else {
      // Draw solid ribbon arc
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness / 2, startAngle, endAngle);
      this.ctx.lineWidth = ribbonThickness;
      this.ctx.strokeStyle = layer.data.color;
      this.ctx.stroke();
    }

    // Draw ribbon border
    if (layer.data.borderWidth > 0) {
      this.ctx.shadowBlur = 0;
      
      // Outer border
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, ribbonRadius + ribbonThickness, startAngle, endAngle);
      this.ctx.lineWidth = layer.data.borderWidth;
      this.ctx.strokeStyle = layer.data.borderColor;
      this.ctx.stroke();

      // Inner border
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, ribbonRadius, startAngle, endAngle);
      this.ctx.lineWidth = layer.data.borderWidth;
      this.ctx.strokeStyle = layer.data.borderColor;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private renderTextLayer(layer: TextLayer) {
    if (!layer.data.content) return;

    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;

    const text = this.formatText(layer.data.content, layer.data.textCase);
    const fontSize = layer.data.fontSize;

    this.ctx.save();
    this.ctx.font = `bold ${fontSize}px ${layer.data.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const ribbonLayer = this.layers.find(l => l.type === 'ribbon' && l.visible) as RibbonLayer;
    if (!ribbonLayer) {
      this.ctx.restore();
      return;
    }

    this.renderCurvedText(layer, text, fontSize, centerX, centerY, ribbonLayer);

    this.ctx.restore();
  }

  private renderCurvedText(
    layer: TextLayer,
    text: string,
    fontSize: number,
    centerX: number,
    centerY: number,
    ribbonLayer: RibbonLayer
  ) {
    if (!layer.data.ribbonRadius) return;

    const textRadius = layer.data.ribbonRadius;
    const letterSpacing = layer.data.letterSpacing;

    const charWidths = text.split('').map((char) => this.ctx.measureText(char).width + letterSpacing);
    const totalWidth = charWidths.reduce((sum, w) => sum + w, 0);

    const anglePerPixel = 1 / textRadius;
    const totalAngle = totalWidth * anglePerPixel;

    const startAngle =
      (ribbonLayer.data.startAngle * Math.PI) / 180 + 
      (ribbonLayer.data.arcWidth * Math.PI) / 360 -
      totalAngle / 2;

    let currentAngle = startAngle;
    text.split('').forEach((char, i) => {
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(currentAngle + (charWidths[i] * anglePerPixel) / 2 + Math.PI / 2);
      this.ctx.translate(0, -textRadius - layer.data.radialOffset);

      if (layer.data.strokeWidth > 0) {
        this.ctx.strokeStyle = layer.data.strokeColor;
        this.ctx.lineWidth = layer.data.strokeWidth * 2;
        this.ctx.strokeText(char, 0, 0);
      }

      this.ctx.fillStyle = layer.data.color;
      this.ctx.fillText(char, 0, 0);

      currentAngle += charWidths[i] * anglePerPixel;
      this.ctx.restore();
    });
  }

  private formatText(text: string, textCase: 'upper' | 'title' | 'lower'): string {
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
  }

  exportCanvas(format: 'png' | 'jpg' = 'png'): string {
    return this.canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
  }
}
