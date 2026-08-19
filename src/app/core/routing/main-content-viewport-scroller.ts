import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * The app shell keeps `<main id="main-content">` as the only scrollable
 * region (header/sidebar/footer stay fixed), so Angular's default
 * `ViewportScroller` — which scrolls `window` — can't reach anchors or
 * restore scroll position. This redirects both to that container.
 */
@Injectable()
export class MainContentViewportScroller implements ViewportScroller {
  private readonly document = inject(DOCUMENT);
  private offsetFn: () => [number, number] = () => [0, 0];

  private get scrollContainer(): HTMLElement | null {
    return this.document.getElementById('main-content');
  }

  setOffset(offset: [number, number] | (() => [number, number])): void {
    this.offsetFn = Array.isArray(offset) ? () => offset : offset;
  }

  getScrollPosition(): [number, number] {
    const container = this.scrollContainer;
    return container ? [container.scrollLeft, container.scrollTop] : [0, 0];
  }

  scrollToPosition(position: [number, number], options?: ScrollOptions): void {
    this.scrollContainer?.scrollTo({ ...options, left: position[0], top: position[1] });
  }

  scrollToAnchor(target: string, options?: ScrollOptions): void {
    const container = this.scrollContainer;
    const element = this.document.getElementById(target) ?? this.document.getElementsByName(target)[0];
    if (!container || !element) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const [offsetX, offsetY] = this.offsetFn();

    container.scrollTo({
      ...options,
      left: container.scrollLeft + (elementRect.left - containerRect.left) - offsetX,
      top: container.scrollTop + (elementRect.top - containerRect.top) - offsetY,
    });
    element.focus({ preventScroll: true });
  }

  setHistoryScrollRestoration(): void {
    // No-op: the browser only restores window scroll, and here the window never scrolls.
  }
}
