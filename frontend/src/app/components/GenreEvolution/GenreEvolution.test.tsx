import { screen } from '@testing-library/react';
import GenreEvolution from '@/app/components/GenreEvolution/GenreEvolution';
import { renderWithState } from '@/test-utils';

// Mock fetchTopArtists thunk to avoid real API calls during tests
jest.mock('@/app/store/artistsSlice', () => ({
  ...jest.requireActual('@/app/store/artistsSlice'),
  fetchTopArtists: () => () => {}, // no-op thunk
}));

describe('GenreEvolution component', () => {
  const state = {
    artists: { medium_term: [] },
    loading: true,
    error: null,
  };
  it('shows loading message when loading', () => {
    renderWithState(<GenreEvolution />, 'artists', () => state, state);
    expect(screen.getByText(/Loading your genres.../i)).toBeInTheDocument();
  });

  it('shows an error message when there is an error', () => {
    const state = {
      artists: { medium_term: [] },
      loading: false,
      error: 'Failed to fetch',
    };
    renderWithState(<GenreEvolution />, 'artists', () => state, state);
    expect(screen.getByText(/Error loading genres:/i)).toBeInTheDocument();
  });

  it('renders genre evolution component successfully', () => {
    const state = {
      artists: {
        short_term: [
          { id: '1', name: 'Artist A', genres: ['rock', 'pop'] },
          { id: '2', name: 'Artist B', genres: ['rock'] },
        ],
        medium_term: [{ id: '3', name: 'Artist C', genres: ['pop'] }],
        long_term: [{ id: '4', name: 'Artist D', genres: ['jazz'] }],
        loading: false,
        error: null,
      },
    };
    renderWithState(<GenreEvolution />, 'artists', () => state, state);

    expect(screen.queryByText(/Loading your genres.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error loading genres:/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0);
  });
});
