'use client';
import Image from 'next/image';

import FadeInWhenVisible from '@/app/components/FadInWhenVisible/FadeInWhenVisible';
import GlassCard from '@/app/components/GlassCard/GlassCard';

interface HeaderProps {
  date: string;
  label: string;
}

interface SavedCardProps {
  term: string;
}

// ideas for adding - optional title- if the save involves a popup with text input
const SavedCard = ({ term }: SavedCardProps) => {
  return (
    <div key={term} className="savedCard">
      <h3 className="savedCardTitle">{term}</h3>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center divide-x divide-[#1a2a22] mb-4">
        <div>
          <p className="cardStatsValue">2,350</p>
          <p className="grayGreenText">MINUTES</p>
        </div>
        <div>
          <p className="cardStatsValue">127</p>
          <p className="grayGreenText">TRACKS</p>
        </div>
        <div>
          <p className="cardStatsValue">62</p>
          <p className="grayGreenText">ARTISTS</p>
        </div>
      </div>
      {/* Highlights */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img src="/artist.jpg" alt="Top Artist" width={32} height={32} className="rounded-full" />
          <div>
            <p className="cardWhiteText">Fred again..</p>
            <p className="grayGreenText">TOP ARTIST</p>
          </div>
        </div>

        <div>
          <p className="grayGreenText">Top Track</p>
          <p className="cardWhiteText">Hey There Delilah</p>
        </div>

        <div>
          <p className="grayGreenText">Top Genre</p>
          <p className="cardWhiteText">Techno</p>
        </div>
      </div>
    </div>
  );
};

export default SavedCard;
