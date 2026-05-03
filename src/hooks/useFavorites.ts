import { useState, useEffect, useCallback } from 'react';
import { Site } from './useSites';

const STORAGE_KEY = 'whs_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save to local storage
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter(fId => fId !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
