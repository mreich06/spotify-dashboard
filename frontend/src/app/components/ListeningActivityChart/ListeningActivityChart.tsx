'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchGenreTrends } from '@/app/store/genreTrendsSlice';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import GlassCard from '../GlassCard/GlassCard';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import { TimeRange } from '@/app/types/spotify';

type ChartRow = {
  time: TimeRange;
  [genre: string]: number | TimeRange;
};

// from top-genres-over-time route
const TopGenresOverTimeChart = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.genreTrends);

  useEffect(() => {
    // fetch genre trends data once when component mounts
    dispatch(fetchGenreTrends());
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading genre trends...</p>;
  if (error || !data) return <p className="text-white">Error loading genre trends</p>;

  // Get union of all genres
  const allGenres = Array.from(new Set(Object.values(data).flatMap((rangeData) => Object.keys(rangeData))));

  // Compute total count across all ranges for each genre
  const genreTotals = allGenres.map((genre) => {
    const total = (data.short_term?.[genre] || 0) + (data.medium_term?.[genre] || 0) + (data.long_term?.[genre] || 0);
    return { genre, total };
  });

  // Sort by total and pick top 5
  const topGenres = genreTotals
    .sort((a, b) => b.total - a.total)
    .slice(0, 5) // change this number to show more/less
    .map((g) => g.genre);

  // Put into chart data format
  // [{ time: "short_term", pop: 10, rock: 5, ... }, ...]
  const chartData: ChartRow[] = Object.entries(data).map(([range, rangeData]) => {
    const row: ChartRow = { time: range as TimeRange };
    for (const genre of topGenres) {
      row[genre] = rangeData[genre] || 0;
    }
    return row;
  });

  return (
    <FadeInWhenVisible order="sixth">
      <GlassCard>
        <div className="p-4 h-[300px]">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Top Genres Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1a2a21" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#ccc" /> {/* short, medium, long term */}
              <YAxis stroke="#ccc" /> {/* genre counts */}
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#22c55e' }}
                cursor={{ fill: '#1e293b33' }}
              />
              <Legend />
              {/* Render only top n genres */}
              {topGenres.map((genre, index) => (
                <Line key={genre} type="monotone" dataKey={genre} stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopGenresOverTimeChart;
