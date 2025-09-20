'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopPlaylists } from '@/app/store/playlistsSlice';

/**
 * Playlists component
 *
 * Creates a component that lists all of the playlists for that user
 * Fetches the playlists and displays loading state while fetching
 *
 */
const Playlists = () => {
  const dispatch = useAppDispatch();
  const { playlists, loading, error } = useAppSelector((state) => state.topPlaylists);

  useEffect(() => {
    dispatch(fetchTopPlaylists());
  }, [dispatch]);

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p>Error loading playlists: {error}</p>;
  return (
    <div className="pt-4 pl-8">
      <h1>My Playlists</h1>
      <ol className="pt-4">
        {playlists?.['long_term'].items.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default Playlists;
