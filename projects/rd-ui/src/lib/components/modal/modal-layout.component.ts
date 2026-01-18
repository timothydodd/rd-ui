import { ChangeDetectionStrategy, Component, ElementRef, inject, Injector, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ModalContainerService } from './modal-container.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'rd-modal-layout',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="rd-modal-header">
      <ng-content select="[slot=header]">
        @if (title()) {
          <h4 class="rd-modal-title">{{ title() }}</h4>
        }
      </ng-content>

      <button class="rd-close" aria-label="Close" (click)="close()">
        <lucide-icon name="x" size="20"></lucide-icon>
      </button>
    </div>

    <div class="rd-modal-body">
      <ng-content select="[slot=body]"></ng-content>
    </div>

    <div class="rd-modal-footer">
      <ng-content select="[slot=footer]"></ng-content>
    </div>
  `,
  styleUrl: './modal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutComponent {
  modalContainerService = inject(ModalContainerService);
  injector = inject(Injector);
  title = input<string | null>(null);
  elementRef = inject(ElementRef);
  modalComponent = inject(ModalComponent);

  close() {
    this.modalComponent.close();
  }
}
