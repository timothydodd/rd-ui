import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[rdSelectOption]',
  standalone: true,
})
export class SelectOptionTemplateDirective {
  template = inject(TemplateRef);
}

@Directive({
  selector: '[rdSelectLabel]',
  standalone: true,
})
export class SelectLabelTemplateDirective {
  template = inject(TemplateRef);
}
