/**
 * BudgetBasics - Navbar & Navigation Controller
 * Handles dropdown interactions, scroll spy, mobile drawer collapse, and deep linking
 * Strictly NO AI links in the navbar
 */

function initNavbar() {
  const nav = document.getElementById('mainNavbar');
  const navMenu = document.getElementById('navbarCollapse');
  const navLinks = document.querySelectorAll('.bb-nav-link');

  // Populate Explore Dropdowns dynamically if containers exist (Strictly 7 Visual Learning Topics)
  const exploreDropdown = document.getElementById('navExploreDropdown');
  const exploreDropdownMobile = document.getElementById('navExploreDropdownMobile');
  const exploreCategories = [
    { name: "All Visuals", filter: "All", icon: "bi-grid-fill" },
    { name: "Saving", filter: "Saving", icon: "bi-piggy-bank" },
    { name: "Planning", filter: "Planning", icon: "bi-arrow-repeat" },
    { name: "Habit and Goals", filter: "Habit and Goals", icon: "bi-bullseye" },
    { name: "Mistakes", filter: "Mistakes", icon: "bi-exclamation-triangle" },
    { name: "20-30-50 Rule", filter: "20-30-50 Rule", icon: "bi-pie-chart" },
    { name: "Needs and Wants", filter: "Needs and Wants", icon: "bi-signpost-split" }
  ];

  const exploreHtml = exploreCategories.map(cat => `
    <li>
      <a class="bb-dropdown-item" href="#resources" onclick="navigateToExploreCategory('${cat.filter}')">
        <i class="bi ${cat.icon}"></i>
        <span>${cat.name}</span>
      </a>
    </li>
  `).join('');

  if (exploreDropdown) exploreDropdown.innerHTML = exploreHtml;

  // Handle Practice Dropdown Navigation
  window.navigateToPracticeTab = function(tabId) {
    if (typeof switchPracticeTab === 'function') {
      switchPracticeTab(tabId);
    }
    const section = document.getElementById('practice') || document.getElementById('planning');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileNav();
  };

  // Handle Explore Dropdown Navigation
  window.navigateToExploreCategory = function(catName) {
    if (typeof filterExploreCategory === 'function') {
      filterExploreCategory(catName);
    }
    const resSection = document.getElementById('resources');
    if (resSection) {
      resSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileNav();
  };

  // Handle Learn Sub-Topic Navigation (Income, Expenses, Common Money Mistakes, Saving, Needs vs Wants, Emergency Savings)
  window.navigateToLearnTopic = function(topicId) {
    const mapping = {
      'Income': 'what-is-income',
      'Expenses': 'what-are-expenses',
      'Common Money Mistakes': 'common-money-mistakes',
      'Saving': 'what-are-savings',
      'Needs vs Wants': 'needs-vs-wants',
      'Emergency Savings': 'emergency-savings'
    };
    const resolvedId = mapping[topicId] || topicId;

    if (resolvedId === 'needs-vs-wants') {
      const nvw = document.getElementById('needs-wants');
      if (nvw) {
        nvw.scrollIntoView({ behavior: 'smooth' });
        closeMobileNav();
        return;
      }
    }

    const card = document.getElementById('module-card-' + resolvedId);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const learnSec = document.getElementById('learning');
      if (learnSec) learnSec.scrollIntoView({ behavior: 'smooth' });
    }

    if (typeof openLearnModalById === 'function') {
      setTimeout(() => {
        openLearnModalById(resolvedId);
      }, 250);
    }
    closeMobileNav();
  };

  // Navbar scroll styling & scroll spy
  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    updateActiveNavLink();
  }, { passive: true });

  // Update active links on scroll
  function updateActiveNavLink() {
    const sections = ['home', 'about', 'learning', 'practice', 'planning', 'needs-wants', 'games', 'resources', 'feedback', 'contact'];
    let current = 'home';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollPosition) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Close mobile nav when clicking standard links
  document.querySelectorAll('.bb-nav-link:not(.dropdown-toggle), .btn-nav-contact').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  function closeMobileNav() {
    if (navMenu && navMenu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
}
