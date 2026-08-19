import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../core/layout/sidebar/sidebar.service';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { buildProductListSidebarItems } from '../products/data/product-sidebar';
import { ProductsService } from '../products/data/products.service';

@Component({
  selector: 'app-home',
  imports: [ProductCard, RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);

  protected readonly products = this.productsService.allProducts;

  constructor() {
    effect(() => {
      this.sidebarService.setItems(buildProductListSidebarItems(this.products()), 'Productos');
    });
  }
}
