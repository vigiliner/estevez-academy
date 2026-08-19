import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer, Sidebar],
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
      @if (sidebarService.items().length) {
        <div class="border-b border-gray-200 bg-white px-4 py-2 lg:hidden">
          <button
            type="button"
            (click)="mobileSidebarOpen.set(true)"
            aria-controls="app-sidebar-nav"
            [attr.aria-expanded]="mobileSidebarOpen()"
            class="inline-flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            {{ sidebarService.title() || 'Menú' }}
          </button>
        </div>
      }
      <div class="flex flex-1 items-start">
        @if (mobileSidebarOpen()) {
          <div
            (click)="mobileSidebarOpen.set(false)"
            class="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
            aria-hidden="true"
          ></div>
        }
        <app-sidebar
          [title]="sidebarService.title()"
          [items]="sidebarService.items()"
          (closeRequested)="mobileSidebarOpen.set(false)"
          class="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-white shadow-xl transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-gray-200 lg:shadow-none"
          [class.translate-x-0]="mobileSidebarOpen()"
          [class.-translate-x-full]="!mobileSidebarOpen()"
        />
        <main id="main-content" class="min-w-0 flex-1">
          <router-outlet />
        </main>
      </div>
      <app-footer />
    </div>
  `,
})
export class Shell {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly mobileSidebarOpen = signal(false);
}
