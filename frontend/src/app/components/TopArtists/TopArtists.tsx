'use client';

import { useEffect } from 'react';
import styles from './TopArtists.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopArtists } from '@/app/store/artistsSlice';

const TopArtists = () => {
  const dispatch = useAppDispatch();
  const { artists, loading, error } = useAppSelector((state) => state.artists);
  const token = useAppSelector((state) => state.token.accessToken);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchTopArtists(token));
  }, [token, dispatch]);

  if (loading) return <p>Loading your top artists...</p>;
  if (error) return <p>Error loading top artists: {error}</p>;
  return (
    <div>
      <h1>Top Artists</h1>
      <ol className={styles.artistList}>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default TopArtists;
