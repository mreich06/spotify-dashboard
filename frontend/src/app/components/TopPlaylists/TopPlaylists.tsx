'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import GlassCard from '../GlassCard/GlassCard';
import { fetchPlaylists } from '@/app/store/playlistsSlice';
import { useEffect } from 'react';

const TopPlaylists = () => {
  const dispatch = useAppDispatch();
  const { playlists, loading, error } = useAppSelector((state) => state.playlists);

  useEffect(() => {
    dispatch(fetchPlaylists());
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading playlists...</p>;
  if (error) return <p className="text-white">Error: {error}</p>;
  return (
    <FadeInWhenVisible order="fourth">
      <GlassCard>
        <h2 className="text-lg font-semibold text-green-400 mb-4">Your Top Playlists</h2>
        <ul className="space-y-3">
          {playlists.items.slice(0, 5).map((playlist) => (
            <li key={playlist.id} className="flex items-center gap-4">
              {playlist.images?.[0]?.url && <img src={playlist.images[0].url} alt={playlist.name} className="w-12 h-12 rounded object-cover" />}
              <span className="text-md">{playlist.name}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopPlaylists;
