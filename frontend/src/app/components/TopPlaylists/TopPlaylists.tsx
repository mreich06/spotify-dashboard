// components/TopPlaylists/TopPlaylists.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import GlassCard from '../GlassCard/GlassCard';
import { fetchTopPlaylists } from '@/app/store/playlistsSlice';
import { CardProps } from '@/app/types/spotify';
import Image from 'next/image';

const TopPlaylists = ({ timeRange }: CardProps) => {
  const dispatch = useAppDispatch();
  const { playlists, loading, error } = useAppSelector((state) => state.topPlaylists);

  useEffect(() => {
    dispatch(fetchTopPlaylists());
  }, [dispatch]);

  const playlistsData = playlists?.[timeRange];

  if (loading) return <p className="text-white">Loading playlists...</p>;
  if (error || !playlists) return <p className="text-white">Error: {error || 'No playlist data'}</p>;

  return (
    <FadeInWhenVisible order="third">
      <GlassCard>
        <h2 className="text-lg font-semibold text-green-400 mb-4">Your Top Playlists</h2>
        <ul className="space-y-3">
          {playlistsData?.items.slice(0, 5).map((playlist) => (
            <li key={playlist.id} className="flex items-center gap-4">
              {playlist.images?.[0]?.url && <Image src={playlist.images[0].url} alt={playlist.name} className="w-12 h-12 rounded object-cover" />}
              <span className="text-md">{playlist.name}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopPlaylists;
