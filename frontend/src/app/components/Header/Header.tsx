'use client';

import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const Header = () => {
  return (
    <FadeInWhenVisible order="first">
      <div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Maya&apos;s Spotify Dashboard</h1>
        <p className="text-md text-white/75 mt-1 mb-3">Discover your top tracks, playlists, genres and artists over time.</p>
      </div>
    </FadeInWhenVisible>
  );
};

export default Header;
