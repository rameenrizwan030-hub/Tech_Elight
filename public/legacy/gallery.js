/**
 * BudgetBasics - Explore: Visual Learning Controller
 * Renders non-card, visual-first financial experiences:
 * 3D visual comparisons, 6-phase budget cycle, interactive 50-30-20 charts,
 * goal staircases, 30-day saving steps, and student mistake scenario matrices.
 * Strictly 7 filters: All, Saving, Planning, Habit and Goals, Mistakes, 20-30-50 Rule, Needs and Wants.
 * Strictly NO emojis.
 */

let currentVisualLearningFilter = 'All';
let currentVisualLearningSearch = '';
let currentVisualLearningSort = 'default';

function initGallery() {
  const search = document.getElementById('visualLearningSearch');
  const clear = document.getElementById('clearVisualLearningSearch');
  const sort = document.getElementById('visualLearningSort');

  if (search) {
    search.addEventListener('input', () => {
      currentVisualLearningSearch = search.value.trim().toLowerCase();
      if (clear) clear.hidden = !currentVisualLearningSearch;
      renderVisualLearning(currentVisualLearningFilter);
    });
  }
  if (clear) {
    clear.addEventListener('click', () => {
      if (search) search.value = '';
      currentVisualLearningSearch = '';
      clear.hidden = true;
      renderVisualLearning(currentVisualLearningFilter);
      if (search) search.focus();
    });
  }
  if (sort) {
    sort.addEventListener('change', () => {
      currentVisualLearningSort = sort.value;
      renderVisualLearning(currentVisualLearningFilter);
    });
  }

  renderVisualLearning('All');
}

window.filterVisualLearning = function(category) {
  // Accept both the old project label and the SRS wording without breaking existing links.
  if (category === '20-30-50 Rule') category = '50-30-20 Rule';
  currentVisualLearningFilter = category;

  document.querySelectorAll('#visualLearningFilterBar .bb-planning-tab').forEach(btn => {
    const targetCat = btn.getAttribute('data-vl-filter');
    btn.classList.toggle('active', targetCat === category);
  });

  renderVisualLearning(category);
};

window.navigateToExploreCategory = function(catName) {
  const mapping = {
    'Guidance': 'Planning',
    'Introduction': '50-30-20 Rule',
    'Money Tips': 'Saving',
    'Financial Resources': 'All',
    'Learning': 'All',
    'Family': 'Planning',
    'Needs & Wants Visual': 'Needs and Wants',
    '20/30/50 Budget Visual': '50-30-20 Rule',
    'Money Budget Cycle': 'Planning',
    'Saving Challenges': 'Saving',
    '20-30-50 Rule': '50-30-20 Rule'
  };
  const targetCategory = mapping[catName] || catName;
  filterVisualLearning(targetCategory);

  const resSection = document.getElementById('resources');
  if (resSection) resSection.scrollIntoView({ behavior: 'smooth' });

  const navMenu = document.getElementById('navbarCollapse');
  if (navMenu && navMenu.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
    if (bsCollapse) bsCollapse.hide();
  }
};

function getVisualLearningModules(data) {
  return [
    { key: 'rule503020', category: '50-30-20 Rule', title: data.rule503020?.title || '50-30-20 Rule', renderer: renderVisual503020, data: data.rule503020 },
    { key: 'saving', category: 'Saving', title: data.saving?.title || 'Saving', renderer: renderVisualSaving, data: data.saving },
    { key: 'planning', category: 'Planning', title: data.planning?.title || 'Planning', renderer: renderVisualPlanning, data: data.planning },
    { key: 'habitAndGoals', category: 'Habit and Goals', title: data.habitAndGoals?.title || 'Habit and Goals', renderer: renderVisualHabitAndGoals, data: data.habitAndGoals },
    { key: 'mistakes', category: 'Mistakes', title: data.mistakes?.title || 'Mistakes', renderer: renderVisualMistakes, data: data.mistakes },
    { key: 'needsAndWants', category: 'Needs and Wants', title: data.needsAndWants?.title || 'Needs and Wants', renderer: renderVisualNeedsAndWants, data: data.needsAndWants }
  ];
}

