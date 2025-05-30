'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { genre: 'Pop', value: 30 },
  { genre: 'Dance Pop', value: 25 },
  { genre: 'Hip Hop', value: 20 },
  { genre: 'Folk', value: 15 },
  { genre: 'Reggaeton', value: 10 },
];

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#0f766e', '#064e3b'];

const TopGenres = () => {
  return (
    <div className="bg-[#0f1d17] rounded-xl p-4 text-white w-full h-[350px]">
      <h2 className="text-lg font-semibold text-green-400 mb-4">Your Top Genres</h2>

      <div className="flex flex-col md:flex-row items-center justify-between h-full">
        {/* Pie chart */}
        <div className="w-full md:w-1/2 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="genre" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ genre }) => genre}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Genre list w/ percentages */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6 space-y-2">
          {data.map((entry, index) => (
            <div key={index} className="flex justify-between border-b border-[#1f2f23] pb-1">
              <span className="text-sm text-green-300">{entry.genre}</span>
              <span className="text-sm text-white font-semibold">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopGenres;
