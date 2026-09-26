import { useLayoutEffect, useRef } from 'react';
import { HOME_MARKUP } from './homeMarkup';

export default function Home() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.innerHTML = HOME_MARKUP;
  }, []);
  return <div ref={ref} />;
}
