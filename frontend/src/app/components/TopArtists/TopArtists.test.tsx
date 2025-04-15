import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TopArtists from '@/app/components/TopArtists/TopArtists';

// API call needs to be mocked because request to /top-artists triggered during render
// error will occus if test finishes before async code completes
jest.mock('@/app/store/artistsSlice', () => ({
  ...jest.requireActual('@/app/store/artistsSlice'),
  fetchTopArtists: () => () => {}, // mock thunk as noop function
}));

// Helper to mock state shape expected by TopArtists component
const renderWithState = (state: any) => {
  const store = configureStore({
    reducer: {
      artists: () => state,
    },
  });

  return render(
    <Provider store={store}>
      <TopArtists />
    </Provider>,
  );
};

describe('TopArtists component', () => {
  it('shows loading message when loading', () => {
    renderWithState({
      artists: { medium_term: [] },
      loading: true,
      error: null,
    });
    expect(screen.getByText(/Loading your top artists.../i)).toBeInTheDocument();
  });

  it('shows an error message when there is an error', () => {
    renderWithState({
      artists: { medium_term: [] },
      loading: false,
      error: 'Failed to fetch',
    });
    expect(screen.getByText(/Error loading top artists:/i)).toBeInTheDocument();
  });

  it('renders top artists list', () => {
    renderWithState({
      artists: {
        medium_term: [
          { id: '1', name: 'Artist One' },
          { id: '2', name: 'Artist Two' },
        ],
      },
      loading: false,
      error: null,
    });

    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Artist Two')).toBeInTheDocument();
  });
});
