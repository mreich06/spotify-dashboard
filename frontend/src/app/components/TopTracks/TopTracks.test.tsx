import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TopTracks from '@/app/components/TopTracks/TopTracks';

// mock fetchTopTracks thunk so network request is not attempted
// and no axios error will log
jest.mock('@/app/store/topTracksSlice', () => {
  const actual = jest.requireActual('@/app/store/topTracksSlice');
  return {
    ...actual,
    fetchTopTracks: () => () => {}, // no-op thunk
  };
});

// Mock reducer with custom initial state
const renderWithState = (mockState: { topTracks: { id: string; name: string }[]; loading: boolean; error: string | null }) => {
  const store = configureStore({
    reducer: {
      topTracks: () => mockState,
    },
  });

  return render(
    <Provider store={store}>
      <TopTracks />
    </Provider>,
  );
};

describe('TopTracks component', () => {
  it('shows loading message when loading', () => {
    renderWithState({ topTracks: [], loading: true, error: null });
    expect(screen.getByText(/Loading your top tracks.../i)).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    renderWithState({ topTracks: [], loading: false, error: 'Failed to fetch' });
    expect(screen.getByText(/Error loading top tracks:/i)).toBeInTheDocument();
  });

  it('shows top tracks when data is loaded', () => {
    renderWithState({
      topTracks: [
        { id: '1', name: 'Track One' },
        { id: '2', name: 'Track Two' },
      ],
      loading: false,
      error: null,
    });

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Track Two')).toBeInTheDocument();
  });
});
