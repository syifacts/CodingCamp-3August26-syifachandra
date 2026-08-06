# 💸 Expense & Budget Visualizer

A mobile-friendly web app to track daily spending. Built with plain HTML, CSS, and Vanilla JavaScript — no frameworks, no backend.

🌐 **Live Demo:** [syifacts.github.io/CodingCamp-3August26-syifachandra](https://syifacts.github.io/CodingCamp-3August26-syifachandra/)

---

## Features

### Core (MVP)
- **Input Form** — add a transaction with item name, amount, and category (Food, Transport, Fun)
- **Validation** — all fields are required; inline error messages shown on invalid input
- **Transaction List** — scrollable list showing name, amount, category, date, and percentage of total; each item has a delete button
- **Total Balance** — displayed prominently at the top, auto-updates on every add/delete; formatted in Indonesian Rupiah (Rp)
- **Pie Chart** — visual spending distribution by category using Chart.js; updates automatically

### Optional Challenges
- **Custom Categories** — add your own categories via a modal dialog; persisted in LocalStorage
- **Sort Transactions** — sort by newest, oldest, amount (high/low), or category A–Z
- **Dark / Light Mode** — toggle between themes; preference saved across page refreshes
- **Spending Limit** *(bonus)* — set an optional limit; warning banner appears when exceeded; individual items over 50% of the limit are highlighted

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | CSS3 (CSS Variables, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Chart | [Chart.js 4.4.3](https://www.chartjs.org/) via CDN |
| Storage | Browser LocalStorage API |

No build tools, no frameworks, no backend required.

---

## Project Structure

```
CodingCamp-3August26-syifachandra/
├── index.html        # App structure and markup
├── css/
│   └── style.css     # All styles (light/dark themes, layout, components)
├── js/
│   └── app.js        # All JavaScript logic
└── .kiro/            # Kiro IDE spec files
```

---

## Running Locally

No installation needed. Just open `index.html` in any modern browser:

```
Chrome · Firefox · Edge · Safari
```

Or clone the repo:

```bash
git clone https://github.com/syifacts/CodingCamp-3August26-syifachandra.git
cd CodingCamp-3August26-syifachandra
# open index.html in your browser
```

---

## Assignment Info

- **Course:** CodingCamp — Batch 3 August 2026
- **Participant:** syifachandra
- **Repository format:** `CodingCamp-[ddmmyy]-[name]`
