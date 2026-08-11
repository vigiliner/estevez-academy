import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-500">
        © {{ currentYear }} Estevez.jor — Estevez Academy
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
}
