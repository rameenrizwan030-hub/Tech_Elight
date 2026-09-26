/**
 * BudgetBasics - Planning Section Controller
 * Powers Planning tabs, Guiding Questions Wizard, and Interactive Budget Planner table
 */

function initPlanning() {
  setupPlanningTabs();
  setupGuidingQuestions();
  setupBudgetPlannerTable();
}

/**
 * Switching Planning Tabs
 */
window.switchPlanningTab = function(toolId) {
  if (!toolId) return;
  BB_DATA.activePlanningTool = toolId;

  // Update nav tabs specifically for planning tools
  const planningTabs = document.querySelectorAll('#planningTabsNav .bb-planning-tab, [data-tool-id]');
  planningTabs.forEach(tab => {
    if (tab.dataset && tab.dataset.toolId) {
      if (tab.dataset.toolId === toolId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    }
  });

  // Update panels
  document.querySelectorAll('.bb-tool-panel').forEach(panel => {
    if (panel.id === `panel-${toolId}` || panel.id === `practice-${toolId}` || panel.id === toolId) {
      panel.classList.remove('d-none');
    } else {
      panel.classList.add('d-none');
    }
  });

  if (typeof window.refreshRevealAnimations === 'function') {
    window.refreshRevealAnimations();
  }
};

window.switchPracticeTab = window.switchPlanningTab;

function setupPlanningTabs() {
  const container = document.getElementById('planningTabsNav');
  const tabs = container ? container.querySelectorAll('[data-tool-id]') : document.querySelectorAll('[data-tool-id]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const toolId = tab.dataset.toolId;
      if (toolId) {
        switchPlanningTab(toolId);
      }
    });
  });
}

/**
 * Guiding Questions Wizard
 */
