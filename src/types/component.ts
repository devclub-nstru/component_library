export type ComponentCategory =
  | "layout"
  | "buttons"
  | "cards"
  | "feedback"
  | "loaders"
  | "navigation"
  | "display"
  | "inputs"
  | "sliders-and-toggles"
  | "clocks-and-timers"
  | "date-and-time"
  | "accordion"
  | "ai-stuff"
  | "search"
  | "galleries-and-media"
  | "backgrounds-and-effects"
  | "menus";

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentPhysicsParam {
  label: string;
  value: string;
}

export interface ComponentPhysicsSpec {
  engine: string;
  description: string;
  parameters: ComponentPhysicsParam[];
}

export interface ComponentKeyboardShortcut {
  key: string;
  description: string;
}

export interface ComponentAccessibilitySpec {
  role?: string;
  keyboard?: ComponentKeyboardShortcut[];
  aria?: string;
  reducedMotion?: string;
}

export interface ComponentGuidelines {
  recommended: string[];
  bestPractices: string[];
}

export interface ComponentItem {
  slug: string;
  name: string;
  description: string;
  summary?: string;
  category: ComponentCategory;
  tags: string[];
  dependencies: string[];
  registryDependencies?: string[];
  highlights?: string[];
  anatomy?: string[];
  physics?: ComponentPhysicsSpec;
  accessibility?: ComponentAccessibilitySpec;
  guidelines?: ComponentGuidelines;
  files: {
    name: string;
    path: string;
    code: string;
  }[];
  props?: ComponentProp[];
  interactive?: boolean;
  supportsColor?: boolean;
  hidden?: boolean;
}

export interface ComponentRegistryItem extends ComponentItem {
  version: string;
  createdDate: string;
  updatedDate: string;
}
