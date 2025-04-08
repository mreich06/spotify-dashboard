'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/tokenSlice';
import styles from './SpotifyDashboard.module.css';
import sharedStyles from '../styles/shared.module.css';
import TopArtists from '../components/TopArtists/TopArtists';
import TopTracks from '../components/TopTracks/TopTracks';
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
 * 5. Displays Spotify metrics data by getting data from Redux
 *
 */
const SpotifyDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.token.accessToken);
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

  if (tokenLoading) return <p>Connecting to your Spotify account</p>;

  if (!token) {
    return (
      <div className={styles.tokenExpiredMsg}>
        <h2 className={styles.loginHeader}>Session Expired</h2>
        <p className={styles.loginMsg}>Please login again to continue</p>
        <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`)} className={sharedStyles.button}>
          Reconnect to Spotify
        </button>
      </div>
    );
  }

  return (
    <>
      <TopArtists />
      <TopTracks />
    </>
  );
};

export default SpotifyDashboard;
