export interface RibbonConfig {
  visible: boolean;
  color: string;
  thickness: number; // 0-40 as percentage of radius
  startAngle: number; // 0-360 degrees
  arcWidth: number; // 0-360 degrees
  borderColor: string;
  borderWidth: number;
  shadowBlur: number;
  shadowOpacity: number;
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
  startAngle: number; // 0-360 degrees
  arcWidth: number; // 0-360 degrees
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
    color: '#57C785',
    thickness: 20,
    startAngle: 82,
    arcWidth: 120,
    borderColor: '#ffffff',
    borderWidth: 0,
    shadowBlur: 0,
    shadowOpacity: 0,
    useGradient: true,
    gradientFadePercent: 8,
  },
  text: {
    content: '#OPENTOWORK',
    textCase: 'upper',
    fontFamily: 'Arial',
    fontSize: 40,
    letterSpacing: 2,
    radialOffset: 0,
    startAngle: 100,
    arcWidth: 120,
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
        color: '#57C785',
        thickness: 20,
        startAngle: 82,
        arcWidth: 120,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 0,
        shadowOpacity: 0,
        useGradient: true,
        gradientFadePercent: 8,
      },
      text: {
        content: '#OPENTOWORK',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 40,
        letterSpacing: 2,
        radialOffset: 0,
        startAngle: 100,
        arcWidth: 120,
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
        color: '#1D4ED8',
        thickness: 20,
        startAngle: 82,
        arcWidth: 120,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 0,
        shadowOpacity: 0,
        useGradient: true,
        gradientFadePercent: 8,
      },
      text: {
        content: '#HIRING',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 40,
        letterSpacing: 2,
        radialOffset: 0,
        startAngle: 100,
        arcWidth: 120,
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
        color: '#6D28D9',
        thickness: 20,
        startAngle: 82,
        arcWidth: 120,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 0,
        shadowOpacity: 0,
        useGradient: true,
        gradientFadePercent: 8,
      },
      text: {
        content: '#FREELANCE',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 40,
        letterSpacing: 2,
        radialOffset: 0,
        startAngle: 100,
        arcWidth: 120,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
      },
    },
  },
  {
    name: 'Available',
    config: {
      ribbon: {
        visible: true,
        color: '#EA580C',
        thickness: 20,
        startAngle: 82,
        arcWidth: 120,
        borderColor: '#ffffff',
        borderWidth: 0,
        shadowBlur: 0,
        shadowOpacity: 0,
        useGradient: true,
        gradientFadePercent: 8,
      },
      text: {
        content: '#AVAILABLE',
        textCase: 'upper',
        fontFamily: 'Arial',
        fontSize: 40,
        letterSpacing: 2,
        radialOffset: 0,
        startAngle: 100,
        arcWidth: 120,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 0,
      },
    },
  },
];
