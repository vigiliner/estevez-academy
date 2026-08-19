import { Injectable, signal } from '@angular/core';
import { SidebarItem } from '../../../shared/models/sidebar-item.model';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly itemsSignal = signal<readonly SidebarItem[]>([]);
  private readonly titleSignal = signal<string | undefined>(undefined);

  readonly items = this.itemsSignal.asReadonly();
  readonly title = this.titleSignal.asReadonly();

  setItems(items: readonly SidebarItem[], title?: string): void {
    this.itemsSignal.set(items);
    this.titleSignal.set(title);
  }
}
