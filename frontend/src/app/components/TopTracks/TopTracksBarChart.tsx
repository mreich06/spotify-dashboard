'use client';

import { useAppSelector } from '@/app/store/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../GlassCard/GlassCard';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#0f766e', '#065f46', '#064e3b'];

const TopTracksBarChart = () => {
  const { track } = useAppSelector((state) => state.mostStreamedTrack);

  const data =
    track?.items?.slice(0, 6).map((t) => ({
      name: t.name.length > 20 ? `${t.name.slice(0, 20)}…` : t.name,
      popularity: t.popularity,
    })) || [];

  return (
    <FadeInWhenVisible order="fifth">
      <GlassCard>
        <div className="p-4 h-[300px]">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Top Tracks by Popularity</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 10, right: 20, left: -30, bottom: 10 }}>
              <XAxis type="number" stroke="#ccc" />
              <YAxis type="category" dataKey="name" stroke="#ccc" tick={{ fontSize: 12 }} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#22c55e' }}
                cursor={{ fill: '#1e293b33' }}
              />
              <Bar dataKey="popularity">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopTracksBarChart;
