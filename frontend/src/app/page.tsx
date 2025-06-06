'use client';

import { useRouter } from 'next/navigation';
import FadeInWhenVisible from './components/FadInWhenVisible/FadeInWhenVisible';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?returnTo=/dashboard`);
  };

  return (
    <main className="min-h-screen p-10 flex flex-col items-center justify-center text-center bg-black text-green-500">
      <FadeInWhenVisible order="first">
        <h1 className="text-5xl font-bold mb-6">🎧 Spotify User Metrics Dashboard</h1>
      </FadeInWhenVisible>
      <FadeInWhenVisible order="second">
        <p className="text-xl text-neutral-300 mb-8 max-w-xl">
          Analyze your top artists, genres, and tracks. Connect your Spotify account to get started.
        </p>
      </FadeInWhenVisible>
      <FadeInWhenVisible order="third">
        <button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          Connect your Spotify account
        </button>
      </FadeInWhenVisible>
    </main>
  );
};

export default Home;
