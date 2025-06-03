'use client';

import { ReactNode } from 'react';

export default function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/20 before:pointer-events-none before:[mask-image:linear-gradient(to_bottom_right,white,transparent)] bg-[#0a1410] bg-[radial-gradient(ellipse_at_top_left,_rgba(34,197,94,0.08),_transparent_80%)] p-6 text-white shadow-inner">
      {children}
    </div>
  );
}
