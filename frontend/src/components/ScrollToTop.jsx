"use client";
import { useEffect } from 'react';
import { useLocation } from 'next/navigation';


const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;