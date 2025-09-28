'use client';

import { useEffect } from 'react';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchSummaryStats } from '@/app/store/summarySlice';
import GlassCard from '../GlassCard/GlassCard';

interface SummaryCardsProps {
  timeRange: 'short_term' | 'medium_term' | 'long_term';
}

export const SummaryCards = ({ timeRange }: SummaryCardsProps) => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.summaryStats);

  useEffect(() => {
    dispatch(fetchSummaryStats());
  }, [dispatch]);

  const statsWithTimeRange = stats?.[timeRange]; // undefined if stats is null

  if (loading) return <p>Loading summary stats...</p>;
  if (error || !stats) return <p>Error loading summary stats: {error || 'No data available'}</p>;

  const statItems = [
    { label: 'Total Tracks', value: statsWithTimeRange?.totalTracks },
    { label: 'Total Play Minutes', value: statsWithTimeRange?.totalMinutes },
    { label: 'Avg Minutes/Day', value: statsWithTimeRange?.avgMinutesPerDay },
    { label: 'Avg Plays/Day', value: statsWithTimeRange?.avgPlaysPerDay },
  ];

  return (
    <FadeInWhenVisible order="second">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, idx) => (
          <GlassCard key={idx}>
            <div className="text-sm text-green-300 mb-1 uppercase tracking-wide">{stat.label}</div>
            <div className="text-3xl font-bold text-green-400">{stat.value}</div>
          </GlassCard>
        ))}
      </div>
    </FadeInWhenVisible>
  );
};

export default SummaryCards;
