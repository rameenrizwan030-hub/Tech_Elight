/**
 * BudgetBasics - Learn Through Play / Money Games Controller
 * Powers 5 Educational Games:
 * 1. Needs vs Wants Challenge
 * 2. 50/30/20 Allocation Challenge
 * 3. Saving Goal Challenge
 * 4. Budget Detective
 * 5. Smart Spending Quiz
 * Strictly NO emojis - Clean icons and professional UI
 */

function initGames() {
  setupGamesTabs();
  initNeedsWantsGame();
  init503020Game();
  initSavingGoalGame();
  initBudgetDetectiveGame();
  initSmartSpendingQuiz();
}

/**
 * Game Tabs Switcher
 */
function setupGamesTabs() {
  const tabs = document.querySelectorAll('.bb-game-tab');
  const panels = document.querySelectorAll('.bb-game-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.gameTarget;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.remove('d-none');
        } else {
          p.classList.add('d-none');
        }
      });
    });
  });
}

/**
 * GAME 1: Needs vs Wants Challenge
 */
function initNeedsWantsGame() {
  const container = document.getElementById('nvwGameContainer');
  if (!container || !BB_DATA.games || !BB_DATA.games.needsVsWants) return;

  const questions = BB_DATA.games.needsVsWants;
  let currentIndex = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIndex >= questions.length) {
      renderCompletion();
      return;
    }

    const q = questions[currentIndex];
    const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

    container.innerHTML = `
      <div class="bb-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="bb-eyebrow mb-0">Question ${currentIndex + 1} of ${questions.length}</span>
          <span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark); font-weight: 700; padding: 6px 12px;">Score: ${score}</span>
        </div>

        <div class="progress mb-4" style="height: 6px; background: var(--lavender-light); border-radius: 10px;">
          <div class="progress-bar" style="width: ${progressPct}%; background: var(--lavender-primary); transition: width 0.3s ease;"></div>
        </div>

        <div class="text-center py-3">
          <span class="d-block text-muted small text-uppercase fw-bold mb-1">Item to Evaluate</span>
          <h3 class="fw-bold mb-3" style="color: var(--text-primary); font-size: 1.5rem;">${q.item}</h3>
          <p class="text-secondary small mb-4">${q.question}</p>

          <div class="d-flex justify-content-center gap-3 mb-4">
            <button class="btn btn-bb-outline px-4 py-2 fw-bold" id="btnChooseNeed">
              <i class="bi bi-shield-check me-1"></i> NEED
            </button>
            <button class="btn btn-bb-outline px-4 py-2 fw-bold" id="btnChooseWant">
              <i class="bi bi-star me-1"></i> WANT
            </button>
          </div>

          <div id="nvwFeedback" class="d-none p-3 rounded text-start mb-3" style="background: var(--lavender-light); border: 1px solid var(--bb-border);">
            <div id="nvwFeedbackTitle" class="fw-bold mb-1"></div>
            <div id="nvwFeedbackText" class="small text-secondary mb-3"></div>
            <button id="btnNvwNext" class="btn btn-bb-primary btn-sm">
              <span>Next Item</span>
              <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnChooseNeed').addEventListener('click', () => handleAnswer('Need'));
    document.getElementById('btnChooseWant').addEventListener('click', () => handleAnswer('Want'));
  }

  function handleAnswer(choice) {
    const q = questions[currentIndex];
    const isCorrect = choice === q.correctAnswer;
    if (isCorrect) score += 10;

    const btnNeed = document.getElementById('btnChooseNeed');
    const btnWant = document.getElementById('btnChooseWant');
    if (btnNeed) btnNeed.disabled = true;
    if (btnWant) btnWant.disabled = true;

    const feedbackBox = document.getElementById('nvwFeedback');
    const feedbackTitle = document.getElementById('nvwFeedbackTitle');
    const feedbackText = document.getElementById('nvwFeedbackText');
    const nextBtn = document.getElementById('btnNvwNext');

    if (feedbackBox && feedbackTitle && feedbackText) {
      feedbackBox.classList.remove('d-none');
      feedbackTitle.className = isCorrect ? 'fw-bold text-success' : 'fw-bold text-danger';
      feedbackTitle.innerHTML = isCorrect
        ? `<i class="bi bi-check-circle me-1"></i> Correct: It is a ${q.correctAnswer}!`
        : `<i class="bi bi-info-circle me-1"></i> Actually classified as a ${q.correctAnswer}`;
      feedbackText.textContent = q.explanation;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        renderQuestion();
      });
    }
  }

  function renderCompletion() {
    const maxScore = questions.length * 10;
    const pct = Math.round((score / maxScore) * 100);

    container.innerHTML = `
      <div class="bb-card text-center p-5">
        <div class="bb-score-circle mb-3">
          <strong class="fs-2">${score}</strong>
          <span class="small text-muted">/ ${maxScore}</span>
        </div>
        <h3 class="fw-bold mb-2">Challenge Completed!</h3>
        <p class="text-secondary small mb-4">
          ${pct >= 80 ? 'Outstanding discernment! You have a keen ability to separate essential needs from optional wants.' :
            pct >= 60 ? 'Good work! A little more practice with everyday expenses will sharpen your budgeting clarity.' :
            'Keep practicing! Remember: if life, health, or coursework does not stop without it, it is a want.'}
        </p>
        <button id="btnRestartNvw" class="btn btn-bb-primary">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Play Again
        </button>
      </div>
    `;

    document.getElementById('btnRestartNvw').addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/**
 * GAME 2: 50/30/20 Challenge
 */
function init503020Game() {
  const container = document.getElementById('game503020Container');
  if (!container || !BB_DATA.games || !BB_DATA.games.challenge503020) return;

  const scenarios = BB_DATA.games.challenge503020;
  let activeScenarioIndex = 0;

  function renderScenario() {
    const s = scenarios[activeScenarioIndex];
    const initialNeeds = Math.round(s.income * 0.45);
    const initialWants = Math.round(s.income * 0.35);
    const initialSavings = s.income - initialNeeds - initialWants;

    container.innerHTML = `
      <div class="bb-card p-4">
        <!-- Scenario Selector Tabs -->
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <span class="bb-eyebrow mb-0">Scenario ${activeScenarioIndex + 1} of ${scenarios.length}</span>
          <div class="btn-group btn-group-sm">
            ${scenarios.map((sc, i) => `
              <button class="btn ${i === activeScenarioIndex ? 'btn-bb-primary' : 'btn-bb-outline'} btn-sm py-1 px-2" onclick="switch503020Scenario(${i})">
                ${sc.title.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <h4 class="fw-bold mb-1">${s.title}</h4>
        <p class="text-secondary small mb-3">${s.description}</p>

        <div class="p-3 rounded mb-4 text-center" style="background: var(--lavender-light); border: 1px solid var(--bb-border);">
          <span class="small text-muted text-uppercase d-block fw-bold mb-1">Monthly Net Inflow</span>
          <strong class="fs-4" style="color: var(--lavender-dark);">${formatMoney(s.income)}</strong>
        </div>

        <!-- Allocation Interactive Sliders -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="bb-card-flat">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>Needs (Target 50%)</span>
                <span id="labelNeedsAmt">${formatMoney(initialNeeds)}</span>
              </div>
              <input type="range" class="form-range" id="rangeNeeds" min="0" max="${s.income}" step="1000" value="${initialNeeds}">
              <small class="text-muted d-block mt-1">Guideline: ${formatMoney(s.targetNeeds)}</small>
            </div>
          </div>
          <div class="col-md-4">
            <div class="bb-card-flat">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>Wants (Target 30%)</span>
                <span id="labelWantsAmt">${formatMoney(initialWants)}</span>
              </div>
              <input type="range" class="form-range" id="rangeWants" min="0" max="${s.income}" step="1000" value="${initialWants}">
              <small class="text-muted d-block mt-1">Guideline: ${formatMoney(s.targetWants)}</small>
            </div>
          </div>
          <div class="col-md-4">
            <div class="bb-card-flat">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>Savings (Target 20%)</span>
                <span id="labelSavingsAmt">${formatMoney(initialSavings)}</span>
              </div>
              <input type="range" class="form-range" id="rangeSavings" min="0" max="${s.income}" step="1000" value="${initialSavings}">
              <small class="text-muted d-block mt-1">Guideline: ${formatMoney(s.targetSavings)}</small>
            </div>
          </div>
        </div>

        <!-- Live Sum Check -->
        <div class="d-flex justify-content-between align-items-center p-2 rounded mb-3 small" style="background: var(--lavender-soft); border: 1px solid var(--bb-border);">
          <span>Total Allocated: <strong id="lblTotalAllocated">${formatMoney(initialNeeds + initialWants + initialSavings)}</strong></span>
          <span id="lblSumStatus" class="fw-bold text-success"><i class="bi bi-check2-circle"></i> Exactly 100% Allocated</span>
        </div>

        <div class="text-center">
          <button id="btnCheck503020" class="btn btn-bb-primary px-4 py-2">
            <span>Verify 50/30/20 Accuracy</span>
            <i class="bi bi-calculator ms-1"></i>
          </button>
        </div>

        <!-- Result Box -->
        <div id="res503020Box" class="mt-4 pt-3 border-top d-none">
          <div id="res503020Badge" class="badge p-2 mb-2 text-uppercase"></div>
          <p id="res503020Text" class="small text-secondary mb-0"></p>
        </div>
      </div>
    `;

    setupRangeListeners(s);
  }

  window.switch503020Scenario = function(idx) {
    activeScenarioIndex = idx;
    renderScenario();
  };

  function setupRangeListeners(s) {
    const rNeeds = document.getElementById('rangeNeeds');
    const rWants = document.getElementById('rangeWants');
    const rSavings = document.getElementById('rangeSavings');

    const lblNeeds = document.getElementById('labelNeedsAmt');
    const lblWants = document.getElementById('labelWantsAmt');
    const lblSavings = document.getElementById('labelSavingsAmt');

    const lblTotal = document.getElementById('lblTotalAllocated');
    const lblStatus = document.getElementById('lblSumStatus');

    function update() {
      const n = parseInt(rNeeds.value);
      const w = parseInt(rWants.value);
      const sv = parseInt(rSavings.value);

      lblNeeds.textContent = formatMoney(n);
      lblWants.textContent = formatMoney(w);
      lblSavings.textContent = formatMoney(sv);

      const total = n + w + sv;
      lblTotal.textContent = formatMoney(total);

      if (total === s.income) {
        lblStatus.className = 'fw-bold text-success';
        lblStatus.innerHTML = '<i class="bi bi-check2-circle"></i> Exactly 100% Allocated';
      } else if (total > s.income) {
        lblStatus.className = 'fw-bold text-danger';
        lblStatus.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Over by ${formatMoney(total - s.income)}`;
      } else {
        lblStatus.className = 'fw-bold text-warning';
        lblStatus.innerHTML = `<i class="bi bi-info-circle"></i> Under by ${formatMoney(s.income - total)}`;
      }
    }

    [rNeeds, rWants, rSavings].forEach(r => r.addEventListener('input', update));

    document.getElementById('btnCheck503020').addEventListener('click', () => {
      const n = parseInt(rNeeds.value);
      const w = parseInt(rWants.value);
      const sv = parseInt(rSavings.value);
      const total = n + w + sv;

      const resBox = document.getElementById('res503020Box');
      const resBadge = document.getElementById('res503020Badge');
      const resText = document.getElementById('res503020Text');

      resBox.classList.remove('d-none');

      if (total !== s.income) {
        resBadge.className = 'badge bg-warning text-dark p-2 mb-2 text-uppercase';
        resBadge.textContent = 'Adjustment Needed';
        resText.textContent = `Your total allocation must match your monthly income of ${formatMoney(s.income)}. Currently, it equals ${formatMoney(total)}.`;
        return;
      }

      const diffN = Math.abs(n - s.targetNeeds);
      const diffW = Math.abs(w - s.targetWants);
      const diffS = Math.abs(sv - s.targetSavings);

      if (diffN <= 1500 && diffW <= 1500 && diffS <= 1500) {
        resBadge.className = 'badge bg-success p-2 mb-2 text-uppercase';
        resBadge.textContent = 'Perfect 50/30/20 Balance!';
        resText.innerHTML = `Brilliant job! You successfully matched the guideline: Needs = ${formatMoney(s.targetNeeds)} (50%), Wants = ${formatMoney(s.targetWants)} (30%), and Savings = ${formatMoney(s.targetSavings)} (20%).`;
      } else {
        resBadge.className = 'badge bg-secondary p-2 mb-2 text-uppercase';
        resBadge.textContent = 'Close - Check Ratios';
        resText.innerHTML = `Your allocations: Needs ${Math.round((n/s.income)*100)}%, Wants ${Math.round((w/s.income)*100)}%, Savings ${Math.round((sv/s.income)*100)}%. The standard 50/30/20 target for this income is <strong>Needs: ${formatMoney(s.targetNeeds)}</strong>, <strong>Wants: ${formatMoney(s.targetWants)}</strong>, and <strong>Savings: ${formatMoney(s.targetSavings)}</strong>.`;
      }
    });
  }

  renderScenario();
}

/**
 * GAME 3: Saving Goal Challenge
 */
function initSavingGoalGame() {
  const container = document.getElementById('savingGoalGameContainer');
  if (!container || !BB_DATA.games || !BB_DATA.games.savingGoalGame) return;

  const goals = BB_DATA.games.savingGoalGame;
  let activeGoalIdx = 0;

  function renderGoal() {
    const g = goals[activeGoalIdx];
    const remaining = g.cost - g.startingSaved;
    const initialPercent = Math.round((g.startingSaved / g.cost) * 100);

    container.innerHTML = `
      <div class="bb-card p-4">
        <!-- Goal Selector Tabs -->
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <span class="bb-eyebrow mb-0">Goal Milestone ${activeGoalIdx + 1} of ${goals.length}</span>
          <div class="btn-group btn-group-sm">
            ${goals.map((goal, i) => `
              <button class="btn ${i === activeGoalIdx ? 'btn-bb-primary' : 'btn-bb-outline'} btn-sm py-1 px-2" onclick="switchGoalGame(${i})">
                ${goal.title.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <h4 class="fw-bold mb-1">${g.title}</h4>
        <p class="text-secondary small mb-3">${g.description}</p>

        <div class="row g-3 mb-4 text-center">
          <div class="col-sm-4">
            <div class="bb-card-flat">
              <span class="small text-muted d-block text-uppercase">Target Cost</span>
              <strong class="fs-5">${formatMoney(g.cost)}</strong>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="bb-card-flat">
              <span class="small text-muted d-block text-uppercase">Saved So Far</span>
              <strong class="fs-5 text-success">${formatMoney(g.startingSaved)}</strong>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="bb-card-flat">
              <span class="small text-muted d-block text-uppercase">Remaining Needed</span>
              <strong class="fs-5 text-primary">${formatMoney(remaining)}</strong>
            </div>
          </div>
        </div>

        <!-- Strategy Options -->
        <label class="form-label small fw-bold text-muted mb-2">Choose a Monthly Contribution Plan:</label>
        <div class="row g-3 mb-4">
          ${g.options.map((opt, i) => `
            <div class="col-md-4">
              <div class="bb-card-flat h-100 p-3 text-center" style="cursor: pointer; transition: all 0.2s ease;" onclick="selectGoalOption(${i})">
                <span class="badge mb-2" style="background: var(--lavender-light); color: var(--lavender-dark);">${opt.label}</span>
                <strong class="d-block fs-5 mb-1" style="color: var(--text-primary);">${formatMoney(opt.monthly)} / mo</strong>
                <span class="small text-muted d-block mb-2">Timeline: <strong>${opt.months} months</strong></span>
                <p class="small text-secondary mb-0" style="font-size: 0.78rem;">${opt.advice}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Visual Progress Display -->
        <div id="sgGameProgressArea" class="d-none p-3 rounded" style="background: var(--lavender-soft); border: 1px solid var(--bb-border);">
          <div class="d-flex justify-content-between small fw-bold text-muted mb-2">
            <span id="sgGameProgressLabel">Timeline Analysis</span>
            <span id="sgGameProgressPct">${initialPercent}%</span>
          </div>
          <div class="progress mb-2" style="height: 12px; background: var(--lavender-light); border-radius: 10px;">
            <div id="sgGameProgressBar" class="progress-bar" style="width: ${initialPercent}%; background: var(--lavender-primary); transition: width 0.6s ease;"></div>
          </div>
          <p id="sgGameOutcomeText" class="small text-secondary mb-0"></p>
        </div>
      </div>
    `;
  }

  window.switchGoalGame = function(idx) {
    activeGoalIdx = idx;
    renderGoal();
  };

  window.selectGoalOption = function(optIdx) {
    const g = goals[activeGoalIdx];
    const opt = g.options[optIdx];
    const remaining = g.cost - g.startingSaved;

    const area = document.getElementById('sgGameProgressArea');
    const label = document.getElementById('sgGameProgressLabel');
    const pctLabel = document.getElementById('sgGameProgressPct');
    const bar = document.getElementById('sgGameProgressBar');
    const text = document.getElementById('sgGameOutcomeText');

    if (!area) return;

    area.classList.remove('d-none');
    label.textContent = `Selected: ${opt.label} (${formatMoney(opt.monthly)}/month)`;
    pctLabel.textContent = `100% in ${opt.months} months`;
    bar.style.width = '100%';
    text.innerHTML = `At ${formatMoney(opt.monthly)} per month, you will accumulate the remaining ${formatMoney(remaining)} in exactly <strong>${opt.months} months</strong>. ${opt.advice}`;
  };

  renderGoal();
}

/**
 * GAME 4: Budget Detective
 */
function initBudgetDetectiveGame() {
  const container = document.getElementById('budgetDetectiveContainer');
  if (!container || !BB_DATA.games || !BB_DATA.games.budgetDetective) return;

  const cases = BB_DATA.games.budgetDetective;
  let activeCaseIdx = 0;
  let currentQIdx = 0;
  let detectiveScore = 0;

  function renderCase() {
    const c = cases[activeCaseIdx];
    const q = c.questions[currentQIdx];

    container.innerHTML = `
      <div class="bb-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <span class="bb-eyebrow mb-0">Case ${activeCaseIdx + 1} of ${cases.length}</span>
          <div class="btn-group btn-group-sm">
            ${cases.map((cs, i) => `
              <button class="btn ${i === activeCaseIdx ? 'btn-bb-primary' : 'btn-bb-outline'} btn-sm py-1 px-2" onclick="switchDetectiveCase(${i})">
                ${cs.caseName.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <h4 class="fw-bold mb-1">${c.caseName}</h4>
        <p class="text-secondary small mb-3">${c.scenario}</p>

        <!-- Ledger Table -->
        <div class="table-responsive bb-table-wrap mb-4">
          <table class="bb-table align-middle">
            <thead>
              <tr>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Nature</th>
                <th class="text-end">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              ${c.ledger.map(row => `
                <tr class="${row.nature.includes('Leak') ? 'table-warning' : ''}">
                  <td class="fw-semibold">${row.item}</td>
                  <td><span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark);">${row.category}</span></td>
                  <td><small class="fw-bold ${row.nature.includes('Leak') ? 'text-danger' : 'text-secondary'}">${row.nature}</small></td>
                  <td class="text-end fw-bold">${formatMoney(row.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Detective Clue Question -->
        <div class="bb-card-flat p-3">
          <span class="badge mb-2" style="background: var(--lavender-primary); color: var(--white);">Clue Investigation ${currentQIdx + 1} of ${c.questions.length}</span>
          <h5 class="fw-bold mb-3" style="font-size: 1.05rem;">${q.question}</h5>

          <div class="d-grid gap-2 mb-3">
            ${q.options.map(opt => `
              <button class="btn btn-bb-outline text-start py-2 px-3 small fw-semibold btn-detective-opt" onclick="checkDetectiveAnswer('${escapeHtmlStr(opt)}')">
                <i class="bi bi-search me-2 text-primary"></i> ${opt}
              </button>
            `).join('')}
          </div>

          <div id="detectiveFeedback" class="d-none p-3 rounded" style="background: var(--lavender-light); border: 1px solid var(--bb-border);">
            <div id="detectiveFbTitle" class="fw-bold mb-1"></div>
            <p id="detectiveFbText" class="small text-secondary mb-3"></p>
            <button id="btnDetectiveNext" class="btn btn-bb-primary btn-sm">
              <span>Next Clue</span>
              <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.switchDetectiveCase = function(idx) {
    activeCaseIdx = idx;
    currentQIdx = 0;
    renderCase();
  };

  window.checkDetectiveAnswer = function(selected) {
    const c = cases[activeCaseIdx];
    const q = c.questions[currentQIdx];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) detectiveScore += 10;

    document.querySelectorAll('.btn-detective-opt').forEach(btn => btn.disabled = true);

    const fbBox = document.getElementById('detectiveFeedback');
    const fbTitle = document.getElementById('detectiveFbTitle');
    const fbText = document.getElementById('detectiveFbText');
    const nextBtn = document.getElementById('btnDetectiveNext');

    if (fbBox && fbTitle && fbText) {
      fbBox.classList.remove('d-none');
      fbTitle.className = isCorrect ? 'fw-bold text-success' : 'fw-bold text-danger';
      fbTitle.innerHTML = isCorrect
        ? '<i class="bi bi-shield-check me-1"></i> Solved! Sharp deduction.'
        : `<i class="bi bi-info-circle me-1"></i> Key clue: ${q.correctAnswer}`;
      fbText.textContent = q.explanation;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentQIdx < c.questions.length - 1) {
          currentQIdx++;
          renderCase();
        } else if (activeCaseIdx < cases.length - 1) {
          activeCaseIdx++;
          currentQIdx = 0;
          renderCase();
        } else {
          showDetectiveComplete();
        }
      });
    }
  };

  function showDetectiveComplete() {
    container.innerHTML = `
      <div class="bb-card text-center p-5">
        <div class="bb-score-circle mb-3">
          <strong class="fs-2">${detectiveScore}</strong>
          <span class="small text-muted">points</span>
        </div>
        <h3 class="fw-bold mb-2">Audit Investigation Complete!</h3>
        <p class="text-secondary small mb-4">
          You successfully spotted the silent subscription leaks, lifestyle surges, and hidden drains that undermine young professional budgets.
        </p>
        <button class="btn btn-bb-primary" onclick="initBudgetDetectiveGame()">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Review Cases Again
        </button>
      </div>
    `;
  }

  renderCase();
}

/**
 * GAME 5: Smart Spending Quiz
 */
function initSmartSpendingQuiz() {
  const container = document.getElementById('smartQuizContainer');
  if (!container || !BB_DATA.games || !BB_DATA.games.smartSpendingQuiz) return;

  const questions = BB_DATA.games.smartSpendingQuiz;
  let qIdx = 0;
  let quizScore = 0;

  function renderQuizQuestion() {
    if (qIdx >= questions.length) {
      renderQuizResults();
      return;
    }

    const q = questions[qIdx];
    const progress = Math.round(((qIdx + 1) / questions.length) * 100);

    container.innerHTML = `
      <div class="bb-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="bb-eyebrow mb-0">Question ${qIdx + 1} of ${questions.length}</span>
          <span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark); font-weight: 700; padding: 6px 12px;">Score: ${quizScore}</span>
        </div>

        <div class="progress mb-4" style="height: 6px; background: var(--lavender-light); border-radius: 10px;">
          <div class="progress-bar" style="width: ${progress}%; background: var(--lavender-primary); transition: width 0.3s ease;"></div>
        </div>

        <h4 class="fw-bold mb-3" style="color: var(--text-primary); font-size: 1.18rem;">${q.question}</h4>

        <div class="d-grid gap-2 mb-3">
          ${q.options.map((opt, i) => `
            <button class="btn btn-bb-outline text-start py-2 px-3 small fw-semibold btn-smart-quiz-opt" onclick="checkSmartQuizAnswer('${escapeHtmlStr(opt)}')">
              <span class="me-2 text-muted fw-bold">${String.fromCharCode(65 + i)}.</span> ${opt}
            </button>
          `).join('')}
        </div>

        <div id="smartQuizFeedback" class="d-none p-3 rounded" style="background: var(--lavender-light); border: 1px solid var(--bb-border);">
          <div id="smartQuizFbTitle" class="fw-bold mb-1"></div>
          <p id="smartQuizFbText" class="small text-secondary mb-3"></p>
          <button id="btnSmartQuizNext" class="btn btn-bb-primary btn-sm">
            <span>Next Question</span>
            <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    `;
  }

  window.checkSmartQuizAnswer = function(selected) {
    const q = questions[qIdx];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) quizScore += 10;

    document.querySelectorAll('.btn-smart-quiz-opt').forEach(btn => btn.disabled = true);

    const fbBox = document.getElementById('smartQuizFeedback');
    const fbTitle = document.getElementById('smartQuizFbTitle');
    const fbText = document.getElementById('smartQuizFbText');
    const nextBtn = document.getElementById('btnSmartQuizNext');

    if (fbBox && fbTitle && fbText) {
      fbBox.classList.remove('d-none');
      fbTitle.className = isCorrect ? 'fw-bold text-success' : 'fw-bold text-danger';
      fbTitle.innerHTML = isCorrect
        ? '<i class="bi bi-check-circle me-1"></i> Correct!'
        : `<i class="bi bi-info-circle me-1"></i> Correct Answer: ${q.correctAnswer}`;
      fbText.textContent = q.explanation;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        qIdx++;
        renderQuizQuestion();
      });
    }
  };

  function renderQuizResults() {
    const maxScore = questions.length * 10;
    const pct = Math.round((quizScore / maxScore) * 100);

    container.innerHTML = `
      <div class="bb-card text-center p-5">
        <div class="bb-score-circle mb-3">
          <strong class="fs-2">${quizScore}</strong>
          <span class="small text-muted">/ ${maxScore}</span>
        </div>
        <h3 class="fw-bold mb-2">Smart Spending Mastery</h3>
        <p class="text-secondary small mb-4">
          ${pct >= 80 ? 'Mastery Level: Advanced! You possess strong financial awareness and understand crucial budgeting principles.' :
            pct >= 60 ? 'Mastery Level: Intermediate! You have good fundamentals; review our Learning topics to master the details.' :
            'Mastery Level: Beginner. Explore our 50/30/20 guidelines and glossary resources to strengthen your core skills.'}
        </p>
        <button class="btn btn-bb-primary" onclick="initSmartSpendingQuiz()">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Retake Quiz
        </button>
      </div>
    `;
  }

  renderQuizQuestion();
}

function escapeHtmlStr(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
