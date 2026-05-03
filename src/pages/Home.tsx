import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useSites } from '../hooks/useSites';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import SiteCard from '../components/SiteCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const { sites } = useSites();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Derive available types
  const types = useMemo(() => {
    const s = new Set(sites.map(site => site.type));
    return Array.from(s).sort();
  }, [sites]);

  // Configure Fuse
  const fuse = useMemo(() => new Fuse(sites, {
    keys: ['name', 'country', 'city', 'type'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [sites]);

  // Filter pipeline
  const filteredSites = useMemo(() => {
    let result = sites;
    
    // 1. Search
    if (debouncedSearchTerm.trim()) {
      result = fuse.search(debouncedSearchTerm).map(res => res.item);
    }
    
    // 2. Filter by Type
    if (typeFilter !== 'All') {
      result = result.filter(site => site.type === typeFilter);
    }
    
    return result;
  }, [sites, debouncedSearchTerm, typeFilter, fuse]);

  // Pagination
  const totalPages = Math.ceil(filteredSites.length / ITEMS_PER_PAGE);
  const currentSites = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSites.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSites, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, typeFilter]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 pt-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            Discover the World's Heritage
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Explore {sites.length}+ UNESCO World Heritage sites. From ancient ruins to natural wonders, find your next destination.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-12">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            types={types}
          />
        </div>

        {/* Results Info */}
        <div className="mt-12 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Showing <span className="text-zinc-900 dark:text-zinc-50">{filteredSites.length}</span> sites
          </p>
        </div>

        {/* Grid */}
        {currentSites.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentSites.map(site => (
              <SiteCard 
                key={site.id} 
                site={site} 
                isFavorite={isFavorite(site.id)} 
                onToggleFavorite={toggleFavorite} 
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <p className="text-lg text-zinc-500 dark:text-zinc-400">No sites found matching your search criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setTypeFilter('All'); }}
              className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
