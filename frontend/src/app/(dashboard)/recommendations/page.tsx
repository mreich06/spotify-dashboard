'use client';

import { Suspense } from 'react';
import Saved from '../saved/Saved';

const Page = () => {
  return (
    <Suspense fallback={<p>Loading Saved...</p>}>
      <Saved />
    </Suspense>
  );
};

export default Page;
