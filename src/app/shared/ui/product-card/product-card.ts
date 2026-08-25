import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, PRODUCT_STATUS_BADGE_CLASSES, PRODUCT_STATUS_LABELS } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, NgOptimizedImage, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isComingSoon()) {
      <div
        class="block rounded-xl border border-border bg-surface p-6 opacity-60 shadow-sm"
        aria-disabled="true"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </div>
    } @else {
      <a
        [routerLink]="['/productos', product().slug]"
        class="group block rounded-xl border border-border bg-surface p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:border-blue-700"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    }

    <ng-template #content>
      @if (product().logoUrl) {
        <img
          [ngSrc]="product().logoUrl!"
          [width]="product().logoWidth!"
          [height]="product().logoHeight!"
          [alt]="product().name + ' logo'"
          class="h-12 w-auto object-contain"
        />
      } @else {
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-alt text-subtle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-6 w-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 7.5v9l-9 5.25L3 16.5v-9L12 2.25 21 7.5Zm0 0L12 12.75m0 0L3 7.5m9 5.25v9"
            />
          </svg>
        </div>
      }
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
    </ng-template>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();

  protected readonly isComingSoon = computed(() => this.product().status === 'proximamente');
  protected readonly statusLabel = computed(() => PRODUCT_STATUS_LABELS[this.product().status]);
  protected readonly badgeClasses = computed(() => PRODUCT_STATUS_BADGE_CLASSES[this.product().status]);
}
