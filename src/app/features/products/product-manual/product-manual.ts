import { ChangeDetectionStrategy, Component, afterRenderEffect, computed, effect, inject, input } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { observeActiveSection } from '../../../core/layout/sidebar/section-scroll-spy';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { SearchService } from '../../../core/search/search.service';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { buildProductSidebarItems } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-manual',
  imports: [RouterLink, NgOptimizedImage, HighlightPipe],
  templateUrl: './product-manual.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManual {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);
  private readonly document = inject(DOCUMENT);
  protected readonly searchService = inject(SearchService);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => this.productsService.findBySlug(this.slug()));

  private readonly sectionIds = computed(() => {
    const product = this.product();
    return product ? product.userManual.map((role) => `rol-${role.id}`) : [];
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
