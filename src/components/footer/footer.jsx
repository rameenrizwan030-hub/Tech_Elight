import { useLayoutEffect, useRef } from 'react';
import { FOOTER_MARKUP } from './footerMarkup';

export default function Footer() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.innerHTML = FOOTER_MARKUP;
  }, []);
  return <div ref={ref} />;
}
