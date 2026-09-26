import { useEffect } from 'react';

export default function TextReveal() {
  useEffect(() => {
    const heading = document.querySelector('.bb-hero-heading');
    if (!heading || heading.dataset.bb3dTextReveal === '1') return;
    heading.dataset.bb3dTextReveal = '1';

    heading.style.perspective = '1200px';
    heading.style.transformStyle = 'preserve-3d';

    // Collect all text nodes while preserving inline elements like <em>
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeValue && currentNode.nodeValue.trim()) {
        textNodes.push(currentNode);
      }
    }

    let globalCharIndex = 0;
    const duration = 800;

    textNodes.forEach((node) => {
      const parent = node.parentNode;
      const text = node.nodeValue;
      const words = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();

      words.forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }

        const wordSpan = document.createElement('span');
        wordSpan.className = 'text-3d-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        wordSpan.style.transformStyle = 'preserve-3d';

        chunk.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'text-3d-char';
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.transformStyle = 'preserve-3d';
          charSpan.style.transformOrigin = 'bottom center';
          charSpan.style.transform = 'rotateX(85deg) translateY(45px) translateZ(-40px)';
          charSpan.style.opacity = '0';
          charSpan.style.willChange = 'transform, opacity';

          const delayMs = globalCharIndex * 35;
          charSpan.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity ${duration * 0.8}ms ease ${delayMs}ms`;

          wordSpan.appendChild(charSpan);
          globalCharIndex += 1;
        });

        frag.appendChild(wordSpan);
      });

      parent.replaceChild(frag, node);
    });

    // Trigger reveal on next frame
    const timer = setTimeout(() => {
      heading.querySelectorAll('.text-3d-char').forEach((el) => {
        el.style.transform = 'rotateX(0deg) translateY(0) translateZ(0)';
        el.style.opacity = '1';
      });
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
