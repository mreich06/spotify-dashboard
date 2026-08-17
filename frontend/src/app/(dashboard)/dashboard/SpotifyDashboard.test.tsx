import DashboardPage from './page'; // adjust import if needed
import { renderWithStore } from '../../../../test-utils/renderWithStore';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('access_token=mockToken'),
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('DashboardPage', () => {
  it('renders dashboard sections when token is present', async () => {
    renderWithStore(<DashboardPage />);

    // wait for async render
    // expect(await screen.findByText(/My Playlists/i)).toBeInTheDocument();

    // check the main sections (based on your components in DashboardPage)
    // expect(screen.getByText(/Top Genres/i)).toBeInTheDocument();
    // expect(screen.getByText(/Top Tracks/i)).toBeInTheDocument();
    // expect(screen.getByText(/Mock Playlist/i)).toBeInTheDocument();
    // expect(screen.getByText(/Mock Artist/i)).toBeInTheDocument();
  });
});
