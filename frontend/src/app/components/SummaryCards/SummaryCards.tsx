'use client';

import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const stats = [
  { label: 'Total Tracks', value: '1,473' },
  { label: 'Total Play Minutes', value: '14.3k' },
  { label: 'Avg Minutes/Day', value: '71' },
  { label: 'Avg Minutes/Day', value: '71' },
];
export default function SummaryCards() {
  return (
    <FadeInWhenVisible order="second">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl p-4 bg-gradient-to-br from-[#0f1d17] via-[#0d1a15] to-black shadow-inner text-white">
            <div className="text-sm text-green-300 mb-1 uppercase tracking-wide">{stat.label}</div>
            <div className="text-3xl font-bold text-green-400">{stat.value}</div>
          </div>
        ))}
      </div>
    </FadeInWhenVisible>
  );
}
