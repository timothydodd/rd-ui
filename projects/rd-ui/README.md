# rd-ui

Shared Angular UI Components Library - a collection of generic, themeable UI components for Angular 21+ applications.

## Components

| Component | Selector | Description |
|-----------|----------|-------------|
| Dropdown | `rd-dropdown` | Single/multi-select dropdown with search, tri-state, and select-all features |
| Modal | `rd-modal` | Service-based modal with component outlet pattern |
| Modal Layout | `rd-modal-layout` | Modal layout with header/body/footer slots |
| Toast | `rd-toast` | Animated toast notifications with auto-dismiss |
| Tabs | `rd-tabs` / `rd-tab` | Signal-based tabs with ContentChildren pattern |
| Input Switch | `rd-input-switch` | Toggle switch with ControlValueAccessor |
| Checkbox | `rd-checkbox` | Custom SVG checkbox with ControlValueAccessor |
| Skeleton | `rd-skeleton` | Loading placeholder with shape variants |
| Spinner | `rd-spinner` | Animated loading spinner |
| Progress Bar | `rd-progress-bar` | Percentage-based progress display |

## Installation

### As Git Submodule

```bash
git submodule add <rd-ui-repo-url> src/rd-ui
```

### Configure tsconfig.json

Add the library path to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "rd-ui": ["src/rd-ui/projects/rd-ui/src/public-api.ts"]
    }
  }
}
```

## Required Peer Dependencies

Your project must have these dependencies installed:

- `@angular/core` ^21.0.0
- `@angular/common` ^21.0.0
- `@angular/forms` ^21.0.0
- `lucide-angular` ^0.555.0

## Theming

All components use CSS variables for theming. Define these in your app's global styles:

```scss
:root {
  // Core colors
  --rd-background: #282a36;
  --rd-foreground: #f8f8f2;
  --rd-primary: #bd93f9;
  --rd-secondary: #6272a4;
  --rd-success: #50fa7b;
  --rd-danger: #ff5555;
  --rd-warning: #f1fa8c;
  --rd-info: #8be9fd;

  // Surface colors
  --rd-surface: #343746;
  --rd-surface-variant: #424450;
  --rd-surface-container: #44475a;
  --rd-surface-container-high: #4d5066;

  // Text colors
  --rd-on-surface: #f8f8f2;
  --rd-on-surface-variant: #e0e0e0;
  --rd-on-surface-muted: #a0a0a0;
  --rd-on-primary: #1a1a1a;

  // Component-specific
  --rd-input-bg: #424450;
  --rd-border-color: #44475a;
  --rd-focus-ring: rgba(189, 147, 249, 0.3);
  --rd-modal-bg: #343746;
  --rd-dropdown-bg: #343746;
  --rd-shadow-color: rgba(0, 0, 0, 0.3);

  // Spacing & sizing
  --rd-border-radius: 8px;
  --rd-border-radius-sm: 4px;
  --rd-border-radius-lg: 12px;
}
```

### Theme Presets

Import a theme preset for quick setup:

```scss
// Dark theme (Dracula-inspired)
@import 'rd-ui/styles/themes/dark';

// Light theme
@import 'rd-ui/styles/themes/light';
```

## Usage Examples

### Dropdown

```typescript
import { DropdownComponent, DropdownOption } from 'rd-ui';

@Component({
  imports: [DropdownComponent],
  template: `
    <rd-dropdown
      [options]="options"
      [placeholder]="'Select an option'"
      [searchable]="true"
      [multiple]="true"
      [(ngModel)]="selectedValues"
    ></rd-dropdown>
  `
})
export class MyComponent {
  options: DropdownOption[] = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
  ];
  selectedValues: any[] = [];
}
```

### Modal

```typescript
import { ModalContainerService, ModalLayoutComponent } from 'rd-ui';

@Component({
  imports: [ModalLayoutComponent],
  template: `
    <rd-modal-layout [title]="'My Modal'">
      <div slot="body">Modal content here</div>
      <div slot="footer">
        <button (click)="close()">Close</button>
      </div>
    </rd-modal-layout>
  `
})
export class MyModalComponent {
  // Modal content component
}

// Opening the modal
@Component({...})
export class AppComponent {
  modalService = inject(ModalContainerService);

  openModal() {
    const ref = this.modalService.openComponent(MyModalComponent);
    ref.onClose.subscribe(result => {
      console.log('Modal closed with:', result);
    });
  }
}
```

### Toast

```typescript
import { ToastComponent, ToastService } from 'rd-ui';

// Add ToastComponent to your app root template
@Component({
  imports: [ToastComponent],
  template: `
    <rd-toast></rd-toast>
    <!-- Your app content -->
  `
})
export class AppComponent {}

// Use ToastService in any component
@Component({...})
export class MyComponent {
  toastService = inject(ToastService);

  showNotification() {
    this.toastService.success('Operation completed!', 'Success');
    this.toastService.error('Something went wrong', 'Error');
    this.toastService.info('FYI...', 'Info');
    this.toastService.warning('Be careful!', 'Warning');
  }
}
```

### Tabs

```typescript
import { TabsComponent, TabComponent } from 'rd-ui';

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <rd-tabs>
      <rd-tab [id]="1" [title]="'Tab 1'">
        Content for tab 1
      </rd-tab>
      <rd-tab [id]="2" [title]="'Tab 2'">
        Content for tab 2
      </rd-tab>
    </rd-tabs>
  `
})
export class MyComponent {}
```

### Input Switch

```typescript
import { InputSwitchComponent } from 'rd-ui';

@Component({
  imports: [InputSwitchComponent],
  template: `
    <rd-input-switch
      [(ngModel)]="isEnabled"
      [trueValue]="'yes'"
      [falseValue]="'no'"
    ></rd-input-switch>
  `
})
export class MyComponent {
  isEnabled = 'no';
}
```

### Checkbox

```typescript
import { CheckboxComponent } from 'rd-ui';

@Component({
  imports: [CheckboxComponent],
  template: `
    <rd-checkbox
      [label]="'Accept terms'"
      [(ngModel)]="accepted"
    ></rd-checkbox>
  `
})
export class MyComponent {
  accepted = false;
}
```

### Skeleton

```typescript
import { SkeletonComponent } from 'rd-ui';

@Component({
  imports: [SkeletonComponent],
  template: `
    <rd-skeleton [width]="'200px'" [height]="'20px'"></rd-skeleton>
    <rd-skeleton [shape]="'circle'" [size]="'50px'"></rd-skeleton>
  `
})
export class MyComponent {}
```

### Spinner

```typescript
import { SpinnerComponent } from 'rd-ui';

@Component({
  imports: [SpinnerComponent],
  template: `
    @if (loading) {
      <rd-spinner>Loading...</rd-spinner>
    }
  `
})
export class MyComponent {
  loading = true;
}
```

### Progress Bar

```typescript
import { ProgressBarComponent } from 'rd-ui';

@Component({
  imports: [ProgressBarComponent],
  template: `
    <rd-progress-bar [progress]="75"></rd-progress-bar>
  `
})
export class MyComponent {}
```

## Lucide Icons Setup

The library uses Lucide icons. Configure them in your `app.config.ts`:

```typescript
import { LucideAngularModule, X, Check, ChevronDown, Search } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      LucideAngularModule.pick({ X, Check, ChevronDown, Search })
    ),
  ],
};
```

Required icons for rd-ui components:
- `X` - Close buttons, remove tags
- `Check` - Checkmarks, tri-state included
- `ChevronDown` - Dropdown arrow
- `Search` - Search input icon

## License

MIT
