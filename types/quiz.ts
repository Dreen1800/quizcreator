// Tipos de componentes (adicione mais conforme necessário)
export type ComponentType =
  | "Button"
  | "Image"
  | "Options"
  | "Text";

// Interface base para todos os componentes
export interface BaseComponent {
  id: string;
  type: ComponentType;
  // Propriedades comuns podem ir aqui, se houver
}

// Alinhamento para componentes
export type AlignmentType = "left" | "center" | "right";

// Tipos de cores
export type ColorConfig = {
  solid: string;
  isGradient: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to right" | "to left" | "to bottom" | "to top" | "to bottom right" | "to bottom left" | "to top right" | "to top left";
};

// Border config
export type BorderConfig = {
  size: number;
  color: string;
  radius?: number;
};

// Padding and margin config
export type SpacingConfig = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Interfaces específicas para cada tipo de componente
export interface ButtonComponent extends BaseComponent {
  type: "Button";
  text: string;
  action: "nextStep" | "externalLink" | { goToStep: string }; // Ação do botão
  externalUrl?: string; // URL externa quando action for externalLink
  size: "small" | "medium" | "large";
  alignment: AlignmentType;
  color: ColorConfig;
  border: BorderConfig;
  padding?: SpacingConfig;
  margin?: SpacingConfig;
}

export interface TextComponent extends BaseComponent {
  type: "Text";
  content: string;
  size: "small" | "medium" | "large";
  color: string;
  alignment: AlignmentType;
  htmlTag: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fontFamily?: string;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800" | "900";
}

export interface ImageComponent extends BaseComponent {
  type: "Image";
  src: string; // Base64 ou referência para o banco de dados
  alt?: string;
  size: "small" | "medium" | "large" | "custom";
  customWidth?: number;
  customHeight?: number;
  border: BorderConfig;
}

export interface OptionsComponent extends BaseComponent {
  type: "Options";
  text: string; // O texto da pergunta/prompt
  options: Array<{
    id: string;
    text: string;
    nextStepId: string | null; // Para qual *etapa* ir
  }>;
  size: "small" | "medium" | "large";
  color: ColorConfig;
  border: BorderConfig;
}

// Interface para componentes não implementados especificamente
// Garante que eles ainda tenham id e type, mas permite flexibilidade
export interface GenericComponent extends BaseComponent {
  type: Exclude<ComponentType, "Button" | "Image" | "Options" | "Text">;
  // Pode ter propriedades adicionais genéricas se necessário, ou um Record<string, any>
  // properties?: Record<string, any>;
}

// União Simplificada: Direta união das interfaces completas
export type Component =
  | ButtonComponent
  | TextComponent
  | ImageComponent
  | OptionsComponent
  | GenericComponent; // Cobre todos os outros ComponentType

// Interface para uma Etapa (Step)
export interface Step {
  id: string;
  name: string; // Nome da etapa (ex: "Etapa 1")
  title: string; // Título exibido na etapa
  components: Component[]; // Lista de componentes nesta etapa
  // Configurações específicas da etapa (podem vir do header)
  showLogo?: boolean;
  showProgress?: boolean;
  allowReturn?: boolean;
}

// Interface principal do Quiz
export interface Quiz {
  id: string;
  title: string; // Título geral do Quiz (usado na listagem, talvez?)
  steps: Step[]; // Lista de etapas
  createdAt: string;
  updatedAt: string;
  // Configurações globais do quiz (podem vir da aba 'Configurações')
  globalSettings?: {
    // ...
  };
}
