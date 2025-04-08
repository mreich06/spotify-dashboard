'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchPlaylists } from '@/app/store/playlistsSlice';
import styles from './Playlists.module.css';

/**
 * Playlists component
 *
 * Creates a component that lists all of the playlists for that user
 * Fetches the playlists and displays loading state while fetching
 *
 */
const Playlists = () => {
  const dispatch = useAppDispatch();
  const { playlists, loading, error } = useAppSelector((state) => state.playlists);
  const token = useAppSelector((state) => state.token.accessToken);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchPlaylists(token));
  }, [dispatch, token]);

  if (loading) return <p>Loading your playlists...</p>;
  if (error) return <p>Error loading playlists: {error}</p>;
  return (
    <div>
      <h1>Top Artists</h1>
      <ol className={styles.playlist}>
        {playlists.items.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default Playlists;
