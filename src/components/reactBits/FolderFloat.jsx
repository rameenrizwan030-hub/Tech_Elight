import { useState, useEffect, useRef } from 'react';

const DEFAULT_TIPS = [
  {
    id: 'tip-1',
    tag: 'Saving Habit',
    title: 'Pay Yourself First',
    desc: 'Transfer at least 15% to 20% of any income directly to savings before discretionary spending.',
    impact: 'Builds Rs. 15,000+ annual buffer'
  },
  {
    id: 'tip-2',
    tag: 'Mindful Spending',
    title: 'The 24-Hour Buffer Rule',
    desc: 'For non-essential purchases over Rs. 2,000, wait 24 hours to eliminate impulse dopamine buying.',
    impact: 'Prevents 35% of impulse expenses'
  },
  {
    id: 'tip-3',
    tag: 'Expense Audit',
    title: 'Ghost Subscription Check',
    desc: 'Review bank statements monthly to cancel forgotten app free trials and unused streaming tiers.',
    impact: 'Saves Rs. 2,400+ per semester'
  },
  {
    id: 'tip-4',
    tag: 'Emergency Fund',
    title: 'Starter Emergency Cushion',
    desc: 'Accumulate a starter buffer of Rs. 15,000 to insulate against sudden phone or laptop repairs.',
    impact: 'Zero emergency debt stress'
  },
  {
    id: 'tip-5',
    tag: '50/30/20 Rule',
    title: 'Essential Needs Ceiling',
    desc: 'Ensure mandatory survival costs (rent, food, commute) never exceed 50% of net income.',
    impact: 'Guarantees monthly surplus'
  },
  {
    id: 'tip-6',
    tag: 'Debt Prevention',
    title: 'Beware Pay-Later Traps',
    desc: 'Zero-interest Buy-Now-Pay-Later schemes encourage lifestyle inflation and commit future income.',
    impact: 'Protects student credit health'
  }
];

