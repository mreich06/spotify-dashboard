'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { date: 'May 1', minutes: 40 },
  { date: 'May 2', minutes: 35 },
  { date: 'May 3', minutes: 60 },
  { date: 'May 4', minutes: 20 },
  { date: 'May 5', minutes: 45 },
  { date: 'May 6', minutes: 50 },
  { date: 'May 7', minutes: 30 },
];

const ListeningActivityChart = () => {
  return (
    <div className="bg-[#0f1d17] rounded-xl p-4 h-[300px] text-white">
      <h2 className="text-lg font-semibold text-green-400 mb-4">Listening Activity</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#1a2a21" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} labelStyle={{ color: '#22c55e' }} cursor={{ fill: '#1e293b33' }} />
          <Line type="monotone" dataKey="minutes" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningActivityChart;
