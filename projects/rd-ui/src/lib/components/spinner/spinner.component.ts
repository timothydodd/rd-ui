import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rd-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rd-spinner-container" [class.fullscreen]="fullscreen()" [class.overlay]="overlay()">
      <div class="rd-loader"></div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  /**
   * Whether to display the spinner as fullscreen overlay
   */
  fullscreen = input<boolean>(true);

  /**
   * Whether to show overlay background
   */
  overlay = input<boolean>(true);
}
