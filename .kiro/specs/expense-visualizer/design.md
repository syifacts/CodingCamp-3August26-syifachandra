# Design — Expense & Budget Visualizer

## 1. Architecture Overview

This is a single-page client-side web application. There is no build step, no bundler, and no server. The entire app runs in the browser from three files:

```
index.html      ← structure & markup
css/style.css   ← all styling, themes, animations
js/app.js       ← all logic, state, DOM manipulation
```

Data flows in one direction:

```
User Action → JS State Update → LocalStorage Persist → DOM Re-render → Chart Update
```

---

## 2. File Structure

```
CodingCamp-3August26-syifachandra/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
    └── specs/
        └── expense-visualizer/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

---

## 3. Data Model

### Transaction Object
```json
{
  "id":       "lz3k4abc1",
  "name":     "Lunch",
  "amount":   25000,
  "category": "Food",
  "date":     "06 Agt 2026"
}
```

### LocalStorage Keys

| Key                    | Type       | Description                        |
|------------------------|------------|------------------------------------|
| `ebv_transactions`     | JSON array | Array of transaction objects        |
| `ebv_custom_categories`| JSON array | Array of custom category name strings |
| `ebv_theme`            | string     | `"light"` or `"dark"`              |
| `ebv_spending_limit`   | number     | Rp spending limit (0 = not set)    |

---

## 4. UI Layout (Mobile-First)

```
┌─────────────────────────────┐
│  💸 Budget Tracker     🌙   │  ← sticky header + theme toggle
├─────────────────────────────┤
│                             │
│   Total Balance             │  ← balance card (gradient)
│   Rp 125.000                │
│                             │
├─────────────────────────────┤
│  ⚠️ Spending limit exceeded │  ← alert banner (conditional)
├─────────────────────────────┤
│  Add Transaction            │  ← form card
│  ┌─────────────────────┐    │
│  │ Item Name           │    │
│  │ Amount (Rp)         │    │
│  │ Category   [+Custom]│    │
│  │ Spending Limit      │    │
│  │  [Add Transaction]  │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Transactions   [Sort ▾]    │  ← list card
│  ┌─────────────────────┐    │
│  │ 🍔 Lunch  -Rp25.000 │    │
│  │ 🚌 Bus    -Rp5.000  │    │
│  └─────────────────────┘    │
│  (scrollable, max 340px)    │
├─────────────────────────────┤
│  Spending by Category       │  ← chart card
│       [Pie Chart]           │
└─────────────────────────────┘
```

Max container width: **480px**, centered. Padding: 16px sides.

---

## 5. Component Design

### 5.1 Header
- Sticky, `z-index: 100`
- App title on left, theme toggle button on right
- Shadow on scroll

### 5.2 Balance Card
- Full-width gradient card (`#6c63ff → #a78bfa`)
- White text, large font (2.2rem)
- Updates on every render call

### 5.3 Input Form
- Labels above inputs
- Inline error messages beneath each invalid field
- Red border on invalid inputs
- Category row: `<select>` + "＋ Custom" button side-by-side
- Spending limit field is optional
- Primary CTA button spans full width

### 5.4 Transaction List
- `<ul>` with `max-height: 340px; overflow-y: auto`
- Each `<li>` contains: emoji badge, name + meta (category · date · %), amount, delete button
- Items with amount > 50% of limit get yellow left-border highlight
- Slide-in animation on new items
- Empty state paragraph shown when list is empty

### 5.5 Pie Chart
- Chart.js v4 (`chart.umd.min.js` via CDN)
- Data aggregated by category from the transactions array
- Legend below chart, adapts colour to active theme
- Tooltip shows: `Category: Rp X.XXX (Y%)`
- Destroyed and recreated on first render; updated in-place on subsequent renders
- Empty state shown when no transactions exist

### 5.6 Custom Category Modal
- Full-screen overlay with blur backdrop
- White card centered, max-width 340px
- Text input + Add / Cancel buttons
- Closes on Cancel, overlay click, or Escape key
- Validates: non-empty, no duplicates (case-insensitive)

---

## 6. State Management

All state lives in `js/app.js` module-level variables:

```
transactions[]        ← loaded from LocalStorage on init
customCategories[]    ← loaded from LocalStorage on init
spendingLimit         ← loaded from LocalStorage on init
chartInstance         ← Chart.js instance reference (null if no chart yet)
```

There is a single `render()` function that:
1. Calls `updateBalance()` — writes balance to DOM, shows/hides limit alert
2. Calls `renderTransactionList()` — rebuilds the `<ul>` from sorted state
3. Calls `updateChart()` — updates or creates the Chart.js pie chart

Every user action that modifies state calls `render()` after persisting to LocalStorage.

---

## 7. Theme System

CSS custom properties (variables) are defined on `:root` (light) and overridden on `body.dark`.

The theme toggle:
1. Reads current class on `<body>`
2. Toggles between `light` / `dark`
3. Saves preference to `localStorage`
4. Updates the toggle button emoji (🌙 / ☀️)
5. Calls `updateChart()` to recolour chart legend text

---

## 8. Sorting

Sort is applied inside `getSortedTransactions()` which returns a sorted copy of the `transactions` array. It does not mutate the original array. Options:

| Value         | Behaviour                          |
|---------------|------------------------------------|
| `newest`      | Reverse insertion order (default)  |
| `oldest`      | Insertion order                    |
| `amount-desc` | Highest amount first               |
| `amount-asc`  | Lowest amount first                |
| `category`    | Alphabetical by category name      |

---

## 9. Security

- All user-supplied strings are passed through `escapeHtml()` before being inserted into the DOM via `innerHTML`.
- No `eval()`, no `innerHTML` with raw user data.
- No external API calls; all data stays in the browser.

---

## 10. Browser Compatibility

| Feature          | Approach                            |
|------------------|-------------------------------------|
| CSS variables    | Supported in all modern browsers    |
| LocalStorage     | Wrapped in try/catch for safety     |
| Chart.js         | Loaded via CDN (jsDelivr)           |
| ES6+ JS          | `const`, `let`, arrow functions, template literals — supported in Chrome, Firefox, Edge, Safari |
| `appearance: none` on select | Prefixed with `-webkit-appearance` for Safari |
