'use client';

import { Suspense } from 'react';
import SpotifyDashboard from './SpotifyDashboard';

const Page = () => {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <SpotifyDashboard />
    </Suspense>
  );
};

export default Page;
