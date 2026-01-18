import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';

export const INPUTSWITCH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSwitchComponent),
  multi: true,
};

export interface InputSwitchChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

@Component({
  selector: 'rd-input-switch',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <button
      [ngClass]="{
        'rd-input-switch': true,
        'rd-input-switch-checked': checked(),
        'rd-disabled': disabled(),
        'rd-focus': focused,
      }"
      [ngStyle]="style()"
      [class]="styleClass() ?? ''"
      (click)="onClick($event)"
    >
      <div class="rd-hidden-accessible">
        <input
          #input
          [attr.id]="inputId()"
          type="checkbox"
          role="switch"
          [checked]="checked()"
          [disabled]="disabled()"
          [attr.aria-checked]="checked()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.aria-label]="ariaLabel()"
          [attr.name]="name()"
          [attr.tabindex]="tabindex()"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />
      </div>
      <span class="rd-input-switch-slider"></span>
    </button>
  `,
  providers: [INPUTSWITCH_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './input-switch.component.scss',
  host: {
    class: 'rd-element',
  },
})
export class InputSwitchComponent {
  style = input<{ [klass: string]: any } | null>();
  styleClass = input<string>();
  tabindex = input<number, number | string>(numberAttribute(undefined), { transform: numberAttribute });
  inputId = input<string>();
  name = input<string>();
  disabled = model<boolean>(false);
  readonly = input<boolean>(false);
  trueValue = input<any>(true);
  falseValue = input<any>(false);
  ariaLabel = input<string>();
  ariaLabelledBy = input<string>();
  autofocus = input<boolean, boolean | string>(booleanAttribute(undefined), { transform: booleanAttribute });

  onChange = output<InputSwitchChangeEvent>();

  input = viewChild<ElementRef>('input');

  modelValue: any = false;
  focused: boolean = false;

  onModelChange: (v: any) => void = () => {};
  onModelTouched: (v: any) => void = () => {};

  onClick(event: Event) {
    if (!this.disabled() && !this.readonly()) {
      this.modelValue = this.checked() ? this.falseValue() : this.trueValue();

      this.onModelChange(this.modelValue);
      this.onChange.emit({
        originalEvent: event,
        checked: this.modelValue,
      });

      this.input()?.nativeElement.focus();
    }
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.onModelTouched(null);
  }

  writeValue(value: any): void {
    this.modelValue = value;
  }

  registerOnChange(fn: () => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled.set(val);
  }

  checked() {
    return this.modelValue === this.trueValue();
  }
}
