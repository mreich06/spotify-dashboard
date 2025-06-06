'use client';

import FadeInWhenVisible from '../FadInWhenVisible/FadeInWhenVisible';

const Header = () => {
  return (
    <FadeInWhenVisible order="first">
      <div>
        <h1 className="text-3xl font-bold text-green-400">Maya's Spotify Dashboard</h1>
        <p className="text-sm text-white/80 mt-1">Discover your top tracks, playlists, genres and artists over time.</p>
      </div>
    </FadeInWhenVisible>
  );
};

export default Header;
