import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'onWindowResize()' },
  template: `
    @if (breadcrumbService.visible()) {
      <nav
        aria-label="Ruta de navegación"
        class="border-b border-border-subtle bg-surface-alt"
        [class.invisible]="wrapped()"
        [class.h-0]="wrapped()"
        [class.overflow-hidden]="wrapped()"
        [class.border-transparent]="wrapped()"
      >
        <ol #list class="flex flex-wrap items-center gap-1.5 px-4 py-2.5 text-sm sm:px-6">
          @for (crumb of breadcrumbService.crumbs(); track $index) {
            <li class="flex items-center gap-1.5">
              @if (!$last) {
                <a
                  [routerLink]="crumb.routerLink"
                  [fragment]="crumb.fragment"
                  class="rounded text-muted hover:text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {{ crumb.label }}
                </a>
                <span aria-hidden="true" class="text-faint">›</span>
              } @else {
                <span class="font-medium text-heading" aria-current="page">{{ crumb.label }}</span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
})
export class Breadcrumbs {
  protected readonly breadcrumbService = inject(BreadcrumbService);

  private readonly list = viewChild<ElementRef<HTMLOListElement>>('list');

  /** True once the crumb list no longer fits on one line — hides the bar instead of letting it wrap. */
  protected readonly wrapped = signal(false);

  constructor() {
    afterRenderEffect((onCleanup) => {
      this.breadcrumbService.crumbs();
      const el = this.list()?.nativeElement;
      if (!el) {
        return;
      }

      const check = () => this.checkWrap(el);
      check();

      const observer = new ResizeObserver(check);
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }

  protected onWindowResize(): void {
    const el = this.list()?.nativeElement;
    if (el) {
      this.checkWrap(el);
    }
  }

  private checkWrap(el: HTMLElement): void {
    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) {
      this.wrapped.set(false);
      return;
    }
    const firstRowTop = items[0].offsetTop;
    this.wrapped.set(items.some((item) => item.offsetTop > firstRowTop + 1));
  }
}
