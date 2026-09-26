/**
 * BudgetBasics - Main Application Coordinator
 * Boots modules, powers info strip, expense planner, money mistakes, feedback form, checklist, and animations
 * Strictly NO emojis
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Initialize data store
    await initAppData();
  } catch (err) {
    console.error('Failed to initAppData:', err);
  }

  const runSafe = (name, fn) => {
    try {
      if (typeof fn === 'function') {
        fn();
      }
    } catch (err) {
      console.error(`Error in ${name}:`, err);
    }
  };

  // 2. Initialize feature controllers
  runSafe('initNavbar', initNavbar);
  runSafe('initInfoStrip', initInfoStrip);
  runSafe('initLearning', initLearning);
  runSafe('initCalculators', initCalculators);
  runSafe('initPlanning', initPlanning);
  if (typeof initGames === 'function') {
    runSafe('initGames', initGames);
  }
  runSafe('initGallery', initGallery);
  runSafe('initBudgetBeeChatbot', initBudgetBeeChatbot);

  // 3. Initialize interactive practice & student tools
  runSafe('initPracticeSection', initPracticeSection);
  runSafe('initExpensePlanner', initExpensePlanner);
  runSafe('initMoneyMistakes', initMoneyMistakes);
  runSafe('initChecklistWidget', initChecklistWidget);
  runSafe('initNeedsWantsQuiz', initNeedsWantsQuiz);
  runSafe('initBudgetSummaryDashboard', initBudgetSummaryDashboard);
  runSafe('initFeedbackForm', initFeedbackForm);
  runSafe('initContactForm', initContactForm);
  runSafe('initScrollAndAnimations', initScrollAndAnimations);
});

/**
 * 1. INFO STRIP CONTROLLER
 * Real-time clock, persistent visitor counter, and auto-rotating financial tips
 */
function initInfoStrip() {
  // Visitor Counter
  const visitorCountEl = document.getElementById('visitorCountNumber');
  if (visitorCountEl) {
    let visits = parseInt(localStorage.getItem('bb_visitor_counter') || '14820', 10);
    // Increment once per session if not already counted this session
    if (!sessionStorage.getItem('bb_session_counted')) {
      visits += Math.floor(Math.random() * 3) + 1;
      localStorage.setItem('bb_visitor_counter', visits.toString());
      sessionStorage.setItem('bb_session_counted', 'true');
    }
    visitorCountEl.textContent = visits.toLocaleString('en-US') + '+';
  }

  // Real-Time Date & Time Clock
  const dateEl = document.getElementById('currentDateDisplay');
  const timeEl = document.getElementById('currentTimeDisplay');

  function updateClock() {
    const now = new Date();
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', optionsDate);
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', optionsTime);
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Rotating Financial Tips
  const tipCategoryEl = document.getElementById('rotatingTipCategory');
  const tipTextEl = document.getElementById('rotatingTipText');
  const tipAuthorEl = document.getElementById('rotatingTipAuthor');
  const btnPrev = document.getElementById('btnTipPrev');
  const btnNext = document.getElementById('btnTipNext');

  const tipsList = (BB_DATA.tips && BB_DATA.tips.tips) ? BB_DATA.tips.tips : [
    { category: "Saving Habit", text: "Pay Yourself First: Transfer at least 15% to 20% of income directly into savings on the day it arrives.", author: "BudgetBasics Standard" },
    { category: "Mindful Spending", text: "The 24-Hour Rule: Wait 24 to 48 hours before purchasing any non-essential want over Rs. 2,000.", author: "Behavioral Principle" },
    { category: "Expense Audit", text: "The Subscription Check: Review bank statements monthly to cancel forgotten app free trials and unused services.", author: "Cash Flow Guide" },
    { category: "Emergency Cushion", text: "Starter Emergency Fund: Maintain an initial liquid reserve of Rs. 15,000 to Rs. 25,000 for unexpected crises.", author: "Resilience Standard" }
  ];

  let currentTipIdx = 0;
  let tipTimer = null;

  function displayTip(idx) {
    const tip = tipsList[idx];
    if (!tip) return;

    if (tipCategoryEl) tipCategoryEl.textContent = tip.category;
    if (tipTextEl) {
      tipTextEl.style.opacity = '0';
      setTimeout(() => {
        tipTextEl.textContent = tip.text;
        tipTextEl.style.opacity = '1';
      }, 180);
    }
    if (tipAuthorEl) tipAuthorEl.textContent = tip.author || 'BudgetBasics Guide';
  }

  function nextTip() {
    currentTipIdx = (currentTipIdx + 1) % tipsList.length;
    displayTip(currentTipIdx);
  }

  function prevTip() {
    currentTipIdx = (currentTipIdx - 1 + tipsList.length) % tipsList.length;
    displayTip(currentTipIdx);
  }

  displayTip(0);

  // Auto rotate every 7 seconds
  tipTimer = setInterval(nextTip, 7000);

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      clearInterval(tipTimer);
      nextTip();
      tipTimer = setInterval(nextTip, 7000);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      clearInterval(tipTimer);
      prevTip();
      tipTimer = setInterval(nextTip, 7000);
    });
  }
}

