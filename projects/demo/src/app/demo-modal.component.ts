import { Component, inject } from '@angular/core';
import { ModalLayoutComponent, ModalComponent } from 'rd-ui';

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: [ModalLayoutComponent],
  template: `
    <rd-modal-layout [title]="'Demo Modal'">
      <div slot="body">
        <p>This is a demo modal component showcasing the rd-ui modal system.</p>
        <p>The modal uses:</p>
        <ul>
          <li>Service-based opening via <code>ModalContainerService</code></li>
          <li>Component outlet pattern for dynamic content</li>
          <li>Slot-based layout with header, body, and footer sections</li>
          <li>Backdrop click to close (configurable)</li>
          <li>Fade animations</li>
        </ul>
      </div>
      <div slot="footer">
        <button class="btn btn-secondary" (click)="close()">Cancel</button>
        <button class="btn btn-primary" (click)="confirm()">Confirm</button>
      </div>
    </rd-modal-layout>
  `,
  styles: [`
    ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    code {
      background: var(--rd-surface-container);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: var(--rd-border-radius-sm);
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s ease;
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
  `],
})
export class DemoModalComponent {
  private modalComponent = inject(ModalComponent);

  close() {
    this.modalComponent.close();
  }

  confirm() {
    this.modalComponent.modalContainerService.close(this.modalComponent.modalId!, 'confirmed');
  }
}
