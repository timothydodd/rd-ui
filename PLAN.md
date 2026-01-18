# Shared Angular UI Library Consolidation Plan

## Implementation Steps

### Phase 1: Library Setup
- [x] Create new git repository `rd-ui`
- [x] Initialize Angular workspace with library (`ng new rd-ui --no-create-application`, `ng generate library rd-ui`)
- [x] Configure `ng-package.json` for standalone components
- [x] Set up SCSS processing in `angular.json`

### Phase 2: Extract Core Components
- [x] **Dropdown** (from LogMk2) - selector `rd-dropdown`, CSS variables
- [x] **Modal System** (from RoboDash/mailvoid) - `rd-modal`, `rd-modal-layout`, service-based
- [x] **Toast** (from FileLink) - `rd-toast`, CSS-based animations

### Phase 3: Extract Remaining Components
- [x] **Tabs** - from RoboDash
- [x] **Input Switch** - from RoboDash
- [x] **Checkbox** - from FileLink
- [x] **Skeleton** - from FileLink
- [x] **Spinner** - from FileLink (fixed `position: fixed` for fullscreen)
- [x] **Progress Bar** - from RoboDash

### Phase 4: Create Theme System
- [x] Define base CSS variable contract in `_variables.scss`
- [x] Create dark theme preset (`_dark.scss`)
- [x] Create light theme preset (`_light.scss`)
- [x] Document theme customization in README

### Phase 5: Integration Setup
- [x] Push library to GitHub (https://github.com/timothydodd/rd-ui)
- [ ] Add library as git submodule to each project
- [ ] Configure `tsconfig.json` paths in consuming apps
- [ ] Import components in consuming apps
- [ ] Apply theme CSS variables in each app's global styles

### Phase 6: Migration Per Project
For each project (FileLink, LogMk2, RoboDash, mailvoid):
- [ ] Add rd-ui as submodule
- [ ] Configure tsconfig paths
- [ ] Define CSS variables matching their theme
- [ ] Replace local components with rd-ui imports
- [ ] Remove old component files
- [ ] Test functionality

## Additional Work Completed
- [x] Created demo application for testing all components
- [x] Migrated from `@angular/animations` to CSS-based `animate.enter`/`animate.leave`
- [x] Removed `@angular/animations` peer dependency

## Verification Plan
- [x] **Build test**: `ng build rd-ui` succeeds
- [x] **Demo app**: Created and runs at localhost:4200
- [ ] **Integration test**: Add submodule to one project and verify
- [ ] **Visual test**: Components render correctly with both themes
- [ ] **Functionality test**: All interactive features work

---

## Components Included

| Component | Selector | Features |
|-----------|----------|----------|
| Dropdown | `rd-dropdown` | Single/multi-select, tri-state, search, select-all, size variants |
| Modal | `rd-modal` | Component-outlet pattern, service-based |
| Modal Layout | `rd-modal-layout` | Slots for header/body/footer |
| Toast | `rd-toast` | Type variants, auto-dismiss, service-based |
| Tabs | `rd-tabs` / `rd-tab` | Signal-based, ContentChildren pattern |
| Input Switch | `rd-input-switch` | Toggle, ControlValueAccessor, custom values |
| Checkbox | `rd-checkbox` | Custom SVG, ControlValueAccessor, label |
| Skeleton | `rd-skeleton` | Shape variants, animation types |
| Spinner | `rd-spinner` | Fullscreen overlay loading |
| Progress Bar | `rd-progress-bar` | Percentage-based display |

## Peer Dependencies
- `@angular/core` ^21.0.0
- `@angular/common` ^21.0.0
- `@angular/forms` ^21.0.0
- `lucide-angular` ^0.555.0
