export type ProductStatus = 'disponible' | 'en-progreso' | 'proximamente';

export interface DocSection {
  readonly title: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
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
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  disponible: 'Disponible',
  'en-progreso': 'En progreso',
  proximamente: 'Próximamente',
};

export const PRODUCT_STATUS_BADGE_CLASSES: Record<ProductStatus, string> = {
  disponible: 'bg-green-100 text-green-800',
  'en-progreso': 'bg-amber-100 text-amber-800',
  proximamente: 'bg-gray-100 text-gray-700',
};
