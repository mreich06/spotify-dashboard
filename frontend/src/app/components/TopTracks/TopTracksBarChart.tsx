'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../GlassCard/GlassCard';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const data = [
  { name: 'Artist', plays: 320 },
  { name: 'Artist', plays: 275 },
  { name: 'Artist', plays: 210 },
  { name: 'Artist', plays: 180 },
  { name: 'Artist', plays: 160 },
  { name: 'Artist', plays: 130 },
];

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#0f766e', '#065f46', '#064e3b'];

const TopTracksBarChart = () => {
  return (
    <FadeInWhenVisible order="fifth">
      <GlassCard>
        <div className="p-4 h-[300px]">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Top Tracks by Play Count</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
              <XAxis type="number" stroke="#ccc" />
              <YAxis type="category" dataKey="name" stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#22c55e' }}
                cursor={{ fill: '#1e293b33' }}
              />
              <Bar dataKey="plays">
                {data.map((entry, index) => (
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
