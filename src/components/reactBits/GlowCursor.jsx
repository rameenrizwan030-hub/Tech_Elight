import { useState, useEffect, useRef } from 'react';

export default function GlowCursor({ color = 'rgba(147, 51, 234, 0.24)', size = 260 }) {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [isInside, setIsInside] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const followerRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices and reduced-motion preferences
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsDisabled(true);
      return;
    }

    // Scoped strictly to interactive sections: #resources and #planning
    const targetSections = [
      document.getElementById('resources'),
      document.getElementById('planning')
    ].filter(Boolean);

    if (targetSections.length === 0) return;

    let activeTarget = null;

    const handleMouseMove = (e) => {
      let hoveredSection = null;
      for (const section of targetSections) {
        const rect = section.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          hoveredSection = section;
          break;
        }
      }

      if (hoveredSection) {
        setPos({ x: e.clientX, y: e.clientY });
        setIsInside(true);
        activeTarget = hoveredSection;
      } else {
        setIsInside(false);
        activeTarget = null;
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsInside(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, []);

  if (isDisabled) return null;

  return (
    <div
      ref={followerRef}
      className="glow-cursor-follower position-fixed rounded-circle"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} 0%, rgba(147, 51, 234, 0.06) 50%, transparent 70%)`,
        opacity: isInside ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.25s ease, transform 0.05s ease-out',
        zIndex: 999,
        willChange: 'left, top, opacity'
      }}
      aria-hidden="true"
    />
  );
}
