/**
 * BudgetBasics - Dynamic Learning Section Controller
 * Renders topics dynamically from JSON, powers category filtering,
 * modal deep-dives, and tracks session-explored topics.
 * Strictly NO emojis.
 */

let exploredTopics = new Set();
let currentLearningFilter = 'All';

function initLearning() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('bb_explored_topics') || '[]');
    exploredTopics = new Set(saved);
  } catch (e) {
    exploredTopics = new Set();
  }

  renderLearningFilters();
  renderLearningCards('All');
}

/**
 * Render category filter tabs for learning modules
 */
function renderLearningFilters() {
  const container = document.getElementById('learningFilterPills');
  if (!container || !BB_DATA.learning || !BB_DATA.learning.modules) return;

  const categories = ['All', ...new Set(BB_DATA.learning.modules.map(m => m.eyebrow))];

  container.innerHTML = categories.map(cat => `
    <button class="bb-planning-tab ${cat === currentLearningFilter ? 'active' : ''}" data-learn-cat="${cat}" onclick="filterLearningCategory('${cat}')">
      <span>${cat === 'All' ? 'All Modules' : cat}</span>
    </button>
  `).join('');
}

/**
 * Filter learning modules with smooth transition
 */
window.filterLearningCategory = function(cat) {
  currentLearningFilter = cat;
  document.querySelectorAll('#learningFilterPills .bb-planning-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.learnCat === cat);
  });

  const container = document.getElementById('learningCardsContainer');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(6px)';
    setTimeout(() => {
      renderLearningCards(cat);
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 120);
  } else {
    renderLearningCards(cat);
  }
};

/**
 * Render Learning Cards Grid
 */
function renderLearningCards(filter = currentLearningFilter) {
  const container = document.getElementById('learningCardsContainer');
  if (!container || !BB_DATA.learning || !BB_DATA.learning.modules) return;

  let modules = [...BB_DATA.learning.modules];

  if (filter && filter !== 'All') {
    modules = modules.filter(m =>
      (m.eyebrow && m.eyebrow.toLowerCase() === filter.toLowerCase()) ||
      (m.title && m.title.toLowerCase().includes(filter.toLowerCase())) ||
      (m.id && m.id.toLowerCase() === filter.toLowerCase())
    );
  }

  if (modules.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">No learning modules found in this category.</div>`;
    return;
  }

  container.innerHTML = modules.map(mod => {
    const isExplored = exploredTopics.has(mod.id);
    return `
      <article class="bb-learn-card reveal visible" id="module-card-${mod.id}">
        <div class="bb-learn-thumb">
          <img src="${mod.image}" alt="${mod.title}" loading="lazy">
          <span class="bb-learn-tag">${mod.eyebrow}</span>
        </div>
        <div class="bb-learn-body">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h3 class="mb-0">${mod.title}</h3>
            ${isExplored ? '<span class="badge" style="background: var(--lavender-light); color: var(--lavender-dark); font-size: 0.72rem;"><i class="bi bi-check2"></i> Explored</span>' : ''}
          </div>
          <p class="mt-2">${mod.description}</p>
          <ul class="bb-learn-points">
            ${mod.keyPoints.map(pt => `
              <li><i class="bi bi-check-circle-fill"></i><span>${pt}</span></li>
            `).join('')}
          </ul>
          <div class="bb-learn-footer">
            <button class="btn-bb-subtle" onclick="openLearnModalById('${mod.id}')">
              <span>Learn More</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  if (typeof window.refreshRevealAnimations === 'function') {
    window.refreshRevealAnimations();
  }
}

// Global modal opener for learning topic details
window.openLearnModalById = function(modId) {
  if (!BB_DATA.learning || !BB_DATA.learning.modules) return;
  const mod = BB_DATA.learning.modules.find(m => m.id === modId);
  if (!mod) return;

  // Track session exploration
  exploredTopics.add(modId);
  try {
    sessionStorage.setItem('bb_explored_topics', JSON.stringify([...exploredTopics]));
  } catch (e) {}
  
  // Re-render learning cards with active filter, remaining visible
  renderLearningCards(currentLearningFilter);

  const modalTitle = document.getElementById('learnModalTitle');
  const modalBody = document.getElementById('learnModalBody');
  const modalTag = document.getElementById('learnModalTag');

  if (modalTitle) modalTitle.textContent = mod.title;
  if (modalTag) modalTag.textContent = mod.eyebrow;

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-5">
          <div class="bb-learn-modal-image-frame">
            <img src="${mod.image}" alt="${mod.title}" loading="lazy">
          </div>
          <div class="bb-card-flat mt-3">
            <span class="d-block small text-muted text-uppercase fw-bold mb-1">Key Insight</span>
            <p class="small mb-0 text-dark fw-semibold">${mod.description}</p>
          </div>
        </div>
        <div class="col-md-7">
          <h5 class="fw-bold mb-3" style="color: var(--lavender-dark);">Essential Principles</h5>
          <ul class="list-unstyled d-flex flex-column gap-2 mb-4">
            ${mod.keyPoints.map(pt => `
              <li class="d-flex align-items-start gap-2 small">
                <i class="bi bi-shield-check text-primary mt-1"></i>
                <span>${pt}</span>
              </li>
            `).join('')}
          </ul>

          <h5 class="fw-bold mb-2" style="color: var(--lavender-dark);">Real-Life Examples</h5>
          <div class="p-3 mb-3 rounded" style="background: var(--lavender-soft); border: 1px solid var(--bb-border);">
            <ul class="mb-0 ps-3 small text-muted">
              ${(mod.examples || []).map(ex => `<li>${ex}</li>`).join('')}
            </ul>
          </div>

          <h5 class="fw-bold mb-2" style="color: var(--lavender-dark);">Actionable Tips</h5>
          <div class="p-3 rounded" style="background: var(--bb-success-bg); border: 1px solid var(--bb-success); color: var(--bb-success);">
            <ul class="mb-0 ps-3 small">
              ${(mod.tips || []).map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  const modalEl = document.getElementById('learningDetailModal');
  if (modalEl) {
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }
};
