import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { ProductsService } from '../products/data/products.service';

@Component({
  selector: 'app-home',
  imports: [ProductCard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly productsService = inject(ProductsService);

  protected readonly products = this.productsService.allProducts;
}
