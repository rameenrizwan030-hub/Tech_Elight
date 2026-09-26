import { useEffect } from 'react';

const RATING_LEVELS = [
  { level: 1, label: 'Needs Improvement', emoji: '😕', hint: "Didn't meet expectations" },
  { level: 2, label: 'Fair', emoji: '🙂', hint: 'Good start, room to grow' },
  { level: 3, label: 'Good', emoji: '😊', hint: 'Helpful and clear budgeting' },
  { level: 4, label: 'Very Good', emoji: '😃', hint: 'Super practical and visually great' },
  { level: 5, label: 'Excellent!', emoji: '🤩', hint: 'Outstanding financial guide!' }
];

export default function PeekRating() {
  useEffect(() => {
    const group = document.querySelector('.bb-rating-group');
    if (!group || group.dataset.bbPeekRatingActive === '1') return;
    group.dataset.bbPeekRatingActive = '1';

    const stars = [...group.querySelectorAll('.btn-rating-star')];
    const ratingInput = document.getElementById('fbRating');
    const labelText = document.getElementById('ratingLabelText');

    let currentRating = parseInt(ratingInput?.value, 10) || 5;
    let hoveredRating = null;

    // Create the peek preview box above stars
    const previewBox = document.createElement('div');
    previewBox.className = 'peek-preview-box mb-3 d-flex align-items-center px-3 py-1';
    Object.assign(previewBox.style, {
      minHeight: '42px',
      background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%)',
      border: '1px solid rgba(88, 51, 151, 0.2)',
      borderRadius: '9999px',
      boxShadow: '0 4px 14px rgba(88, 51, 151, 0.08)',
      transform: 'scale(1)',
      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      gap: '8px',
      width: 'fit-content'
    });

    const emojiSpan = document.createElement('span');
    emojiSpan.style.fontSize = '1.45rem';
    emojiSpan.style.lineHeight = '1';

    const textDiv = document.createElement('div');
    textDiv.className = 'text-start';

    const titleDiv = document.createElement('div');
    titleDiv.style.fontSize = '0.85rem';
    titleDiv.style.fontWeight = '700';
    titleDiv.style.color = '#583397';

    const hintDiv = document.createElement('div');
    hintDiv.style.fontSize = '0.72rem';
    hintDiv.style.color = '#64748b';

    textDiv.appendChild(titleDiv);
    textDiv.appendChild(hintDiv);
    previewBox.appendChild(emojiSpan);
    previewBox.appendChild(textDiv);

    // Insert preview box before the rating group container
    const parentContainer = group.closest('.d-flex') || group.parentElement;
    if (parentContainer && parentContainer.parentElement) {
      parentContainer.parentElement.insertBefore(previewBox, parentContainer);
    }

    const updatePreview = () => {
      const activeLevel = hoveredRating !== null ? hoveredRating : currentRating;
      const data = RATING_LEVELS.find((r) => r.level === activeLevel) || RATING_LEVELS[4];

      emojiSpan.textContent = data.emoji;
      emojiSpan.setAttribute('aria-label', data.label);
      titleDiv.textContent = data.label;
      hintDiv.textContent = data.hint;
      previewBox.style.transform = hoveredRating !== null ? 'scale(1.06)' : 'scale(1)';

      stars.forEach((star, index) => {
        const starLevel = index + 1;
        const isFilled = activeLevel >= starLevel;
        const isTarget = hoveredRating === starLevel;

        const starIcon = star.querySelector('i');
        if (starIcon) {
          starIcon.className = isFilled ? 'bi bi-star-fill' : 'bi bi-star';
          starIcon.style.color = isFilled ? '#9333ea' : '#cbd5e1';
          starIcon.style.filter = isFilled ? 'drop-shadow(0 2px 6px rgba(147, 51, 234, 0.35))' : 'none';
        }

        star.style.transform = isTarget
          ? 'scale(1.28) translateY(-4px)'
          : isFilled
          ? 'scale(1.08)'
          : 'scale(1)';
        star.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s ease';
      });

      if (labelText) {
        labelText.textContent = `Selected: ${currentRating} out of 5 stars (${(RATING_LEVELS.find(r => r.level === currentRating) || RATING_LEVELS[4]).label})`;
      }
    };

    updatePreview();

    const cleanups = [];

    stars.forEach((star, index) => {
      const level = index + 1;

      const onEnter = () => {
        hoveredRating = level;
        updatePreview();
      };

      const onClick = (e) => {
        e.preventDefault();
        currentRating = level;
        if (ratingInput) ratingInput.value = level;
        updatePreview();
      };

      star.addEventListener('mouseenter', onEnter);
      star.addEventListener('focus', onEnter);
      star.addEventListener('click', onClick);

      cleanups.push(() => {
        star.removeEventListener('mouseenter', onEnter);
        star.removeEventListener('focus', onEnter);
        star.removeEventListener('click', onClick);
      });
    });

    const onGroupLeave = () => {
      hoveredRating = null;
      updatePreview();
    };

    group.addEventListener('mouseleave', onGroupLeave);
    cleanups.push(() => group.removeEventListener('mouseleave', onGroupLeave));

    return () => {
      cleanups.forEach((fn) => fn());
      previewBox.remove();
    };
  }, []);

  return null;
}
