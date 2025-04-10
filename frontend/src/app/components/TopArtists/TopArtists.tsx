'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopArtists } from '@/app/store/artistsSlice';

/**
 * TopArtists component
 *
 * Creates a component that lists the top artists in the medium term for that user
 * Fetches the top artists and displays loading state while fetching
 *
 */
const TopArtists = () => {
  const dispatch = useAppDispatch();
  const {
    artists: { medium_term },
    loading,
    error,
  } = useAppSelector((state) => state.artists);

  useEffect(() => {
    dispatch(fetchTopArtists());
  }, [dispatch]);

  if (loading) return <p>Loading your top artists...</p>;
  if (error) return <p>Error loading top artists: {error}</p>;
  return (
    <div>
      <h1>Top Artists</h1>
      <ol className="pt-4 pl-8">
        {medium_term.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default TopArtists;
