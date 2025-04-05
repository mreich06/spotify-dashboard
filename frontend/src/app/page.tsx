'use client';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('http://localhost:4000/login'); // Express OAuth login route
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🎧 Spotify User Metrics Dashboard</h1>
      <p className={styles.description}>Analyze your top artists, genres, and tracks. Connect your Spotify account to get started.</p>
      <button onClick={handleLogin} className={styles.button}>
        Connect your Spotify account
      </button>
    </main>
  );
};

export default Home;
