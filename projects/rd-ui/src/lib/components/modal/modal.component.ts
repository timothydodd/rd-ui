import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, Type } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ModalContainerService } from './modal-container.service';

@Component({
  selector: 'rd-modal',
  standalone: true,
  imports: [NgComponentOutlet, LucideAngularModule],
  template: `
    <div
      class="rd-backdrop"
      animate.enter="rd-backdrop-enter"
      animate.leave="rd-backdrop-leave"
    ></div>
    <div class="rd-modal-wrapper" (click)="onBackdropClick($event)">
      <div class="rd-modal-container">
        <div
          class="rd-modal"
          animate.enter="rd-modal-enter"
          animate.leave="rd-modal-leave"
          (click)="$event.stopPropagation()"
        >
          <ng-container [ngComponentOutlet]="childType()"></ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  modalContainerService = inject(ModalContainerService);
  modalId?: string;
  config?: { data?: any };

  closeOnBackdropClick = true;
  childType = signal<Type<any> | null>(null);

  close() {
    if (this.modalId) this.modalContainerService.close(this.modalId);
  }

  onBackdropClick(event: Event) {
    if (this.closeOnBackdropClick && event.target === event.currentTarget) {
      this.close();
    }
  }
}
