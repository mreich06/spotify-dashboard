'use client';

type Artist = {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
  genres: string[];
  popularity: number;
  followers: number;
  topTrack: string;
};

const topArtists: Artist[] = [
  {
    id: '1',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebea709c4d1c2096c0b6e53a60',
    spotifyUrl: 'https://open.spotify.com/artist/7KxaZ3OKtqfRM173sKDf3T',
    genres: ['pop'],
    popularity: 78,
    followers: 1200000,
    topTrack: 'Track Example',
  },
  {
    id: '2',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b8b7d5fbd4d5a3fcd7e2f3d',
    spotifyUrl: 'https://open.spotify.com/artist/0gXxL5QpYkWlvqvTgUel6r',
    genres: ['pop'],
    popularity: 73,
    followers: 980000,
    topTrack: 'Track Example',
  },
  {
    id: '3',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8d8e7bb1fce08a9c75faea0d',
    spotifyUrl: 'https://open.spotify.com/artist/1wRPtKGflJrBx9BmLsSwlU',
    genres: ['pop'],
    popularity: 81,
    followers: 1470000,
    topTrack: 'Track Example',
  },
  {
    id: '4',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb56b75983f5e7a06b3db96edc',
    spotifyUrl: 'https://open.spotify.com/artist/0y59o4v8TeAE5tT8CK6dCd',
    genres: ['hip hop'],
    popularity: 66,
    followers: 740000,
    topTrack: 'Track Example',
  },
  {
    id: '5',
    name: 'Artist',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb07b30e4f453cdb206f85e745',
    spotifyUrl: 'https://open.spotify.com/artist/1wRpZ4HQGMo2Q3uWv3xOad',
    genres: ['soundtrack'],
    popularity: 69,
    followers: 880000,
    topTrack: 'Track Example',
  },
];

const TopArtistsDetails = () => {
  return (
    <div className="bg-[#0f1d17] rounded-xl p-4 text-white w-full">
      <h2 className="text-lg font-semibold text-green-400 mb-4">Top Artists (Details)</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-sm">
          <thead className="text-green-300 border-b border-green-700">
            <tr>
              <th className="py-2 pr-4">Artist</th>
              <th className="py-2 pr-4">Genres</th>
              <th className="py-2 pr-4">Top Track</th>
              <th className="py-2 pr-4">Popularity</th>
              <th className="py-2">Followers</th>
            </tr>
          </thead>
          <tbody>
            {topArtists.map((artist) => (
              <tr key={artist.id} className="border-b border-[#1a2a21]">
                <td className="py-2 pr-4 flex items-center gap-3">
                  <img src={artist.imageUrl} alt={artist.name} className="w-8 h-8 rounded-full object-cover" />
                  <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:underline">
                    {artist.name}
                  </a>
                </td>
                <td className="py-2 pr-4">{artist.genres.slice(0, 3).join(', ')}</td>
                <td className="py-2 pr-4">{artist.topTrack}</td>
                <td className="py-2 pr-4">{artist.popularity}</td>
                <td className="py-2">{artist.followers.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopArtistsDetails;
