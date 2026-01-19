import { CommonModule, DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  Renderer2,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  DropdownLabelTemplateDirective,
  DropdownOptionTemplateDirective,
} from './dropdown-template.directive';

export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface TriStateOption {
  value: any;
  label: string;
  state: 'unspecified' | 'included' | 'excluded';
  disabled?: boolean;
}

export interface TriStateValue {
  included: any[];
  excluded: any[];
}

export interface DropdownItem {
  label?: string;
  value?: any;
  [key: string]: any;
}

@Component({
  selector: 'rd-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    NgTemplateOutlet,
    DropdownOptionTemplateDirective,
    DropdownLabelTemplateDirective,
  ],
  template: `
    <div
      class="rd-dropdown-container"
      [class.disabled]="disabled()"
      [class.multiple]="multiple()"
      [class.rd-dropdown-sm]="size() === 'sm'"
      [class.compact]="size() === 'compact'"
      [class.rd-dropdown-lg]="size() === 'lg'"
    >
      <div
        class="rd-dropdown-trigger"
        [class.focused]="isOpen()"
        [class.disabled]="disabled()"
        (click)="toggle()"
        #trigger
      >
        <div class="rd-dropdown-value">
          @if (triState()) {
            @if (triStateValue().included.length === 0 && triStateValue().excluded.length === 0) {
              <span class="placeholder">{{ placeholder() }}</span>
            } @else {
              <div class="tri-state-summary">
                @if (triStateValue().included.length > 0) {
                  <span class="included-count">
                    <span class="count-badge">{{ triStateValue().included.length }}</span>
                    <span class="count-text">included</span>
                  </span>
                }
                @if (triStateValue().excluded.length > 0) {
                  <span class="excluded-count">
                    <span class="count-badge">{{ triStateValue().excluded.length }}</span>
                    <span class="count-text">excluded</span>
                  </span>
                }
              </div>
            }
          } @else if (multiple()) {
            @if (selectedItems().length === 0) {
              <span class="placeholder">{{ placeholder() }}</span>
            } @else if (showCount() || selectedItems().length > maxTagsDisplay()) {
              <div class="selected-count">
                <span class="count-badge">{{ selectedItems().length }}</span>
                <span class="count-text">
                  {{ selectedItems().length === 1 ? 'item' : 'items' }} selected
                </span>
              </div>
            } @else {
              <div class="selected-tags">
                @for (item of selectedItems(); track item.value) {
                  <span class="tag">
                    {{ item.label }}
                    <lucide-icon
                      name="x"
                      size="12"
                      (click)="removeItem($event, item)"
                    ></lucide-icon>
                  </span>
                }
              </div>
            }
          } @else {
            @if (labelTemplate() && selectedValue() !== null) {
              <ng-container
                [ngTemplateOutlet]="labelTemplate()!.template"
                [ngTemplateOutletContext]="{
                  $implicit: getSelectedItem(),
                  item: getSelectedItem(),
                }"
              ></ng-container>
            } @else {
              <span [class.placeholder]="!selectedLabel()">
                {{ selectedLabel() || placeholder() }}
              </span>
            }
          }
        </div>
        <lucide-icon
          name="chevron-down"
          size="16"
          class="rd-dropdown-arrow"
          [class.rotated]="isOpen()"
        ></lucide-icon>
      </div>

      @if (isOpen() && appendTo() !== 'body') {
        <div class="rd-dropdown-panel" [style.min-width.px]="minWidth()" #dropdownPanel>
          @if (searchable()) {
            <div class="rd-dropdown-search">
              <lucide-icon name="search" size="16" class="input-icon"></lucide-icon>
              <input
                type="text"
                class="search-input"
                [placeholder]="searchPlaceholder()"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange()"
                (click)="$event.stopPropagation()"
                #searchInput
              />
            </div>
          }
          @if (multiple() && showSelectAll() && filteredOptions().length > 0) {
            <div class="rd-dropdown-select-all">
              <div class="rd-dropdown-item select-all-item" (click)="toggleSelectAll()">
                <input
                  type="checkbox"
                  [checked]="isAllSelected()"
                  [indeterminate]="isIndeterminate()"
                  (click)="$event.stopPropagation(); toggleSelectAll()"
                />
                <span class="select-all-label">{{ selectAllLabel() }}</span>
              </div>
            </div>
          }
          <div class="rd-dropdown-items custom-scrollbar" (scroll)="onScroll($event)">
            @if (triState()) {
              @for (option of filteredTriStateOptions(); track option.value) {
                <div
                  class="rd-dropdown-item tri-state-item"
                  [class.included]="option.state === 'included'"
                  [class.excluded]="option.state === 'excluded'"
                  [class.disabled]="option.disabled"
                  (click)="selectTriStateOption(option)"
                >
                  <div class="tri-state-icon">
                    @if (option.state === 'included') {
                      <lucide-icon name="check" size="14" class="include-icon"></lucide-icon>
                    } @else if (option.state === 'excluded') {
                      <lucide-icon name="x" size="14" class="exclude-icon"></lucide-icon>
                    } @else {
                      <div class="unspecified-icon"></div>
                    }
                  </div>
                  {{ option.label }}
                </div>
              }
            } @else {
              @for (option of filteredOptions(); track option.value) {
                <div
                  class="rd-dropdown-item"
                  [class.selected]="isSelected(option)"
                  [class.disabled]="option.disabled"
                  (click)="selectOption(option)"
                >
                  @if (multiple()) {
                    <input
                      type="checkbox"
                      [checked]="isSelected(option)"
                      [disabled]="option.disabled"
                      (click)="$event.stopPropagation(); selectOption(option)"
                    />
                  }
                  @if (optionTemplate()) {
                    <ng-container
                      [ngTemplateOutlet]="optionTemplate()!.template"
                      [ngTemplateOutletContext]="{
                        $implicit: getOriginalItem(option),
                        item: getOriginalItem(option),
                        index: $index,
                      }"
                    ></ng-container>
                  } @else {
                    {{ option.label }}
                  }
                </div>
              }
            }
            @if (loading()) {
              <div class="rd-dropdown-item rd-dropdown-loading">
                <lucide-icon name="loader-2" size="16" class="spin"></lucide-icon>
                <span>Loading...</span>
              </div>
            }
            @if (filteredOptions().length === 0 && !loading()) {
              <div class="rd-dropdown-item disabled">
                {{ searchTerm() ? 'No matching options' : 'No options available' }}
              </div>
            }
          </div>
          <ng-content select="[slot=custom-content]"></ng-content>
        </div>
      }
    </div>
  `,
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor, OnDestroy {
  // Signal-based inputs
  options = input<DropdownOption[]>([]);
  items = input<any[]>([]);
  bindLabel = input<string>('label');
  bindValue = input<string | null>('value');
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  multiple = input<boolean>(false);
  minWidth = input<number>(200);
  maxTagsDisplay = input<number>(3);
  showCount = input<boolean>(false);
  searchable = input<boolean>(false);
  searchPlaceholder = input<string>('Search...');
  showSelectAll = input<boolean>(false);
  selectAllLabel = input<string>('Select All');
  size = input<'sm' | 'compact' | 'lg' | undefined>(undefined);
  triState = input<boolean>(false);
  loading = input<boolean>(false);
  appendTo = input<'body' | 'self'>('self');

  // Content child templates
  optionTemplate = contentChild(DropdownOptionTemplateDirective);
  labelTemplate = contentChild(DropdownLabelTemplateDirective);

  // Signal-based outputs
  selectionChange = output<any>();
  scrollToEnd = output<void>();
  openChange = output<boolean>();
  searchChange = output<string>();

  // ViewChild as signal
  trigger = viewChild<ElementRef>('trigger');
  searchInput = viewChild<ElementRef>('searchInput');
  dropdownPanel = viewChild<ElementRef>('dropdownPanel');

  // Component state signals
  isOpen = signal(false);
  selectedValue = signal<any>(null);
  selectedLabel = signal<string>('');
  selectedItems = signal<DropdownOption[]>([]);
  searchTerm = signal<string>('');
  triStateOptions = signal<TriStateOption[]>([]);
  triStateValue = signal<TriStateValue>({ included: [], excluded: [] });

  // Computed signals
  processedOptions = computed(() => {
    if (this.options().length > 0) {
      return this.options();
    }

    return this.items().map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item };
      }
      return {
        value: this.bindValue() ? item[this.bindValue()!] : item,
        label: this.bindLabel() ? item[this.bindLabel()] : item.label || item,
        disabled: item.disabled || false,
      };
    });
  });

  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const options = this.processedOptions();

    if (!search || !this.searchable()) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(search));
  });

  filteredTriStateOptions = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const options = this.triStateOptions();

    if (!search || !this.searchable()) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(search));
  });

  isAllSelected = computed(() => {
    const filtered = this.filteredOptions();
    const selected = this.selectedItems();

    if (filtered.length === 0) return false;

    return filtered
      .filter((opt) => !opt.disabled)
      .every((opt) => selected.some((item) => item.value === opt.value));
  });

  isIndeterminate = computed(() => {
    const filtered = this.filteredOptions();
    const selected = this.selectedItems();

    if (filtered.length === 0) return false;

    const enabledOptions = filtered.filter((opt) => !opt.disabled);
    const selectedCount = enabledOptions.filter((opt) =>
      selected.some((item) => item.value === opt.value),
    ).length;

    return selectedCount > 0 && selectedCount < enabledOptions.length;
  });

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private onChange = (_value: any) => {};
  private onTouched = () => {};
  private lastWrittenValue: any = null;

  // Portal-related
  portalContainer: HTMLElement | null = null;
  panelPosition = signal<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private isUpdatingPortal = false;

  constructor() {
    effect(() => {
      const options = this.processedOptions();
      if (options.length > 0 && this.lastWrittenValue !== null) {
        this.writeValue(this.lastWrittenValue);
      }
    });

    effect(() => {
      const options = this.processedOptions();
      if (this.triState() && options.length > 0) {
        const currentTriStateValue = this.triStateValue();
        const triStateOptions = options.map((opt) => {
          let state: 'unspecified' | 'included' | 'excluded' = 'unspecified';
          if (currentTriStateValue.included.includes(opt.value)) {
            state = 'included';
          } else if (currentTriStateValue.excluded.includes(opt.value)) {
            state = 'excluded';
          }
          return {
            value: opt.value,
            label: opt.label,
            state,
            disabled: opt.disabled,
          };
        });
        this.triStateOptions.set(triStateOptions);
      }
    });

    effect(() => {
      if (this.isOpen() && this.searchable()) {
        setTimeout(() => {
          const input = this.searchInput();
          if (input) {
            input.nativeElement.focus();
          }
        }, 50);
      } else {
        this.searchTerm.set('');
      }
    });

    // Update portal content when items or loading state changes
    effect(() => {
      // Track these signals to trigger updates
      const options = this.processedOptions();
      const loading = this.loading();
      const filtered = this.filteredOptions();

      // Only update if portal is active and not already updating
      if (this.portalContainer && this.isOpen() && this.appendTo() === 'body' && !this.isUpdatingPortal) {
        this.isUpdatingPortal = true;
        // Use setTimeout to batch updates and avoid recursive effect triggers
        setTimeout(() => {
          if (this.portalContainer) {
            this.updatePortalContent();
          }
          this.isUpdatingPortal = false;
        }, 0);
      }
    });
  }

  isSelected(option: DropdownOption): boolean {
    if (this.multiple()) {
      return this.selectedItems().some((item) => item.value === option.value);
    }
    return this.selectedValue() === option.value;
  }

  toggle() {
    if (this.disabled()) return;

    const newState = !this.isOpen();
    this.isOpen.set(newState);
    this.openChange.emit(newState);

    if (newState) {
      this.onTouched();
      if (this.appendTo() === 'body') {
        // Create portal panel after a tick to allow position calculation
        setTimeout(() => {
          this.createPortalPanel();
          this.updatePanelPosition();
          this.setupPortalListeners();
        }, 0);
      }
    } else {
      this.destroyPortalPanel();
      this.removePortalListeners();
    }
  }

  onSearchChange() {
    this.searchChange.emit(this.searchTerm());
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const threshold = 50;
    const position = target.scrollTop + target.clientHeight;
    const height = target.scrollHeight;

    // Only emit if there's actually scrollable content and we're near the bottom
    if (height > target.clientHeight && position >= height - threshold) {
      this.scrollToEnd.emit();
    }
  }

  getOriginalItem(option: DropdownOption): any {
    const items = this.items();
    const bindValue = this.bindValue();

    if (items.length > 0) {
      if (bindValue) {
        return items.find((item) => item[bindValue] === option.value) || option;
      }
      return items.find((item) => item === option.value) || option;
    }
    return option;
  }

  getSelectedItem(): any {
    const value = this.selectedValue();
    const items = this.items();
    const bindValue = this.bindValue();

    if (items.length > 0) {
      if (bindValue) {
        return items.find((item) => item[bindValue] === value);
      }
      return items.find((item) => item === value);
    }
    return value;
  }

  toggleSelectAll() {
    if (!this.multiple()) return;

    const filtered = this.filteredOptions().filter((opt) => !opt.disabled);
    const selected = this.selectedItems();
    const isAllSelected = this.isAllSelected();

    if (isAllSelected) {
      const valuesToRemove = filtered.map((opt) => opt.value);
      const newItems = selected.filter((item) => !valuesToRemove.includes(item.value));
      this.selectedItems.set(newItems);
      const values = newItems.map((item) => item.value);
      this.onChange(values);
      this.selectionChange.emit(values);
    } else {
      const existingValues = selected.map((item) => item.value);
      const newOptions = filtered.filter((opt) => !existingValues.includes(opt.value));
      const newItems = [...selected, ...newOptions];
      this.selectedItems.set(newItems);
      const values = newItems.map((item) => item.value);
      this.onChange(values);
      this.selectionChange.emit(values);
    }
  }

  selectOption(option: DropdownOption) {
    if (option.disabled) return;

    if (this.multiple()) {
      const currentItems = this.selectedItems();
      const isCurrentlySelected = currentItems.some((item) => item.value === option.value);

      if (isCurrentlySelected) {
        const newItems = currentItems.filter((item) => item.value !== option.value);
        this.selectedItems.set(newItems);
        const values = newItems.map((item) => item.value);
        this.onChange(values);
        this.selectionChange.emit(values);
      } else {
        const newItems = [...currentItems, option];
        this.selectedItems.set(newItems);
        const values = newItems.map((item) => item.value);
        this.onChange(values);
        this.selectionChange.emit(values);
      }
    } else {
      this.selectedValue.set(option.value);
      this.selectedLabel.set(option.label);
      this.closePanel();

      this.onChange(option.value);
      this.selectionChange.emit(option.value);
    }
  }

  selectTriStateOption(option: TriStateOption) {
    if (option.disabled) return;

    const currentOptions = this.triStateOptions();
    const updatedOptions = currentOptions.map((opt) => {
      if (opt.value === option.value) {
        let newState: 'unspecified' | 'included' | 'excluded' = 'unspecified';
        switch (opt.state) {
          case 'unspecified':
            newState = 'included';
            break;
          case 'included':
            newState = 'excluded';
            break;
          case 'excluded':
            newState = 'unspecified';
            break;
        }
        return { ...opt, state: newState };
      }
      return opt;
    });

    this.triStateOptions.set(updatedOptions);

    const included = updatedOptions
      .filter((opt) => opt.state === 'included')
      .map((opt) => opt.value);
    const excluded = updatedOptions
      .filter((opt) => opt.state === 'excluded')
      .map((opt) => opt.value);
    const triStateValue: TriStateValue = { included, excluded };

    this.triStateValue.set(triStateValue);
    this.onChange(triStateValue);
    this.selectionChange.emit(triStateValue);
  }

  removeItem(event: Event, item: DropdownOption) {
    event.stopPropagation();
    if (this.disabled()) return;

    const currentItems = this.selectedItems();
    const newItems = currentItems.filter((i) => i.value !== item.value);
    this.selectedItems.set(newItems);
    const values = newItems.map((i) => i.value);
    this.onChange(values);
    this.selectionChange.emit(values);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInsideDropdown = this.elementRef.nativeElement.contains(event.target);
    const clickedInsidePortal = this.portalContainer?.contains(event.target as Node);

    if (!clickedInsideDropdown && !clickedInsidePortal) {
      if (this.isOpen()) {
        this.closePanel();
      }
    }
  }

  ngOnDestroy() {
    this.destroyPortalPanel();
    this.removePortalListeners();
  }

  private updatePanelPosition() {
    const triggerEl = this.trigger()?.nativeElement;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    this.panelPosition.set({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, this.minWidth()),
    });

    if (this.portalContainer) {
      this.portalContainer.style.top = `${rect.bottom + 4}px`;
      this.portalContainer.style.left = `${rect.left}px`;
      this.portalContainer.style.minWidth = `${Math.max(rect.width, this.minWidth())}px`;
    }
  }

  private createPortalPanel() {
    if (this.portalContainer) return;

    // Create portal container
    const container = this.renderer.createElement('div') as HTMLElement;
    container.className = 'rd-dropdown-panel rd-dropdown-portal';
    this.portalContainer = container;

    // Build panel content
    this.updatePortalContent();

    // Append to body
    this.document.body.appendChild(container);
  }

  private updatePortalContent() {
    if (!this.portalContainer) return;

    let html = '';

    // Search section
    if (this.searchable()) {
      html += `
        <div class="rd-dropdown-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input type="text" class="search-input" placeholder="${this.searchPlaceholder()}" />
        </div>
      `;
    }

    // Select all section (for multiple mode)
    if (this.multiple() && this.showSelectAll() && this.filteredOptions().length > 0) {
      const isAllSelected = this.isAllSelected();
      html += `
        <div class="rd-dropdown-select-all">
          <div class="rd-dropdown-item select-all-item" data-action="select-all">
            <input type="checkbox" ${isAllSelected ? 'checked' : ''} />
            <span class="select-all-label">${this.selectAllLabel()}</span>
          </div>
        </div>
      `;
    }

    // Items section
    html += '<div class="rd-dropdown-items custom-scrollbar">';

    if (this.triState()) {
      this.filteredTriStateOptions().forEach((option, index) => {
        const stateClass =
          option.state === 'included' ? 'included' : option.state === 'excluded' ? 'excluded' : '';
        const disabledClass = option.disabled ? 'disabled' : '';
        let icon = '';
        if (option.state === 'included') {
          icon =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="include-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (option.state === 'excluded') {
          icon =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="exclude-icon"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
        } else {
          icon = '<div class="unspecified-icon"></div>';
        }
        html += `
          <div class="rd-dropdown-item tri-state-item ${stateClass} ${disabledClass}" data-index="${index}" data-value="${this.escapeHtml(String(option.value))}">
            <div class="tri-state-icon">${icon}</div>
            ${this.escapeHtml(option.label)}
          </div>
        `;
      });
    } else {
      this.filteredOptions().forEach((option, index) => {
        const selectedClass = this.isSelected(option) ? 'selected' : '';
        const disabledClass = option.disabled ? 'disabled' : '';
        let checkbox = '';
        if (this.multiple()) {
          checkbox = `<input type="checkbox" ${this.isSelected(option) ? 'checked' : ''} ${option.disabled ? 'disabled' : ''} />`;
        }

        // Get the original item for custom template rendering
        const originalItem = this.getOriginalItem(option);
        let label = this.escapeHtml(option.label);

        // If there's a custom option template, we can't easily render it in plain HTML
        // So we'll just use the label
        if (this.optionTemplate()) {
          // For custom templates with items like icons, show label only in portal
          const bindLabel = this.bindLabel();
          if (originalItem && bindLabel && originalItem[bindLabel]) {
            label = this.escapeHtml(originalItem[bindLabel]);
          }
          // If the item has a url property (for icon items), show an image
          if (originalItem && originalItem.url) {
            label = `<div class="custom-option"><img src="${this.escapeHtml(originalItem.url)}" alt="" style="max-width:24px;max-height:24px;object-fit:contain;" /><span>${this.escapeHtml(originalItem.name || option.label)}</span></div>`;
          }
        }

        html += `
          <div class="rd-dropdown-item ${selectedClass} ${disabledClass}" data-index="${index}" data-value="${this.escapeHtml(String(option.value))}">
            ${checkbox}
            ${label}
          </div>
        `;
      });
    }

    // Loading state
    if (this.loading()) {
      html += `
        <div class="rd-dropdown-item rd-dropdown-loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Loading...</span>
        </div>
      `;
    }

    // No options message
    if (this.filteredOptions().length === 0 && !this.loading()) {
      html += `<div class="rd-dropdown-item disabled">${this.searchTerm() ? 'No matching options' : 'No options available'}</div>`;
    }

    html += '</div>';

    this.portalContainer.innerHTML = html;

    // Setup event listeners
    this.setupPortalEventListeners();
  }

  private setupPortalEventListeners() {
    if (!this.portalContainer) return;

    // Search input
    const searchInput = this.portalContainer.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = this.searchTerm();
      searchInput.addEventListener('input', (e) => {
        this.searchTerm.set((e.target as HTMLInputElement).value);
        this.onSearchChange();
        this.updatePortalContent();
      });
      searchInput.addEventListener('click', (e) => e.stopPropagation());
      // Focus search input
      setTimeout(() => searchInput.focus(), 50);
    }

    // Select all
    const selectAllItem = this.portalContainer.querySelector('[data-action="select-all"]');
    if (selectAllItem) {
      selectAllItem.addEventListener('click', () => {
        this.toggleSelectAll();
        this.updatePortalContent();
      });
    }

    // Items scroll
    const itemsContainer = this.portalContainer.querySelector('.rd-dropdown-items');
    if (itemsContainer) {
      itemsContainer.addEventListener('scroll', (e) => this.onScroll(e));
    }

    // Option items
    const optionItems = this.portalContainer.querySelectorAll(
      '.rd-dropdown-item:not(.select-all-item):not(.rd-dropdown-loading):not(.disabled)',
    );
    optionItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const index = parseInt(item.getAttribute('data-index') || '0', 10);

        if (this.triState()) {
          const option = this.filteredTriStateOptions()[index];
          if (option && !option.disabled) {
            this.selectTriStateOption(option);
            this.updatePortalContent();
          }
        } else {
          const option = this.filteredOptions()[index];
          if (option && !option.disabled) {
            this.selectOption(option);
            if (!this.multiple()) {
              // Single select closes the dropdown
              return;
            }
            this.updatePortalContent();
          }
        }
      });
    });
  }

  private escapeHtml(str: string): string {
    const div = this.document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private destroyPortalPanel() {
    if (this.portalContainer) {
      this.portalContainer.remove();
      this.portalContainer = null;
    }
  }

  private setupPortalListeners() {
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.updatePanelPosition();
    });
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updatePanelPosition();
    });
  }

  private removePortalListeners() {
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      this.resizeListener();
      this.resizeListener = null;
    }
  }

  private closePanel() {
    this.isOpen.set(false);
    this.openChange.emit(false);
    this.destroyPortalPanel();
    this.removePortalListeners();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.lastWrittenValue = value;

    if (this.triState()) {
      if (value && typeof value === 'object' && 'included' in value && 'excluded' in value) {
        const triStateValue = value as TriStateValue;
        this.triStateValue.set(triStateValue);

        const options = this.processedOptions();
        const triStateOptions = options.map((opt) => {
          let state: 'unspecified' | 'included' | 'excluded' = 'unspecified';
          if (triStateValue.included.includes(opt.value)) {
            state = 'included';
          } else if (triStateValue.excluded.includes(opt.value)) {
            state = 'excluded';
          }
          return {
            value: opt.value,
            label: opt.label,
            state,
            disabled: opt.disabled,
          };
        });
        this.triStateOptions.set(triStateOptions);
      } else {
        this.triStateValue.set({ included: [], excluded: [] });
        const options = this.processedOptions();
        const triStateOptions = options.map((opt) => ({
          value: opt.value,
          label: opt.label,
          state: 'unspecified' as const,
          disabled: opt.disabled,
        }));
        this.triStateOptions.set(triStateOptions);
      }
    } else if (this.multiple()) {
      const values = Array.isArray(value) ? value : [];
      const options = this.processedOptions();

      if (options.length === 0 && values.length > 0) {
        const tempItems = values.map((v) => ({ value: v, label: v }));
        this.selectedItems.set(tempItems);
      } else {
        const selectedItems = values
          .map((v) => options.find((opt) => opt.value === v) || { value: v, label: v })
          .filter(Boolean) as DropdownOption[];
        this.selectedItems.set(selectedItems);
      }
    } else {
      this.selectedValue.set(value);
      const option = this.processedOptions().find((opt) => opt.value === value);
      this.selectedLabel.set(option?.label || value || '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Note: With signal inputs, disabled state is managed by parent component
  }
}