function setupGuidingQuestions() {
  const steps = [
    { id: 'gqIncome', title: 'What is your typical monthly net income?', hint: 'Include all regular take-home earnings you are certain to receive.', placeholder: '50000', defaultValue: 50000 },
    { id: 'gqNeeds', title: 'What are your total essential expenses (Needs)?', hint: 'Rent/hostel, basic food staples, utilities, required transit, tuition.', placeholder: '25000', defaultValue: 25000 },
    { id: 'gqWants', title: 'What do you typically spend on lifestyle choices (Wants)?', hint: 'Dining out, cafes, subscriptions, shopping, games, entertainment.', placeholder: '15000', defaultValue: 15000 },
    { id: 'gqSavings', title: 'How much do you currently manage to save each month?', hint: 'Money moved into savings or an emergency reserve that remains unspent.', placeholder: '10000', defaultValue: 10000 },
    { id: 'gqGoal', title: 'What is your primary savings milestone right now?', hint: 'Select the primary priority you want to achieve first.', isSelect: true, options: [
      'Building a Starter Emergency Buffer (Rs. 15,000 - 30,000)',
      'Tech or University Equipment (Laptop, tablet, certification)',
      'Tuition Fee & Semester Sinking Fund',
      'Future Travel or Personal Milestone',
      'Long-term Investing & Independence'
    ] }
  ];

  let currentStep = 0;
  const answers = { income: 50000, needs: 25000, wants: 15000, savings: 10000, goal: '' };

  const questionCard = document.getElementById('gqQuestionArea');
  const resultCard = document.getElementById('gqResultArea');
  const stepDots = document.querySelectorAll('.bb-step-dot');
  const btnNext = document.getElementById('btnGqNext');
  const btnPrev = document.getElementById('btnGqPrev');
  const btnRestart = document.getElementById('btnGqRestart');

  function renderStep(idx) {
    currentStep = idx;

    // Update dots
    stepDots.forEach((dot, i) => {
      dot.className = 'bb-step-dot';
      if (i < idx) dot.classList.add('completed');
      else if (i === idx) dot.classList.add('active');
    });

    const step = steps[idx];
    let inputHtml = '';

    if (step.isSelect) {
      inputHtml = `
        <select id="gqInput" class="form-select form-select-lg mb-3">
          ${step.options.map((opt, i) => `<option value="${opt}" ${i === 0 ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      `;
    } else {
      inputHtml = `
        <div class="input-group input-group-lg mb-3">
          <span class="input-group-text" style="background: var(--bb-lav-100); color: var(--bb-lav-700); font-weight: 700;">Rs.</span>
          <input type="number" id="gqInput" class="form-control" placeholder="${step.placeholder}" value="${step.defaultValue}">
        </div>
      `;
    }

    questionCard.innerHTML = `
      <span class="bb-eyebrow mb-2">Question ${idx + 1} of 5</span>
      <h4 class="fw-bold mb-2">${step.title}</h4>
      <p class="text-muted small mb-3">${step.hint}</p>
      ${inputHtml}
      <div id="gqStepError" class="text-danger small mb-2"></div>
    `;

    btnPrev.style.display = idx === 0 ? 'none' : 'inline-flex';
    btnNext.innerHTML = idx === steps.length - 1 ? '<span>Complete Assessment</span> <i class="bi bi-check-lg"></i>' : '<span>Next Question</span> <i class="bi bi-arrow-right"></i>';

    questionCard.classList.remove('d-none');
    resultCard.classList.add('d-none');
  }

  function handleNext() {
    const input = document.getElementById('gqInput');
    const errEl = document.getElementById('gqStepError');
    if (!input) return;

    if (currentStep < 4) {
      const val = parseFloat(input.value);
      if (isNaN(val) || val < 0) {
        if (errEl) errEl.textContent = 'Please enter a valid positive number.';
        return;
      }
      if (currentStep === 0) answers.income = val;
      if (currentStep === 1) answers.needs = val;
      if (currentStep === 2) answers.wants = val;
      if (currentStep === 3) answers.savings = val;
    } else {
      answers.goal = input.value;
      showDiagnosticScore();
      return;
    }

    renderStep(currentStep + 1);
  }

  function handlePrev() {
    if (currentStep > 0) {
      renderStep(currentStep - 1);
    }
  }

  function showDiagnosticScore() {
    questionCard.classList.add('d-none');
    btnNext.style.display = 'none';
    btnPrev.style.display = 'none';

    // Calculate score & stats
    const income = answers.income || 1;
    const needsPct = Math.round((answers.needs / income) * 100);
    const wantsPct = Math.round((answers.wants / income) * 100);
    const savingsPct = Math.round((answers.savings / income) * 100);
    const totalOut = answers.needs + answers.wants;
    const net = income - totalOut;

    let score = 70;
    if (needsPct <= 50) score += 15;
    else if (needsPct > 65) score -= 15;

    if (savingsPct >= 20) score += 15;
    else if (savingsPct < 10) score -= 10;

    if (net < 0) score -= 25;
    score = Math.max(10, Math.min(100, score));

    document.getElementById('gqScoreNumber').textContent = score;
    document.getElementById('gqAnalysisText').innerHTML = `
      <div class="row g-3 text-start mb-3">
        <div class="col-sm-4">
          <div class="bb-card-flat text-center">
            <span class="small text-muted d-block">Needs Ratio</span>
            <strong class="fs-5">${needsPct}%</strong>
            <small class="d-block text-muted">Benchmark: 50%</small>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="bb-card-flat text-center">
            <span class="small text-muted d-block">Wants Ratio</span>
            <strong class="fs-5">${wantsPct}%</strong>
            <small class="d-block text-muted">Benchmark: 30%</small>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="bb-card-flat text-center">
            <span class="small text-muted d-block">Savings Rate</span>
            <strong class="fs-5 ${savingsPct >= 20 ? 'text-success' : 'text-warning'}">${savingsPct}%</strong>
            <small class="d-block text-muted">Benchmark: 20%</small>
          </div>
        </div>
      </div>
      <div class="p-3 rounded text-start" style="background: var(--bb-lav-100); border: 1px solid var(--bb-border);">
        <strong class="d-block mb-1 text-dark"><i class="bi bi-compass text-primary me-1"></i> Tailored Action Roadmap:</strong>
        <p class="small text-muted mb-2">Primary Target: <strong>${answers.goal}</strong></p>
        <p class="small text-muted mb-0">
          ${score >= 80 ? 'Your financial structure shows excellent discipline. Maintain this consistency and automate contributions toward your primary milestone.' :
            score >= 60 ? 'Your foundation is moderate. Focus on trimming discretionary lifestyle wants by 5-10% to channel additional funds into your emergency cushion.' :
            'Your monthly outflows are placing heavy pressure on cash flow. Enforce the 24-hour waiting rule immediately and track daily variable purchases.'}
        </p>
      </div>
    `;

    resultCard.classList.remove('d-none');
  }

  if (btnNext) btnNext.addEventListener('click', handleNext);
  if (btnPrev) btnPrev.addEventListener('click', handlePrev);
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      btnNext.style.display = 'inline-flex';
      renderStep(0);
    });
  }

  // Initial render
  if (questionCard) renderStep(0);
}

/**
 * Interactive Budget Planner Line-Item Table
 */
function setupBudgetPlannerTable() {
  const tableBody = document.getElementById('bpTableBody');
  const addBtn = document.getElementById('bpBtnAdd');
  const nameInput = document.getElementById('bpItemName');
  const catInput = document.getElementById('bpItemCategory');
  const typeInput = document.getElementById('bpItemType');
  const amountInput = document.getElementById('bpItemAmount');
  const errEl = document.getElementById('bpError');

  const totalNeedsEl = document.getElementById('bpTotalNeeds');
  const totalWantsEl = document.getElementById('bpTotalWants');
  const totalSavingsEl = document.getElementById('bpTotalSavings');
  const grandTotalEl = document.getElementById('bpGrandTotal');

  function renderTable() {
    if (!tableBody) return;

    if (BB_DATA.budgetItems.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No budget line items added yet. Use the form above to add your expenses.</td></tr>`;
    } else {
      tableBody.innerHTML = BB_DATA.budgetItems.map(item => `
        <tr>
          <td class="fw-semibold">${item.name}</td>
          <td><span class="badge rounded-pill" style="background: var(--bb-lav-100); color: var(--bb-lav-800);">${item.category}</span></td>
          <td><span class="badge ${item.type === 'Needs' ? 'bg-primary' : item.type === 'Wants' ? 'bg-secondary' : 'bg-success'}">${item.type}</span></td>
          <td class="fw-bold">${formatMoney(item.amount)}</td>
          <td class="text-end">
            <button class="bb-btn-del" onclick="deleteBudgetItem(${item.id})" title="Remove item" aria-label="Remove item">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Calculate sums
    let needsSum = 0, wantsSum = 0, savingsSum = 0;
    BB_DATA.budgetItems.forEach(item => {
      if (item.type === 'Needs') needsSum += item.amount;
      else if (item.type === 'Wants') wantsSum += item.amount;
      else if (item.type === 'Savings') savingsSum += item.amount;
    });

    const grandTotal = needsSum + wantsSum + savingsSum;

    if (totalNeedsEl) totalNeedsEl.textContent = formatMoney(needsSum);
    if (totalWantsEl) totalWantsEl.textContent = formatMoney(wantsSum);
    if (totalSavingsEl) totalSavingsEl.textContent = formatMoney(savingsSum);
    if (grandTotalEl) grandTotalEl.textContent = formatMoney(grandTotal);
  }

  window.deleteBudgetItem = function(id) {
    BB_DATA.budgetItems = BB_DATA.budgetItems.filter(item => item.id !== id);
    renderTable();
  };

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const category = catInput.value;
      const type = typeInput.value;
      const amount = parseFloat(amountInput.value);

      if (errEl) errEl.textContent = '';

      if (!name || isNaN(amount) || amount <= 0) {
        if (errEl) errEl.textContent = 'Please specify a descriptive name and a positive amount.';
        return;
      }

      BB_DATA.budgetItems.push({
        id: Date.now(),
        name,
        category,
        type,
        amount
      });

      nameInput.value = '';
      amountInput.value = '';
      renderTable();
    });
  }

  // Initial render of budget planner items
  renderTable();
}
