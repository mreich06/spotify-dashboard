'use client';

import { Card, CardContent } from '@/components/ui/card';
import GlassCard from '../GlassCard/GlassCard';

type Artist = {
  id: string;
  name: string;
  imageUrl: string;
};

const recommended: Artist[] = [
  {
    id: '1',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebea709c4d1c2096c0b6e53a60',
  },
  {
    id: '2',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b8b7d5fbd4d5a3fcd7e2f3d',
  },
  {
    id: '3',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8d8e7bb1fce08a9c75faea0d',
  },
  {
    id: '4',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb56b75983f5e7a06b3db96edc',
  },
  {
    id: '5',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb07b30e4f453cdb206f85e745',
  },
];

const RecommendedArtists = () => {
  return (
    <GlassCard>
      <CardContent className="p-4">
        <h2 className="title">Recommended Artists</h2>
        <ul className="space-y-4">
          {recommended.map((artist) => (
            <li key={artist.id} className="flex items-center gap-4">
              <img src={artist.imageUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover border border-green-700/40 shadow-sm" />
              <span className="text-md text-white">{artist.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </GlassCard>
  );
};

export default RecommendedArtists;
