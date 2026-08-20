import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Search } from '../../../shared/ui/search/search';

const NAV_LINK_CLASSES =
  'after:content-[\'\'] relative rounded py-1 text-gray-700 transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-200 hover:text-blue-700 hover:after:scale-x-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:after:scale-x-100';
const NAV_LINK_ACTIVE_CLASSES = 'text-blue-700 after:scale-x-100';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, Search],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="border-b bg-white transition-[box-shadow,border-color] duration-200"
      [class.border-gray-200]="!scrolled()"
      [class.border-transparent]="scrolled()"
      [class.shadow-md]="scrolled()"
    >
      <div
        class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:flex-nowrap sm:py-4"
      >
        <div class="group flex shrink-0 items-center gap-2.5 text-lg font-bold text-gray-900 transition-opacity duration-200 hover:opacity-80">
          <img
            ngSrc="logo-mark.svg"
            width="320"
            height="280"
            alt=""
            class="h-9 w-auto transition-transform duration-200 group-hover:scale-110"
          />
          Estevez <span class="text-blue-700">Academy</span>
        </div>
        <div class="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <app-search />
        </div>
        <nav aria-label="Principal" class="order-2 ml-auto sm:order-3 sm:ml-0">
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
      </div>
    </header>
  `,
})
export class Header {
  readonly scrolled = input(false);

  protected readonly navLinkClasses = NAV_LINK_CLASSES;
  protected readonly activeNavLinkClasses = NAV_LINK_ACTIVE_CLASSES;
}
