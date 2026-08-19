import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { PRODUCT_STATUS_BADGE_CLASSES, PRODUCT_STATUS_LABELS } from '../../../shared/models/product.model';
import { buildProductSidebarItems, docSectionId } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);

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

  constructor() {
    effect(() => {
      const product = this.product();
      this.sidebarService.setItems(product ? buildProductSidebarItems(product) : [], product?.name);
    });
  }
}
