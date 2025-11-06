export interface RibbonConfig {
  visible: boolean;
  // Image-based ribbon with color adjustments
  hue: number; // 0-360 degrees
  saturation: number; // 0-200 (100 is normal)
  brightness: number; // 0-200 (100 is normal)
  contrast: number; // 0-200 (100 is normal)
  scale: number; // scale of the ribbon image
  rotation: number; // rotation in degrees
  // Legacy color for backward compatibility
  color: string;
  thickness: number; // 0-40 as percentage of radius
  startAngle: number; // 0-360 degrees
  arcWidth: number; // 0-360 degrees
  borderColor: string;
  borderWidth: number;
  shadowBlur: number;
  shadowOpacity: number;
  // Pill badge style
  style: 'arc' | 'badge' | 'image';
  badgeRotation: number; // rotation in degrees
  badgeOffsetY: number; // vertical offset from center
  useGradient: boolean;
  gradientFadePercent: number; // percentage of fade at edges (0-50)
}

export interface TextConfig {
  content: string;
  textCase: 'upper' | 'title' | 'lower';
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  radialOffset: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface BackgroundConfig {
  type: 'transparent' | 'solid' | 'gradient';
  color: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface AvatarConfig {
  image: string | null;
  imageScale: number;
  imageX: number;
  imageY: number;
  ribbon: RibbonConfig;
  text: TextConfig;
  background: BackgroundConfig;
}

export interface Preset {
  name: string;
  config: Partial<AvatarConfig>;
}

export const defaultAvatarConfig: AvatarConfig = {
  image: null,
  imageScale: 1,
  imageX: 0,
  imageY: 0,
  ribbon: {
    visible: true,
    hue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    scale: 1,
    rotation: 0,
    color: '#57C785',
    thickness: 20,
    startAngle: 215,
    arcWidth: 150,
    borderColor: '#ffffff',
    borderWidth: 0,
    shadowBlur: 6,
    shadowOpacity: 0.2,
    style: 'image',
    badgeRotation: 0,
    badgeOffsetY: 365,
    useGradient: true,
    gradientFadePercent: 13,
  },
  text: {
    content: '#OPENTOWORK',
    textCase: 'upper',
    fontFamily: 'Arial',
    fontSize: 16,
    letterSpacing: 1,
    radialOffset: 0,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 0,
  },
  background: {
    type: 'transparent',
    color: '#ffffff',
    gradientStart: '#f0f0f0',
    gradientEnd: '#e0e0e0',
  },
};

export const presets: Preset[] = [
  {
    name: 'OpenToWork',
    config: {
      ribbon: {
        visible: true,
        hue: 0,
        saturation: 100,
        brightness: 100,
        contrast: 100,
        scale: 1,
        rotation: 0,
        color: '#57C785',
        thickness: 20,
        startAngle: 215,
        arcWidth: 150,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 6,
        shadowOpacity: 0.2,
        style: 'image',
        badgeRotation: 0,
        badgeOffsetY: 365,
        useGradient: true,
        gradientFadePercent: 13,
      },
      text: {
        content: '#OPENTOWORK',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 16,
        letterSpacing: 1,
        radialOffset: 0,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
      },
    },
  },
  {
    name: 'Hiring',
    config: {
      ribbon: {
        visible: true,
        hue: 210,
        saturation: 100,
        brightness: 100,
        contrast: 100,
        scale: 1,
        rotation: 0,
        color: '#1D4ED8',
        thickness: 20,
        startAngle: 215,
        arcWidth: 150,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 6,
        shadowOpacity: 0.2,
        style: 'image',
        badgeRotation: 0,
        badgeOffsetY: 365,
        useGradient: true,
        gradientFadePercent: 13,
      },
      text: {
        content: '#HIRING',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 16,
        letterSpacing: 1,
        radialOffset: 0,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
      },
    },
  },
  {
    name: 'Freelance',
    config: {
      ribbon: {
        visible: true,
        hue: 270,
        saturation: 100,
        brightness: 100,
        contrast: 100,
        scale: 1,
        rotation: 0,
        color: '#6D28D9',
        thickness: 20,
        startAngle: 215,
        arcWidth: 150,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 6,
        shadowOpacity: 0.2,
        style: 'image',
        badgeRotation: 0,
        badgeOffsetY: 365,
        useGradient: true,
        gradientFadePercent: 13,
      },
      text: {
        content: '#AVAILABLE',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 16,
        letterSpacing: 1,
        radialOffset: 0,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
      },
    },
  },
];
