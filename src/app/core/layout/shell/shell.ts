import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
    >
      Saltar al contenido principal
    </a>
    <div class="flex min-h-screen flex-col bg-gray-50">
      <app-header />
      <main id="main-content" class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class Shell {}
