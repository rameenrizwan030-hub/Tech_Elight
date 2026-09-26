import { useState, useRef, useEffect } from 'react';

const FALLBACK_CARDS = [
  {
    id: 'income',
    badge: 'EARNING FOUNDATION',
    color: '#583397',
    title: 'Income Fundamentals',
    subtitle: 'Total cash inflow serving as starting fuel for every financial plan.',
    image: 'assets/images/income-hd.jpg',
    points: [
      'Gross is pre-tax; net income is what you actually budget',
      'Active income vs passive royalties and investments',
      'Irregular earnings require conservative baseline planning'
    ]
  },
  {
    id: 'expenses',
    badge: 'OUTFLOW MANAGEMENT',
    color: '#7c4dff',
    title: 'Expense Categorization',
    subtitle: 'Master fixed obligations and audit variable discretionary outflows.',
    image: 'assets/images/expenses-hd.jpg',
    points: [
      'Fixed expenses stay constant (rent, hostel fees, internet)',
      'Variable costs fluctuate (dining, shopping, transit)',
      'Hidden micro-subscriptions silently drain monthly surplus'
    ]
  },
  {
    id: 'rule503020',
    badge: '50-30-20 RULE',
    color: '#9333ea',
    title: 'The 50/30/20 Benchmark',
    subtitle: 'Balanced financial framework without tedious receipt counting.',
    image: 'assets/images/visual-503020-chart.jpg',
    points: [
      '50% Needs: Essential obligations (housing, groceries, health)',
      '30% Wants: Discretionary lifestyle and entertainment',
      '20% Savings: Emergency cushion and debt prepayment'
    ]
  },
  {
    id: 'saving',
    badge: 'WEALTH PRESERVATION',
    color: '#2e7d32',
    title: 'Automated Savings Habit',
    subtitle: 'Pay yourself first on the day your allowance or income arrives.',
    image: 'assets/images/emergency-hd.jpg',
    points: [
      'Automate transfers so savings happen before spending',
      'Build a starter emergency cushion of Rs. 15,000+',
      'Compound returns multiply consistent student contributions'
    ]
  },
  {
    id: 'mistakes',
    badge: 'RISK PREVENTION',
    color: '#d97706',
    title: 'Money Traps Avoidance',
    subtitle: 'Dodge high-interest credit traps and lifestyle inflation.',
    image: 'assets/images/mistakes-hd.jpg',
    points: [
      'Avoid Buy-Now-Pay-Later schemes committing future pay',
      'Use 24-hour buffer rule before non-essential purchases',
      'Regular statement audits catch forgotten recurring charges'
    ]
  }
];

