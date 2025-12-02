'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PlaceCard from '@/components/PlaceCard';
import { FiSearch, FiFilter, FiMapPin, FiX } from 'react-icons/fi';

interface Place {
  _id: string;
  name: string;
  country: string;
  description: string;
  shortDescription?: string;
  images: string[];
  bestTime: string;
  category: string;
  rating?: number;
  isWorldWonder?: boolean;
  isTrending?: boolean;
  budget?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: string;
}

export default function PlacesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [searchQuery, selectedCategory]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', '100');

      const res = await fetch(`/api/places?${params.toString()}`);
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    router.push(`/places?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    router.push('/places');
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#111] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Explore{' '}
              <span className="gradient-text">Destinations</span>
            </h1>
            <p className="text-xl text-gray-400">
              Discover {places.length}+ incredible places across the globe
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mt-10">
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, countries..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#111] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <FiSearch className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="px-6 py-4 bg-[#111] border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter className="h-5 w-5" />
              </button>
            </form>

            {/* Filter Pills */}
            {showFilters && (
              <div className="mt-6 flex flex-wrap gap-2 animate-fade-up">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.slug ? '' : cat.slug
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === cat.slug
                        ? 'bg-teal-500 text-white'
                        : 'bg-[#111] text-gray-300 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            )}

            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                    "{searchQuery}"
                    <FiX
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                    {categories.find((c) => c.slug === selectedCategory)?.title}
                    <FiX
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory('')}
                    />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400 mb-8">
            Showing {places.length} destinations
          </p>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : places.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place, index) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                No destinations found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#111] border border-gray-700 text-white rounded-xl hover:border-gray-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
