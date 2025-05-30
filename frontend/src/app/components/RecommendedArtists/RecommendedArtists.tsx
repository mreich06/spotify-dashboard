'use client';

type Artist = {
  id: string;
  name: string;
  imageUrl: string;
};

const recommended: Artist[] = [
  {
    id: '1',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebea709c4d1c2096c0b6e53a60',
  },
  {
    id: '2',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b8b7d5fbd4d5a3fcd7e2f3d',
  },
  {
    id: '3',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8d8e7bb1fce08a9c75faea0d',
  },
  {
    id: '4',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb56b75983f5e7a06b3db96edc',
  },
  {
    id: '5',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb07b30e4f453cdb206f85e745',
  },
];

const RecommendedArtists = () => {
  return (
    <div className="bg-[#0f1d17] rounded-xl p-4 h-full text-white">
      <h2 className="text-lg font-semibold text-green-400 mb-4">Recommended Artists</h2>
      <ul className="space-y-4">
        {recommended.map((artist) => (
          <li key={artist.id} className="flex items-center gap-4">
            <img src={artist.imageUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
            <span className="text-md">{artist.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedArtists;
