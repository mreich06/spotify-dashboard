import { screen } from '@testing-library/react';
import TopArtists from '@/app/components/TopArtists/TopArtists';
import { renderWithState } from '@/test-utils';

// API call needs to be mocked because request to /top-artists triggered during render
// error will occus if test finishes before async code completes
jest.mock('@/app/store/artistsSlice', () => ({
  ...jest.requireActual('@/app/store/artistsSlice'),
  fetchTopArtists: () => () => {}, // mock thunk as noop function
}));

describe('TopArtists component', () => {
  it('shows loading message when loading', () => {
    const state = {
      artists: { medium_term: [] },
      loading: true,
      error: null,
    };
    renderWithState(<TopArtists />, 'artists', () => state, state);
    expect(screen.getByText(/Loading your top artists.../i)).toBeInTheDocument();
  });

  it('shows an error message when there is an error', () => {
    const state = {
      artists: { medium_term: [] },
      loading: false,
      error: 'Failed to fetch',
    };
    renderWithState(<TopArtists />, 'artists', () => state, state);
    expect(screen.getByText(/Error loading top artists:/i)).toBeInTheDocument();
  });

  it('renders top artists list', () => {
    const state = {
      artists: {
        medium_term: [
          { id: '1', name: 'Artist One' },
          { id: '2', name: 'Artist Two' },
        ],
      },
      loading: false,
      error: null,
    };
    renderWithState(<TopArtists />, 'artists', () => state, state);

    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Artist Two')).toBeInTheDocument();
  });
});
