import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'rd-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: `
    <div class="rd-checkbox-wrapper">
      <label class="rd-checkbox">
        <input
          class="rd-checkbox-trigger visuallyhidden"
          type="checkbox"
          [disabled]="disabled()"
          [(ngModel)]="checked"
          (change)="change($event)"
        />
        <span class="rd-checkbox-symbol">
          <svg
            aria-hidden="true"
            class="icon-checkbox"
            width="28px"
            height="28px"
            viewBox="0 0 28 28"
            version="1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 14l8 7L24 7"></path>
          </svg>
        </span>
        @if (label()) {
          <p class="rd-checkbox-text">{{ label() }}</p>
        }
      </label>
    </div>
  `,
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  checked = false;
  disabled = input(false);
  label = input<string>('');

  checkedChange = output<boolean>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.checked = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  change(_e: any) {
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
    this.onTouched();
  }
}
