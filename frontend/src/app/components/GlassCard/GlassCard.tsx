'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={`rounded-xl p-6 bg-gradient-to-br from-[#0f1d17] via-[#0d1a15] to-black shadow-inner text-white ${className || ''}`}>
      {children}
    </div>
  );
};

export default GlassCard;
