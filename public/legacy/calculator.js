/**
 * BudgetBasics - Calculator Modules
 * Powers 50/30/20 Rule Calculator, Comprehensive Budget Calculator, and Saving Goals
 */

function initCalculators() {
  setup503020Calculator();
  setupBudgetCalculator();
  setupSavingGoalsCalculator();
}

/**
 * Tool 1: 50/30/20 Rule Calculator
 */
function setup503020Calculator() {
  const input = document.getElementById('calcIncomeInput');
  const btn = document.getElementById('btnCalc503020');
  const errorEl = document.getElementById('calc503020Error');
  const resultArea = document.getElementById('result503020');

  const needsAmount = document.getElementById('calcNeedsAmount');
  const wantsAmount = document.getElementById('calcWantsAmount');
  const savingsAmount = document.getElementById('calcSavingsAmount');

  function calculate() {
    const val = parseFloat(input.value);
    errorEl.textContent = '';

    if (isNaN(val) || val <= 0) {
      errorEl.textContent = 'Please enter a valid positive monthly income.';
      resultArea.classList.add('d-none');
      return;
    }

    const needs = val * 0.50;
    const wants = val * 0.30;
    const savings = val * 0.20;

    needsAmount.textContent = formatMoney(needs);
    wantsAmount.textContent = formatMoney(wants);
    savingsAmount.textContent = formatMoney(savings);

    resultArea.classList.remove('d-none');
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (btn) btn.addEventListener('click', calculate);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calculate();
    });
  }
}

/**
 * Tool 2: Comprehensive Budget Calculator (Income, Expenses, Savings Target)
 */
