import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarIcon, SidebarItem } from '../../../shared/models/sidebar-item.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #sectionIcon let-name="name">
      @if (name) {
        <svg
          class="h-4 w-4 shrink-0 text-subtle transition-colors duration-150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="iconPath(name)" />
        </svg>
      }
    </ng-template>

    <div class="flex h-full flex-col">
      <nav
        id="app-sidebar-nav"
        class="min-h-0 flex-1 overflow-y-auto p-4"
        [attr.aria-label]="title() || 'Navegación secundaria'"
      >
        <div class="mb-3 flex items-center justify-between">
          @if (title()) {
            <p class="px-2 text-xs font-semibold tracking-wider text-subtle uppercase">
              {{ title() }}
            </p>
          }
          <button
            type="button"
            (click)="closeRequested.emit()"
            class="ml-auto rounded-md p-1.5 text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mx-2 mb-3 border-t border-border-subtle"></div>
        <ul class="space-y-0.5">
          @for (item of items(); track item.label) {
            <li>
              @if (item.children?.length) {
                <p
                  class="mt-5 flex items-center gap-2.5 px-2 py-1 text-xs font-semibold tracking-wide text-subtle uppercase first:mt-0"
                >
                  <ng-container
                    [ngTemplateOutlet]="sectionIcon"
                    [ngTemplateOutletContext]="{ name: item.icon }"
                  />
                  {{ item.label }}
                </p>
                <ul class="mt-1 ml-2 space-y-0.5 border-l border-border-subtle pl-3">
                  @for (child of item.children; track child.label) {
                    <li>
                      <a
                        [routerLink]="child.routerLink ?? []"
                        [fragment]="child.fragment"
                        (click)="onChildClick(child)"
                        class="block rounded-md px-2.5 py-1.5 text-sm text-body transition-colors duration-150 hover:bg-surface-hover hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        [class.bg-accent-muted]="isChildActive(child)"
                        [class.text-accent]="isChildActive(child)"
                        [attr.aria-current]="isChildActive(child) ? 'location' : null"
                      >
                        {{ child.label }}
                      </a>
                    </li>
                  }
                </ul>
              } @else {
                <a
                  [routerLink]="item.routerLink ?? []"
                  [fragment]="item.fragment"
                  (click)="closeRequested.emit()"
                  routerLinkActive="bg-accent-muted text-accent"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-body transition-colors duration-150 hover:bg-surface-hover hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <ng-container
                    [ngTemplateOutlet]="sectionIcon"
                    [ngTemplateOutletContext]="{ name: item.icon }"
                  />
                  <span class="truncate">{{ item.label }}</span>
                  <svg
                    class="ml-auto h-4 w-4 shrink-0 text-faint transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-subtle"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </a>
              }
            </li>
          } @empty {
            <li class="px-2 text-sm text-muted">Sin contenido para mostrar.</li>
          }
        </ul>
      </nav>
      <div class="shrink-0 border-t border-border-subtle px-4 py-3 text-center text-xs text-muted">
        © {{ currentYear }} Estevez.jor — Estevez Academy
      </div>
    </div>
  `,
})
export class Sidebar {
  readonly items = input<readonly SidebarItem[]>([]);
  readonly title = input<string | undefined>();
  readonly activeFragment = input<string | null>(null);
  readonly closeRequested = output<void>();
  readonly fragmentActivated = output<string>();

  protected readonly currentYear = new Date().getFullYear();

  protected isChildActive(child: SidebarItem): boolean {
    return !!child.fragment && child.fragment === this.activeFragment();
  }

  protected onChildClick(child: SidebarItem): void {
    if (child.fragment) {
      this.fragmentActivated.emit(child.fragment);
    }
    this.closeRequested.emit();
  }

  protected iconPath(icon: SidebarIcon | undefined): string {
    switch (icon) {
      case 'package':
        return 'M20.25 7.5l-8.25-4.5L3.75 7.5m16.5 0l-8.25 4.5m8.25-4.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5';
      case 'book-open':
        return 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25';
      case 'code':
        return 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5';
      case 'users':
        return 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z';
      default:
        return '';
    }
  }
}
