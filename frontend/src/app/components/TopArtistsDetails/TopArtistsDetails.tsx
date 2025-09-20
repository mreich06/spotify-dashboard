'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchTopArtists } from '@/app/store/topArtistsSlice';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import GlassCard from '../GlassCard/GlassCard';
import { capitalizeFirstLetter } from '@/lib/utils';

const TopArtistsDetails = () => {
  const dispatch = useAppDispatch();
  const { artists, loading, error } = useAppSelector((state) => state.topArtists);

  useEffect(() => {
    dispatch(fetchTopArtists());
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading top artists...</p>;
  if (error) return <p className="text-white">Error: {error}</p>;

  return (
    <FadeInWhenVisible order="fifth">
      <GlassCard>
        <h2 className="text-lg font-semibold text-green-400 mb-4">Top Artists (Details)</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left text-sm">
            <thead className="text-green-300 border-b border-green-700">
              <tr>
                <th className="py-2 pr-4">Artist</th>
                <th className="py-2 pr-4">Genres</th>
                <th className="py-2 pr-4">Popularity</th>
                <th className="py-2">Followers</th>
              </tr>
            </thead>
            <tbody>
              {artists.slice(0, 5).map((artist) => (
                <tr key={artist.id} className="border-b border-[#1a2a21]">
                  <td className="py-2 pr-4 flex items-center gap-3">
                    <img src={artist.images?.[0]?.url ?? '/fallback.jpg'} alt={artist.name} className="w-8 h-8 rounded-full object-cover" />
                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:underline">
                      {artist.name}
                    </a>
                  </td>
                  <td className="py-2 pr-4">
                    {artist.genres.length > 0
                      ? artist.genres
                          .slice(0, 3)
                          .map((genre) => capitalizeFirstLetter(genre))
                          .join(', ')
                      : 'No genre provided'}
                  </td>
                  <td className="py-2 pr-4">{artist.popularity}</td>
                  <td className="py-2">{artist.followers.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default TopArtistsDetails;