export default function DepthCarousel() {
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const dragStartX = useRef(0);
  const dragDistance = useRef(0);
  const total = cards.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 992;

  useEffect(() => {
    fetch('data/learning.json')
      .then((res) => res.json())
      .then((data) => {
        if (data?.modules && Array.isArray(data.modules)) {
          const mapped = data.modules.map((m, i) => ({
            id: m.id || `card-${i}`,
            badge: m.eyebrow || 'FINANCIAL PILLAR',
            color: ['#583397', '#7c4dff', '#9333ea', '#2e7d32', '#d97706', '#0284c7'][i % 6],
            title: m.title,
            subtitle: m.description,
            image: m.image,
            points: (m.keyPoints || []).slice(0, 3)
          }));
          setCards(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    dragDistance.current = e.clientX - dragStartX.current;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDistance.current > 50) {
      prevCard();
    } else if (dragDistance.current < -50) {
      nextCard();
    }
  };

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragDistance.current = 0;
  };

  const handleTouchMove = (e) => {
    dragDistance.current = e.touches[0].clientX - dragStartX.current;
  };

  const handleTouchEnd = () => {
    if (dragDistance.current > 40) {
      prevCard();
    } else if (dragDistance.current < -40) {
      nextCard();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === 'ArrowRight') nextCard();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Mount carousel into the Visual Learning / Explore section
  const containerRef = useRef(null);
  useEffect(() => {
    const targetSection = document.getElementById('resources');
    const existingHeading = targetSection?.querySelector('.bb-section-heading');
    if (!targetSection || !existingHeading || !containerRef.current) return;

    if (!targetSection.contains(containerRef.current)) {
      existingHeading.parentNode.insertBefore(containerRef.current, existingHeading.nextSibling);
    }
  }, []);

  const stageHeight = isMobile ? '330px' : (isTablet ? '345px' : '365px');
  const cardHeight = isMobile ? '320px' : (isTablet ? '335px' : '355px');
  const cardWidth = isMobile ? 'min(290px, 86vw)' : (isTablet ? 'min(320px, 80vw)' : '340px');

  return (
    <div
      ref={containerRef}
      className="depth-carousel-wrapper pt-1 pb-0 px-2 position-relative text-center user-select-none"
      style={{
        overflow: 'hidden',
        maxWidth: '100%',
        marginBottom: isMobile ? '8px' : '14px'
      }}
    >
      <div className="mb-2">
        <span
          className="badge px-3 py-1 mb-2"
          style={{
            background: 'rgba(88, 51, 151, 0.1)',
            color: '#583397',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '9999px'
          }}
        >
          <i className="bi bi-collection-play me-1" /> 3D Interactive Depth Carousel
        </span>
        <h4 className="fw-bold mb-1" style={{ color: '#583397', fontSize: isMobile ? '1.15rem' : '1.3rem' }}>
          Explore Curriculum Modules in 3D
        </h4>
        <p className="text-muted small mx-auto mb-1" style={{ maxWidth: '580px', fontSize: isMobile ? '0.78rem' : '0.825rem' }}>
          Drag left or right, use arrow keys, or click side cards to bring any financial concept into focus.
        </p>
      </div>

      {/* 3D Scene Viewport */}
      <div
        className="depth-carousel-stage position-relative mx-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          height: stageHeight,
          maxWidth: '850px',
          width: '100%',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {cards.map((card, idx) => {
          let offset = idx - activeIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          const stepX = isMobile
            ? Math.min(65, Math.round(windowWidth * 0.16))
            : isTablet
            ? 150
            : 210;
          const translateX = offset * stepX;
          const translateZ = -absOffset * (isMobile ? 80 : 150);
          const rotateY = -offset * (isMobile ? 12 : 18);
          const opacity = isMobile
            ? (absOffset > 1 ? 0 : 1 - absOffset * 0.28)
            : (absOffset > 2 ? 0 : 1 - absOffset * 0.22);
          const zIndex = 20 - absOffset * 4;
          const pointerEvents = (isMobile ? absOffset > 1 : absOffset > 2) ? 'none' : 'auto';

          return (
            <div
              key={card.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`depth-carousel-card position-absolute top-50 start-50 ${isMobile ? 'p-3' : 'p-4'} d-flex flex-column justify-content-between text-start`}
              style={{
                width: cardWidth,
                height: cardHeight,
                borderRadius: '18px',
                background: isCenter
                  ? 'linear-gradient(145deg, #ffffff 0%, #faf8ff 100%)'
                  : '#ffffff',
                border: isCenter
                  ? '2px solid #9333ea'
                  : '1px solid rgba(88, 51, 151, 0.15)',
                boxShadow: isCenter
                  ? '0 16px 36px rgba(88, 51, 151, 0.18)'
                  : '0 8px 22px rgba(88, 51, 151, 0.06)',
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                opacity: opacity,
                zIndex: zIndex,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, border-color 0.3s ease',
                pointerEvents: pointerEvents,
                boxSizing: 'border-box'
              }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span
                    className="badge rounded-pill px-2 py-1"
                    style={{
                      backgroundColor: card.color || '#583397',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: '700'
                    }}
                  >
                    {card.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                    {idx + 1} / {total}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: isMobile ? '1.05rem' : '1.18rem',
                    fontWeight: '800',
                    color: '#583397',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: isMobile ? '0.74rem' : '0.80rem', color: '#64748b', marginBottom: isMobile ? '6px' : '10px', lineHeight: 1.3 }}>
                  {card.subtitle}
                </p>

                <ul className="list-unstyled mb-0" style={{ fontSize: isMobile ? '0.73rem' : '0.78rem' }}>
                  {card.points?.map((pt, pIdx) => (
                    <li key={pIdx} className="mb-1 d-flex align-items-start gap-2">
                      <i
                        className="bi bi-check2-circle mt-1"
                        style={{ color: card.color || '#7c4dff', fontSize: '0.88rem', flexShrink: 0 }}
                      />
                      <span style={{ color: '#334155', lineHeight: 1.3 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.70rem', color: '#94a3b8' }}>
                  Interactive 3D Card
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: isCenter ? '#9333ea' : '#64748b'
                  }}
                >
                  {isCenter ? 'Active Blueprint' : 'Click to view'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
        <button
          onClick={prevCard}
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: isMobile ? '32px' : '36px',
            height: isMobile ? '32px' : '36px',
            borderColor: 'rgba(88, 51, 151, 0.25)',
            color: '#583397',
            cursor: 'pointer',
            padding: 0
          }}
          aria-label="Previous Infographic Card"
        >
          <i className="bi bi-chevron-left" style={{ fontSize: '0.95rem' }} />
        </button>

        {/* Indicator dots */}
        <div className="d-flex gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="border-0 p-0"
              style={{
                width: activeIndex === i ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: activeIndex === i ? '#583397' : '#cbd5e1',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: isMobile ? '32px' : '36px',
            height: isMobile ? '32px' : '36px',
            borderColor: 'rgba(88, 51, 151, 0.25)',
            color: '#583397',
            cursor: 'pointer',
            padding: 0
          }}
          aria-label="Next Infographic Card"
        >
          <i className="bi bi-chevron-right" style={{ fontSize: '0.95rem' }} />
        </button>
      </div>
    </div>
  );
}