export default function FolderFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTip, setActiveTip] = useState(null);
  const [tips, setTips] = useState(DEFAULT_TIPS);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 680;

  useEffect(() => {
    fetch('data/tips.json')
      .then((res) => res.json())
      .then((data) => {
        if (data?.tips && Array.isArray(data.tips)) {
          const impacts = [
            'Builds Rs. 15,000+ buffer',
            'Prevents 35% impulse buys',
            'Saves Rs. 2,400+ / semester',
            'Zero emergency debt',
            'Guarantees monthly surplus',
            'Protects student credit'
          ];
          const mapped = data.tips.map((t, idx) => ({
            id: t.id || `tip-${idx}`,
            tag: t.category || 'Financial Tip',
            title: t.text.split(':')[0] || 'Smart Money Tip',
            desc: t.text.split(':')[1]?.trim() || t.text,
            impact: impacts[idx % impacts.length]
          }));
          setTips(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Mount into the Saving Goals panel in #planning
  useEffect(() => {
    const goalsPanel = document.querySelector('#panel-saving-goals .bb-tool-container');
    if (!goalsPanel || !containerRef.current) return;

    if (!goalsPanel.contains(containerRef.current)) {
      goalsPanel.appendChild(containerRef.current);
    }
  }, []);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
    if (isOpen) setActiveTip(null);
  };

  return (
    <div
      ref={containerRef}
      className="folder-float-container py-4 text-center position-relative mt-4 border-top"
      style={{ overflowX: 'clip', maxWidth: '100%' }}
    >
      <div className="mb-3 px-2">
        <span
          className="badge px-3 py-1 mb-2"
          style={{
            background: 'var(--bb-lav-100)',
            color: 'var(--bb-lav-800)',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '9999px'
          }}
        >
          <i className="bi bi-shield-lock me-1" /> Interactive Financial Tips Vault
        </span>
        <h4 className="fw-bold mb-1" style={{ color: '#583397', fontSize: '1.25rem' }}>
          Smart Student Savings &amp; Budget Vault
        </h4>
        <p className="text-muted small mx-auto" style={{ maxWidth: '520px' }}>
          Click the vault folder below to release floating tactical savings tips and student budget hacks.
        </p>
      </div>

      {/* Main Folder Trigger & Physics Stage */}
      <div
        className="folder-stage position-relative mx-auto my-3 d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: !isMobile ? (isOpen ? '360px' : '170px') : 'auto',
          maxWidth: '780px',
          width: '100%',
          transition: 'min-height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Desktop / Tablet Floating Cards (render when open) */}
        {isOpen && !isMobile && (
          <div className="floating-cards-field position-absolute top-0 start-0 w-100 h-100">
            {tips.slice(0, 6).map((tip, idx) => {
              const scaleFactor = Math.min(1, Math.max(0.65, (windowWidth - 360) / 480));
              const angles = [-14, 10, -6, 12, -18, 8];
              const baseXOffsets = [-230, -105, 0, 105, 230, 20];
              const baseYOffsets = [-75, -105, -115, -95, -65, 75];

              const angle = angles[idx % angles.length];
              const xPos = Math.round(baseXOffsets[idx % baseXOffsets.length] * scaleFactor);
              const yPos = Math.round(baseYOffsets[idx % baseYOffsets.length] * scaleFactor);

              const isSelected = activeTip?.id === tip.id;

              return (
                <div
                  key={tip.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTip(isSelected ? null : tip);
                  }}
                  className="floating-tip-card position-absolute top-50 start-50 p-3 text-start"
                  style={{
                    width: 'min(200px, 44vw)',
                    background: isSelected
                      ? 'linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)'
                      : '#ffffff',
                    border: isSelected
                      ? '2px solid #9333ea'
                      : '1px solid rgba(88, 51, 151, 0.18)',
                    borderRadius: '14px',
                    boxShadow: isSelected
                      ? '0 16px 36px rgba(88, 51, 151, 0.25)'
                      : '0 8px 24px rgba(88, 51, 151, 0.12)',
                    transform: `translate(-50%, -50%) translate(${xPos}px, ${yPos}px) rotate(${angle}deg) scale(${isSelected ? 1.15 : 1})`,
                    zIndex: isSelected ? 40 : 20 + idx,
                    cursor: 'pointer',
                    transition:
                      'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: '#ede9fe',
                        color: '#583397',
                        fontSize: '0.68rem'
                      }}
                    >
                      {tip.tag}
                    </span>
                    <i
                      className="bi bi-stars"
                      style={{ color: '#9333ea', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      color: '#1e1b4b',
                      lineHeight: 1.25,
                      marginBottom: '4px'
                    }}
                  >
                    {tip.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      lineHeight: 1.35
                    }}
                  >
                    {tip.desc}
                  </div>
                  <div
                    className="mt-2 pt-1 border-top"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#7c4dff'
                    }}
                  >
                    {tip.impact}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3D Physical Folder Button */}
        <button
          onClick={toggleFolder}
          className="folder-body-button border-0 position-relative p-0 d-flex flex-column align-items-center justify-content-center"
          style={{
            width: '150px',
            height: '115px',
            background: 'linear-gradient(135deg, #583397 0%, #6b46c1 100%)',
            borderRadius: '14px',
            boxShadow: '0 14px 30px rgba(88, 51, 151, 0.28)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          aria-expanded={isOpen}
          aria-label="Toggle Financial Tips Vault Folder"
        >
          {/* Top Folder Tab */}
          <div
            className="position-absolute"
            style={{
              top: '-12px',
              left: '14px',
              width: '55px',
              height: '16px',
              background: '#482682',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          />

          <i
            className={`bi ${isOpen ? 'bi-folder2-open' : 'bi-folder-fill'}`}
            style={{ fontSize: '2.5rem', color: '#f8f7ff' }}
          />

          <span
            className="badge rounded-pill mt-1"
            style={{
              background: isOpen ? '#9333ea' : 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: '600'
            }}
          >
            {isOpen ? 'Close Vault' : 'Open Tips Vault'}
          </span>
        </button>

        {/* Mobile Responsive Cards Deck (renders inline below folder when open) */}
        {isOpen && isMobile && (
          <div
            className="mobile-tips-deck mt-3 px-1 w-100"
            style={{
              display: 'grid',
              gridTemplateColumns: windowWidth < 460 ? '1fr' : 'repeat(2, 1fr)',
              gap: '10px',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            {tips.slice(0, 6).map((tip, idx) => {
              const isSelected = activeTip?.id === tip.id;
              return (
                <div
                  key={tip.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTip(isSelected ? null : tip);
                  }}
                  className="mobile-tip-card p-3 text-start"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)'
                      : '#ffffff',
                    border: isSelected
                      ? '2px solid #9333ea'
                      : '1.5px solid rgba(88, 51, 151, 0.15)',
                    borderRadius: '14px',
                    boxShadow: isSelected
                      ? '0 10px 24px rgba(88, 51, 151, 0.2)'
                      : '0 4px 14px rgba(88, 51, 151, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: '#ede9fe',
                        color: '#583397',
                        fontSize: '0.68rem'
                      }}
                    >
                      {tip.tag}
                    </span>
                    <i
                      className="bi bi-stars"
                      style={{ color: '#9333ea', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      color: '#1e1b4b',
                      lineHeight: 1.25,
                      marginBottom: '4px'
                    }}
                  >
                    {tip.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      lineHeight: 1.35
                    }}
                  >
                    {tip.desc}
                  </div>
                  <div
                    className="mt-2 pt-1 border-top"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#7c4dff'
                    }}
                  >
                    {tip.impact}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Tip Inspector Modal/Callout */}
      {activeTip && (
        <div
          className="active-tip-highlight mx-auto p-3 mt-3 text-start bb-card"
          style={{
            maxWidth: '520px',
            background: '#ffffff',
            borderLeft: '4px solid #9333ea',
            animation: 'fadeInUp 0.2s ease',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(88, 51, 151, 0.14)'
          }}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span className="badge bg-light text-primary mb-1">{activeTip.tag}</span>
              <h5 className="mb-0 fw-bold" style={{ color: '#583397' }}>
                {activeTip.title}
              </h5>
            </div>
            <button
              onClick={() => setActiveTip(null)}
              className="btn btn-sm btn-link text-muted p-0"
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <p className="mb-2 text-secondary" style={{ fontSize: '0.875rem' }}>
            {activeTip.desc}
          </p>
          <div className="fw-bold" style={{ color: '#7c4dff', fontSize: '0.85rem' }}>
            Estimated Value: {activeTip.impact}
          </div>
        </div>
      )}
    </div>
  );
}
