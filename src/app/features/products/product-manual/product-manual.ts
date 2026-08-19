import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { buildProductSidebarItems } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-manual',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-manual.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManual {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => this.productsService.findBySlug(this.slug()));

  constructor() {
    effect(() => {
      const product = this.product();
      this.sidebarService.setItems(product ? buildProductSidebarItems(product) : [], product?.name);
    });
  }
}
