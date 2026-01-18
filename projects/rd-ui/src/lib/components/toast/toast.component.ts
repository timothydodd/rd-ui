import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'rd-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rd-toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [ngClass]="['rd-toast', toast.type]"
          animate.enter="rd-toast-enter"
          animate.leave="rd-toast-leave"
          (click)="removeToast(toast.id)"
        >
          <div class="rd-toast-content">
            @if (toast.title) {
              <div class="toast-title">{{ toast.title }}</div>
            }
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="close-button" (click)="removeToast(toast.id); $event.stopPropagation()">×</button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toastService = inject(ToastService);

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}
