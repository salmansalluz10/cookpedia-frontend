import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class NoticeService {
  message = signal('');
  kind = signal<'error' | 'success'>('success');
  private timer?: ReturnType<typeof setTimeout>;
  show(message: string, kind: 'error' | 'success' = 'success') {
    clearTimeout(this.timer);
    this.kind.set(kind);
    this.message.set(message);
    this.timer = setTimeout(() => this.message.set(''), 7000);
  }
}
export function apiError(error: any): string {
  return error?.name === 'TimeoutError'
    ? 'CookPedia took too long to respond. Please try again.'
    : typeof error?.error === 'string' && !/<[^>]+>/.test(error.error)
      ? error.error
      : error?.error?.message ||
        (error?.status === 503
          ? 'The recipe service is temporarily unavailable. Please try again shortly.'
          : error?.status === 0
            ? 'We could not reach CookPedia. Check your connection and try again.'
            : 'Something went wrong. Please try again.');
}
