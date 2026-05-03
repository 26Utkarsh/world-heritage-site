import { useMemo, useState } from 'react';
import { useSites } from '../hooks/useSites';
import { useFavorites } from '../hooks/useFavorites';
import SiteCard from '../components/SiteCard';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function Favorites() {
  const { sites } = useSites();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  // Derive favorite sites
  const favoriteSites = useMemo(() => {
    return sites.filter(site => favorites.includes(site.id));
  }, [sites, favorites]);

  // Pagination
  const totalPages = Math.ceil(favoriteSites.length / ITEMS_PER_PAGE);
  const currentSites = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return favoriteSites.slice(start, start + ITEMS_PER_PAGE);
  }, [favoriteSites, currentPage]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 pt-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            My Favorites
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Keep track of the sites you want to visit and cherish.
          </p>
        </div>

        {favoriteSites.length > 0 ? (
          <>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentSites.map(site => (
                <SiteCard 
                  key={site.id} 
                  site={site} 
                  isFavorite={isFavorite(site.id)} 
                  onToggleFavorite={toggleFavorite} 
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="mt-24 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600">
              <Compass className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">No favorites yet</h3>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Start exploring and save sites you would like to visit.
            </p>
            <Link 
              to="/" 
              className="mt-8 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-700 dark:hover:bg-orange-500"
            >
              Explore Sites
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
