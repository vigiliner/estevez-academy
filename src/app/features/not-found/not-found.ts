import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt text-subtle"
      >
        <svg
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h1 class="mt-6 text-2xl font-bold text-heading">Esta página no existe</h1>
      <p class="mt-2 text-body">
        Revisá el enlace o volvé al inicio para seguir explorando la documentación de Estevez.jor.
      </p>
      <a
        routerLink="/"
        class="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Volver al inicio
      </a>
    </div>
  `,
})
export class NotFound {}