function renderVisualLearning(filter = 'All') {
  const container = document.getElementById('visualLearningDisplayArea');
  if (!container) return;

  const data = (BB_DATA.visualLearning && BB_DATA.visualLearning.visuals)
    ? BB_DATA.visualLearning.visuals
    : getDefaultVisualLearning().visuals;

  let modules = getVisualLearningModules(data).filter(m => m.data);
  if (filter && filter !== 'All') modules = modules.filter(m => m.category === filter);

  if (currentVisualLearningSearch) {
    modules = modules.filter(m => {
      const searchable = JSON.stringify(m.data).toLowerCase() + ' ' + m.category.toLowerCase() + ' ' + m.title.toLowerCase();
      return searchable.includes(currentVisualLearningSearch);
    });
  }

  if (currentVisualLearningSort === 'az') {
    modules.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentVisualLearningSort === 'category') {
    modules.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  }

  if (!modules.length) {
    container.innerHTML = `
      <div class="bb-explore-empty reveal visible" role="status" aria-live="polite">
        <div class="bb-explore-empty-icon"><i class="bi bi-search" aria-hidden="true"></i></div>
        <h3>No matching content found</h3>
        <p>Try another keyword or choose a different topic filter.</p>
        <button type="button" class="btn btn-bb-outline" onclick="clearExploreSearch()">Clear search</button>
      </div>`;
    return;
  }

  container.innerHTML = modules.map(m => m.renderer(m.data)).join('');
  attachVisualLearningEvents();
  if (typeof window.refreshRevealAnimations === 'function') window.refreshRevealAnimations();
}

window.clearExploreSearch = function() {
  const search = document.getElementById('visualLearningSearch');
  const clear = document.getElementById('clearVisualLearningSearch');
  if (search) search.value = '';
  currentVisualLearningSearch = '';
  if (clear) clear.hidden = true;
  renderVisualLearning(currentVisualLearningFilter);
  if (search) search.focus();
};

/**
 * 1. 20-30-50 Visual Donut & Allocation Module
 */
