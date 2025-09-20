'use client';

import { motion } from 'framer-motion';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import { TimeRange } from '@/app/types/spotify';

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: 'Last 4 Weeks', value: 'short_term' },
  { label: 'Last 6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
];

interface YearSelectorTabsProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelectorTabs = ({ selectedRange, onChange }: YearSelectorTabsProps) => {
  return (
    <FadeInWhenVisible order="first">
      <div className="relative mt-4 sm:mt-0 flex items-center justify-center bg-[#1c2b24] rounded-full p-1 w-full max-w-sm mx-auto">
        <div className="relative flex w-full justify-between">
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-0 bottom-0 bg-green-500 rounded-full z-0"
            style={{
              width: 'calc(100% / 3 - 0.5rem)',
              left: `calc(${timeRanges.findIndex((t) => t.value === selectedRange)} * (100% / 3))`,
            }}
          />
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onChange(range.value)}
              className={`relative z-10 flex-1 text-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedRange === range.value ? 'text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

export default TimeRangeSelectorTabs;