/**
 * 2. PRACTICE SECTION TAB CONTROLLER
 */
function initPracticeSection() {
  const tabs = document.querySelectorAll('.bb-practice-tab');
  const panels = document.querySelectorAll('.bb-practice-panel');

  window.switchPracticeTab = function(targetId) {
    if (!targetId) return;
    if (typeof window.switchPlanningTab === 'function') {
      window.switchPlanningTab(targetId);
    }
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.practiceTarget === targetId);
    });

    panels.forEach(p => {
      if (p.id === `practice-${targetId}` || p.id === targetId || p.id === `panel-${targetId}`) {
        p.classList.remove('d-none');
      } else {
        p.classList.add('d-none');
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.practiceTarget;
      switchPracticeTab(target);
    });
  });
}

/**
 * 3. EXPENSE PLANNER CONTROLLER
 * Full CRUD, Categories (Food, Transport, Education, Bills, Shopping, Entertainment, Other),
 * Totals calculation, Remaining balance, localStorage persistence
 */
function initExpensePlanner() {
  const dateInput = document.getElementById('epDate');
  const catSelect = document.getElementById('epCategory');
  const amountInput = document.getElementById('epAmount');
  const descInput = document.getElementById('epDesc');
  const btnAdd = document.getElementById('btnEpAdd');
  const tableBody = document.getElementById('epTableBody');
  const totalAmountEl = document.getElementById('epTotalOutflows');
  const remainingEl = document.getElementById('epRemainingBalance');
  const incomeInput = document.getElementById('epMonthlyIncomeInput');
  const errorEl = document.getElementById('epFormError');

  // Set default date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Load from localStorage or defaults
  let expenses = [];
  try {
    const stored = localStorage.getItem('bb_expense_records');
    if (stored) {
      expenses = JSON.parse(stored);
    } else {
      expenses = [
        { id: 'e-1', date: '2026-09-20', category: 'Food', amount: 3500, desc: 'Hostel mess staple food & produce' },
        { id: 'e-2', date: '2026-09-22', category: 'Transport', amount: 1200, desc: 'Semester transit smart card recharge' },
        { id: 'e-3', date: '2026-09-23', category: 'Education', amount: 2400, desc: 'Required academic textbook & printouts' },
        { id: 'e-4', date: '2026-09-24', category: 'Bills', amount: 1500, desc: 'Mobile internet & coursework data' }
      ];
    }
  } catch (e) {
    expenses = [];
  }

  let editingId = null;

  function renderExpenses() {
    if (!tableBody) return;

    if (expenses.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">
            <i class="bi bi-inbox d-block fs-3 mb-2 text-secondary"></i>
            No expenses logged yet. Add your first expense above.
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = expenses.map(item => `
        <tr>
          <td><span class="small text-muted">${item.date}</span></td>
          <td>
            <span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark);">
              ${item.category}
            </span>
          </td>
          <td><strong>${item.desc}</strong></td>
          <td><span class="fw-bold">${formatMoney(item.amount)}</span></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-1 py-0 px-2" onclick="editExpense('${item.id}')" title="Edit Item">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteExpense('${item.id}')" title="Remove Item">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Calculate totals
    const totalOutflow = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const income = parseFloat(incomeInput ? incomeInput.value : 50000) || 50000;
    const remaining = income - totalOutflow;

    if (totalAmountEl) totalAmountEl.textContent = formatMoney(totalOutflow);
    if (remainingEl) {
      remainingEl.textContent = formatMoney(remaining);
      remainingEl.className = remaining >= 0 ? 'fs-5 text-success fw-bold' : 'fs-5 text-danger fw-bold';
    }

    // Persist
    try {
      localStorage.setItem('bb_expense_records', JSON.stringify(expenses));
    } catch (e) {}
  }

  // Add / Update Expense
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      if (errorEl) errorEl.textContent = '';

      const date = dateInput ? dateInput.value : '';
      const category = catSelect ? catSelect.value : 'Food';
      const amount = parseFloat(amountInput ? amountInput.value : 0);
      const desc = descInput ? descInput.value.trim() : '';

      if (!date) {
        if (errorEl) errorEl.textContent = 'Please specify a valid expense date.';
        return;
      }
      if (!desc) {
        if (errorEl) errorEl.textContent = 'Please provide a brief description for this expense.';
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        if (errorEl) errorEl.textContent = 'Please enter a valid expense amount greater than zero.';
        return;
      }

      if (editingId) {
        // Update existing item
        const item = expenses.find(e => e.id === editingId);
        if (item) {
          item.date = date;
          item.category = category;
          item.amount = amount;
          item.desc = desc;
        }
        editingId = null;
        btnAdd.innerHTML = '<span>Add Expense</span> <i class="bi bi-plus-lg"></i>';
      } else {
        // Add new item
        const newItem = {
          id: 'e-' + Date.now(),
          date,
          category,
          amount,
          desc
        };
        expenses.unshift(newItem);
      }

      // Reset form
      if (descInput) descInput.value = '';
      if (amountInput) amountInput.value = '';
      renderExpenses();
    });
  }

  window.editExpense = function(id) {
    const item = expenses.find(e => e.id === id);
    if (!item) return;

    if (dateInput) dateInput.value = item.date;
    if (catSelect) catSelect.value = item.category;
    if (amountInput) amountInput.value = item.amount;
    if (descInput) descInput.value = item.desc;

    editingId = id;
    if (btnAdd) {
      btnAdd.innerHTML = '<span>Update Expense</span> <i class="bi bi-check-lg"></i>';
    }
    if (descInput) descInput.focus();
  };

  window.deleteExpense = function(id) {
    expenses = expenses.filter(e => e.id !== id);
    if (editingId === id) {
      editingId = null;
      if (btnAdd) btnAdd.innerHTML = '<span>Add Expense</span> <i class="bi bi-plus-lg"></i>';
    }
    renderExpenses();
  };

  if (incomeInput) {
    incomeInput.addEventListener('input', renderExpenses);
  }

  renderExpenses();
}

/**
 * 4. MONEY MISTAKES ACCORDION CONTROLLER
 */
function initMoneyMistakes() {
  const container = document.getElementById('moneyMistakesContainer');
  if (!container || !BB_DATA.mistakes || !BB_DATA.mistakes.mistakes) return;

  container.innerHTML = BB_DATA.mistakes.mistakes.map((m, idx) => `
    <div class="bb-mistake-card mb-3 reveal visible">
      <div class="bb-mistake-header" onclick="toggleMistakeAccordion('mistake-body-${idx}')">
        <div class="d-flex align-items-center gap-3">
          <div class="bb-mistake-icon">
            <i class="bi ${m.icon || 'bi-exclamation-triangle'}"></i>
          </div>
          <div>
            <span class="small text-muted text-uppercase fw-bold d-block">Pitfall 0${idx + 1}</span>
            <h5 class="mb-0 fw-bold">${m.topic}</h5>
          </div>
        </div>
        <i class="bi bi-chevron-down bb-mistake-chevron" id="chevron-mistake-body-${idx}"></i>
      </div>
      <div id="mistake-body-${idx}" class="bb-mistake-body ${idx === 0 ? '' : 'd-none'}">
        <div class="p-3 mb-2 rounded" style="background: var(--lavender-soft); border-left: 3px solid var(--lavender-dark);">
          <strong class="d-block small text-muted text-uppercase mb-1">
            <i class="bi bi-eye text-primary me-1"></i> The Scenario
          </strong>
          <p class="small mb-0 text-dark">${m.situation}</p>
        </div>
        <div class="p-3 mb-2 rounded" style="background: rgba(220, 53, 69, 0.05); border-left: 3px solid #dc3545;">
          <strong class="d-block small text-danger text-uppercase mb-1">
            <i class="bi bi-x-octagon text-danger me-1"></i> Why It Harms Your Finances
          </strong>
          <p class="small mb-0 text-dark">${m.whyProblem}</p>
        </div>
        <div class="p-3 rounded" style="background: rgba(40, 167, 69, 0.06); border-left: 3px solid #28a745;">
          <strong class="d-block small text-success text-uppercase mb-1">
            <i class="bi bi-shield-check text-success me-1"></i> The Smarter Action
          </strong>
          <p class="small mb-0 text-dark">${m.betterAction}</p>
        </div>
      </div>
    </div>
  `).join('');

  window.toggleMistakeAccordion = function(bodyId) {
    const body = document.getElementById(bodyId);
    const chevron = document.getElementById(`chevron-${bodyId}`);
    if (!body) return;

    const isClosed = body.classList.contains('d-none');
    body.classList.toggle('d-none', !isClosed);
    if (chevron) {
      chevron.style.transform = isClosed ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  };
}

/**
 * 5. FEEDBACK FORM CONTROLLER
 * Rating selector, character counter, required field validation, submit animation, confirmation
 */
function initFeedbackForm() {
  const form = document.getElementById('bbFeedbackForm');
  const ratingButtons = document.querySelectorAll('.btn-rating-star');
  const ratingInput = document.getElementById('fbRating');
  const commentsInput = document.getElementById('fbComments');
  const charCounter = document.getElementById('fbCharCount');
  const successAlert = document.getElementById('fbSuccessAlert');

  // Rating selection
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.ratingValue;
      if (ratingInput) ratingInput.value = val;

      ratingButtons.forEach(b => {
        const bVal = parseInt(b.dataset.ratingValue, 10);
        if (bVal <= parseInt(val, 10)) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    });
  });

  // Character counter
  if (commentsInput && charCounter) {
    commentsInput.addEventListener('input', () => {
      const len = commentsInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.classList.add('text-danger');
      } else {
        charCounter.classList.remove('text-danger');
      }
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity() || !ratingInput?.value) {
        e.stopPropagation();
        form.classList.add('was-validated');
        if (!ratingInput?.value) {
          const ratingErr = document.getElementById('fbRatingError');
          if (ratingErr) ratingErr.classList.remove('d-none');
        }
        return;
      }

      // Hide rating error if valid
      const ratingErr = document.getElementById('fbRatingError');
      if (ratingErr) ratingErr.classList.add('d-none');

      // Submit feedback animation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : 'Submit Feedback';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Submitting Feedback...';
      }

      setTimeout(() => {
        if (successAlert) successAlert.classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
        ratingButtons.forEach(b => b.classList.remove('active'));
        if (charCounter) charCounter.textContent = '0 / 500';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }

        // Hide success alert after 8 seconds
        setTimeout(() => {
          if (successAlert) successAlert.classList.add('d-none');
        }, 8000);
      }, 700);
    });
  }
}

/**
 * 6. CHECKLIST WIDGET CONTROLLER (With LocalStorage Persistence)
 */
function initChecklistWidget() {
  const container = document.getElementById('checklistItemsContainer');
  const countEl = document.getElementById('checklistCompletedCount');
  const totalEl = document.getElementById('checklistTotalCount');
  const pctEl = document.getElementById('checklistPercent');
  const barEl = document.getElementById('checklistProgressBar');
  const celebrationEl = document.getElementById('checklistCelebration');
  const resetBtn = document.getElementById('btnResetChecklist');

  if (!container || !BB_DATA.checklist) return;

  // Restore from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('bb_checklist_state') || 'null');
    if (saved && Array.isArray(saved)) {
      BB_DATA.checklist.forEach(item => {
        const found = saved.find(s => s.id === item.id);
        if (found) item.done = found.done;
      });
    }
  } catch (e) {}

  function renderChecklist() {
    container.innerHTML = BB_DATA.checklist.map(item => `
      <div class="bb-check-item ${item.done ? 'checked' : ''}" onclick="toggleChecklistItem('${item.id}')">
        <div class="bb-check-box">
          <i class="bi bi-check-lg"></i>
        </div>
        <div class="bb-check-text">
          <h5>${item.title}</h5>
          <p>${item.desc}</p>
        </div>
      </div>
    `).join('');

    const completed = BB_DATA.checklist.filter(i => i.done).length;
    const total = BB_DATA.checklist.length;
    const pct = Math.round((completed / total) * 100);

    if (countEl) countEl.textContent = completed;
    if (totalEl) totalEl.textContent = total;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;

    // Completion State Celebration
    if (celebrationEl) {
      if (completed === total) {
        celebrationEl.classList.remove('d-none');
      } else {
        celebrationEl.classList.add('d-none');
      }
    }

    // Persist
    try {
      const stateToSave = BB_DATA.checklist.map(i => ({ id: i.id, done: i.done }));
      localStorage.setItem('bb_checklist_state', JSON.stringify(stateToSave));
    } catch (e) {}
  }

  window.toggleChecklistItem = function(id) {
    const item = BB_DATA.checklist.find(i => i.id === id);
    if (item) {
      item.done = !item.done;
      renderChecklist();
    }
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      BB_DATA.checklist.forEach(i => i.done = false);
      renderChecklist();
    });
  }

  renderChecklist();
}

/**
 * 7. BUDGET SUMMARY DASHBOARD WIDGET
 */
function initBudgetSummaryDashboard() {
  const incEl = document.getElementById('dashIncome');
  const expEl = document.getElementById('dashExpenses');
  const savEl = document.getElementById('dashSavings');
  const remEl = document.getElementById('dashRemaining');

  function updateDashboard() {
    const income = 50000;
    let needsSum = 0, wantsSum = 0, savingsSum = 0;

    if (BB_DATA.budgetItems) {
      BB_DATA.budgetItems.forEach(item => {
        if (item.type === 'Needs') needsSum += item.amount;
        else if (item.type === 'Wants') wantsSum += item.amount;
        else if (item.type === 'Savings') savingsSum += item.amount;
      });
    }

    const totalExpenses = needsSum + wantsSum;
    const remaining = income - totalExpenses - savingsSum;

    if (incEl) incEl.textContent = formatMoney(income);
    if (expEl) expEl.textContent = formatMoney(totalExpenses);
    if (savEl) savEl.textContent = formatMoney(savingsSum);
    if (remEl) {
      remEl.textContent = formatMoney(remaining);
      remEl.className = remaining >= 0 ? 'fs-5 text-success fw-bold' : 'fs-5 text-danger fw-bold';
    }
  }

  updateDashboard();
}

/**
 * 8. NEEDS VS WANTS QUICK QUIZ
 */
function initNeedsWantsQuiz() {
  const quizItems = (BB_DATA.needsWants && BB_DATA.needsWants.curriculum && BB_DATA.needsWants.curriculum.quickQuiz)
    ? BB_DATA.needsWants.curriculum.quickQuiz
    : [
      { id: 1, item: "Daily specialty iced latte before class", category: "Want", rationale: "While delicious, basic hydration or home-brewed tea satisfies caffeine needs at a fraction of the cost." },
      { id: 2, item: "Prescription spectacles / contact lenses", category: "Need", rationale: "Vision correction is an essential medical and educational prerequisite to participate in daily activities." },
      { id: 3, item: "Flagship smartphone upgrade while current phone works", category: "Want", rationale: "An upgrade is a lifestyle desire when your current device reliably handles calling and coursework." },
      { id: 4, item: "Nutritious grocery staples (rice, lentils, produce)", category: "Need", rationale: "Baseline nutritional sustenance is non-negotiable for human health and daily energy." },
      { id: 5, item: "Front-row tickets to a touring music concert", category: "Want", rationale: "Live entertainment brings joy, but your survival, health, and academic requirements do not depend on it." }
    ];

  const quizContainer = document.getElementById('nvwQuizContainer');
  if (!quizContainer) return;

  quizContainer.innerHTML = quizItems.map(q => `
    <div class="bb-quiz-item mb-2" id="quiz-row-${q.id}">
      <div class="bb-quiz-item-name">
        <i class="bi bi-question-diamond text-primary me-2"></i>
        <span>${q.item}</span>
      </div>
      <div class="bb-quiz-btn-group">
        <button class="btn-quiz-opt" onclick="checkQuizAnswer(${q.id}, 'Need')">Need</button>
        <button class="btn-quiz-opt" onclick="checkQuizAnswer(${q.id}, 'Want')">Want</button>
      </div>
    </div>
    <div id="quiz-feedback-${q.id}" class="small text-muted px-3 pb-2 d-none"></div>
  `).join('');

  window.checkQuizAnswer = function(id, selected) {
    const q = quizItems.find(item => item.id === id);
    if (!q) return;

    const row = document.getElementById(`quiz-row-${id}`);
    const feedback = document.getElementById(`quiz-feedback-${id}`);
    const buttons = row.querySelectorAll('.btn-quiz-opt');

    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === q.category) {
        btn.classList.add('correct');
      } else if (btn.textContent === selected && selected !== q.category) {
        btn.classList.add('incorrect');
      }
    });

    if (feedback) {
      feedback.classList.remove('d-none');
      const isCorrect = selected === q.category;
      feedback.innerHTML = `
        <span class="${isCorrect ? 'text-success' : 'text-danger'} fw-bold">
          <i class="bi ${isCorrect ? 'bi-check-circle' : 'bi-info-circle'} me-1"></i>
          ${isCorrect ? 'Correct discernment!' : `Actually classified as a ${q.category}.`}
        </span>
        <span class="d-block mt-1">${q.rationale}</span>
      `;
    }
  };
}

/**
 * Switch Needs vs Wants Focus
 */
window.switchNvwConcept = function(concept) {
  const target = document.getElementById('nvwQuizContainer') || document.getElementById('needs-wants');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

window.scrollToQuiz = function() {
  const quiz = document.getElementById('nvwQuizContainer');
  if (quiz) {
    quiz.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

/**
 * 9. CONTACT FORM CONTROLLER
 */
function initContactForm() {
  const form = document.getElementById('bbContactForm');
  const toastEl = document.getElementById('appToast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const name = document.getElementById('cfName')?.value || 'Student';
    showToast(`Thank you, ${name}. Your inquiry has been submitted. Our educational team will respond shortly.`);
    form.reset();
    form.classList.remove('was-validated');
  });

  function showToast(message) {
    if (!toastEl) return;
    const body = toastEl.querySelector('.toast-body');
    if (body) body.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
  }
}

/**
 * 10. SCROLL, BACK TO TOP, AND ANIMATIONS
 */
function initScrollAndAnimations() {
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }, { passive: true });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }
  const footerBackToTop = document.getElementById('footerBackToTop');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', scrollToTop);
  }

  // Intersection Observer for controlled reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  window.bbObserver = observer;
  window.refreshRevealAnimations = function() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  };

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
