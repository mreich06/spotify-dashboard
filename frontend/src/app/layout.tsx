import type { Metadata } from 'next';
import './globals.css';
import { Provider } from 'react-redux';
import store from './store';
export const metadata: Metadata = {
  title: 'Spotify Dashboard',
  description: 'Visualize your Spotify listening history',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
