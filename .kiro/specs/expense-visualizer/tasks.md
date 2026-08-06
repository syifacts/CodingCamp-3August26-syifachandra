# Tasks — Expense & Budget Visualizer

## Overview

Implementation broken into 7 phases. Each task maps to one or more requirements from `requirements.md`. All code lives in `index.html`, `css/style.css`, and `js/app.js` — no build tools required.

---

## Phase 1 — Project Scaffold

### Task 1.1 — Create folder structure
- [x] Create `css/` directory
- [x] Create `js/` directory
- [x] Create `.kiro/specs/expense-visualizer/` directory
- **Requirement:** TC-4

### Task 1.2 — Create base HTML file (`index.html`)
- [x] DOCTYPE, `<head>` with charset, viewport, title
- [x] Link `css/style.css`
- [x] Load Chart.js via CDN (`chart.umd.min.js`)
- [x] Defer `js/app.js` at bottom of `<body>`
- **Requirement:** TC-1

---

## Phase 2 — HTML Structure

### Task 2.1 — Header
- [x] App title (`💸 Budget Tracker`)
- [x] Theme toggle button (`🌙`)
- **Requirement:** OC-3.1

### Task 2.2 — Balance card
- [x] Label "Total Balance"
- [x] `<h2 id="balance">` for live update target
- **Requirement:** FR-3.1

### Task 2.3 — Spending limit alert banner
- [x] Hidden `<div id="limit-alert">` with `role="alert"`
- **Requirement:** OC-4.2

### Task 2.4 — Input form
- [x] Item Name `<input type="text">`
- [x] Amount `<input type="number">`
- [x] Category `<select>` (Food, Transport, Fun)
- [x] "＋ Custom" category button
- [x] Spending Limit `<input type="number">` (optional)
- [x] Inline `<span class="field-error">` under each required field
- [x] Submit button "Add Transaction"
- **Requirement:** FR-1.1 – FR-1.5, OC-1.1, OC-4.1

### Task 2.5 — Transaction list
- [x] Sort `<select>` with 5 options
- [x] `<ul id="transaction-list">`
- [x] Empty state `<p id="empty-state">`
- **Requirement:** FR-2.1 – FR-2.4, OC-2.1

### Task 2.6 — Chart section
- [x] `<canvas id="spending-chart">`
- [x] Empty state `<p id="chart-empty">`
- **Requirement:** FR-4.1 – FR-4.4

### Task 2.7 — Custom category modal
- [x] Overlay `<div id="modal-overlay">`
- [x] Modal card with text input, Add and Cancel buttons
- **Requirement:** OC-1.1 – OC-1.4

---

## Phase 3 — CSS Styling

### Task 3.1 — CSS variables (light & dark themes)
- [x] Define all colour, shadow, and radius tokens on `:root`
- [x] Override tokens on `body.dark`
- **Requirement:** OC-3.1 – OC-3.3, NFR-3

### Task 3.2 — Layout & typography
- [x] Mobile-first single-column layout, `max-width: 480px`, centered
- [x] Card component with border, radius, shadow
- [x] Readable font stack (`Segoe UI`, system-ui)
- **Requirement:** NFR-1, NFR-3

### Task 3.3 — Balance card gradient
- [x] Purple gradient background, white text, large amount font
- **Requirement:** NFR-4

### Task 3.4 — Form styles
- [x] Input focus state highlights accent colour
- [x] `.input-error` border state (red)
- [x] `.field-error` inline message style
- **Requirement:** FR-1.6

### Task 3.5 — Transaction list item
- [x] Flex layout: emoji badge · info block · amount · delete button
- [x] Slide-in animation on new items
- [x] `.over-limit` yellow highlight variant
- [x] Custom scrollbar styling
- **Requirement:** FR-2.2, OC-4.3

### Task 3.6 — Buttons
- [x] `.btn-primary` — accent fill, full-width variant
- [x] `.btn-secondary` — surface fill, used for Custom and Cancel
- [x] `.btn-delete` — icon-only, red on hover
- [x] `.btn-icon` — square, used for theme toggle
- **Requirement:** NFR-1

### Task 3.7 — Modal overlay
- [x] Fixed full-screen overlay, blur backdrop
- [x] Fade-up animation on modal card
- **Requirement:** OC-1.1

### Task 3.8 — Responsive breakpoint
- [x] `@media (min-width: 600px)` — larger padding and font for desktop
- **Requirement:** NFR-3

