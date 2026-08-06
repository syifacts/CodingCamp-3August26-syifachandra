# Requirements — Expense & Budget Visualizer

## Project Overview

A mobile-friendly web app that helps users track daily spending. It displays a total balance, a scrollable transaction history, and a pie chart of spending by category. All data is stored in the browser using LocalStorage — no backend required.

---

## Functional Requirements

### FR-1: Input Form

| ID | Requirement |
|----|-------------|
| FR-1.1 | The form must include an **Item Name** text field. |
| FR-1.2 | The form must include an **Amount** numeric field (positive numbers only). |
| FR-1.3 | The form must include a **Category** dropdown with at least: Food, Transport, Fun. |
| FR-1.4 | Submitting the form must add the transaction to the list. |
| FR-1.5 | All fields must be validated — submission is blocked if any field is empty or invalid. |
| FR-1.6 | Each field must display an inline error message when validation fails. |
| FR-1.7 | The form must reset after a successful submission. |

### FR-2: Transaction List

| ID | Requirement |
|----|-------------|
| FR-2.1 | All added transactions must be displayed in a scrollable list. |
| FR-2.2 | Each list item must show: item name, amount, and category. |
| FR-2.3 | Each list item must have a delete button that removes it from the list and storage. |
| FR-2.4 | An empty-state message must be shown when no transactions exist. |

### FR-3: Total Balance

| ID | Requirement |
|----|-------------|
| FR-3.1 | The total balance must be displayed prominently at the top of the page. |
| FR-3.2 | The balance must update automatically whenever a transaction is added or deleted. |
| FR-3.3 | Amounts must be formatted as Indonesian Rupiah (Rp). |

### FR-4: Visual Chart

| ID | Requirement |
|----|-------------|
| FR-4.1 | A pie chart must display spending distribution grouped by category. |
| FR-4.2 | The chart must update automatically when transactions are added or deleted. |
| FR-4.3 | Tooltips must show the category name, amount, and percentage of total. |
| FR-4.4 | An empty-state message must be shown when there are no transactions. |

---

## Optional Challenges (3 selected)

### OC-1: Custom Categories
| ID | Requirement |
|----|-------------|
| OC-1.1 | Users can add custom category names via a modal dialog. |
| OC-1.2 | Custom categories persist in LocalStorage. |
| OC-1.3 | Custom categories appear in the category dropdown and the pie chart. |
| OC-1.4 | Duplicate category names (case-insensitive) must be rejected. |

### OC-2: Sort Transactions
| ID | Requirement |
|----|-------------|
| OC-2.1 | Users can sort the transaction list by: Newest first, Oldest first, Amount ↓, Amount ↑, Category A–Z. |
| OC-2.2 | The sort selection must update the displayed list immediately. |

### OC-3: Dark / Light Mode Toggle
| ID | Requirement |
|----|-------------|
| OC-3.1 | A toggle button in the header switches between dark and light themes. |
| OC-3.2 | The selected theme persists in LocalStorage across page refreshes. |
| OC-3.3 | All UI elements — including the chart — must adapt to the active theme. |

### OC-4 (Bonus): Spending Limit Highlight
| ID | Requirement |
|----|-------------|
| OC-4.1 | Users can optionally set a spending limit (Rp). |
| OC-4.2 | A warning banner appears when the total balance exceeds the limit. |
| OC-4.3 | Individual items whose amount exceeds 50% of the limit are visually highlighted. |
| OC-4.4 | The spending limit persists in LocalStorage. |

---

## Technical Constraints

| ID | Constraint |
|----|-----------|
| TC-1 | Technology stack: HTML, CSS, Vanilla JavaScript — no frameworks (React, Vue, etc.). |
| TC-2 | Data storage: Browser LocalStorage API only — all data is client-side. |
| TC-3 | Browser compatibility: Chrome, Firefox, Edge, Safari (modern versions). |
| TC-4 | File structure: exactly 1 CSS file in `css/`, exactly 1 JS file in `js/`. |
| TC-5 | No backend server required. |
| TC-6 | No test setup required. |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Clean, minimal interface — easy to understand without instructions. |
| NFR-2 | Fast load time; no noticeable lag when adding or deleting transactions. |
| NFR-3 | Mobile-friendly layout (max-width container, readable typography, touch targets ≥ 44px). |
| NFR-4 | Clear visual hierarchy — balance is the most prominent element. |
| NFR-5 | Accessible markup: semantic HTML, ARIA labels on interactive elements, visible focus states. |
