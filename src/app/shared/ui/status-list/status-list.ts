import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  STATUS_ITEM_BADGE_CLASSES,
  STATUS_ITEM_DOT_CLASSES,
  STATUS_ITEM_LABELS,
  type StatusItem,
} from '../../models/product.model';

@Component({
  selector: 'app-status-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items(); as list) {
      @if (list.length) {
        <ul class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          @for (item of list; track item.label) {
            <li
              class="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-surface-alt px-3 py-2.5"
            >
              <span
                class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                [class]="dotClasses[item.tone]"
                aria-hidden="true"
              ></span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="text-sm font-medium text-heading">{{ item.label }}</span>
                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    [class]="badgeClasses[item.tone]"
                  >
                    {{ toneLabels[item.tone] }}
                  </span>
                </div>
                @if (item.text) {
                  <p class="mt-0.5 text-xs text-muted">{{ item.text }}</p>
                }
              </div>
            </li>
          }
        </ul>
      }
    }
  `,
})
export class StatusList {
  readonly items = input<readonly StatusItem[] | undefined>();

  protected readonly dotClasses = STATUS_ITEM_DOT_CLASSES;
  protected readonly badgeClasses = STATUS_ITEM_BADGE_CLASSES;
  protected readonly toneLabels = STATUS_ITEM_LABELS;
}
