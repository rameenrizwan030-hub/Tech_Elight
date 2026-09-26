import { useState, useEffect, useRef } from 'react';

export default function Shredder() {
  const [activeItem, setActiveItem] = useState(null);
  const [isShredding, setIsShredding] = useState(false);
  const containerRef = useRef(null);

  // Mount shredder widget below the expense planner table
  useEffect(() => {
    const tableWrap = document.querySelector('.bb-table-wrap');
    if (!tableWrap || !containerRef.current) return;

    if (!tableWrap.parentNode.contains(containerRef.current)) {
      tableWrap.parentNode.insertBefore(containerRef.current, tableWrap.nextSibling);
    }
  }, []);

  // Hook into window.deleteExpense to trigger animated shredding
  useEffect(() => {
    let originalDelete = window.deleteExpense;

    const checkAndWrap = () => {
      if (typeof window.deleteExpense === 'function' && window.deleteExpense !== wrappedDelete) {
        originalDelete = window.deleteExpense;
        window.deleteExpense = wrappedDelete;
      }
    };

    const wrappedDelete = (id) => {
      // Find row details to display on paper slip
      const table = document.getElementById('epTableBody');
      let title = 'Student Expense';
      let amount = '0';

      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
          const btn = row.querySelector(`button[onclick*="${id}"]`);
          if (btn) {
            const cols = row.querySelectorAll('td');
            if (cols.length >= 4) {
              title = cols[2]?.textContent?.trim() || cols[1]?.textContent?.trim() || 'Expense';
              amount = cols[3]?.textContent?.replace(/[^\d.,]/g, '').trim() || '0';
            }
          }
        });
      }

      // Trigger shredding
      setActiveItem({ id, title, amount });
      setIsShredding(true);

      // Scroll smoothly to shredder so user witnesses the animation
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        setIsShredding(false);
        setActiveItem(null);
        if (typeof originalDelete === 'function') {
          originalDelete(id);
        }
      }, 1600);
    };

    checkAndWrap();
    const interval = setInterval(checkAndWrap, 300);

    return () => {
      clearInterval(interval);
      if (typeof originalDelete === 'function') {
        window.deleteExpense = originalDelete;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="shredder-widget-container d-flex flex-column align-items-center p-3 text-center my-3 mx-auto"
      style={{
        maxWidth: '380px',
        background: 'rgba(88, 51, 151, 0.04)',
        borderRadius: '16px',
        border: '1px dashed rgba(88, 51, 151, 0.25)'
      }}
    >
      <div className="text-muted small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '0.06em' }}>
        <i className="bi bi-trash3 me-1 text-danger" /> Interactive Expense Shredder
      </div>

      {/* Paper feeding into slot */}
      <div
        className="shredder-feed-zone position-relative overflow-hidden mb-1 d-flex justify-content-center align-items-end"
        style={{
          width: '240px',
          height: '75px'
        }}
      >
        {isShredding && activeItem && (
          <div
            className="shredding-slip position-absolute bg-white px-3 py-2 border shadow-sm text-start"
            style={{
              width: '190px',
              borderRadius: '6px',
              borderTop: '3px solid #ef4444',
              animation: 'feedIntoShredder 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              zIndex: 3
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e1b4b' }} className="text-truncate">
              {activeItem.title}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>
              Rs. {activeItem.amount} (Shredding...)
            </div>
          </div>
        )}
      </div>

      {/* Shredder Machine Head */}
      <div
        className="shredder-head position-relative p-2 px-3 d-flex flex-column align-items-center justify-content-between"
        style={{
          width: '250px',
          height: '65px',
          background: 'linear-gradient(180deg, #321a5c 0%, #1e1b4b 100%)',
          borderRadius: '12px',
          boxShadow: isShredding
            ? '0 10px 25px rgba(239, 68, 68, 0.35)'
            : '0 8px 20px rgba(88, 51, 151, 0.25)',
          border: '2px solid #583397',
          animation: isShredding ? 'shredderVibrate 0.1s infinite' : 'none',
          zIndex: 4
        }}
      >
        {/* Machine Feed Slot */}
        <div
          className="shredder-slot w-100"
          style={{
            height: '8px',
            background: '#0f172a',
            borderRadius: '4px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
          }}
        />

        <div className="w-100 d-flex justify-content-between align-items-center mt-1">
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: '600' }}>
            <i className="bi bi-cpu me-1" />
            Budget Shredder
          </span>
          <span
            className="badge rounded-pill"
            style={{
              background: isShredding ? '#ef4444' : '#10b981',
              color: '#ffffff',
              fontSize: '0.65rem'
            }}
          >
            {isShredding ? 'SHREDDING' : 'READY'}
          </span>
        </div>
      </div>

      {/* Shredded paper strips falling out bottom */}
      <div
        className="shredder-exit-zone position-relative overflow-hidden mt-1 d-flex justify-content-center"
        style={{
          width: '240px',
          height: '65px'
        }}
      >
        {isShredding && (
          <div className="d-flex justify-content-center gap-1 w-100">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="paper-strip"
                style={{
                  width: '12px',
                  background: i % 2 === 0 ? '#ffffff' : '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2px',
                  animation: `paperStripFall 0.7s ease-in ${0.2 + (i % 4) * 0.1}s forwards`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes feedIntoShredder {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          70% {
            transform: translateY(65px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(90px);
            opacity: 0;
          }
        }

        @keyframes shredderVibrate {
          0% { transform: translateY(0); }
          50% { transform: translateY(1.5px); }
          100% { transform: translateY(-1.5px); }
        }

        @keyframes paperStripFall {
          0% {
            height: 0;
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            height: 35px;
            opacity: 1;
          }
          100% {
            height: 48px;
            transform: translateY(24px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
