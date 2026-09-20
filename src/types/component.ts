export type ComponentCategory =
  | "layout"
  | "buttons"
  | "cards"
  | "feedback"
  | "navigation"
  | "scales"
  | "display";

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentItem {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  dependencies: string[];
  registryDependencies?: string[];
  files: {
    name: string;
    path: string;
    code: string;
  }[];
  props?: ComponentProp[];
  interactive?: boolean;
}

export interface ComponentRegistryItem extends ComponentItem {
  version: string;
  createdDate: string;
  updatedDate: string;
}