function setupBudgetCalculator() {
  const incInput = document.getElementById('bcIncome');
  const fixedInput = document.getElementById('bcFixedExp');
  const varInput = document.getElementById('bcVarExp');
  const targetInput = document.getElementById('bcTargetSave');
  const btn = document.getElementById('btnCalculateBudgetComprehensive');
  const errEl = document.getElementById('bcError');
  const resultArea = document.getElementById('bcResultArea');

  const totalExpEl = document.getElementById('bcTotalExpenses');
  const netSurplusEl = document.getElementById('bcNetSurplus');
  const saveRateEl = document.getElementById('bcSavingsRate');
  const healthBadgeEl = document.getElementById('bcHealthBadge');
  const adviceEl = document.getElementById('bcAdvice');

  function calculateComprehensive() {
    const income = parseFloat(incInput.value) || 0;
    const fixed = parseFloat(fixedInput.value) || 0;
    const variable = parseFloat(varInput.value) || 0;
    const targetSave = parseFloat(targetInput.value) || 0;

    errEl.textContent = '';

    if (income <= 0) {
      errEl.textContent = 'Please specify a monthly income greater than zero.';
      resultArea.classList.add('d-none');
      return;
    }

    const totalExpenses = fixed + variable;
    const netSurplus = income - totalExpenses;
    const actualSavings = Math.max(0, netSurplus);
    const savingsRate = Math.round((actualSavings / income) * 100);

    totalExpEl.textContent = formatMoney(totalExpenses);
    netSurplusEl.textContent = formatMoney(netSurplus);
    saveRateEl.textContent = `${savingsRate}%`;

    // Health Analysis
    if (netSurplus < 0) {
      healthBadgeEl.className = 'badge bg-danger p-2 text-uppercase';
      healthBadgeEl.textContent = 'Deficit Warning';
      adviceEl.innerHTML = `<strong>Attention Required:</strong> Your planned expenses exceed your monthly income by ${formatMoney(Math.abs(netSurplus))}. Immediate reduction of flexible expenses or adjusting variable categories is recommended to avoid debt.`;
    } else if (netSurplus < targetSave) {
      healthBadgeEl.className = 'badge bg-warning text-dark p-2 text-uppercase';
      healthBadgeEl.textContent = 'Surplus Below Target';
      adviceEl.innerHTML = `<strong>Moderate Resilience:</strong> You have a positive surplus of ${formatMoney(netSurplus)}, which is slightly below your target of ${formatMoney(targetSave)}. Trimming non-essential discretionary wants will bridge the gap.`;
    } else {
      healthBadgeEl.className = 'badge bg-success p-2 text-uppercase';
      healthBadgeEl.textContent = 'Healthy Balance';
      adviceEl.innerHTML = `<strong>Optimal Health:</strong> Your budget generates a healthy surplus of ${formatMoney(netSurplus)}, comfortably meeting your savings target. You have achieved a solid ${savingsRate}% savings rate!`;
    }

    resultArea.classList.remove('d-none');
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (btn) btn.addEventListener('click', calculateComprehensive);
}

/**
 * Tool 3: Saving Goals Planner
 */
function setupSavingGoalsCalculator() {
  const nameInput = document.getElementById('sgGoalName');
  const targetInput = document.getElementById('sgTargetAmount');
  const currentInput = document.getElementById('sgCurrentAmount');
  const monthlyInput = document.getElementById('sgMonthlyContrib');
  const btn = document.getElementById('btnCalculateSavingGoal');
  const errEl = document.getElementById('sgError');
  const resultArea = document.getElementById('sgResultArea');

  const titleEl = document.getElementById('sgResultTitle');
  const remainingEl = document.getElementById('sgRemainingAmount');
  const monthsEl = document.getElementById('sgMonthsEstimated');
  const percentEl = document.getElementById('sgProgressPercent');
  const barEl = document.getElementById('sgProgressBar');
  const milestoneAdviceEl = document.getElementById('sgMilestoneAdvice');

  // Restore goal from localStorage if available
  try {
    const savedGoal = JSON.parse(localStorage.getItem('bb_saved_goal') || 'null');
    if (savedGoal && nameInput && targetInput && monthlyInput) {
      nameInput.value = savedGoal.name || '';
      targetInput.value = savedGoal.target || '';
      if (currentInput) currentInput.value = savedGoal.current || '';
      monthlyInput.value = savedGoal.monthly || '';
    }
  } catch (e) {}

  function calculateGoal() {
    const name = nameInput.value.trim() || 'My Savings Goal';
    const target = parseFloat(targetInput.value);
    const current = parseFloat(currentInput.value) || 0;
    const monthly = parseFloat(monthlyInput.value);

    errEl.textContent = '';

    if (isNaN(target) || target <= 0 || isNaN(monthly) || monthly <= 0 || current < 0) {
      errEl.textContent = 'Please enter valid positive numbers for target and monthly contribution.';
      resultArea.classList.add('d-none');
      return;
    }

    // Persist goal inputs
    try {
      localStorage.setItem('bb_saved_goal', JSON.stringify({
        name,
        target,
        current,
        monthly
      }));
    } catch (e) {}

    if (current >= target) {
      errEl.textContent = 'Current savings already meets or exceeds the target!';
      resultArea.classList.remove('d-none');
      titleEl.textContent = name;
      remainingEl.textContent = 'Target Achieved!';
      monthsEl.textContent = '0 months';
      percentEl.textContent = '100%';
      barEl.style.width = '100%';
      milestoneAdviceEl.innerHTML = '<strong>Milestone Unlocked:</strong> Congratulations! You have fully funded this goal. Direct your next monthly savings transfer toward an emergency buffer or long-term growth.';
      return;
    }

    const remaining = target - current;
    const months = Math.ceil(remaining / monthly);
    const percent = Math.min(100, Math.round((current / target) * 100));

    titleEl.textContent = name;
    remainingEl.textContent = formatMoney(remaining);
    monthsEl.textContent = `${months} month${months === 1 ? '' : 's'}`;
    percentEl.textContent = `${percent}%`;
    barEl.style.width = `${percent}%`;

    const tip = months > 12
      ? "Pro-Tip: For long-horizon goals over 12 months, break milestones into quarterly mini-targets to maintain motivation."
      : "Pro-Tip: Automate this exact monthly contribution into a separate high-yield account right on stipend day.";

    milestoneAdviceEl.innerHTML = `<strong>Timeline Forecast:</strong> At a disciplined rate of ${formatMoney(monthly)} per month, you are projected to reach this milestone in approximately ${months} months. <br><span class="text-primary mt-1 d-block"><i class="bi bi-lightbulb me-1"></i>${tip}</span>`;

    resultArea.classList.remove('d-none');
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (btn) btn.addEventListener('click', calculateGoal);
}
