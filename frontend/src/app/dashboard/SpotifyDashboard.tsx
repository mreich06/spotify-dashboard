'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/tokenSlice';

import Sidebar from '../components/Sidebar/Sidebar';
import SummaryCards from '../components/SummaryCards/SummaryCards';
import TopPlaylists from '../components/TopPlaylists/TopPlaylists';
import TopGenres from '../components/TopGenres/TopGenres';
import RecommendedArtists from '../components/RecommendedArtists/RecommendedArtists';
import TopTracksBarChart from '../components/TopTracks/TopTracksBarChart';
import TopArtistsDetails from '../components/TopArtistsDetails/TopArtistsDetails';
import ListeningActivityChart from '../components/ListeningActivityChart/ListeningActivityChart';

const SpotifyDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.token.accessToken);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const storedToken = localStorage.getItem('access_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      dispatch(setToken(accessToken));
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="pb-6 text-4xl font-bold">Session Expired</h2>
        <p className="pb-6 text-[1.2rem] text-[#5a5a5a]">Please login again to continue</p>
        <button className="px-4 py-2 bg-green-600 rounded" onClick={() => router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`)}>
          Reconnect to Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-black text-white px-6 py-8 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold text-green-400 text-start mb-8">Maya's Spotify Dashboard</h1>

        <div className="relative rounded-2xl p-[1px] overflow-hidden">
          {/* Gradient border using before */}
          <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[conic-gradient(from_225deg,_rgba(34,197,94,0.3),_transparent_70%)] before:rounded-2xl before:blur-md" />

          {/* Card content */}
        </div>
        <h2 className="text-lg font-semibold text-green-300">Your Personalized Spotify Listening Insights</h2>
        <p className="text-sm text-white/70 mt-2">Elevate your brand with a golden tick and connect with top-tier associates.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Summary Cards */}
          <div className="lg:col-span-4 sm:col-span-2 col-span-1">
            <SummaryCards />
          </div>

          {/* Your Top Genres spans full width below cards */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5">
            <TopGenres />
          </div>

          {/* Below genres: Recommended left, TopPlaylists right */}
          <div className="sm:col-span-2 col-span-1">
            <RecommendedArtists />
          </div>

          <div className="sm:col-span-2 col-span-1">
            <TopPlaylists />
          </div>

          {/* Listening Activity */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5">
            <ListeningActivityChart />
          </div>

          {/* Bottom Row */}
          <div className="lg:col-span-2 sm:col-span-2 col-span-1">
            <TopTracksBarChart />
          </div>

          <div className="lg:col-span-3 sm:col-span-2 col-span-1">
            <TopArtistsDetails />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpotifyDashboard;
