import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, PRODUCT_STATUS_BADGE_CLASSES, PRODUCT_STATUS_LABELS } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/productos', product().slug]"
      class="group block rounded-xl border border-border bg-surface p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:border-blue-700"
    >
      <img
        [ngSrc]="product().logoUrl"
        [width]="product().logoWidth"
        [height]="product().logoHeight"
        [alt]="product().name + ' logo'"
        class="h-12 w-auto object-contain"
      />
      <span
        class="mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        [class]="badgeClasses()"
      >
        {{ statusLabel() }}
      </span>
      <h3 class="mt-3 text-lg font-semibold text-heading group-hover:text-accent">
        {{ product().name }}
      </h3>
      <p class="mt-1 text-sm text-body">{{ product().shortDescription }}</p>
    </a>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();

  protected readonly statusLabel = computed(() => PRODUCT_STATUS_LABELS[this.product().status]);
  protected readonly badgeClasses = computed(() => PRODUCT_STATUS_BADGE_CLASSES[this.product().status]);
}
