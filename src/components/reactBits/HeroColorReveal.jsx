import { useEffect } from 'react';

export default function HeroColorReveal() {
  useEffect(() => {
    const hero = document.querySelector('.bb-hero-section');
    if (!hero || hero.dataset.bbColorReveal === '1') return;
    hero.dataset.bbColorReveal = '1';

    // Respect reduced-motion accessibility preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Ensure hero container does not clip or overflow
    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';

    const maskLayer = document.createElement('div');
    maskLayer.className = 'bb-hero-color-reveal-layer';
    maskLayer.setAttribute('aria-hidden', 'true');
    Object.assign(maskLayer.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '1',
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(135deg, rgba(88, 51, 151, 0.15) 0%, rgba(124, 77, 255, 0.15) 100%),
        url('assets/images/hero-budget-bg.jpg')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      filter: 'saturate(1.35) contrast(1.12) brightness(1.06)',
      opacity: '0',
      transition: 'opacity 0.4s ease'
    });

    hero.insertBefore(maskLayer, hero.firstChild);

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    let isHovered = false;
    let isTouchActive = false;
    let touchFadeTimer = null;
    let animFrame = null;
    let startTime = performance.now();

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    // Center coordinates initially
    const initRect = hero.getBoundingClientRect();
    posX = initRect.width ? initRect.width / 2 : 200;
    posY = initRect.height ? initRect.height / 2 : 200;
    mouseX = posX;
    mouseY = posY;

    // If mobile/touch device, start with ambient reveal so it feels alive
    if (isCoarse) {
      maskLayer.style.opacity = '0.45';
    }

    const updateLoop = (now) => {
      const rect = hero.getBoundingClientRect();
      const heroW = rect.width || window.innerWidth;
      const heroH = rect.height || 400;

      // Dynamic mask radius based on viewport width
      const radius = Math.min(260, Math.max(130, Math.round(heroW * 0.38)));

      if (isCoarse && !isTouchActive) {
        // Ambient gentle drift on mobile/tablet when idle
        const elapsed = (now - startTime) * 0.001;
        const targetX = heroW / 2 + Math.sin(elapsed * 0.8) * (heroW * 0.18);
        const targetY = heroH / 2 + Math.cos(elapsed * 1.1) * 35;

        posX += (targetX - posX) * 0.05;
        posY += (targetY - posY) * 0.05;
      } else {
        const ease = 0.14;
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
      }

      // Clamp coordinates safely within hero bounding box
      const x = Math.max(0, Math.min(heroW, Math.round(posX)));
      const y = Math.max(0, Math.min(heroH, Math.round(posY)));

      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)`;

      maskLayer.style.webkitMaskImage = mask;
      maskLayer.style.maskImage = mask;

      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);

    // Desktop Mouse Handlers
    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      mouseY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      if (!isHovered) {
        isHovered = true;
        maskLayer.style.opacity = '0.92';
      }
    };

    const onMouseEnter = (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      mouseY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      posX = mouseX;
      posY = mouseY;
      isHovered = true;
      maskLayer.style.opacity = '0.92';
    };

    const onMouseLeave = () => {
      isHovered = false;
      maskLayer.style.opacity = isCoarse ? '0.45' : '0';
    };

    // Mobile / Touch Handlers
    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const rect = hero.getBoundingClientRect();
      mouseX = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
      mouseY = Math.max(0, Math.min(rect.height, e.touches[0].clientY - rect.top));
      isTouchActive = true;
      maskLayer.style.opacity = '0.88';

      if (touchFadeTimer) clearTimeout(touchFadeTimer);
      touchFadeTimer = setTimeout(() => {
        isTouchActive = false;
        if (maskLayer) maskLayer.style.opacity = '0.45';
      }, 2000);
    };

    const onTouchStart = (e) => {
      onTouchMove(e);
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseenter', onMouseEnter, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });
    hero.addEventListener('touchstart', onTouchStart, { passive: true });
    hero.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (touchFadeTimer) clearTimeout(touchFadeTimer);
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseenter', onMouseEnter);
      hero.removeEventListener('mouseleave', onMouseLeave);
      hero.removeEventListener('touchstart', onTouchStart);
      hero.removeEventListener('touchmove', onTouchMove);
      delete hero.dataset.bbColorReveal;
      maskLayer.remove();
    };
  }, []);

  return null;
}
