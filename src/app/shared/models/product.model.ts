export type ProductStatus = 'disponible' | 'en-progreso' | 'proximamente';

export interface DocSection {
  readonly title: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
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
}

export interface ManualRole {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly steps: readonly ManualStep[];
}

export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly status: ProductStatus;
  readonly logoUrl: string;
  readonly logoWidth: number;
  readonly logoHeight: number;
  readonly functionalDoc: readonly DocSection[];
  readonly technicalDoc: readonly DocSection[];
  readonly userManual: readonly ManualRole[];
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
