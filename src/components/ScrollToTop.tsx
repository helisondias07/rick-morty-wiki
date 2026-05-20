import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// rola a tela para o topo sempre que muda de rota
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // transição suave
    });
  }, [pathname]);

  return null;
}
