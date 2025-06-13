'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchGenreTrends } from '@/app/store/genreTrendsSlice';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import GlassCard from '../GlassCard/GlassCard';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import { GenreTrendsResponse } from '@/app/types/spotify';

const TopGenresOverTimeChart = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.genreTrends);

  useEffect(() => {
    dispatch(fetchGenreTrends());
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading genre trends...</p>;
  if (error || !data) return <p className="text-white">Error loading genre trends</p>;

  // Extract top 5 genres across all time ranges
  const genreFrequency: Record<string, number> = {};
  for (const timeRange of Object.values(data)) {
    for (const [genre, count] of Object.entries(timeRange)) {
      if (typeof count === 'number') {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + count;
      }
    }
  }

  const topGenres = Object.entries(genreFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  // Format data for recharts
  const chartData = (['short_term', 'medium_term', 'long_term'] as Array<keyof GenreTrendsResponse>).map((range) => {
    const rangeData: Record<string, number | string> = {
      time: range.replace('_term', '').toUpperCase(),
    };
    topGenres.forEach((genre) => {
      rangeData[genre] = data?.[range]?.[genre] || 0;
    });
    return rangeData;
  });

  return (
    <FadeInWhenVisible order="sixth">
      <GlassCard>
        <div className="p-4 h-[300px]">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Top Genres Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1a2a21" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#22c55e' }}
                cursor={{ fill: '#1e293b33' }}
              />
              <Legend />
              {topGenres.map((genre, index) => (
                <Line key={genre} type="monotone" dataKey={genre} stroke={`hsl(${index * 60}, 70%, 50%)`} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopGenresOverTimeChart;
