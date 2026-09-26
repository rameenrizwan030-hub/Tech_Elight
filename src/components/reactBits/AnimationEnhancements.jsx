import { useEffect } from 'react';
import TextReveal from './TextReveal';
import HeroColorReveal from './HeroColorReveal';
import PeekRating from './PeekRating';
import DepthCarousel from './DepthCarousel';
import FolderFloat from './FolderFloat';
import ScrollExpand from './ScrollExpand';
import Shredder from './Shredder';
import GlowCursor from './GlowCursor';

function RevealRefresh() {
  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.querySelectorAll('.reveal:not(.bb-enhanced-reveal)').forEach((el) => {
          el.classList.add('bb-enhanced-reveal');
        });
      }, 80);
    };
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);
  return null;
}

export default function AnimationEnhancements() {
  return (
    <>
      <RevealRefresh />
      <TextReveal />
      <HeroColorReveal />
      <PeekRating />
      <DepthCarousel />
      <FolderFloat />
      <ScrollExpand />
      <Shredder />
      <GlowCursor />
    </>
  );
}
