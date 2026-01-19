import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  DropdownComponent,
  DropdownOption,
  DropdownOptionTemplateDirective,
  DropdownLabelTemplateDirective,
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
    DropdownOptionTemplateDirective,
    DropdownLabelTemplateDirective,
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

  // Custom template dropdown state
  iconItems = [
    { id: 1, name: 'Home', icon: '🏠', color: '#4CAF50' },
    { id: 2, name: 'Settings', icon: '⚙️', color: '#2196F3' },
    { id: 3, name: 'Profile', icon: '👤', color: '#9C27B0' },
    { id: 4, name: 'Messages', icon: '💬', color: '#FF9800' },
    { id: 5, name: 'Calendar', icon: '📅', color: '#E91E63' },
  ];
  selectedIconItem = signal<any>(null);

  // Loading/pagination demo state
  paginatedItems = signal<any[]>([]);
  paginationLoading = signal(false);
  currentPage = signal(1);
  selectedPaginatedItem = signal<any>(null);

  // Event tracking
  lastOpenChange = signal<boolean | null>(null);
  lastSearchTerm = signal<string>('');
  scrollEndCount = signal(0);

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

  // Dropdown event handlers
  onOpenChange(isOpen: boolean) {
    this.lastOpenChange.set(isOpen);
    if (isOpen && this.paginatedItems().length === 0) {
      this.loadInitialItems();
    }
  }

  onSearchChange(term: string) {
    this.lastSearchTerm.set(term);
  }

  onScrollToEnd() {
    this.scrollEndCount.update(c => c + 1);
    this.loadMoreItems();
  }

  // Simulated pagination
  loadInitialItems() {
    this.paginationLoading.set(true);
    this.currentPage.set(1);

    // Simulate API delay
    setTimeout(() => {
      const items = this.generateItems(1, 10);
      this.paginatedItems.set(items);
      this.paginationLoading.set(false);
    }, 500);
  }

  loadMoreItems() {
    if (this.paginationLoading()) return;

    const page = this.currentPage();
    if (page >= 5) return; // Max 5 pages

    this.paginationLoading.set(true);

    setTimeout(() => {
      const newPage = page + 1;
      const newItems = this.generateItems(newPage, 10);
      this.paginatedItems.update(items => [...items, ...newItems]);
      this.currentPage.set(newPage);
      this.paginationLoading.set(false);
    }, 800);
  }

  generateItems(page: number, count: number) {
    const start = (page - 1) * count + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: start + i,
      name: `Item ${start + i}`,
      description: `Description for item ${start + i}`,
    }));
  }

  resetPagination() {
    this.paginatedItems.set([]);
    this.currentPage.set(1);
    this.scrollEndCount.set(0);
    this.selectedPaginatedItem.set(null);
  }
}
