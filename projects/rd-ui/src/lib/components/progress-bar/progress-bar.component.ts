import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rd-progress-bar',
  standalone: true,
  imports: [],
  template: `
    @if (progress() !== null) {
      <div class="rd-progress-bar" [style.width.%]="progress()"></div>
    }
  `,
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  /**
   * Progress percentage (0 to 100)
   */
  progress = input<number | null>(0);
}
