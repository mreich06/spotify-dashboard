'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/tokenSlice';

import Sidebar from '../components/Sidebar/Sidebar';
import SummaryCards from '../components/SummaryCards/SummaryCards';
import TopGenres from '../components/TopGenres/TopGenres';
import TopTracksBarChart from '../components/TopTracks/TopTracksBarChart';
import TopArtistsDetails from '../components/TopArtistsDetails/TopArtistsDetails';
import ListeningActivityChart from '../components/ListeningActivityChart/ListeningActivityChart';
import TopPlaylists from '../components/TopPlaylists/TopPlaylists';
import MostStreamedTrack from '../components/MostStreamedTrack/MostStreamedTrack';
import YearSelectorTabs from '../components/YearSelectorTabs/YearSelectorTabs';
import Header from '../components/Header/Header';

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
        <div className="flex justify-between items-start mb-6 px-4 flex-wrap sm:flex-nowrap mt-3">
          <Header />
          <YearSelectorTabs />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-min">
          <div className="col-span-full md:col-span-4 lg:col-span-3 space-y-6">
            <SummaryCards />
            <TopGenres />
            <TopPlaylists />
          </div>

          <div className="col-span-full md:col-span-4 lg:col-span-1 lg:row-span-1 lg:row-start-1 lg:col-start-4">
            <MostStreamedTrack />
          </div>

          <div className="col-span-full md:col-span-4 lg:col-span-2">
            <TopTracksBarChart />
          </div>
          <div className="md:col-span-4 lg:col-span-2">
            <TopArtistsDetails />
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <ListeningActivityChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpotifyDashboard;
