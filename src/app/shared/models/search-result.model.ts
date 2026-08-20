export type SearchResultKind = 'functional' | 'technical' | 'manual';

export interface SearchResult {
  readonly id: string;
  readonly productSlug: string;
  readonly productName: string;
  readonly kind: SearchResultKind;
  readonly sectionLabel: string;
  readonly title: string;
  readonly snippet: string;
  readonly route: readonly string[];
  readonly fragment: string;
}
