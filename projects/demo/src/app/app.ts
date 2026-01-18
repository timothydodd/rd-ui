import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  DropdownComponent,
  DropdownOption,
  ModalContainerService,
  ToastComponent,
  ToastService,
  TabsComponent,
  TabComponent,
  InputSwitchComponent,
  CheckboxComponent,
  SkeletonComponent,
  SpinnerComponent,
  ProgressBarComponent,
} from 'rd-ui';
import { DemoModalComponent } from './demo-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    JsonPipe,
    DropdownComponent,
    ToastComponent,
    TabsComponent,
    TabComponent,
    InputSwitchComponent,
    CheckboxComponent,
    SkeletonComponent,
    SpinnerComponent,
    ProgressBarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  toastService = inject(ToastService);
  modalService = inject(ModalContainerService);

  // Dropdown state
  dropdownOptions: DropdownOption[] = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
    { value: 4, label: 'Option 4 (Disabled)', disabled: true },
    { value: 5, label: 'Option 5' },
  ];
  singleValue = signal<number | null>(null);
  multiValue = signal<number[]>([]);
  triStateValue = signal<{ included: number[]; excluded: number[] }>({ included: [], excluded: [] });

  // Input switch state
  switchValue = signal(false);
  customSwitchValue = signal<string>('no');

  // Checkbox state
  checkboxValue = signal(false);

  // Progress bar state
  progressValue = signal(45);

  // Spinner state
  showSpinner = signal(false);

  // Toast methods
  showSuccess() {
    this.toastService.success('Operation completed successfully!', 'Success');
  }

  showError() {
    this.toastService.error('Something went wrong. Please try again.', 'Error');
  }

  showInfo() {
    this.toastService.info('Here is some useful information.', 'Info');
  }

  showWarning() {
    this.toastService.warning('Please review before proceeding.', 'Warning');
  }

  // Modal methods
  openModal() {
    const ref = this.modalService.openComponent(DemoModalComponent);
    ref.onClose.subscribe((result) => {
      if (result) {
        this.toastService.success(`Modal closed with: ${result}`, 'Modal Result');
      }
    });
  }

  // Spinner methods
  toggleSpinner() {
    this.showSpinner.set(true);
    setTimeout(() => this.showSpinner.set(false), 3000);
  }

  // Progress methods
  incrementProgress() {
    const current = this.progressValue();
    this.progressValue.set(Math.min(100, current + 10));
  }

  decrementProgress() {
    const current = this.progressValue();
    this.progressValue.set(Math.max(0, current - 10));
  }
}
