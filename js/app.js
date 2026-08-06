/* =====================================================
   EXPENSE & BUDGET VISUALIZER — app.js
   Vanilla JS · LocalStorage · Chart.js
   ===================================================== */

'use strict';

// ─────────────────────────────────────────────
// CONSTANTS & STATE
// ─────────────────────────────────────────────

/** Emoji map for known + custom categories */
const CATEGORY_EMOJI = {
  Food:      '🍔',
  Transport: '🚌',
  Fun:       '🎉',
};

/** Default categories (also used for chart colour ordering) */
const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Fun'];

/** Chart.js colour palette — cycles if many categories */
const CHART_COLORS = [
  '#6c63ff', '#ff6384', '#36a2eb', '#ffce56',
  '#4bc0c0', '#ff9f40', '#9966ff', '#c9cbcf',
];

// LocalStorage keys
const LS_TRANSACTIONS  = 'ebv_transactions';
const LS_CATEGORIES    = 'ebv_custom_categories';
const LS_THEME         = 'ebv_theme';
const LS_LIMIT         = 'ebv_spending_limit';

// ─────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────

const form            = document.getElementById('transaction-form');
const itemNameInput   = document.getElementById('item-name');
const amountInput     = document.getElementById('amount');
const categorySelect  = document.getElementById('category');
const limitInput      = document.getElementById('spending-limit');
const balanceEl       = document.getElementById('balance');
const txList          = document.getElementById('transaction-list');
const emptyState      = document.getElementById('empty-state');
const limitAlert      = document.getElementById('limit-alert');
const sortSelect      = document.getElementById('sort-select');
const themeToggle     = document.getElementById('theme-toggle');
const chartCanvas     = document.getElementById('spending-chart');
const chartEmpty      = document.getElementById('chart-empty');

// Modal
const addCategoryBtn  = document.getElementById('add-category-btn');
const modalOverlay    = document.getElementById('modal-overlay');
const customCatInput  = document.getElementById('custom-cat-input');
const modalConfirm    = document.getElementById('modal-confirm');
const modalCancel     = document.getElementById('modal-cancel');
const errCustomCat    = document.getElementById('err-custom-cat');

// Error spans
const errName         = document.getElementById('err-name');
const errAmount       = document.getElementById('err-amount');
const errCategory     = document.getElementById('err-category');

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

let transactions   = loadJSON(LS_TRANSACTIONS, []);
let customCategories = loadJSON(LS_CATEGORIES, []);
let spendingLimit  = parseFloat(localStorage.getItem(LS_LIMIT)) || 0;
let chartInstance  = null;

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

/** Load JSON from localStorage with fallback */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Save value as JSON to localStorage */
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Format number as Indonesian Rupiah */
function formatRupiah(amount) {
  return 'Rp ' + Math.abs(amount).toLocaleString('id-ID');
}

/** Get emoji for a category */
function getEmoji(cat) {
  return CATEGORY_EMOJI[cat] || '📦';
}

/** Generate a simple unique ID */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** All categories (default + custom) */
function allCategories() {
  return [...DEFAULT_CATEGORIES, ...customCategories];
}

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('light', theme !== 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  // Update chart colours when theme changes
  if (chartInstance) {
    updateChart();
  }
}

function initTheme() {
  const saved = localStorage.getItem(LS_THEME) || 'light';
  applyTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem(LS_THEME, next);
  applyTheme(next);
});

// ─────────────────────────────────────────────
// CATEGORY SELECT — populate with all categories
// ─────────────────────────────────────────────

function populateCategorySelect() {
  // Remove all existing options except the placeholder
  while (categorySelect.options.length > 1) {
    categorySelect.remove(1);
  }

  allCategories().forEach(cat => {
    const opt = new Option(`${getEmoji(cat)} ${cat}`, cat);
    categorySelect.add(opt);
  });
}

// ─────────────────────────────────────────────
// FORM VALIDATION
// ─────────────────────────────────────────────

function clearErrors() {
  [errName, errAmount, errCategory].forEach(el => { el.textContent = ''; });
  [itemNameInput, amountInput, categorySelect].forEach(el => el.classList.remove('input-error'));
}

/**
 * Validate form fields.
 * @returns {boolean} true if valid
 */
function validateForm() {
  clearErrors();
  let valid = true;

  const name = itemNameInput.value.trim();
  const amt  = amountInput.value.trim();
  const cat  = categorySelect.value;

  if (!name) {
    errName.textContent = 'Item name is required.';
    itemNameInput.classList.add('input-error');
    valid = false;
  }

  if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) {
    errAmount.textContent = 'Enter a valid amount greater than 0.';
    amountInput.classList.add('input-error');
    valid = false;
  }

  if (!cat) {
    errCategory.textContent = 'Please select a category.';
    categorySelect.classList.add('input-error');
    valid = false;
  }

  return valid;
}

// ─────────────────────────────────────────────
// ADD TRANSACTION
// ─────────────────────────────────────────────

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!validateForm()) return;

  const transaction = {
    id:       uid(),
    name:     itemNameInput.value.trim(),
    amount:   parseFloat(amountInput.value),
    category: categorySelect.value,
    date:     new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  transactions.push(transaction);
  saveJSON(LS_TRANSACTIONS, transactions);

  // Save spending limit if changed
  const limitVal = parseFloat(limitInput.value);
  if (!isNaN(limitVal) && limitVal >= 0) {
    spendingLimit = limitVal;
    localStorage.setItem(LS_LIMIT, spendingLimit);
  }

  // Reset form
  form.reset();
  clearErrors();

  render();
});

