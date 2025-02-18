import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Spinner from './ui/Spinner';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen font-raleway bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<Spinner />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

export default React.memo(Layout);
