import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'estevez-academy-theme';
const DARK_CLASS = 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly themeSignal = signal<Theme>(this.readInitialTheme());
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      this.document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  private readInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
