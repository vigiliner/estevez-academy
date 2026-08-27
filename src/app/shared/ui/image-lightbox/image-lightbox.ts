import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';
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
    <div class="flex max-h-full max-w-5xl flex-col items-center" (click)="$event.stopPropagation()">
      <div class="relative flex items-center justify-center">
        @if (hasMultiple() && !isFirst()) {
          <button
            type="button"
            (click)="previous()"
            aria-label="Imagen anterior"
            class="absolute left-2 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              class="h-6 w-6"
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

        <div
          class="max-h-[75vh] max-w-[calc(100vw-2rem)] overflow-auto overscroll-contain rounded-lg sm:contents"
        >
          <img
            [ngSrc]="current().src"
            [width]="current().width"
            [height]="current().height"
            [alt]="current().alt"
            priority
            class="block max-w-none rounded-lg sm:h-auto sm:max-h-[75vh] sm:w-auto sm:max-w-[calc(100vw-2rem)] sm:object-contain"
          />
        </div>

        @if (hasMultiple() && !isLast()) {
          <button
            type="button"
            (click)="next()"
            aria-label="Imagen siguiente"
            class="absolute right-2 z-10 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              class="h-6 w-6"
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

        @if (hasMultiple()) {
          <span
            class="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white"
          >
            {{ index() + 1 }} de {{ images().length }}
          </span>
        }

        <button
          #closeButton
          type="button"
          (click)="closed.emit()"
          aria-label="Cerrar imagen"
          class="absolute -right-3 -top-3 rounded-full bg-black/70 p-2 text-white shadow-lg ring-1 ring-white/20 transition-colors hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="mt-4 max-w-prose text-center text-sm text-white/80">{{ current().alt }}</p>
    </div>
  `,
})
export class ImageLightbox {
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly images = input.required<readonly ManualScreenshot[]>();
  readonly startIndex = input(0);
  readonly closed = output<void>();

  protected readonly index = linkedSignal(() => this.startIndex());
  protected readonly current = computed(() => this.images()[this.index()]);
  protected readonly hasMultiple = computed(() => this.images().length > 1);
  protected readonly isFirst = computed(() => this.index() === 0);
  protected readonly isLast = computed(() => this.index() === this.images().length - 1);

  constructor() {
    afterRenderEffect(() => {
      this.closeButton().nativeElement.focus();
    });
  }

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

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
