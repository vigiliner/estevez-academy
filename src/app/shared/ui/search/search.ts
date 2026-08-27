import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { SearchService } from '../../../core/search/search.service';
import { SearchResult, SearchResultKind } from '../../models/search-result.model';

let nextSearchId = 0;
const MIN_QUERY_LENGTH = 2;

const KIND_LABELS: Record<SearchResultKind, string> = {
  functional: 'Funcional',
  technical: 'Técnica',
  manual: 'Manual',
};

const KIND_BADGE_CLASSES: Record<SearchResultKind, string> = {
  functional: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  technical: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  manual: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
};

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <label [for]="inputId" class="sr-only">Buscar en el contenido de los productos</label>
    <div class="relative">
      <svg
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.2-5.2m1.7-5.3a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        />
      </svg>
      <input
        [id]="inputId"
        type="text"
        [formControl]="control"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="panelOpen()"
        [attr.aria-controls]="listboxId"
        [attr.aria-activedescendant]="activeIndex() >= 0 ? optionId(activeIndex()) : null"
        autocomplete="off"
        placeholder="Buscar en productos…"
        class="w-full rounded-lg border border-border bg-surface-alt py-2 pl-9 text-sm text-heading placeholder:text-subtle transition-shadow duration-200 hover:border-subtle focus:outline-none focus-visible:border-blue-600 focus-visible:shadow-[0_0_0_6px_rgba(37,99,235,0.12)] focus-visible:ring-2 focus-visible:ring-blue-600"
        [class.pr-3]="!showCounter()"
        [class.pr-20]="showCounter()"
        (focus)="isOpen.set(true)"
        (input)="isOpen.set(true)"
        (keydown)="onKeydown($event)"
      />
      @if (showCounter()) {
        <span
          aria-hidden="true"
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums text-muted"
        >
          {{ counterLabel() }}
        </span>
      }
    </div>

    <div class="sr-only" aria-live="polite">{{ liveMessage() }}</div>

    @if (panelOpen()) {
      <div
        class="animate-dropdown-in absolute left-0 right-0 top-full z-50 mt-2 max-h-96 origin-top overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
      >
        @if (results().length) {
          <ul
            [id]="listboxId"
            role="listbox"
            aria-label="Resultados de búsqueda"
            class="divide-y divide-border-subtle"
          >
            @for (result of results(); track result.id; let i = $index) {
              <li
                [id]="optionId(i)"
                role="option"
                [attr.aria-selected]="i === activeIndex()"
                (mousedown)="$event.preventDefault()"
                (click)="activate(result)"
                class="cursor-pointer px-4 py-3 transition-colors duration-150 hover:bg-surface-hover"
                [class.bg-accent-muted]="i === activeIndex()"
              >
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-heading">{{ result.title }}</span>
                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    [class]="kindBadgeClasses[result.kind]"
                  >
                    {{ kindLabels[result.kind] }}
                  </span>
                </div>
                <p class="mt-0.5 truncate text-xs text-muted">
                  {{ result.productName }} · {{ result.sectionLabel }}
                </p>
                <p class="mt-1 line-clamp-2 text-xs text-body">{{ result.snippet }}</p>
              </li>
            }
          </ul>
        } @else {
          <p class="px-4 py-6 text-center text-sm text-muted">
            Sin resultados para "{{ query() }}"
          </p>
        }
      </div>
    }
  `,
})
export class Search {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);

  protected readonly control = new FormControl('', { nonNullable: true });
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly inputId = `app-search-input-${nextSearchId++}`;
  protected readonly listboxId = `${this.inputId}-listbox`;

  protected readonly kindLabels = KIND_LABELS;
  protected readonly kindBadgeClasses = KIND_BADGE_CLASSES;

  protected readonly query = toSignal(
    this.control.valueChanges.pipe(
      startWith(this.control.value),
      debounceTime(150),
      distinctUntilChanged(),
    ),
    { initialValue: this.control.value },
  );

  protected readonly results = computed<SearchResult[]>(() => {
    const term = this.query().trim();
    return term.length >= MIN_QUERY_LENGTH ? this.searchService.search(term) : [];
  });

  protected readonly totalMatches = computed(() => {
    const term = this.query().trim();
    return term.length >= MIN_QUERY_LENGTH ? this.searchService.totalMatches(term) : 0;
  });

  protected readonly showCounter = computed(() => this.query().trim().length >= MIN_QUERY_LENGTH);

  protected readonly counterLabel = computed(() => {
    const count = this.totalMatches();
    return `${count} resultado${count === 1 ? '' : 's'}`;
  });

  protected readonly panelOpen = computed(
    () => this.isOpen() && this.query().trim().length >= MIN_QUERY_LENGTH,
  );

  protected readonly liveMessage = computed(() => {
    const term = this.query().trim();
    if (term.length < MIN_QUERY_LENGTH) {
      return '';
    }
    const count = this.totalMatches();
    return count ? `${count} resultado${count === 1 ? '' : 's'} encontrados` : 'Sin resultados';
  });

  constructor() {
    effect(() => {
      this.results();
      this.activeIndex.set(-1);
    });

    effect(() => {
      this.searchService.setActiveTerm(this.query());
    });
  }

  protected optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (!host || !next || !host.contains(next)) {
      this.close();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const total = this.results().length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!total) return;
        this.isOpen.set(true);
        this.activeIndex.set((this.activeIndex() + 1) % total);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!total) return;
        this.isOpen.set(true);
        this.activeIndex.set((this.activeIndex() - 1 + total) % total);
        break;
      case 'Enter': {
        if (!total) return;
        event.preventDefault();
        const active = this.activeIndex();
        const result = this.results()[active >= 0 ? active : 0];
        if (result) {
          this.activate(result);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  protected activate(result: SearchResult): void {
    this.router.navigate([...result.route], { fragment: result.fragment });
    this.close();
  }

  private close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }
}
