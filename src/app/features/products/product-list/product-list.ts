import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { ProductCard } from '../../../shared/ui/product-card/product-card';
import { buildProductListSidebarItems } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);

  protected readonly products = this.productsService.allProducts;

  constructor() {
    effect(() => {
      this.sidebarService.setItems(buildProductListSidebarItems(this.products()), 'Productos');
    });
  }
}
