'use client';

import { ReactNode } from 'react';

export default function GlassCard({ children }: { children: ReactNode }) {
  return <div className="rounded-xl p-4 bg-gradient-to-br from-[#0f1d17] via-[#0d1a15] to-black shadow-inner text-white">{children}</div>;
}
