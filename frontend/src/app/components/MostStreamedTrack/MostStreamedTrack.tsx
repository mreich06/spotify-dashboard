'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';
import GlassCard from '../GlassCard/GlassCard';
import { fetchMostStreamedTrack } from '@/app/store/mostStreamedTrackSlice';
import { CardProps } from '@/app/types/spotify';
import { capitalizeFirstLetter, msToMinutesAndSeconds } from '@/lib/utils';
import Image from 'next/image';

const Section = ({ content, title, className }: { content: string; title: string; className?: string }) => (
  <div className={className}>
    <p className="text-white font-semibold text-2xl">{content}</p>
    <p className="text-gray-400 text-sm">{title}</p>
  </div>
);

const MostStreamedTrack = ({ timeRange }: CardProps) => {
  const dispatch = useAppDispatch();
  const { track, loading, error } = useAppSelector((state) => state.mostStreamedTrack);

  useEffect(() => {
    dispatch(fetchMostStreamedTrack());
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading most streamed track...</p>;
  if (error || !track) return <p className="text-white">Error: {error || 'No track data'}</p>;

  // only using first in this array so do we need it?
  const topTrack = track?.[timeRange]?.items[0];
  const image = topTrack.album.images[0]?.url;
  const title = topTrack.name;
  const artist = topTrack.artists?.[0]?.name || 'Unknown Artist';
  const album = topTrack.album?.name || 'Album Name';
  const duration = msToMinutesAndSeconds(topTrack.duration_ms);
  const popularity = topTrack.popularity;
  const genre = capitalizeFirstLetter(topTrack.genres?.[0]);
  const albumType = capitalizeFirstLetter(topTrack.album.album_type);

  return (
    <FadeInWhenVisible order="second" className="h-full">
      <GlassCard className="h-full flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-green-400 mb-4">Most Streamed Track</h2>
        {image && <Image src={image} alt={title} className="w-full h-full object-cover rounded-md mb-4" />}
        <div className="text-white space-y-1">
          <p className="font-bold text-2xl">{title}</p>
          <p className="text-green-300 text-xl">{artist}</p>
          <p className="text-sm text-gray-400 italic">Album: {album}</p>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Section content={duration} title="Track Duration" className="border-t border-gray-700 pt-3" />
          <Section content={genre || 'N/A'} title="Genre" />
          <Section content={popularity.toString()} title="Popularity Score" />
          <Section content={albumType.toString()} title="Album Type" />
        </div>
      </GlassCard>
    </FadeInWhenVisible>
  );
};

export default MostStreamedTrack;
