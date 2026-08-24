import { ChangeDetectionStrategy, Component, afterRenderEffect, computed, effect, inject, input } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { observeActiveSection } from '../../../core/layout/sidebar/section-scroll-spy';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { SearchService } from '../../../core/search/search.service';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { PRODUCT_STATUS_BADGE_CLASSES, PRODUCT_STATUS_LABELS } from '../../../shared/models/product.model';
import { buildProductSidebarItems, docSectionId } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, NgOptimizedImage, HighlightPipe],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);
  private readonly document = inject(DOCUMENT);
  protected readonly searchService = inject(SearchService);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => this.productsService.findBySlug(this.slug()));
  protected readonly statusLabel = computed(() => {
    const product = this.product();
    return product ? PRODUCT_STATUS_LABELS[product.status] : '';
  });
  protected readonly badgeClasses = computed(() => {
    const product = this.product();
    return product ? PRODUCT_STATUS_BADGE_CLASSES[product.status] : '';
  });
  protected readonly sectionId = docSectionId;

  private readonly sectionIds = computed(() => {
    const product = this.product();
    if (!product) {
      return [];
    }
    return [
      ...product.functionalDoc.map((section) => docSectionId('func', section.title)),
      ...product.technicalDoc.map((section) => docSectionId('tec', section.title)),
    ];
  });

  constructor() {
    effect(() => {
      const product = this.product();
      this.sidebarService.setItems(product ? buildProductSidebarItems(product) : [], product?.name);
    });

    afterRenderEffect((onCleanup) => {
      observeActiveSection(
        this.document,
        this.sectionIds(),
        (id) => this.sidebarService.setActiveFragment(id),
        onCleanup,
      );
    });
  }
}
