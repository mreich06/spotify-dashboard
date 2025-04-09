'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopArtists } from '@/app/store/artistsSlice';
import { SpotifyArtist } from '@/app/types/spotify';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';
type GenreFrequencyMap = Record<string, Record<TimeRange, number>>;

const countGenresByTimeRange = (data: Record<TimeRange, SpotifyArtist[]>): GenreFrequencyMap => {
  const result: GenreFrequencyMap = {};

  // go through each time range to get the genre count for each
  for (const range of ['short_term', 'medium_term', 'long_term'] as TimeRange[]) {
    const artists = data[range];

    // for each time range, add the genre counts
    for (const artist of artists) {
      for (const genre of artist.genres) {
        // if genre doesnt exist already, add it to result
        if (!result[genre]) {
          result[genre] = {
            short_term: 0,
            medium_term: 0,
            long_term: 0,
          };
        }
        result[genre][range]++; // increase if it exists
      }
    }
  }

  return result;
};

const getGenreCountsByTimeRange = (artistsByRange: Record<TimeRange, SpotifyArtist[]>) => {
  // get genreCount for each time range
  const genreCount = (artists: SpotifyArtist[]) => {
    const genreCounts: Record<string, number> = {};
    for (const artist of artists) {
      for (const genre of artist.genres) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }
    return genreCounts;
  };

  return {
    shortTermGenres: genreCount(artistsByRange.short_term),
    mediumTermGenres: genreCount(artistsByRange.medium_term),
    longTermGenres: genreCount(artistsByRange.long_term),
  };
};
/**
 * TopTracks component
 *
 * Creates a component that lists the top tracks for that user
 * Fetches the top tracks and displays loading state while fetching
 *
 */
const GenreEvolution = () => {
  const dispatch = useAppDispatch();
  const { artists, loading, error } = useAppSelector((state) => state.artists);

  useEffect(() => {
    dispatch(fetchTopArtists({ query: { time_range: 'short_term' } }));
    dispatch(fetchTopArtists({ query: { time_range: 'medium_term' } }));
    dispatch(fetchTopArtists({ query: { time_range: 'long_term' } }));
  }, [dispatch]);

  if (loading) return <p>Loading your genres...</p>;
  if (error) return <p>Error loading genres: {error}</p>;

  // get genres of top artists for short, medium and long term
  const { shortTermGenres, mediumTermGenres, longTermGenres } = getGenreCountsByTimeRange(artists);

  for (const [key, value] of Object.entries(shortTermGenres)) {
    console.log(key, value);
  }
  return <div></div>;
};

export default GenreEvolution;
