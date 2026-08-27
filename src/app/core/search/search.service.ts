import { Injectable, computed, inject, signal } from '@angular/core';
import { docSectionId } from '../../features/products/data/product-sidebar';
import { ProductsService } from '../../features/products/data/products.service';
import { DocSection, ManualRole, Product } from '../../shared/models/product.model';
import { SearchResult, SearchResultKind } from '../../shared/models/search-result.model';

const DIACRITICS_PATTERN = /[̀-ͯ]/g;
const MAX_RESULTS = 8;
const SNIPPET_MAX_LENGTH = 140;

function normalize(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS_PATTERN, '').toLowerCase();
}

function buildSnippet(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > SNIPPET_MAX_LENGTH
    ? `${trimmed.slice(0, SNIPPET_MAX_LENGTH).trimEnd()}…`
    : trimmed;
}

function buildDocResult(
  product: Product,
  section: DocSection,
  kind: Extract<SearchResultKind, 'functional' | 'technical'>,
  sectionLabel: string,
): SearchResult {
  const fragment = docSectionId(kind === 'functional' ? 'func' : 'tec', section.title);
  const statusText = (section.statusItems ?? []).map((item) => `${item.label} ${item.text ?? ''}`);
  const content = [
    section.title,
    ...(section.paragraphs ?? []),
    ...(section.items ?? []),
    ...statusText,
  ].join(' ');

  return {
    id: `${product.slug}-${kind}-${fragment}`,
    productSlug: product.slug,
    productName: product.name,
    kind,
    sectionLabel,
    title: section.title,
    snippet: buildSnippet(content),
    route: ['/productos', product.slug],
    fragment,
  };
}

function buildManualResults(product: Product, role: ManualRole): SearchResult[] {
  const fragment = `rol-${role.id}`;
  const route = ['/productos', product.slug, 'manual'];
  const sectionLabel = `Manual de usuario · ${role.name}`;

  const roleResult: SearchResult = {
    id: `${product.slug}-manual-${role.id}`,
    productSlug: product.slug,
    productName: product.name,
    kind: 'manual',
    sectionLabel,
    title: role.name,
    snippet: buildSnippet(role.summary),
    route,
    fragment,
  };

  const stepResults = role.steps.map<SearchResult>((step, index) => ({
    id: `${product.slug}-manual-${role.id}-${index}`,
    productSlug: product.slug,
    productName: product.name,
    kind: 'manual',
    sectionLabel,
    title: step.title,
    snippet: buildSnippet(step.description.join(' ')),
    route,
    fragment,
  }));

  return [roleResult, ...stepResults];
}

function buildProductIndex(product: Product): SearchResult[] {
  return [
    ...product.functionalDoc.map((section) =>
      buildDocResult(product, section, 'functional', 'Documentación funcional'),
    ),
    ...product.technicalDoc.map((section) =>
      buildDocResult(product, section, 'technical', 'Documentación técnica'),
    ),
    ...product.userManual.flatMap((role) => buildManualResults(product, role)),
  ];
}

function scoreResult(result: SearchResult, term: string): number {
  const title = normalize(result.title);
  if (title === term) {
    return 3;
  }
  if (title.includes(term)) {
    return 2;
  }
  if (normalize(result.snippet).includes(term) || normalize(result.sectionLabel).includes(term)) {
    return 1;
  }
  return 0;
}

/**
 * Indexes product content reactively from `ProductsService`. Adding a new
 * product to that source is enough for it to appear in search — nothing
 * here or in the search component needs to change.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly productsService = inject(ProductsService);

  private readonly index = computed<SearchResult[]>(() =>
    this.productsService.allProducts().flatMap((product) => buildProductIndex(product)),
  );

  private readonly activeTermSignal = signal('');

  /**
   * The term currently shown in the navbar search box. Content pages read
   * this to highlight the matching text once the search navigates them there.
   */
  readonly activeTerm = this.activeTermSignal.asReadonly();

  search(query: string): SearchResult[] {
    return this.matchResults(query).slice(0, MAX_RESULTS);
  }

  /** Total number of matching sections, uncapped — used for the "N resultados" counter. */
  totalMatches(query: string): number {
    return this.matchResults(query).length;
  }

  setActiveTerm(term: string): void {
    this.activeTermSignal.set(term.trim());
  }

  private matchResults(query: string): SearchResult[] {
    const term = normalize(query.trim());
    if (!term) {
      return [];
    }

    return this.index()
      .map((result) => ({ result, score: scoreResult(result, term) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.result);
  }
}
