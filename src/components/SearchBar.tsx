import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  types: string[];
}

export default function SearchBar({ value, onChange, typeFilter, onTypeFilterChange, types }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync internal state if prop changes (e.g. clear filters)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search places, countries, history..."
          className="h-14 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 pl-12 pr-4 text-zinc-900 dark:text-zinc-50 shadow-sm outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-zinc-500"
        />
      </div>
      <div className="relative shrink-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SlidersHorizontal className="h-5 w-5 text-zinc-400" />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 pl-12 pr-10 text-zinc-900 dark:text-zinc-50 shadow-sm outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 sm:w-48"
        >
          <option value="All">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );
}
