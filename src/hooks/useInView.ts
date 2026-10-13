import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Root margin passed to IntersectionObserver. Default: '0px 0px -60px 0px' (trigger slightly before fully in view). */
  rootMargin?: string;
  /** Intersection threshold. Default: 0.1 */
  threshold?: number;
}

/**
 * Fires once when the referenced element enters the viewport.
 * Immediately returns `true` when `prefers-reduced-motion: reduce` is active,
 * so all content is visible without any animation.
 *
 * Usage:
 *   const [ref, inView] = useInView<HTMLDivElement>();
 */
export function useInView<T extends Element = Element>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { rootMargin = '0px 0px -60px 0px', threshold = 0.1 } = options;

  // Honour prefers-reduced-motion: skip the whole observer and show content immediately.
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    // Fallback: if IntersectionObserver is not available (very old browsers),
    // show content immediately so it is never stuck at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(el); // fire once only
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [prefersReduced, rootMargin, threshold]);

  return [ref, inView];
}
