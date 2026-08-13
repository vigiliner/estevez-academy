import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { ProductsService } from '../products/data/products.service';

@Component({
  selector: 'app-home',
  imports: [ProductCard, RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly productsService = inject(ProductsService);

  protected readonly products = this.productsService.allProducts;
}
