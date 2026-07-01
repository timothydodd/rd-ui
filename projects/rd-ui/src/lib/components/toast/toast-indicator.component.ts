import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import {
  LucideBell,
  LucideCircleCheck,
  LucideCircleX,
  LucideInfo,
  LucideTriangleAlert,
} from '@lucide/angular';
import { Toast, ToastService, ToastType } from './toast.service';

type IndicatorPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * A low-profile alternative to the `rd-toast` popup. Renders a small bell pill that
 * briefly expands to reveal the latest message when one arrives, then collapses back
 * to just an icon. Clicking it opens a panel with the last few messages.
 *
 * Uses the same {@link ToastService}, so existing `success()/error()/info()/warning()`
 * calls light it up with no changes at the call sites. Pick whichever visualization you
 * want by rendering either `<rd-toast />` or `<rd-toast-indicator />`.
 *
 * Icons are bundled via Lucide's static per-icon components, so the host app does not
 * need to register anything.
 */
@Component({
  selector: 'rd-toast-indicator',
  standalone: true,
  imports: [LucideBell, LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert],
  template: `
    <div class="rd-ti" [class]="position()" [class.rd-ti-open]="open()">
      @if (open()) {
        <div class="rd-ti-backdrop" (click)="close()"></div>
        <div class="rd-ti-panel">
          <div class="rd-ti-panel-head">
            <span>Recent</span>
            @if (history().length) {
              <button class="rd-ti-clear" (click)="clear(); $event.stopPropagation()">Clear</button>
            }
          </div>
          @if (history().length) {
            @for (n of history(); track n.id) {
              <div class="rd-ti-item" [class]="n.type">
                <span class="rd-ti-item-icon">
                  @switch (n.type) {
                    @case (ToastType.SUCCESS) {
                      <svg lucideCircleCheck [size]="15"></svg>
                    }
                    @case (ToastType.ERROR) {
                      <svg lucideCircleX [size]="15"></svg>
                    }
                    @case (ToastType.WARNING) {
                      <svg lucideTriangleAlert [size]="15"></svg>
                    }
                    @default {
                      <svg lucideInfo [size]="15"></svg>
                    }
                  }
                </span>
                <div class="rd-ti-item-body">
                  @if (n.title) {
                    <div class="rd-ti-item-title">{{ n.title }}</div>
                  }
                  <div class="rd-ti-item-msg">{{ n.message }}</div>
                </div>
              </div>
            }
          } @else {
            <div class="rd-ti-empty">No recent messages</div>
          }
        </div>
      }

      <button
        type="button"
        class="rd-ti-pill"
        [class]="latest()?.type ?? ''"
        [class.rd-ti-peek]="peeking() && !open()"
        [attr.aria-label]="'Notifications'"
        (click)="toggle(); $event.stopPropagation()"
      >
        <span class="rd-ti-bell">
          @let current = latest();
          @if (open() || !current) {
            <svg lucideBell [size]="16"></svg>
          } @else {
            @switch (current.type) {
              @case (ToastType.SUCCESS) {
                <svg lucideCircleCheck [size]="16"></svg>
              }
              @case (ToastType.ERROR) {
                <svg lucideCircleX [size]="16"></svg>
              }
              @case (ToastType.WARNING) {
                <svg lucideTriangleAlert [size]="16"></svg>
              }
              @default {
                <svg lucideInfo [size]="16"></svg>
              }
            }
          }
          @if (unread() > 0 && !open()) {
            <span class="rd-ti-badge">{{ unread() > 9 ? '9+' : unread() }}</span>
          }
        </span>
        <span class="rd-ti-msg">{{ latest()?.message }}</span>
      </button>
    </div>
  `,
  styleUrl: './toast-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastIndicatorComponent {
  private toastService = inject(ToastService);

  /** Exposed for the template's `@switch`. */
  protected readonly ToastType = ToastType;

  /** Corner to anchor the indicator to. */
  position = input<IndicatorPosition>('bottom-right');
  /** How long the peek stays expanded for low-priority messages (ms). */
  peekDuration = input(2500);
  /** How long the peek stays expanded for errors/warnings (ms). */
  peekDurationImportant = input(5000);

  history = this.toastService.history;
  latest = computed(() => this.history()[0] ?? null);

  peeking = signal(false);
  open = signal(false);
  unread = signal(0);

  private lastPeekedId = -1;
  private peekTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const latest = this.history()[0];
      if (!latest || latest.id === this.lastPeekedId) {
        return;
      }
      this.lastPeekedId = latest.id;
      // While the panel is open the message is already visible, so don't also peek.
      if (!this.open()) {
        this.unread.update((u) => u + 1);
        this.peek(latest);
      }
    });
  }

  private peek(toast: Toast): void {
    this.peeking.set(true);
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
    const important = toast.type === ToastType.ERROR || toast.type === ToastType.WARNING;
    const duration = important ? this.peekDurationImportant() : this.peekDuration();
    this.peekTimer = setTimeout(() => this.peeking.set(false), duration);
  }

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.open.set(true);
    this.peeking.set(false);
    this.unread.set(0);
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
  }

  close(): void {
    this.open.set(false);
  }

  clear(): void {
    this.toastService.clearHistory();
    this.close();
  }
}
