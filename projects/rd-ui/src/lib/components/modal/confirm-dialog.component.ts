import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalLayoutComponent } from './modal-layout.component';

@Component({
  selector: 'rd-confirm-dialog',
  standalone: true,
  imports: [ModalLayoutComponent],
  template: `
    <rd-modal-layout [title]="title()">
      <div slot="body">
        <p class="confirm-message">{{ message() }}</p>
      </div>
      <div slot="footer" class="confirm-footer">
        <button class="btn btn-secondary" (click)="cancel()">{{ cancelText() }}</button>
        <button class="btn btn-primary" (click)="confirm()">{{ confirmText() }}</button>
      </div>
    </rd-modal-layout>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
        margin: 0 auto;
      }
      .confirm-message {
        margin: 0;
        font-size: 1rem;
        color: var(--rd-on-surface);
        text-align: center;
      }
      .confirm-footer {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
      }
      .btn {
        padding: 0.5rem 1.25rem;
        border-radius: var(--rd-border-radius-sm);
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.15s ease;
        min-width: 80px;
      }
      .btn-primary {
        background: var(--rd-primary);
        color: var(--rd-on-primary);
      }
      .btn-primary:hover {
        filter: brightness(1.1);
      }
      .btn-secondary {
        background: var(--rd-surface-variant);
        color: var(--rd-on-surface);
      }
      .btn-secondary:hover {
        background: var(--rd-surface-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent implements OnInit {
  private modalComponent = inject(ModalComponent);

  title = signal('Confirm');
  message = signal('Are you sure?');
  confirmText = signal('Confirm');
  cancelText = signal('Cancel');

  ngOnInit(): void {
    const data = this.modalComponent.config?.data;
    if (data?.title) {
      this.title.set(data.title);
    }
    if (data?.message) {
      this.message.set(data.message);
    }
    if (data?.confirmText) {
      this.confirmText.set(data.confirmText);
    }
    if (data?.cancelText) {
      this.cancelText.set(data.cancelText);
    }
  }

  confirm() {
    this.modalComponent.modalContainerService.close(this.modalComponent.modalId!, true);
  }

  cancel() {
    this.modalComponent.modalContainerService.close(this.modalComponent.modalId!, false);
  }
}
