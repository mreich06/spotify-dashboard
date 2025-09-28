'use client';

import GlassCard from '@/app/components/GlassCard/GlassCard';
import SavedCard from './SavedCard';

// need to implement this combined with terms
const cardList = [
  {
    totalMinutes: 2350,
    totalTracks: 127,
    totalArtists: 62,
    topArtist: 'Fred Again',
    topTrack: 'Delilah',
    topGenre: 'Techno',
  },
  {
    totalMinutes: 2350,
    totalTracks: 127,
    totalArtists: 48,
    topArtist: 'Fred Again',
    topTrack: 'Dreaming of You',
    topGenre: 'Techno',
  },
  {
    totalMinutes: 2350,
    totalTracks: 127,
    totalArtists: 52,
    topArtist: 'U2',
    topTrack: 'Who Knows What Will Happen',
    topGenre: 'Techno',
  },
];
interface SnapshotProps {
  name: string;
  date: string;
}

const Snapshot = ({ name, date }: SnapshotProps) => {
  return (
    <GlassCard className="rounded-xl p-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-[#7fae99]">Saved on {date}</p>
        <span className="snapshot">SNAPSHOT</span>
      </div>
      <h2 className="text-2xl font-semibold mb-6">{name}</h2>

      {/* Row of 3 Term Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {['Short Term', 'Medium Term', 'Long Term'].map((term) => (
          <SavedCard term={term} key={term} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="button">View</button>
        <button className="button">Rename</button>
        <button className="deleteButton">Delete</button>
      </div>
    </GlassCard>
  );
};

export default Snapshot;
