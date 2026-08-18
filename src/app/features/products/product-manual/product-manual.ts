import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-manual',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './product-manual.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManual {
  private readonly productsService = inject(ProductsService);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => this.productsService.findBySlug(this.slug()));
}
