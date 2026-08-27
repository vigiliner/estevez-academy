import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-subtle"
      >
        <svg
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 7.5v9l-9 5.25L3 16.5v-9L12 2.25 21 7.5Zm0 0L12 12.75m0 0L3 7.5m9 5.25v9"
          />
        </svg>
      </div>
      <h1 class="mt-5 text-xl font-bold text-heading">No encontramos ese producto</h1>
      <p class="mt-2 text-body">
        El enlace puede estar mal escrito o el producto ya no está disponible.
      </p>
      <a
        routerLink="/productos"
        class="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Ver todos los productos
      </a>
    </div>
  `,
})
export class ProductNotFound {}
