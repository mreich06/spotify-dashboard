'use client';

import styles from './page.module.css';
import sharedStyles from './styles/shared.module.css';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Express OAuth login route that redirects to dashboard after login
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?returnTo=/dashboard`);
    console.log('API:', process.env.NEXT_PUBLIC_BACKEND_URL);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🎧 Spotify User Metrics Dashboard</h1>
      <p className={styles.description}>Analyze your top artists, genres, and tracks. Connect your Spotify account to get started.</p>
      <button onClick={handleLogin} className={sharedStyles.button}>
        Connect your Spotify account
      </button>
    </main>
  );
};

export default Home;
