'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../GlassCard/GlassCard';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import { useAppSelector } from '@/app/store/hooks';
import { capitalizeFirstLetter } from '@/lib/utils';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#0f766e', '#064e3b'];

const TopGenres = () => {
  const selectedRange = useAppSelector((state) => state.timeRange.selectedRange);
  const summaryData = useAppSelector((state) => state.summaryStats.data[selectedRange]);

  if (!summaryData?.genres || summaryData.genres.length === 0) {
    return null;
  }

  const totalGenreCount = summaryData.genres.reduce((sum, g) => sum + g.count, 0);
  const chartData = summaryData.genres.map((genre) => ({
    genre: genre.name,
    value: Math.round((genre.count / totalGenreCount) * 100),
  }));

  return (
    <FadeInWhenVisible order="third">
      <div className="relative rounded-xl overflow-hidden p-[1px]">
        <GlassCard>
          <h2 className="text-lg font-semibold text-green-400 mb-4">Your Top 5 Genres</h2>
          <div className="flex flex-col md:flex-row items-center justify-between h-full">
            {/* Pie chart */}
            <div className="w-full md:w-1/2 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="genre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ genre }) => capitalizeFirstLetter(genre)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Genre list w/ percentages */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6 space-y-2">
              {chartData.map((entry, index) => (
                <div key={index} className="flex justify-between border-b border-[#1f2f23] pb-1">
                  <span className="text-sm text-green-300">{capitalizeFirstLetter(entry.genre)}</span>
                  <span className="text-sm text-white font-semibold">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </FadeInWhenVisible>
  );
};

export default TopGenres;
