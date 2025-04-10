'use client';

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Express OAuth login route that redirects to dashboard after login
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?returnTo=/dashboard`);
    console.log('API:', process.env.NEXT_PUBLIC_BACKEND_URL);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">🎧 Spotify User Metrics Dashboard</h1>
      <p className="text-xl text-neutral-600 mb-8 max-w-xl">
        Analyze your top artists, genres, and tracks. Connect your Spotify account to get started.
      </p>
      <button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
        Connect your Spotify account
      </button>
    </main>
  );
};

export default Home;
