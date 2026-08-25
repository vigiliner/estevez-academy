import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductCard } from './product-card';

function buildProduct(overrides: Partial<Product>): Product {
  return {
    slug: 'demo',
    name: 'Demo',
    shortDescription: 'Descripción de prueba.',
    status: 'disponible',
    functionalDoc: [],
    technicalDoc: [],
    userManual: [],
    ...overrides,
  };
}

describe('ProductCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders an active product as a clickable link', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', buildProduct({ status: 'en-progreso' }));
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('a')).toBeTruthy();
    expect(host.querySelector('div[aria-disabled]')).toBeFalsy();
    expect(host.textContent).toContain('En progreso');
  });

  it('renders a "proximamente" product as a disabled, non-navigable card', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', buildProduct({ status: 'proximamente' }));
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('a')).toBeFalsy();
    const disabledCard = host.querySelector('div[aria-disabled="true"]');
    expect(disabledCard).toBeTruthy();
    expect(disabledCard?.className).toContain('opacity-60');
    expect(host.textContent).toContain('Próximamente');
  });

  it('shows a placeholder icon when the product has no logo yet', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', buildProduct({ status: 'proximamente' }));
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('img')).toBeFalsy();
    expect(host.querySelector('svg')).toBeTruthy();
  });
});
