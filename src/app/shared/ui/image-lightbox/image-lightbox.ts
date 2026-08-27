import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, inject, input, linkedSignal, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { ManualScreenshot } from '../../models/product.model';

@Component({
  selector: 'app-image-lightbox',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4',
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '(keydown.escape)': 'closed.emit()',
    '(keydown.arrowLeft)': 'previous()',
    '(keydown.arrowRight)': 'next()',
    '(click)': 'onBackdropClick($event)',
  },
  template: `
    <div class="relative flex max-h-full max-w-5xl flex-col items-center" (click)="$event.stopPropagation()">
      <div class="flex w-full items-center justify-between gap-4 px-1 pb-3 text-white">
        <p class="text-sm">{{ index() + 1 }} de {{ images().length }}</p>
        <button
          #closeButton
          type="button"
          (click)="closed.emit()"
          aria-label="Cerrar imagen"
          class="rounded-full p-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="relative flex items-center justify-center">
        @if (hasMultiple()) {
          <button
            type="button"
            (click)="previous()"
            aria-label="Imagen anterior"
            class="absolute left-2 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        }

        <img
          [ngSrc]="current().src"
          [width]="current().width"
          [height]="current().height"
          [alt]="current().alt"
          [style.maxWidth.px]="current().width"
          priority
          class="max-h-[75vh] w-auto rounded-lg object-contain"
        />

        @if (hasMultiple()) {
          <button
            type="button"
            (click)="next()"
            aria-label="Imagen siguiente"
            class="absolute right-2 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        }
      </div>

      <p class="mt-3 max-w-prose text-center text-sm text-white/80">{{ current().alt }}</p>
    </div>
  `,
})
export class ImageLightbox {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly images = input.required<readonly ManualScreenshot[]>();
  readonly startIndex = input(0);
  readonly closed = output<void>();

  protected readonly index = linkedSignal(() => this.startIndex());
  protected readonly current = computed(() => this.images()[this.index()]);
  protected readonly hasMultiple = computed(() => this.images().length > 1);

  constructor() {
    afterRenderEffect(() => {
      this.host.nativeElement.querySelector('button')?.focus();
    });
  }

  protected previous(): void {
    const total = this.images().length;
    this.index.update((i) => (i - 1 + total) % total);
  }

  protected next(): void {
    const total = this.images().length;
    this.index.update((i) => (i + 1) % total);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
