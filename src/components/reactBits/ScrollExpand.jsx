import { useEffect } from 'react';

export default function ScrollExpand() {
  useEffect(() => {
    const frame = document.querySelector('.bb-about-illustration-frame');
    if (!frame || frame.dataset.bbScrollExpandActive === '1') return;
    frame.dataset.bbScrollExpandActive = '1';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    frame.style.display = 'block';
    frame.style.margin = '0 auto';
    frame.style.transition = 'width 0.12s ease-out, border-radius 0.12s ease-out, transform 0.12s ease-out, box-shadow 0.12s ease-out';
    frame.style.willChange = 'width, border-radius, transform, box-shadow';

    let animFrame = 0;

    const updateExpand = () => {
      animFrame = 0;
      const rect = frame.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      const start = windowHeight;
      const end = windowHeight * 0.35;
      const current = rect.top;

      let progress = 0;
      if (current >= start) {
        progress = 0;
      } else if (current <= end) {
        progress = 1;
      } else {
        progress = (start - current) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1);
      }

      // Starts at 72% width, expands to 100%
      const currentWidthPercent = 72 + progress * 28;
      const currentRadius = 28 - progress * 12;
      const scale = 0.96 + progress * 0.04;
      const shadowBlur = 25 + progress * 20;
      const shadowY = 10 + progress * 15;
      const shadowAlpha = 0.08 + progress * 0.08;

      frame.style.width = `${currentWidthPercent}%`;
      frame.style.maxWidth = '100%';
      frame.style.borderRadius = `${currentRadius}px`;
      frame.style.transform = `scale(${scale})`;
      frame.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(88, 51, 151, ${shadowAlpha})`;
    };

    const onScroll = () => {
      if (!animFrame) animFrame = requestAnimationFrame(updateExpand);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateExpand();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return null;
}
