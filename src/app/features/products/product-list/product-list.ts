import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCard } from '../../../shared/ui/product-card/product-card';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productsService = inject(ProductsService);

  protected readonly products = this.productsService.allProducts;
}
