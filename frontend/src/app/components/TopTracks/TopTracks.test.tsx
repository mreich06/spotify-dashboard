import { screen } from '@testing-library/react';
import TopTracks from '@/app/components/TopTracks/TopTracks';
import { renderWithState } from '@/test-utils';

// mock fetchTopTracks thunk so network request is not attempted
// and no axios error will log
jest.mock('@/app/store/topTracksSlice', () => {
  const actual = jest.requireActual('@/app/store/topTracksSlice');
  return {
    ...actual,
    fetchTopTracks: () => () => {}, // no-op thunk
  };
});

describe('TopTracks component', () => {
  const state = {
    topTracks: [],
    loading: true,
    error: null,
  };
  it('shows loading message when loading', () => {
    renderWithState(<TopTracks />, 'topTracks', () => state, state);
    expect(screen.getByText(/Loading your top tracks.../i)).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const state = {
      topTracks: [],
      loading: false,
      error: 'Failed to fetch',
    };
    renderWithState(<TopTracks />, 'topTracks', () => state, state);
    expect(screen.getByText(/Error loading top tracks:/i)).toBeInTheDocument();
  });

  it('shows top tracks when data is loaded', () => {
    const state = {
      topTracks: [
        { id: '1', name: 'Track One' },
        { id: '2', name: 'Track Two' },
      ],
      loading: false,
      error: null,
    };
    renderWithState(<TopTracks />, 'topTracks', () => state, state);

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Track Two')).toBeInTheDocument();
  });
});
