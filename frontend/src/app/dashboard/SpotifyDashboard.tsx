'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/tokenSlice';
import { RootState } from '../store';
import styles from './SpotifyDashboard.module.css';
import { SpotifyArtist, SpotifyTopArtistsResponse } from '../types/spotify';

/**
 * SpotifyDashboard client component - main app component
 *
 * Handles the post-login flow by getting the Spotify access token from the URL
 * or sessionStorage if it exists. Then store it in local state and remove token from the URL
 *
 * 1. Extract token from the URL query string after OAuth redirect
 * 2. Stores token in sessionStorage for later
 * 3. Update state to trigger a re-render
 * 4. Cleans up  URL using Next.js router
 *
 * Displays a loading message until we have the token
 */
const SpotifyDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.token.accessToken);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);

  // Get token from URL or sessionStorage and store in Redux
  useEffect(() => {
    const queryToken = searchParams.get('token');
    const storedToken = sessionStorage.getItem('spotify_token');

    if (queryToken) {
      sessionStorage.setItem('spotify_token', queryToken);
      dispatch(setToken(queryToken));
      router.replace('/dashboard');
    } else if (storedToken) {
      dispatch(setToken(storedToken));
    } else {
      setLoading(false);
    }
  }, [searchParams, router, dispatch]);

  // fetch top artists data
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:4000/top-artists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: SpotifyTopArtistsResponse) => {
        setArtists(data.items || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching top artists:', error);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading...</p>;

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

export default SpotifyDashboard;