function renderVisual503020(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-503020">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-pie-chart-fill me-1"></i> Visual Allocation Rule</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="bb-vl-503020-grid">
        <div class="bb-vl-donut-visual">
          <svg class="bb-vl-donut-svg" viewBox="0 0 120 120">
            <!-- 50% Needs (Green/Deep Purple) -->
            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#583397" stroke-width="20" stroke-dasharray="141.37 282.74" stroke-dashoffset="0" />
            <!-- 30% Wants (Lavender Primary) -->
            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#7C4DFF" stroke-width="20" stroke-dasharray="84.82 282.74" stroke-dashoffset="-141.37" />
            <!-- 20% Savings (Emerald Green) -->
            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#388E67" stroke-width="20" stroke-dasharray="56.55 282.74" stroke-dashoffset="-226.19" />
            <text x="60" y="58" text-anchor="middle" font-weight="800" font-size="14" fill="#341A5C" font-family="Poppins">100%</text>
            <text x="60" y="72" text-anchor="middle" font-size="7.5" fill="#736C7D" font-weight="600" font-family="Poppins">Take-Home</text>
          </svg>

          <div class="bb-vl-donut-legend">
            <span class="bb-vl-legend-item"><span class="bb-vl-legend-dot" style="background: #583397;"></span> 50% Needs</span>
            <span class="bb-vl-legend-item"><span class="bb-vl-legend-dot" style="background: #7C4DFF;"></span> 30% Wants</span>
            <span class="bb-vl-legend-item"><span class="bb-vl-legend-dot" style="background: #388E67;"></span> 20% Savings</span>
          </div>

          <div class="mt-3 p-2 rounded" style="background: rgba(124, 77, 255, 0.08); font-size: 0.8rem; font-weight: 600; color: #583397;">
            <i class="bi bi-shield-check me-1"></i> ${data.tagline}
          </div>
        </div>

        <div class="bb-vl-503020-pillars">
          ${data.slices.map(s => `
            <div class="bb-vl-pillar ${s.name.toLowerCase()}">
              <div class="bb-vl-pillar-icon">
                <i class="bi ${s.icon}"></i>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <strong class="fs-6 text-dark">${s.percent}% ${s.name}</strong>
                  <span class="badge" style="background: var(--bb-lav-100); color: var(--bb-lav-800);">${s.percent}% of Pay</span>
                </div>
                <p class="small text-muted mb-0">${s.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

/**
 * 2. Saving Ecosystem Visual Module
 */
function renderVisualSaving(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-saving">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-piggy-bank-fill me-1"></i> Saving Ecosystem</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="bb-vl-saving-grid">
        <!-- 30-Day Step Challenge -->
        <div class="bb-vl-saving-block">
          <div class="bb-vl-block-title">
            <i class="bi bi-trophy text-warning"></i>
            <span>${data.challenge.title}</span>
          </div>
          <small class="text-muted d-block">${data.challenge.tagline}</small>

          <div class="bb-vl-steps-track">
            ${data.challenge.milestones.map((m, idx) => `
              <div class="bb-vl-step-item" style="height: ${65 + idx * 18}px; display: flex; flex-direction: column; justify-content: flex-end;">
                <span class="bb-vl-step-day">${m.day}</span>
                <strong class="bb-vl-step-amt">Rs. ${m.amount}</strong>
              </div>
            `).join('')}
          </div>

          <div class="mt-3 text-center p-2 rounded" style="background: var(--white); border: 1px solid var(--bb-border);">
            <small class="text-muted">Total 30-Day Goal Accumulation: <strong class="text-success fs-6">Rs. ${data.challenge.totalSavings.toLocaleString()}</strong></small>
          </div>
        </div>

        <!-- How Saving Helps -->
        <div class="bb-vl-saving-block">
          <div class="bb-vl-block-title">
            <i class="bi bi-shield-check text-primary"></i>
            <span>${data.benefits.title}</span>
          </div>
          <small class="text-muted d-block">${data.benefits.tagline}</small>

          <div class="bb-vl-benefit-nodes">
            ${data.benefits.points.map(p => `
              <div class="bb-vl-benefit-node">
                <i class="bi ${p.icon}"></i>
                <div>
                  <strong class="d-block text-dark" style="font-size: 0.85rem;">${p.title}</strong>
                  <span class="text-muted" style="font-size: 0.76rem;">${p.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Goal Tracker Jar -->
        <div class="bb-vl-saving-block">
          <div class="bb-vl-block-title">
            <i class="bi bi-bullseye text-danger"></i>
            <span>${data.goalsJar.title}</span>
          </div>
          <small class="text-muted d-block">${data.goalsJar.tagline}</small>

          <div class="bb-vl-goal-list">
            ${data.goalsJar.goals.map(g => {
              const pct = Math.round((g.saved / g.target) * 100);
              return `
                <div class="bb-vl-goal-item">
                  <div class="d-flex justify-content-between align-items-center small mb-1">
                    <span><i class="bi ${g.icon} me-1 text-primary"></i> <strong>${g.name}</strong></span>
                    <span class="text-muted fw-bold">Rs. ${g.saved.toLocaleString()} / ${g.target.toLocaleString()} (${pct}%)</span>
                  </div>
                  <div class="progress" style="height: 8px; border-radius: 6px; background: var(--bb-lav-100);">
                    <div class="progress-bar" style="width: ${pct}%; background: var(--lavender-primary);"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Student Saving Tips -->
        <div class="bb-vl-saving-block">
          <div class="bb-vl-block-title">
            <i class="bi bi-lightbulb text-warning"></i>
            <span>Saving Tips for Students</span>
          </div>
          <small class="text-muted d-block">Smart habits create bigger dreams.</small>

          <ul class="bb-vl-tips-list">
            ${data.studentTips.map(t => `
              <li>
                <i class="bi bi-check-circle-fill"></i>
                <span>${t.tip}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

/**
 * 3. Planning: Circular Budget Cycle Module
 */
function renderVisualPlanning(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-planning">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-arrow-repeat me-1"></i> Continuous Planning Flow</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="bb-vl-cycle-container">
        ${data.phases.map(p => `
          <div class="bb-vl-cycle-phase">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="bb-vl-phase-num">${p.step}</span>
              <i class="bi ${p.icon} fs-4 text-primary"></i>
            </div>
            <h4 class="bb-vl-phase-title">${p.title}</h4>
            <p class="small text-dark fw-semibold mb-2">${p.action}</p>
            <div class="p-2 rounded" style="background: var(--bb-lav-50); border: 1px solid var(--bb-lav-200); font-size: 0.78rem; color: var(--lavender-dark);">
              <i class="bi bi-pin-angle-fill me-1"></i> <strong>Rule:</strong> ${p.rule}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * 4. Habits & Goals Dual Visual Module
 */
function renderVisualHabitAndGoals(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-habit-goals">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-bullseye me-1"></i> Long-Term Growth</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="row g-4 align-items-stretch">
        <!-- Habits Matrix -->
        <div class="col-lg-6 d-flex flex-column">
          <div class="p-4 rounded h-100" style="background: linear-gradient(135deg, rgba(247, 239, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%); border: 1.5px solid var(--bb-lav-200); border-radius: var(--bb-radius-lg);">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold text-dark mb-0">${data.habits.title}</h4>
              <span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark);">6 Key Behaviors</span>
            </div>
            <p class="small text-muted">${data.habits.tagline}</p>

            <div class="bb-vl-habits-grid" style="grid-template-columns: repeat(2, 1fr);">
              ${data.habits.items.map(h => `
                <div class="bb-vl-habit-tile">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi ${h.icon} fs-5 text-primary"></i>
                    <strong class="small text-dark">${h.title}</strong>
                  </div>
                  <p class="mb-0 text-muted" style="font-size: 0.76rem; line-height: 1.45;">${h.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Goals Staircase -->
        <div class="col-lg-6 d-flex flex-column">
          <div class="p-4 rounded h-100" style="background: linear-gradient(135deg, rgba(247, 239, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%); border: 1.5px solid var(--bb-lav-200); border-radius: var(--bb-radius-lg);">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold text-dark mb-0">${data.goals.title}</h4>
              <span class="badge" style="background: #388E67; color: white;">3-Tier Milestone Plan</span>
            </div>
            <p class="small text-muted">${data.goals.tagline}</p>

            <div class="bb-vl-staircase">
              ${data.goals.tiers.map((t, idx) => `
                <div class="bb-vl-stair-tier tier-${t.tier}">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-dark"><i class="bi ${t.icon} me-1 text-primary"></i> ${t.heading} (${t.timeframe})</strong>
                    <span class="badge bg-light text-dark small border">${t.tag}</span>
                  </div>
                  <ul class="mb-0 ps-3 small text-muted">
                    ${t.items.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * 5. Mistakes 5-Column Matrix Module
 */
function renderVisualMistakes(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-mistakes">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-exclamation-triangle-fill me-1"></i> Behavioral Protection</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="bb-vl-mistakes-grid">
        ${data.cases.map(c => `
          <div class="bb-vl-mistake-col">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="bb-vl-mistake-badge">${c.num}</span>
              <i class="bi ${c.icon} fs-4 text-danger"></i>
            </div>
            <h4 class="bb-vl-mistake-name">${c.name}</h4>
            <small class="text-muted d-block mb-2 fst-italic">"${c.tagline}"</small>
            
            <div class="p-2 rounded mb-2" style="background: rgba(220, 38, 38, 0.05); border: 1px solid rgba(220, 38, 38, 0.15); font-size: 0.77rem; color: #7F1D1D;">
              <strong>Scenario:</strong> ${c.scenario}
            </div>

            <div class="bb-vl-mistake-fix">
              <strong><i class="bi bi-check-circle me-1 text-success"></i> Solution:</strong>
              <div>${c.correction}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * 6. Needs and Wants 3D Visual Showcase Module
 */
function renderVisualNeedsAndWants(data) {
  if (!data) return '';
  return `
    <section class="bb-vl-module reveal visible" id="vl-sec-needs-wants">
      <div class="bb-vl-module-header">
        <span class="bb-eyebrow"><i class="bi bi-signpost-split-fill me-1"></i> Decision Framework</span>
        <h3 class="bb-vl-module-title">${data.title}</h3>
        <p class="bb-vl-module-lead">${data.subtitle}</p>
      </div>

      <div class="bb-vl-nvw-container">
        <!-- 6 Needs -->
        <div class="bb-vl-nvw-side needs">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h4 class="fw-bold mb-0 text-dark"><i class="bi bi-shield-check text-primary me-1"></i> Essential Needs</h4>
            <span class="badge" style="background: rgba(88, 51, 151, 0.1); color: var(--lavender-dark);">50% Foundation</span>
          </div>
          <small class="text-muted d-block">Essential for survival, health, and academic progress.</small>

          <div class="bb-vl-nvw-items-grid">
            ${data.needs.map(n => `
              <div class="bb-vl-nvw-item-chip">
                <i class="bi ${n.icon}"></i>
                <div>
                  <strong class="d-block text-dark">${n.name}</strong>
                  <span class="text-muted" style="font-size: 0.74rem;">${n.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Center Mascot Message -->
        <div class="bb-vl-nvw-center-badge">
          <div class="p-3 rounded text-center" style="background: var(--bb-lav-100); border: 1.5px solid var(--bb-lav-300); border-radius: var(--bb-radius-lg);">
            <i class="bi bi-lightbulb-fill text-warning fs-3 mb-2 d-block"></i>
            <strong class="small text-dark d-block mb-1">Mascot Wisdom</strong>
            <p class="mb-0 text-muted" style="font-size: 0.76rem;">${data.mascotMessage}</p>
          </div>
        </div>

        <!-- 6 Wants -->
        <div class="bb-vl-nvw-side wants">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h4 class="fw-bold mb-0 text-dark"><i class="bi bi-cart-fill text-primary me-1"></i> Lifestyle Wants</h4>
            <span class="badge" style="background: rgba(124, 77, 255, 0.1); color: var(--lavender-primary);">30% Discretionary</span>
          </div>
          <small class="text-muted d-block">Nice to have for fun and comfort, but not essential for survival.</small>

          <div class="bb-vl-nvw-items-grid">
            ${data.wants.map(w => `
              <div class="bb-vl-nvw-item-chip">
                <i class="bi ${w.icon}"></i>
                <div>
                  <strong class="d-block text-dark">${w.name}</strong>
                  <span class="text-muted" style="font-size: 0.74rem;">${w.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function attachVisualLearningEvents() {
  // Any interactive tooltips or animation triggers
}
