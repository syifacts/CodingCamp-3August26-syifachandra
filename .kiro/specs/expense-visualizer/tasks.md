# Implementation Plan: Expense & Budget Visualizer

## Overview

Implementation broken into 7 phases. Each task maps to one or more requirements from `requirements.md`. All code lives in `index.html`, `css/style.css`, and `js/app.js` — no build tools required.

---

## Tasks

### Phase 1 — Project Scaffold

- [x] 1.1 Create folder structure (`css/`, `js/`, `.kiro/specs/expense-visualizer/`). **Requirement:** TC-4

- [x] 1.2 Create base HTML file (`index.html`) with DOCTYPE, `<head>`, Chart.js CDN link, and deferred `js/app.js`. **Requirement:** TC-1

---

### Phase 2 — HTML Structure

- [x] 2.1 Header with app title (`💸 Budget Tracker`) and theme toggle button (`🌙`). **Requirement:** OC-3.1

- [x] 2.2 Balance card with "Total Balance" label and `<h2 id="balance">` live update target. **Requirement:** FR-3.1

- [x] 2.3 Spending limit alert banner — hidden `<div id="limit-alert">` with `role="alert"`. **Requirement:** OC-4.2

- [x] 2.4 Input form with Item Name, Amount, Category select (Food/Transport/Fun), "＋ Custom" button, optional Spending Limit field, inline field-error spans, and Submit button. **Requirement:** FR-1.1 – FR-1.5, OC-1.1, OC-4.1

- [x] 2.5 Transaction list with sort `<select>`, `<ul id="transaction-list">`, and empty state `<p id="empty-state">`. **Requirement:** FR-2.1 – FR-2.4, OC-2.1

- [x] 2.6 Chart section with `<canvas id="spending-chart">` and empty state `<p id="chart-empty">`. **Requirement:** FR-4.1 – FR-4.4

- [x] 2.7 Custom category modal with overlay `<div id="modal-overlay">`, text input, Add and Cancel buttons. **Requirement:** OC-1.1 – OC-1.4

---

### Phase 3 — CSS Styling

- [x] 3.1 CSS variables for light and dark themes — colour, shadow, and radius tokens on `:root`; overrides on `body.dark`. **Requirement:** OC-3.1 – OC-3.3, NFR-3

- [x] 3.2 Mobile-first layout (`max-width: 480px`, centered), card component, and readable font stack (`Segoe UI`, system-ui). **Requirement:** NFR-1, NFR-3

- [x] 3.3 Balance card with purple gradient background, white text, and large amount font. **Requirement:** NFR-4

- [x] 3.4 Form styles — input focus accent, `.input-error` red border, `.field-error` inline message. **Requirement:** FR-1.6

- [x] 3.5 Transaction list item — flex layout, slide-in animation, `.over-limit` highlight, custom scrollbar. **Requirement:** FR-2.2, OC-4.3

- [x] 3.6 Button variants — `.btn-primary`, `.btn-secondary`, `.btn-delete`, `.btn-icon`. **Requirement:** NFR-1

- [x] 3.7 Modal overlay — fixed full-screen, blur backdrop, fade-up animation on card. **Requirement:** OC-1.1

- [x] 3.8 Responsive breakpoint `@media (min-width: 600px)` for larger padding and font on desktop. **Requirement:** NFR-3

---

### Phase 4 — JavaScript: Core Logic

- [x] 4.1 LocalStorage helpers — `loadJSON(key, fallback)` with try/catch and `saveJSON(key, value)`. **Requirement:** TC-2

- [x] 4.2 State initialisation — load `transactions`, `customCategories`, `spendingLimit` from LocalStorage on page load. **Requirement:** TC-2

- [x] 4.3 Utility functions — `formatRupiah`, `getEmoji`, `uid`, `escapeHtml`, `allCategories`. **Requirement:** FR-3.3, NFR-1

- [x] 4.4 Form validation — `validateForm()` checks required fields, marks `.input-error`, populates `.field-error` messages; `clearErrors()` resets all states. **Requirement:** FR-1.5, FR-1.6

- [x] 4.5 Add transaction — form submit handler builds transaction object, pushes to array, saves to LocalStorage, saves spending limit if changed, resets form, calls `render()`. **Requirement:** FR-1.4, FR-1.7

- [x] 4.6 Delete transaction — `deleteTransaction(id)` filters array, saves, calls `render()`; event delegation on `<ul>`. **Requirement:** FR-2.3

---

### Phase 5 — JavaScript: Render & UI Updates

- [x] 5.1 Balance update — `calcTotal()` sums amounts; `updateBalance()` writes to `#balance` and shows/hides `#limit-alert`. **Requirement:** FR-3.1, FR-3.2, OC-4.2

- [x] 5.2 Transaction list render — `renderTransactionList()` builds `<li>` elements from `getSortedTransactions()`, shows percentage, applies `.over-limit`, manages empty state. **Requirement:** FR-2.1, FR-2.2, FR-2.4, OC-4.3

