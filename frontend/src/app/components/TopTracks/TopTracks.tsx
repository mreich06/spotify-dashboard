'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopTracks } from '@/app/store/topTracksSlice';

/**
 * TopTracks component
 *
 * Creates a component that lists the top tracks for that user
 * Fetches the top tracks and displays loading state while fetching
 *
 */
const TopTracks = () => {
  const dispatch = useAppDispatch();
  const { topTracks, loading, error } = useAppSelector((state) => state.topTracks);
  const token = useAppSelector((state) => state.token.accessToken);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchTopTracks());
  }, [token, dispatch]);
  if (loading) return <p>Loading your top tracks...</p>;
  if (error) return <p>Error loading top tracks: {error}</p>;

  return (
    <ol>
      {topTracks.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ol>
  );
};

export default TopTracks;
