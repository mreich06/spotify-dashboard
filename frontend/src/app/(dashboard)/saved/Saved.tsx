'use client';

import Snapshot from './Snapshot';

const snapshotList = [
  {
    date: 'Aug 12, 2025',
    name: 'Summer Vibes',
  },
  {
    date: 'Aug 12, 2025',
    name: 'Hip Hop Era',
  },
  {
    date: 'Aug 12, 2025',
    name: 'Chill Winter',
  },
];

const Saved = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-400 mb-2">Maya's Spotify Dashboard</h1>
      <p className="text-md text-white/75 mt-1 mb-3">Discover your top tracks, playlists, genres and artists over time.</p>
      {snapshotList.map((snapshot) => (
        <div className="my-10">
          <Snapshot name={snapshot.name} date={snapshot.date} />
        </div>
      ))}
    </div>
  );
};

export default Saved;
