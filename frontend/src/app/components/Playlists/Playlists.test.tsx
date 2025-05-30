import { screen } from '@testing-library/react';
import Playlists from './Playlists';
import { renderWithState } from '@/test-utils';

// Mock base state shape matching your Redux slice
const baseState = {
  playlists: {
    playlists: {
      href: '',
      limit: 0,
      total: 0,
      items: [],
    },
    loading: false,
    error: null,
  },
};

describe('Playlists component', () => {
  it('shows loading message', () => {
    const state = {
      ...baseState,
      playlists: { ...baseState.playlists.playlists },
      loading: true,
    };
    renderWithState(<Playlists />, 'playlists', () => state, state);
    expect(screen.getByText(/Loading your playlists/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    const state = {
      ...baseState,
      playlists: { ...baseState.playlists.playlists },
      loading: false,
      error: 'Failed to fetch playlists',
    };
    renderWithState(<Playlists />, 'playlists', () => state, state);
    expect(screen.getByText(/Failed to fetch playlists/i)).toBeInTheDocument();
  });

  it('renders playlists', () => {
    const state = {
      ...baseState,
      playlists: {
        href: '',
        limit: 1,
        total: 1,
        items: [
          {
            id: '1',
            name: 'Chill Vibes',
            images: [],
            href: 'https://api.spotify.com/v1/playlists/1',
            tracks: {
              href: 'https://api.spotify.com/v1/playlists/1/tracks',
              total: 10,
            },
          },
        ],
      },
    };
    renderWithState(<Playlists />, 'playlists', () => state, state);
    expect(screen.getByText(/Chill Vibes/i)).toBeInTheDocument();
  });
});