---

## Phase 4 — JavaScript: Core Logic

### Task 4.1 — LocalStorage helpers
- [x] `loadJSON(key, fallback)` — parse with try/catch
- [x] `saveJSON(key, value)` — JSON stringify
- **Requirement:** TC-2

### Task 4.2 — State initialisation
- [x] Load `transactions`, `customCategories`, `spendingLimit` from LocalStorage on page load
- **Requirement:** TC-2

### Task 4.3 — Utility functions
- [x] `formatRupiah(amount)` — locale-formatted Rupiah string
- [x] `getEmoji(category)` — returns emoji for known and custom categories
- [x] `uid()` — generates unique transaction ID
- [x] `escapeHtml(str)` — XSS-safe string escaping
- [x] `allCategories()` — merges default + custom categories
- **Requirement:** FR-3.3, NFR-1

### Task 4.4 — Form validation
- [x] `validateForm()` — checks all three required fields
- [x] Marks invalid inputs with `.input-error` class
- [x] Populates inline `<span class="field-error">` messages
- [x] `clearErrors()` — resets all error states
- **Requirement:** FR-1.5, FR-1.6

### Task 4.5 — Add transaction
- [x] `form` submit handler
- [x] Build transaction object with uid, name, amount, category, date
- [x] Push to `transactions` array, save to LocalStorage
- [x] Save spending limit if field changed
- [x] Reset form, call `render()`
- **Requirement:** FR-1.4, FR-1.7

### Task 4.6 — Delete transaction
- [x] `deleteTransaction(id)` — filters array, saves, calls `render()`
- [x] Event delegation on `<ul>` for delete buttons
- **Requirement:** FR-2.3

---

## Phase 5 — JavaScript: Render & UI Updates

### Task 5.1 — Balance update
- [x] `calcTotal()` — sums all transaction amounts
- [x] `updateBalance()` — writes to `#balance`, shows/hides `#limit-alert`
- **Requirement:** FR-3.1, FR-3.2, OC-4.2

### Task 5.2 — Transaction list render
- [x] `renderTransactionList()` — builds `<li>` elements from `getSortedTransactions()`
- [x] Shows percentage of total on each item
- [x] Applies `.over-limit` class when applicable
- [x] Shows/hides empty state
- **Requirement:** FR-2.1, FR-2.2, FR-2.4, OC-4.3

### Task 5.3 — Sort
- [x] `getSortedTransactions()` — returns sorted copy based on `sortSelect.value`
- [x] `sortSelect` change listener calls `render()`
- **Requirement:** OC-2.1, OC-2.2

### Task 5.4 — Master render function
- [x] `render()` calls `updateBalance()`, `renderTransactionList()`, `updateChart()` in sequence
- **Requirement:** FR-3.2, FR-4.2

---

## Phase 6 — JavaScript: Chart & Theme

### Task 6.1 — Chart data builder
- [x] `buildChartData()` — aggregates `transactions` into `{ labels, data, colors }` by category
- **Requirement:** FR-4.1

### Task 6.2 — Chart render/update
- [x] `updateChart()` — creates Chart.js instance on first call, updates in-place on subsequent calls
- [x] Destroys chart when no data
- [x] Legend colour adapts to active theme
- [x] Tooltip shows category, formatted amount, percentage
- **Requirement:** FR-4.2, FR-4.3, FR-4.4, OC-3.3

### Task 6.3 — Theme toggle
- [x] `applyTheme(theme)` — toggles `body.dark` / `body.light`, updates button emoji
- [x] `initTheme()` — reads saved preference from LocalStorage
- [x] `themeToggle` click listener — saves and applies new theme, re-renders chart
- **Requirement:** OC-3.1, OC-3.2, OC-3.3

---

## Phase 7 — JavaScript: Optional Features

### Task 7.1 — Custom category modal
- [x] `addCategoryBtn` opens modal, focuses input
- [x] `addCustomCategory()` — validates, pushes to `customCategories`, saves, repopulates select, pre-selects new category, closes modal
- [x] Closes on Cancel button, overlay click, Escape key
- [x] `populateCategorySelect()` — rebuilds `<select>` options from `allCategories()`
- **Requirement:** OC-1.1 – OC-1.4

### Task 7.2 — Spending limit
- [x] `limitInput` change listener — saves limit to LocalStorage, calls `render()`
- [x] Restore saved limit value to input on page load
- **Requirement:** OC-4.1, OC-4.4

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