- [x] 5.3 Sort — `getSortedTransactions()` returns sorted copy by `sortSelect.value`; change listener calls `render()`. **Requirement:** OC-2.1, OC-2.2

- [x] 5.4 Master render function — `render()` calls `updateBalance()`, `renderTransactionList()`, `updateChart()` in sequence. **Requirement:** FR-3.2, FR-4.2

---

### Phase 6 — JavaScript: Chart & Theme

- [x] 6.1 Chart data builder — `buildChartData()` aggregates transactions into `{ labels, data, colors }` by category. **Requirement:** FR-4.1

- [x] 6.2 Chart render/update — `updateChart()` creates Chart.js instance on first call, updates in-place subsequently, destroys when no data; legend and tooltips adapt to theme. **Requirement:** FR-4.2, FR-4.3, FR-4.4, OC-3.3

- [x] 6.3 Theme toggle — `applyTheme(theme)` toggles `body.dark`/`body.light` and updates button emoji; `initTheme()` restores saved preference; click listener saves, applies, and re-renders chart. **Requirement:** OC-3.1, OC-3.2, OC-3.3

---

### Phase 7 — JavaScript: Optional Features

- [x] 7.1 Custom category modal — `addCategoryBtn` opens modal; `addCustomCategory()` validates, saves, repopulates select, pre-selects new category; closes on Cancel, overlay click, or Escape; `populateCategorySelect()` rebuilds options. **Requirement:** OC-1.1 – OC-1.4

- [x] 7.2 Spending limit — `limitInput` change listener saves to LocalStorage and calls `render()`; saved value restored on page load. **Requirement:** OC-4.1, OC-4.4

---

## Completion Checklist

### MVP
- [x] Input form with 3 fields and validation
- [x] Transactions added to list on submit
- [x] Transaction list is scrollable and shows name, amount, category
- [x] Delete button on each transaction
- [x] Total balance displayed and auto-updated
- [x] Pie chart auto-updates with transactions
- [x] All data persisted in LocalStorage

### Optional Challenges
- [x] Custom categories (OC-1)
- [x] Sort transactions (OC-2)
- [x] Dark/light mode toggle (OC-3)
- [x] Spending limit highlight — bonus 4th challenge (OC-4)

### Technical Constraints
- [x] HTML + CSS + Vanilla JS only
- [x] No backend
- [x] LocalStorage only
- [x] 1 CSS file in `css/`
- [x] 1 JS file in `js/`
- [x] Works in Chrome, Firefox, Edge, Safari

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1.1"]
    },
    {
      "wave": 2,
      "tasks": ["1.2"]
    },
    {
      "wave": 3,
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"]
    },
    {
      "wave": 4,
      "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "4.1", "4.2", "4.3"]
    },
    {
      "wave": 5,
      "tasks": ["4.4", "4.5", "4.6"]
    },
    {
      "wave": 6,
      "tasks": ["5.1", "5.2", "5.3", "5.4"]
    },
    {
      "wave": 7,
      "tasks": ["6.1", "6.2", "6.3"]
    },
    {
      "wave": 8,
      "tasks": ["7.1", "7.2"]
    }
  ]
}
```

```
Phase 1 (Scaffold)
  └── Phase 2 (HTML Structure)
        └── Phase 3 (CSS Styling)
        └── Phase 4 (JS: Core Logic)
              └── Phase 5 (JS: Render & UI Updates)
                    └── Phase 6 (JS: Chart & Theme)
                          └── Phase 7 (JS: Optional Features)
```

- **1.1 → 1.2**: Folder structure must exist before creating `index.html`.
- **1.2 → 2.x**: Base HTML file required before adding structural sections.
- **2.x → 3.x**: HTML elements must be defined before CSS styles target them.
- **2.x → 4.x**: HTML form/list elements must exist before JS wires up event listeners.
- **4.1–4.3 → 4.4–4.6**: Helpers and state must be initialised before form/delete logic.
- **4.x → 5.x**: Core logic (state, validation, CRUD) must be complete before render functions.
- **5.x → 6.x**: Render pipeline must be stable before chart and theme layers are added.
- **5.x + 6.x → 7.x**: All core features must work before optional enhancements (custom categories, spending limit) are layered on.

---

## Notes

- All implementation is contained in three files: `index.html`, `css/style.css`, and `js/app.js`. No build step, bundler, or server is required.
- Chart.js is loaded via CDN; an internet connection is needed for the first load. Subsequent loads can work offline once cached by the browser.
- LocalStorage is the only persistence layer. Clearing browser storage will reset all data.
- The `escapeHtml()` utility (task 4.3) is critical for XSS safety whenever user-supplied text is rendered as HTML.
- Dark/light theme preference is stored in LocalStorage under a dedicated key and restored on page load.
- The spending limit feature is optional and additive — it does not affect MVP functionality if the field is left empty.
- All phases are now complete; the Completion Checklist above reflects the finished state of the project.
