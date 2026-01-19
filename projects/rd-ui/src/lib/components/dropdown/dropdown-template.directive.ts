import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[rdDropdownOption]',
  standalone: true,
})
export class DropdownOptionTemplateDirective {
  template = inject(TemplateRef);
}

@Directive({
  selector: '[rdDropdownLabel]',
  standalone: true,
})
export class DropdownLabelTemplateDirective {
  template = inject(TemplateRef);
}
