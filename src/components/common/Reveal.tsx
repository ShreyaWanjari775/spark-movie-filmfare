import React from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  /** Children to reveal. */
  children: React.ReactNode;
  /**
   * Animation delay in milliseconds (for staggered children).
   * Applied via the `--reveal-delay` CSS custom property.
   * Default: 0
   */
  delay?: number;
  /** Extra class names to add to the wrapper div. */
  className?: string;
  /** Root margin forwarded to useInView. */
  rootMargin?: string;
  /** HTML tag to use for the wrapper element. Default: 'div' */
  as?: React.ElementType;
}

/**
 * A lightweight reveal wrapper that fades + slides up its children when
 * the element enters the viewport (single fire, via IntersectionObserver).
 *
 * Respects `prefers-reduced-motion`: content is shown immediately with no
 * movement when reduced motion is preferred.
 *
 * Styling lives in index.css under the `.reveal` / `.reveal-visible` classes.
 * Stagger delays are controlled by the `delay` prop (written to `--reveal-delay`).
 *
 * Usage:
 *   <Reveal delay={150} className="w-full">
 *     <MyCard />
 *   </Reveal>
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  className = '',
  rootMargin,
  as: Tag = 'div',
}) => {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin });

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal ${inView ? 'reveal-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
