import { Injectable, signal } from '@angular/core';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastCount = 0;

  /** Currently-visible toasts (used by the popup `rd-toast` visualization). */
  public toasts = signal<Toast[]>([]);

  /**
   * Recent messages, newest first, kept even after their toast auto-expires.
   * Alternative visualizations (e.g. `rd-toast-indicator`) can surface the last
   * few messages without relying on a toast still being on screen.
   */
  public history = signal<Toast[]>([]);

  /** How many messages to retain in {@link history}. */
  private readonly historyLimit = 20;

  /**
   * Show a success toast message
   */
  success(message: string, title?: string, duration = 3000): void {
    this.show(message, ToastType.SUCCESS, title, duration);
  }

  /**
   * Show an error toast message
   */
  error(message: string, title?: string, duration = 5000): void {
    this.show(message, ToastType.ERROR, title, duration);
  }

  /**
   * Show an info toast message
   */
  info(message: string, title?: string, duration = 3000): void {
    this.show(message, ToastType.INFO, title, duration);
  }

  /**
   * Show a warning toast message
   */
  warning(message: string, title?: string, duration = 4000): void {
    this.show(message, ToastType.WARNING, title, duration);
  }

  /**
   * Show a toast with a specific type
   */
  private show(message: string, type: ToastType, title?: string, duration?: number): void {
    const id = this.toastCount++;
    const toast: Toast = { id, message, type, title, duration };

    this.toasts.update((toasts) => [...toasts, toast]);
    this.history.update((history) => [toast, ...history].slice(0, this.historyLimit));

    if (duration) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  /** Clear the retained message history. */
  clearHistory(): void {
    this.history.set([]);
  }

  /**
   * Remove a toast by id
   */
  remove(id: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts.update(() => []);
  }
}
