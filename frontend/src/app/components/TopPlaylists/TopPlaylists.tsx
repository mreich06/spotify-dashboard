'use client';

import GlassCard from '../GlassCard/GlassCard';

type Playlist = {
  id: string;
  name: string;
  imageUrl: string;
};

const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    imageUrl: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    name: 'Top Hits',
    imageUrl: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    name: 'Focus Mix',
    imageUrl: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    name: 'Throwbacks',
    imageUrl: 'https://via.placeholder.com/50',
  },
  {
    id: '5',
    name: 'Morning Energy',
    imageUrl: 'https://via.placeholder.com/50',
  },
];

const TopPlaylists = () => {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-green-400 mb-4">Your Top Playlists</h2>
      <ul className="space-y-3">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="flex items-center gap-4">
            <img src={playlist.imageUrl} alt={playlist.name} className="w-12 h-12 rounded object-cover" />
            <span className="text-md">{playlist.name}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default TopPlaylists;
