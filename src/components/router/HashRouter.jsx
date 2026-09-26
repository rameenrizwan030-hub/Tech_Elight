import { useEffect } from 'react';
import { scrollToRoute } from '../../routes';

export default function HashRouter() {
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash) {
        window.setTimeout(() => scrollToRoute(window.location.hash), 0);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return null;
}
