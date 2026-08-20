import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const MIN_TERM_LENGTH = 2;
const MARK_CLASS = 'rounded-sm bg-amber-200 px-0.5 text-inherit';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wraps every case-insensitive match of `term` inside `value` with a `<mark>`.
 * `value` is HTML-escaped first, so this is safe to bind via [innerHTML].
 */
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, term: string | null | undefined): SafeHtml {
    const escapedValue = escapeHtml(value ?? '');
    const trimmedTerm = term?.trim() ?? '';

    if (trimmedTerm.length < MIN_TERM_LENGTH) {
      return this.sanitizer.bypassSecurityTrustHtml(escapedValue);
    }

    const pattern = new RegExp(escapeRegExp(escapeHtml(trimmedTerm)), 'gi');
    const highlighted = escapedValue.replace(pattern, (match) => `<mark class="${MARK_CLASS}">${match}</mark>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
