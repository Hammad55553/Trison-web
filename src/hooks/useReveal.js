import { useEffect, useRef, useState } from 'react';

export function useReveal(options = {}) {
  const { threshold = 0.18, rootMargin = '0px 0px -80px 0px', once = true } = options;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Safety net: never let content stay invisible if the observer is throttled.
    const fallback = setTimeout(() => setVisible(true), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold, rootMargin, once]);

  return [ref, visible];
}

export default useReveal;
