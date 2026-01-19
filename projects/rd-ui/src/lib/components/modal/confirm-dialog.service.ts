import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalContainerService } from './modal-container.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private modalContainerService = inject(ModalContainerService);

  /**
   * Shows a confirmation dialog and returns an Observable that emits true if confirmed, false if cancelled.
   * @param options - The dialog options (message is required, others are optional)
   * @returns Observable<boolean> - true if confirmed, false if cancelled
   */
  confirm(options: ConfirmDialogOptions | string): Observable<boolean> {
    const config = typeof options === 'string' ? { message: options } : options;

    const modalRef = this.modalContainerService.openComponent(ConfirmDialogComponent, {
      data: {
        title: config.title ?? 'Confirm',
        message: config.message,
        confirmText: config.confirmText ?? 'Confirm',
        cancelText: config.cancelText ?? 'Cancel',
      },
      size: 'small',
      centered: true,
    });

    return modalRef.onClose.pipe(map((result) => result === true));
  }

  /**
   * Shows a delete confirmation dialog with appropriate defaults.
   * @param itemName - Optional name of the item being deleted
   * @returns Observable<boolean> - true if confirmed, false if cancelled
   */
  confirmDelete(itemName?: string): Observable<boolean> {
    const message = itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : 'Are you sure you want to delete this? This action cannot be undone.';

    return this.confirm({
      title: 'Delete',
      message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  }
}
