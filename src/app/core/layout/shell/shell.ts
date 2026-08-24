import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { SidebarService } from '../sidebar/sidebar.service';

const SCROLL_ELEVATION_THRESHOLD = 8;

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:shadow"
    >
      Saltar al contenido principal
    </a>
    <div class="flex h-screen flex-col overflow-hidden bg-canvas">
      <app-header class="shrink-0" [scrolled]="mainScrolled()" />
      @if (sidebarService.items().length) {
        <div class="shrink-0 border-b border-border bg-surface px-4 py-2 lg:hidden">
          <button
            type="button"
            (click)="mobileSidebarOpen.set(true)"
            aria-controls="app-sidebar-nav"
            [attr.aria-expanded]="mobileSidebarOpen()"
            class="inline-flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-body hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            {{ sidebarService.title() || 'Menú' }}
          </button>
        </div>
      }
      <div class="flex min-h-0 flex-1 items-stretch">
        @if (mobileSidebarOpen()) {
          <div
            (click)="mobileSidebarOpen.set(false)"
            class="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          ></div>
        }
        <app-sidebar
          [title]="sidebarService.title()"
          [items]="sidebarService.items()"
          (closeRequested)="mobileSidebarOpen.set(false)"
          class="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-surface shadow-lg transition-transform duration-300 ease-out lg:static lg:z-auto lg:h-full lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-border lg:shadow-none"
          [class.translate-x-0]="mobileSidebarOpen()"
          [class.-translate-x-full]="!mobileSidebarOpen()"
        />
        <main id="main-content" class="min-w-0 flex-1 overflow-y-auto" (scroll)="onMainScroll($event)">
          <router-outlet />
        </main>
      </div>
      <app-footer class="shrink-0" />
    </div>
  `,
})
export class Shell {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly mobileSidebarOpen = signal(false);
  protected readonly mainScrolled = signal(false);

  protected onMainScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.mainScrolled.set(scrollTop > SCROLL_ELEVATION_THRESHOLD);
  }
}
