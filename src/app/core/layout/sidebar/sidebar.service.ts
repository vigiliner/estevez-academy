import { Injectable, signal } from '@angular/core';
import { SidebarItem } from '../../../shared/models/sidebar-item.model';

const MANUAL_OVERRIDE_MS = 500;

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly itemsSignal = signal<readonly SidebarItem[]>([]);
  private readonly titleSignal = signal<string | undefined>(undefined);
  private readonly activeFragmentSignal = signal<string | null>(null);
  private manualOverrideUntil = 0;

  readonly items = this.itemsSignal.asReadonly();
  readonly title = this.titleSignal.asReadonly();
  readonly activeFragment = this.activeFragmentSignal.asReadonly();

  setItems(items: readonly SidebarItem[], title?: string): void {
    this.itemsSignal.set(items);
    this.titleSignal.set(title);
    this.activeFragmentSignal.set(null);
    this.manualOverrideUntil = 0;
  }

  /** Scroll-spy calls this as the user scrolls. Ignored right after an explicit click. */
  setActiveFragment(fragment: string | null): void {
    if (Date.now() < this.manualOverrideUntil) {
      return;
    }
    this.activeFragmentSignal.set(fragment);
  }

  /**
   * A sidebar link was clicked: it wins immediately and stays pinned briefly, since the
   * resulting anchor-scroll can land short of the target near the end of the page (not enough
   * content left to scroll it flush to the top) and would otherwise make the scroll-spy guess
   * a different, later section.
   */
  activateFragment(fragment: string): void {
    this.activeFragmentSignal.set(fragment);
    this.manualOverrideUntil = Date.now() + MANUAL_OVERRIDE_MS;
  }
}
