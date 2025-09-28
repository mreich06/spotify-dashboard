import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: CardProps) => {
  return (
    <div
      className={`bg-[#0a1511] border border-[#1a2a22]
                  rounded-xl p-6 text-[#dff1e9]
                  shadow-[0_4px_12px_rgba(0,0,0,0.5),0_0_8px_rgba(16,40,24,0.4)] 
                  ${className || ''}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
