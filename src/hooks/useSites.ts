import { useState, useEffect } from 'react';
import sitesData from '../data/sites.json';

export interface Site {
  id: number;
  name: string;
  country: string;
  city: string;
  coordinates: { lat: number; lng: number };
  type: "Cultural" | "Natural" | "Mixed";
  history_place: string;
  history_site: string;
  significance: string;
  important_people: { name: string; role: string }[];
  best_time: {
    months: string;
    time_of_day: string;
  };
  travel_info: {
    nearest_airport: string;
    train_access: boolean;
    estimated_time: string;
  };
  thumbnail?: string;
  images: string[];
}

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    // Cast appropriately since we're using static JSON imports
    setSites(sitesData as Site[]);
  }, []);

  return { sites };
};
