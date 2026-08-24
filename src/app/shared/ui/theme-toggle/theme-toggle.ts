import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="themeService.toggle()"
      class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      [attr.aria-label]="label()"
      [attr.aria-pressed]="isDark()"
    >
      @if (isDark()) {
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      } @else {
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);

  protected readonly isDark = computed(() => this.themeService.theme() === 'dark');
  protected readonly label = computed(() => (this.isDark() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'));
}
