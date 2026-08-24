import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
import { Search } from '../../../shared/ui/search/search';
import { ThemeToggle } from '../../../shared/ui/theme-toggle/theme-toggle';

const NAV_LINK_CLASSES =
  'after:content-[\'\'] relative rounded py-1 text-body transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-200 hover:text-accent hover:after:scale-x-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:after:scale-x-100';
const NAV_LINK_ACTIVE_CLASSES = 'text-accent after:scale-x-100';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, Search, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="border-b bg-surface transition-[box-shadow,border-color] duration-200"
      [class.border-border]="!scrolled()"
      [class.border-transparent]="scrolled()"
      [class.shadow-md]="scrolled()"
    >
      <div
        class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:flex-nowrap sm:gap-x-6 sm:py-4"
      >
        @if (sidebarService.items().length) {
          <button
            type="button"
            (click)="sidebarService.openMobile()"
            aria-controls="app-sidebar-nav"
            [attr.aria-expanded]="sidebarService.mobileOpen()"
            [attr.aria-label]="'Abrir menú de ' + (sidebarService.title() || 'navegación')"
            class="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-body hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        }
        <div class="group flex shrink-0 items-center gap-2.5 text-lg font-bold text-heading transition-opacity duration-200 hover:opacity-80">
          <img
            ngSrc="logo-mark.svg"
            width="320"
            height="280"
            alt=""
            class="h-9 w-auto transition-transform duration-200 group-hover:scale-110"
          />
          Estevez <span class="text-accent">Academy</span>
        </div>
        <div class="order-2 flex w-full items-center justify-between sm:order-3 sm:contents">
          <nav aria-label="Principal" class="sm:order-3">
            <ul class="flex items-center gap-6 text-sm font-medium">
              <li>
                <a
                  routerLink="/"
                  [routerLinkActiveOptions]="{ exact: true }"
                  [routerLinkActive]="activeNavLinkClasses"
                  [class]="navLinkClasses"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a routerLink="/productos" [routerLinkActive]="activeNavLinkClasses" [class]="navLinkClasses">
                  Productos
                </a>
              </li>
            </ul>
          </nav>
          <app-theme-toggle class="sm:order-4" />
        </div>
        <div class="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <app-search />
        </div>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly sidebarService = inject(SidebarService);

  readonly scrolled = input(false);

  protected readonly navLinkClasses = NAV_LINK_CLASSES;
  protected readonly activeNavLinkClasses = NAV_LINK_ACTIVE_CLASSES;
}
