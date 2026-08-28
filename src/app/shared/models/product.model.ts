export type ProductStatus = 'disponible' | 'en-progreso' | 'proximamente';

export type StatusItemTone = 'done' | 'partial' | 'pending';

export interface StatusItem {
  readonly label: string;
  readonly text?: string;
  readonly tone: StatusItemTone;
}

export interface DocSection {
  readonly title: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
  readonly statusItems?: readonly StatusItem[];
  readonly screenshots?: readonly ManualScreenshot[];
}

export interface ManualScreenshot {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface ManualStep {
  readonly title: string;
  readonly description: readonly string[];
  readonly screenshots?: readonly ManualScreenshot[];
  /** Reglas de negocio o comportamientos no obvios de este módulo, resaltados aparte de la descripción. */
  readonly businessRules?: readonly string[];
  /** true si el módulo cambió recientemente y las capturas todavía no reflejan el estado exacto. */
  readonly pendingScreenshots?: boolean;
}

export interface ManualRole {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly steps: readonly ManualStep[];
}

export interface ManualCapabilityRow {
  readonly capability: string;
  /** Un valor por cada entrada de `ManualOverview.roleColumns`, en el mismo orden. */
  readonly values: readonly string[];
}

export interface ManualOverview {
  readonly roleColumns: readonly string[];
  readonly rows: readonly ManualCapabilityRow[];
}

export interface ManualGuideStep {
  readonly title: string;
  readonly description: string;
  readonly screenshot?: ManualScreenshot;
}

export interface ManualGuide {
  readonly id: string;
  readonly title: string;
  readonly role: string;
  readonly summary: string;
  readonly steps: readonly ManualGuideStep[];
}

export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly status: ProductStatus;
  readonly statusLabel?: string;
  readonly logoUrl?: string;
  readonly logoWidth?: number;
  readonly logoHeight?: number;
  readonly functionalDoc: readonly DocSection[];
  readonly technicalDoc: readonly DocSection[];
  readonly userManual: readonly ManualRole[];
  readonly manualOverview?: ManualOverview;
  /** Pasos válidos para cualquier rol autenticado (ej. "Mi perfil"), mostrados antes de las secciones por rol. */
  readonly manualCommonSteps?: readonly ManualStep[];
  /** Guías paso a paso de alta/registro (crear unidad, usuario, etc.), transversales a los roles. */
  readonly manualGuides?: readonly ManualGuide[];
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  disponible: 'Disponible',
  'en-progreso': 'En progreso',
  proximamente: 'Próximamente',
};

export const PRODUCT_STATUS_BADGE_CLASSES: Record<ProductStatus, string> = {
  disponible: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  'en-progreso': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  proximamente: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const STATUS_ITEM_LABELS: Record<StatusItemTone, string> = {
  done: 'Completo',
  partial: 'Parcial',
  pending: 'Pendiente',
};

export const STATUS_ITEM_BADGE_CLASSES: Record<StatusItemTone, string> = {
  done: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const STATUS_ITEM_DOT_CLASSES: Record<StatusItemTone, string> = {
  done: 'bg-green-500',
  partial: 'bg-amber-500',
  pending: 'bg-gray-400 dark:bg-gray-500',
};
