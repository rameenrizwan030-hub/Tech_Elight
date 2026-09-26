import { useEffect, useRef } from 'react';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import HashRouter from './components/router/HashRouter';
import { PROGRESS_MARKUP } from './components/router/progressMarkup';
import AnimationEnhancements from './components/reactBits/AnimationEnhancements';

const LEGACY_SCRIPTS = [
  '/legacy/data.js',
  '/legacy/navbar.js',
  '/legacy/learning.js',
  '/legacy/calculator.js',
  '/legacy/planning.js',
  '/legacy/games.js',
  '/legacy/gallery.js',
  '/legacy/chatbot.js',
  '/legacy/app.js'
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-budgetbasics-legacy="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.budgetbasicsLegacy = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function App() {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    let cancelled = false;
    const boot = async () => {
      try {
        for (const src of LEGACY_SCRIPTS) await loadScript(src);
        if (!cancelled) {
          // The original controllers are preserved so all calculators,
          // planners, games, filters, search/sort, chatbot and modals keep working.
          document.dispatchEvent(new Event('DOMContentLoaded'));
        }
      } catch (error) {
        console.error('[BudgetBasics] Legacy feature bootstrap failed:', error);
      }
    };
    boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && document.getElementById(href.slice(1))) {
        // Keep normal hash navigation; the React hash router handles the scroll.
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: PROGRESS_MARKUP }} />
      <Navbar />
      <Home />
      <Footer />
      <AnimationEnhancements />
      <HashRouter />
    </>
  );
}
