/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const SiteDetails = lazy(() => import('./pages/SiteDetails'));
const Favorites = lazy(() => import('./pages/Favorites'));

function Loader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 dark:border-orange-900/50 border-t-orange-600 dark:border-t-orange-500"></div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col font-sans selection:bg-orange-500/30 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
          <Navbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/site/:id" element={<SiteDetails />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  );
}
