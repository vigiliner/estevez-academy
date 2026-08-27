import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { ManualScreenshot } from '../../models/product.model';
import { ScreenshotCarousel } from '../screenshot-carousel/screenshot-carousel';

@Component({
  selector: 'app-screenshot-block',
  imports: [NgOptimizedImage, ScreenshotCarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (screenshots(); as shots) {
      @if (shots.length > 1) {
        <app-screenshot-carousel [screenshots]="shots" (opened)="opened.emit($event)" />
      } @else if (shots.length) {
        <figure
          class="mx-auto mt-4 w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
        >
          <button
            type="button"
            (click)="opened.emit(shots[0])"
            [attr.aria-label]="'Ampliar imagen: ' + shots[0].alt"
            class="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
          >
            <img
              [ngSrc]="shots[0].src"
              [width]="shots[0].width"
              [height]="shots[0].height"
              [alt]="shots[0].alt"
              class="h-auto w-full"
            />
          </button>
        </figure>
      }
    }
  `,
})
export class ScreenshotBlock {
  readonly screenshots = input<readonly ManualScreenshot[] | undefined>();
  readonly opened = output<ManualScreenshot>();
}
