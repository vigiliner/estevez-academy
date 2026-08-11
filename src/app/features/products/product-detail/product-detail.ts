import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PRODUCT_STATUS_BADGE_CLASSES, PRODUCT_STATUS_LABELS } from '../../../shared/models/product.model';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly productsService = inject(ProductsService);

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
}
