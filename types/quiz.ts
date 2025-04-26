// Quiz base types
export type ComponentType = "Button" | "Text" | "Image" | "Options" | "Input" | "Video" | "Audio";
export type ComponentSize = "small" | "medium" | "large" | "custom";
export type AlignmentType = "left" | "center" | "right";

// Component base interface
export interface Component {
  id: string;
  type: ComponentType;
}

// Button component
export interface ButtonComponent extends Component {
  type: "Button";
  text: string;
  action: "nextStep" | "externalLink" | { goToStep: string };
  externalUrl?: string;
  size: ComponentSize;
  alignment: AlignmentType;
  color: ColorConfig;
  border: BorderConfig;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Text component
export interface TextComponent extends Component {
  type: "Text";
  content: string;
  htmlTag: "p" | "h1" | "h2" | "h3";
  size: ComponentSize;
  color: string;
  alignment: AlignmentType;
  fontFamily?: string;
  fontWeight?: string;
}

// Image component
export interface ImageComponent extends Component {
  type: "Image";
  src: string;
  alt?: string;
  size: ComponentSize;
  customWidth?: number;
  customHeight?: number;
  border: BorderConfig;
}

// Options component
export interface OptionsComponent extends Component {
  type: "Options";
  text: string;
  options: {
    id: string;
    text: string;
    nextStepId: string | null;
  }[];
  size: ComponentSize;
  color: ColorConfig;
  border: BorderConfig;
}

// Input component
export interface InputComponent extends Component {
  type: "Input";
  label: string;
  placeholder?: string;
  required?: boolean;
  inputType: "text" | "email" | "number" | "tel" | "date";
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

// Color configuration
export interface ColorConfig {
  solid: string;
  isGradient: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
}

// Border configuration
export interface BorderConfig {
  size: number;
  color: string;
  radius: number;
}

// Step (screen) in the quiz
export interface Step {
  id: string;
  name: string;
  title: string;
  components: Component[];
  showLogo?: boolean;
  showProgress?: boolean;
  allowReturn?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
}

// Quiz settings
export interface QuizSettings {
  backgroundColor: string;
  showBranding: boolean;
  fontFamily: string;
}

// Quiz data structure
export interface Quiz {
  id: string;
  title: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
  settings?: QuizSettings;
  // Legacy support
  questions?: any[];
}