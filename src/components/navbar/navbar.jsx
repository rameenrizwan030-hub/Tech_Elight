import { useLayoutEffect, useRef } from 'react';
import { NAVBAR_MARKUP } from './navbarMarkup';

export default function Navbar() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = NAVBAR_MARKUP;
  }, []);

  return <div ref={ref} />;
}
