'use client';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const orderDelays: Record<string, number> = {
  first: 0,
  second: 0.2,
  third: 0.4,
  fourth: 0.6,
  fifth: 0.8,
};

const FadeInWhenVisible = ({
  children,
  order = 'first',
  className = '',
}: {
  children: React.ReactNode;
  order?: 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth';
  className?: string;
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          delay: orderDelays[order] ?? 0,
          duration: 0.7,
          ease: 'easeOut',
        },
      });
    }
  }, [controls, inView, order]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={controls} className={className}>
      {children}
    </motion.div>
  );
};

export default FadeInWhenVisible;
