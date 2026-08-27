import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { ManualScreenshot } from '../../models/product.model';

@Component({
  selector: 'app-screenshot-carousel',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative mx-auto mt-4 block w-full max-w-2xl',
  },
  template: `
    <figure class="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <button
        type="button"
        (click)="opened.emit(current())"
        [attr.aria-label]="'Ampliar imagen: ' + current().alt"
        class="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
      >
        <img
          [ngSrc]="current().src"
          [width]="current().width"
          [height]="current().height"
          [alt]="current().alt"
          class="h-auto w-full"
        />
      </button>
    </figure>

    @if (!isFirst()) {
      <button
        type="button"
        (click)="previous()"
        aria-label="Captura anterior"
        class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    }

    @if (!isLast()) {
      <button
        type="button"
        (click)="next()"
        aria-label="Siguiente captura"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    }

    <span class="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
      {{ index() + 1 }} de {{ screenshots().length }}
    </span>

    <div class="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Capturas de este paso">
      @for (shot of screenshots(); track shot.src; let i = $index) {
        <button
          type="button"
          role="tab"
          (click)="goTo(i)"
          [attr.aria-label]="'Ir a la captura ' + (i + 1)"
          [attr.aria-selected]="i === index()"
          class="h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          [style.width.px]="i === index() ? 16 : 6"
          [class.bg-accent]="i === index()"
          [class.bg-faint]="i !== index()"
        ></button>
      }
    </div>
  `,
})
export class ScreenshotCarousel {
  readonly screenshots = input.required<readonly ManualScreenshot[]>();
  readonly opened = output<ManualScreenshot>();

  protected readonly index = signal(0);
  protected readonly current = computed(() => this.screenshots()[this.index()]);
  protected readonly isFirst = computed(() => this.index() === 0);
  protected readonly isLast = computed(() => this.index() === this.screenshots().length - 1);

  protected previous(): void {
    if (!this.isFirst()) {
      this.index.update((i) => i - 1);
    }
  }

  protected next(): void {
    if (!this.isLast()) {
      this.index.update((i) => i + 1);
    }
  }

  protected goTo(i: number): void {
    this.index.set(i);
  }
}
