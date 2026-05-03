import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Plane, Train, MapPin, Heart } from 'lucide-react';
import { useSites } from '../hooks/useSites';
import { useFavorites } from '../hooks/useFavorites';
import MapView from '../components/MapView';
import Gallery from '../components/Gallery';
import AIGuide from '../components/AIGuide';
import { useWikipedia } from '../hooks/useWikipedia';

export default function SiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites } = useSites();
  const { isFavorite, toggleFavorite } = useFavorites();

  const siteId = Number(id);
  const site = sites.find(s => s.id === siteId);
  const favorite = isFavorite(siteId);
  const { wikiData, wikiLoading } = useWikipedia(site?.name || '', site?.country || '');

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
        <h2 className="text-2xl font-bold text-zinc-900">Site not found</h2>
        <Link to="/" className="mt-4 text-orange-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  // Use wiki data if available, fallback to static data
  const displayImages = wikiData?.images?.length ? wikiData.images : site.images;
  const heroImage = displayImages[0] || site.thumbnail || site.images[0];
  const historyText = wikiData?.extract || site.history_site;

  return (
    <article className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 transition-colors">
      {/* Hero Section */}
      <div className="relative h-[65vh] min-h-[500px] w-full bg-zinc-950 overflow-hidden">
        <img 
          src={heroImage} 
          alt={site.name} 
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-[30s] ease-out hover:scale-110 xl:opacity-60 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Explore
              </button>
              
              <button
                onClick={() => toggleFavorite(siteId)}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:scale-105 shadow-xl ${
                  favorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : 'text-zinc-500'}`} />
                {favorite ? 'Saved to Favorites' : 'Save Site'}
              </button>
            </div>

            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur-md border border-orange-500/30">
                {site.type} Heritage
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl [text-wrap:balance]">
                {site.name}
              </h1>
              <div className="mt-6 flex items-center gap-2 text-lg text-zinc-300 font-medium">
                <MapPin className="h-5 w-5 text-orange-400" />
                {site.city}, {site.country}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">About the Site</h2>
              <div className="mt-4 prose prose-zinc dark:prose-invert prose-lg">
                {wikiLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                ) : (
                  <p className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {historyText}
                  </p>
                )}
              </div>
            </section>
            
            {/* Add AIGuide here */}
            <AIGuide siteName={site.name} country={site.country} />

            {site.significance && site.significance !== 'Cultural or natural heritage is considered to be of outstanding value to humanity.' && (
              <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Significance</h2>
                <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {site.significance}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Gallery</h2>
              {wikiLoading ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <div className="aspect-[4/3] rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                   <div className="aspect-[4/3] rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                </div>
              ) : (
                <Gallery images={displayImages} name={site.name} />
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-colors">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                <Clock className="h-5 w-5 text-orange-500" />
                Best Time to Visit
              </h3>
              <dl className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">Months</dt>
                  <dd className="mt-1">{site.best_time.months}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">Time of Day</dt>
                  <dd className="mt-1">{site.best_time.time_of_day}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-colors">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                <Plane className="h-5 w-5 text-orange-500" />
                Travel Info
              </h3>
              <dl className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">Nearest Airport</dt>
                  <dd className="mt-1">{site.travel_info.nearest_airport}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">Estimated Duration</dt>
                  <dd className="mt-1">{site.travel_info.estimated_time}</dd>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Train className={`h-5 w-5 ${site.travel_info.train_access ? 'text-green-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {site.travel_info.train_access ? 'Train Access Available' : 'No Train Access'}
                  </span>
                </div>
              </dl>
            </div>

            {site.coordinates.lat !== 0 && site.coordinates.lng !== 0 && (
              <div className="rounded-3xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden relative z-0 transition-colors">
                 <MapView 
                   lat={site.coordinates.lat} 
                   lng={site.coordinates.lng} 
                   name={site.name} 
                   city={site.city} 
                 />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
