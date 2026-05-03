import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Site } from '../hooks/useSites';
import { cn } from '../utils/helpers';

interface SiteCardProps {
  site: Site;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export default memo(function SiteCard({ site, isFavorite, onToggleFavorite }: SiteCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all hover:shadow-xl hover:ring-zinc-300 dark:hover:ring-zinc-700" style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <img 
          src={site.thumbnail || site.images[0]} 
          alt={site.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent dark:from-black/80 dark:via-black/20" />
        
        {/* Badges */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(site.id);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "fill-transparent text-white")} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {site.type}
        </div>
      </div>
      
      <Link to={`/site/${site.id}`} className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{site.name}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{site.city}, {site.country}</span>
        </div>
        <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {site.significance}
        </p>
      </Link>
    </div>
  );
});
