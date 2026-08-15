import { screen } from '@testing-library/react';
import Playlists from './Playlists';
import { renderWithState } from '@/test-utils';

const baseState = {
  playlists: {
    short_term: { href: '', limit: 0, total: 0, items: [] },
    medium_term: { href: '', limit: 0, total: 0, items: [] },
    long_term: { href: '', limit: 0, total: 0, items: [] },
  },
  loading: false,
  error: null,
};

describe('Playlists component', () => {
  it('shows loading message', () => {
    const state = { ...baseState, loading: true };
    renderWithState(<Playlists />, 'topPlaylists', () => state, state);

    expect(screen.getByText(/Loading your playlists.../i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    const state = { ...baseState, error: 'Failed to fetch playlists' };
    renderWithState(<Playlists />, 'topPlaylists', () => state, state);

    expect(screen.getByText(/Error loading playlists: Failed to fetch playlists/i)).toBeInTheDocument();
  });

  it('renders playlists', () => {
    const state = {
      ...baseState,
      playlists: {
        ...baseState.playlists,
        long_term: {
          href: '',
          limit: 1,
          total: 1,
          items: [
            {
              id: '1',
              name: 'Chill Vibes',
              images: [],
              href: 'https://api.spotify.com/v1/playlists/1',
              tracks: { href: '', total: 10 },
              uri: 'spotify:playlist:mockuri',
              type: 'playlist',
              external_urls: { spotify: '' },
            },
          ],
        },
      },
    };

    renderWithState(<Playlists />, 'topPlaylists', () => state, state);
    expect(screen.getByText(/Chill Vibes/i)).toBeInTheDocument();
  });
});