// ─────────────────────────────────────────────
// DELETE TRANSACTION
// ─────────────────────────────────────────────

function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveJSON(LS_TRANSACTIONS, transactions);
  render();
}

// ─────────────────────────────────────────────
// SORT
// ─────────────────────────────────────────────

function getSortedTransactions() {
  const order = sortSelect.value;
  const copy  = [...transactions];

  switch (order) {
    case 'newest':      return copy.reverse();
    case 'oldest':      return copy;
    case 'amount-desc': return copy.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':  return copy.sort((a, b) => a.amount - b.amount);
    case 'category':    return copy.sort((a, b) => a.category.localeCompare(b.category));
    default:            return copy.reverse();
  }
}

sortSelect.addEventListener('change', render);

// ─────────────────────────────────────────────
// BALANCE
// ─────────────────────────────────────────────

function calcTotal() {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

function updateBalance() {
  const total = calcTotal();
  balanceEl.textContent = formatRupiah(total);

  // Check spending limit
  if (spendingLimit > 0 && total > spendingLimit) {
    limitAlert.classList.remove('hidden');
  } else {
    limitAlert.classList.add('hidden');
  }
}

// ─────────────────────────────────────────────
// TRANSACTION LIST RENDER
// ─────────────────────────────────────────────

function renderTransactionList() {
  const sorted = getSortedTransactions();
  const total  = calcTotal();

  txList.innerHTML = '';

  if (sorted.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  sorted.forEach(tx => {
    // Per-item over-limit highlight: item > 50% of limit (if set)
    const isOver = spendingLimit > 0 && tx.amount > spendingLimit * 0.5;

    const li = document.createElement('li');
    li.className = 'transaction-item' + (isOver ? ' over-limit' : '');
    li.dataset.id = tx.id;

    // Percentage of total
    const pct = total > 0 ? ((tx.amount / total) * 100).toFixed(1) : '0.0';

    li.innerHTML = `
      <div class="tx-category-badge" aria-hidden="true">${getEmoji(tx.category)}</div>
      <div class="tx-info">
        <div class="tx-name" title="${escapeHtml(tx.name)}">${escapeHtml(tx.name)}</div>
        <div class="tx-meta">${escapeHtml(tx.category)} · ${tx.date} · ${pct}%</div>
      </div>
      <span class="tx-amount">−${formatRupiah(tx.amount)}</span>
      <button class="btn-delete" data-id="${tx.id}" aria-label="Delete ${escapeHtml(tx.name)}" title="Delete">✕</button>
    `;

    txList.appendChild(li);
  });

  // Event delegation for delete buttons
  txList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
  });
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────
// CHART
// ─────────────────────────────────────────────

function buildChartData() {
  // Aggregate totals per category
  const totals = {};
  transactions.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });

  const labels  = Object.keys(totals);
  const data    = Object.values(totals);
  const colors  = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  return { labels, data, colors };
}

function updateChart() {
  const { labels, data, colors } = buildChartData();

  if (data.length === 0) {
    chartEmpty.classList.remove('hidden');
    chartCanvas.classList.add('hidden');
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    return;
  }

  chartEmpty.classList.add('hidden');
  chartCanvas.classList.remove('hidden');

  const isDark = document.body.classList.contains('dark');
  const legendColor = isDark ? '#e8eaf0' : '#1a1d23';

  if (chartInstance) {
    // Update existing chart
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data   = data;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.options.plugins.legend.labels.color = legendColor;
    chartInstance.update();
  } else {
    // Create new chart
    chartInstance = new Chart(chartCanvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: isDark ? '#1a1d27' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: legendColor,
              padding: 14,
              font: { size: 12, weight: '600' },
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label(ctx) {
                const val   = ctx.parsed;
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct   = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                return ` ${ctx.label}: ${formatRupiah(val)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }
}

// ─────────────────────────────────────────────
// MASTER RENDER
// ─────────────────────────────────────────────

function render() {
  updateBalance();
  renderTransactionList();
  updateChart();
}

// ─────────────────────────────────────────────
// CUSTOM CATEGORY MODAL
// ─────────────────────────────────────────────

addCategoryBtn.addEventListener('click', () => {
  customCatInput.value = '';
  errCustomCat.textContent = '';
  modalOverlay.classList.remove('hidden');
  customCatInput.focus();
});

modalCancel.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

modalConfirm.addEventListener('click', addCustomCategory);

customCatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addCustomCategory();
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  modalOverlay.classList.add('hidden');
}

function addCustomCategory() {
  const name = customCatInput.value.trim();
  errCustomCat.textContent = '';

  if (!name) {
    errCustomCat.textContent = 'Category name cannot be empty.';
    return;
  }

  if (allCategories().map(c => c.toLowerCase()).includes(name.toLowerCase())) {
    errCustomCat.textContent = 'That category already exists.';
    return;
  }

  customCategories.push(name);
  saveJSON(LS_CATEGORIES, customCategories);
  populateCategorySelect();

  // Pre-select the new category
  categorySelect.value = name;

  closeModal();
}

// ─────────────────────────────────────────────
// SPENDING LIMIT — persist on input change
// ─────────────────────────────────────────────

limitInput.addEventListener('change', () => {
  const val = parseFloat(limitInput.value);
  if (!isNaN(val) && val >= 0) {
    spendingLimit = val;
    localStorage.setItem(LS_LIMIT, spendingLimit);
    render();
  }
});

// Restore saved limit value in input
if (spendingLimit > 0) {
  limitInput.value = spendingLimit;
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  initTheme();
  populateCategorySelect();
  render();
}

init();
