'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const queryToken = searchParams.get('token');

    if (queryToken) {
      sessionStorage.setItem('spotify_token', queryToken);
      setToken(queryToken);
      router.replace('/dashboard');
    } else {
      const stored = sessionStorage.getItem('spotify_token');
      if (stored) setToken(stored);
    }
  }, [searchParams, router]);

  if (!token) return <p>Loading...</p>;

  return (
    <div>
      <h1>Spotify Dashboard After Login</h1>
    </div>
  );
};

export default SpotifyDashboard;
