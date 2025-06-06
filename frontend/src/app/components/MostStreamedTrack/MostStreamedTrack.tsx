import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const MostStreamedTrack = () => (
  <FadeInWhenVisible order="second" className="h-full">
    <div className="h-full rounded-xl bg-[#0f1d17] bg-gradient-to-br from-[#0f1d17] via-[#0d1a15] to-black p-6 text-white shadow-inner flex flex-col justify-between">
      <h2 className="text-lg font-semibold text-green-400 mb-4">Most Streamed Track</h2>
      <img src="/your-track-cover.jpg" alt="Most Streamed" className="w-full h-32 object-cover rounded-md mb-4" />
      <div className="text-white">
        <p className="font-bold">idontwannabeyouanymore</p>
        <p className="text-sm text-green-300">Billie Eilish</p>
        <p className="text-xs mt-2 text-gray-400">First Played: 24/01/2024</p>
        <p className="text-xs text-gray-400">Minutes Listened: 187</p>
        <p className="text-xs text-gray-400">Track Repeats: 74</p>
      </div>
    </div>
  </FadeInWhenVisible>
);

export default MostStreamedTrack;
