'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex relative w-64 lg:w-80 group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
      <input 
        type="text" 
        placeholder="Search everything..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary border-transparent focus:bg-background focus:border-border outline-none transition-all duration-300 placeholder:text-muted-foreground text-sm"
      />
    </form>
  );
}
