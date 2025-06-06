'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const YearSelectorTabs = () => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const yearBeforeLast = currentYear - 2;
  const years = [yearBeforeLast, lastYear, currentYear];
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <FadeInWhenVisible order="first">
      <div className="relative mt-4 sm:mt-0 flex items-center justify-center bg-[#1c2b24] rounded-full p-1">
        <div className="relative flex space-x-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                year === selectedYear ? 'text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}

          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute z-0 h-full bg-green-500 rounded-full"
            style={{
              width: 'calc(100% / 3 - 0.5rem)',
              left: `calc(${years.indexOf(selectedYear)} * (100% / 3))`,
            }}
          />
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

export default YearSelectorTabs;
