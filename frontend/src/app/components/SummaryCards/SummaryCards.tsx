'use client';

import { CardContent } from '@/components/ui/card';
import GlassCard from '../GlassCard/GlassCard';

const stats = [
  { label: 'Total Tracks', value: '1,473' },
  { label: 'Total Artists', value: '812' },
  { label: 'Total Play Minutes', value: '14.3k' },
  { label: 'Avg Minutes/Day', value: '71' },
];

export default function SummaryCards() {
  return (
    <div className="w-full flex justify-center bg-black py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-5xl w-full px-4">
        {stats.map((stat, idx) => (
          <GlassCard key={idx}>
            <CardContent className="flex flex-col justify-center items-center text-white">
              <div className="text-sm text-green-300 mb-1 uppercase tracking-wide">{stat.label}</div>
              <div className="text-3xl font-bold text-green-400">{stat.value}</div>
            </CardContent>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
