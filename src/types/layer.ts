export type LayerType = 'image' | 'ribbon' | 'text' | 'background';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  data: any; // Layer-specific data
  zIndex: number;
}

export interface ImageLayer extends Layer {
  type: 'image';
  data: {
    imageUrl: string;
    scale: number;
    x: number;
    y: number;
  };
}

export interface RibbonLayer extends Layer {
  type: 'ribbon';
  data: {
    color: string;
    thickness: number;
    startAngle: number;
    arcWidth: number;
    borderColor: string;
    borderWidth: number;
    shadowBlur: number;
    shadowOpacity: number;
    style: 'arc' | 'badge';
    badgeRotation: number;
    badgeOffsetY: number;
  };
}

export interface TextLayer extends Layer {
  type: 'text';
  data: {
    content: string;
    textCase: 'upper' | 'title' | 'lower';
    fontFamily: string;
    fontSize: number;
    letterSpacing: number;
    radialOffset: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
    ribbonRadius?: number;
  };
}

export interface BackgroundLayer extends Layer {
  type: 'background';
  data: {
    bgType: 'transparent' | 'solid' | 'gradient';
    color: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

export type AnyLayer = ImageLayer | RibbonLayer | TextLayer | BackgroundLayer;

export interface CanvasState {
  layers: AnyLayer[];
  selectedLayerId: string | null;
  canvasSize: number;
  zoom: number;
  panX: number;
  panY: number;
}
