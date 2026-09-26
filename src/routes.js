// BudgetBasics is intentionally a single-page application.
// These anchors are the stable section routes used by the existing content.
export const sectionRoutes = [
  'home', 'about', 'learning', 'planning', 'needs-wants',
  'games', 'resources', 'checklist', 'feedback', 'contact'
];

export function scrollToRoute(hash, behavior = 'smooth') {
  const id = String(hash || '').replace(/^#/, '') || 'home';
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior, block: 'start' });
    return true;
  }
  return false;
}
