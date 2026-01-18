import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rd-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngClass]="containerClass()" [class]="styleClass()!" [ngStyle]="containerStyle()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  /**
   * Class of the element.
   */
  styleClass = input<string | undefined>();

  /**
   * Inline style of the element.
   */
  style = input<{ [klass: string]: any } | null | undefined>();

  /**
   * Shape of the element.
   */
  shape = input<string>('rectangle');

  /**
   * Type of the animation.
   */
  animation = input<string>('wave');

  /**
   * Border radius of the element, defaults to value from theme.
   */
  borderRadius = input<string | undefined>();

  /**
   * Size of the Circle or Square.
   */
  size = input<string | undefined>();

  /**
   * Width of the element.
   */
  width = input<string>('100%');

  /**
   * Height of the element.
   */
  height = input<string>('1rem');

  containerClass = computed(() => {
    return {
      'rd-skeleton': true,
      'rd-skeleton-circle': this.shape() === 'circle',
      'rd-skeleton-none': this.animation() === 'none',
    };
  });

  containerStyle = computed(() => {
    let wh = {};
    if (this.width() && this.height()) {
      wh = { width: this.width(), height: this.height() };
    }

    if (this.size()) {
      return { ...this.style(), ...wh, width: this.size(), height: this.size(), borderRadius: this.borderRadius() };
    } else {
      return { ...this.style(), ...wh, borderRadius: this.borderRadius() };
    }
  });
}
