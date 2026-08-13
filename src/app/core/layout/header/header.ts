import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a
          routerLink="/"
          class="flex items-center gap-2.5 rounded text-lg font-bold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <img ngSrc="/logo-mark.svg" width="320" height="280" alt="" class="h-9 w-auto" />
          Estevez <span class="text-blue-700">Academy</span>
        </a>
        <nav aria-label="Principal">
          <ul class="flex items-center gap-6 text-sm font-medium text-gray-700">
            <li>
              <a
                routerLink="/"
                routerLinkActive="text-blue-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="rounded hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                routerLink="/productos"
                routerLinkActive="text-blue-700"
                class="rounded hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Productos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class Header {}
