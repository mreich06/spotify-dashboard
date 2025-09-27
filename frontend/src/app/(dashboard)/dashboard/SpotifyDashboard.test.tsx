import { screen } from '@testing-library/react';
import { renderWithStore } from '../../../../test-utils/renderWithStore'; // adjust path if needed
import SpotifyDashboard from './SpotifyDashboard';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('access_token=mockToken'),
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('SpotifyDashboard', () => {
  it('renders dashboard sections when token is present', async () => {
    renderWithStore(<SpotifyDashboard />);
    expect(await screen.findByText(/Top Artists/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/Playlists/i)).toBeInTheDocument();
  });
});
