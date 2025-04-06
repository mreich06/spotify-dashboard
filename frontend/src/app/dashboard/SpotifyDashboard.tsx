'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/tokenSlice';
import styles from './SpotifyDashboard.module.css';
import { fetchTopArtists } from '../store/artistsSlice';
import sharedStyles from '../styles/shared.module.css';
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
  const { artists, loading, error } = useAppSelector((state) => state.artists);
  const [tokenLoading, setTokenLoading] = useState(true);

  // Get token from URL or sessionStorage and store in Redux
  useEffect(() => {
    const queryToken = searchParams.get('token');
    const storedToken = sessionStorage.getItem('spotify_token');

    if (queryToken) {
      sessionStorage.setItem('spotify_token', queryToken);
      dispatch(setToken(queryToken));
      router.replace('/dashboard');
      setTokenLoading(false);
    } else if (storedToken) {
      dispatch(setToken(storedToken));
      setTokenLoading(false);
    } else {
      setTokenLoading(false);
    }
  }, [searchParams, router, dispatch]);

  // fetch top artists data
  useEffect(() => {
    if (!token) return;
    dispatch(fetchTopArtists(token));
  }, [token, dispatch]);

  if (tokenLoading) return <p>Connecting to your Spotify account</p>;

  if (!token) {
    return (
      <div className={styles.tokenExpiredMsg}>
        <h2 className={styles.loginHeader}>Session Expired</h2>
        <p className={styles.loginMsg}>Please login again to continue</p>
        <button onClick={() => router.push('http://localhost:4000/login')} className={sharedStyles.button}>
          Reconnect to Spotify
        </button>
      </div>
    );
  }

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

export default SpotifyDashboard;
