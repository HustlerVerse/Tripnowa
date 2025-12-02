'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PlaceCard from '@/components/PlaceCard';
import CategoryCard from '@/components/CategoryCard';
import { FiSearch, FiMapPin, FiStar, FiZap, FiArrowRight, FiAward, FiTrendingUp } from 'react-icons/fi';

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
  isFeatured?: boolean;
  budget?: string;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [worldWonders, setWorldWonders] = useState<Place[]>([]);
  const [trendingPlaces, setTrendingPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [placesRes, categoriesRes] = await Promise.all([
        fetch('/api/places?limit=50'),
        fetch('/api/categories'),
      ]);

      const placesData = await placesRes.json();
      const categoriesData = await categoriesRes.json();

      const allPlaces = placesData.places || [];
      setFeaturedPlaces(allPlaces.filter((p: Place) => p.isFeatured).slice(0, 6));
      setWorldWonders(allPlaces.filter((p: Place) => p.isWorldWonder).slice(0, 7));
      setTrendingPlaces(allPlaces.filter((p: Place) => p.isTrending).slice(0, 5));
      setCategories(categoriesData.categories?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/places?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularSearches = ['Paris', 'Bali', 'Santorini', 'Machu Picchu', 'Tokyo'];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920"
            alt="Beautiful travel destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/60 via-[#0f0f0f]/40 to-[#0f0f0f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-[#0f0f0f]/80" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl animate-float animation-delay-200" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fade-up">
              <FiZap className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Discover 1000+ Destinations
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up animation-delay-100">
              Explore the{' '}
              <span className="gradient-text">World's Most</span>
              <br />
              Beautiful Places
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-200">
              From ancient wonders to hidden gems, discover extraordinary
              destinations that will take your breath away. Start your journey
              today.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto mb-8 animate-fade-up animation-delay-300"
            >
              <div className="glass-card p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where do you want to explore?"
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-400 py-3"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center gap-2"
                >
                  <FiSearch className="h-5 w-5" />
                  Search
                </button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-up animation-delay-400">
              <span className="text-sm text-gray-400">Popular:</span>
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => router.push(`/places?search=${search}`)}
                  className="px-3 py-1 rounded-full text-sm bg-[#111] hover:bg-[#1a1a1a] text-gray-300 transition-colors duration-300"
                >
                  {search}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-up animation-delay-500">
              {[
                { number: '1000+', label: 'Destinations' },
                { number: '50+', label: 'Countries' },
                { number: '4.9', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-600/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {!loading && categories.length > 0 && (
        <section className="py-24 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Browse by{' '}
                  <span className="gradient-text">Category</span>
                </h2>
                <p className="text-gray-400 max-w-xl">
                  Find your perfect getaway based on your travel style and preferences
                </p>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-teal-400 hover:gap-3 transition-all duration-300 font-medium"
              >
                View All Categories
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Places Section */}
      {!loading && featuredPlaces.length > 0 && (
        <section className="py-24 bg-[#111]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Featured{' '}
                  <span className="gradient-text">Destinations</span>
                </h2>
                <p className="text-gray-400 max-w-xl">
                  Handpicked extraordinary places that offer unforgettable experiences
                </p>
              </div>
              <Link
                href="/places"
                className="inline-flex items-center gap-2 text-teal-400 hover:gap-3 transition-all duration-300 font-medium"
              >
                Explore All Places
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredPlaces.map((place, index) => (
                <PlaceCard
                  key={place._id}
                  place={place}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/places">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center gap-2 mx-auto">
                  Discover All Destinations
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      {!loading && trendingPlaces.length > 0 && (
        <section className="py-24 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-teal-400 mb-4">
                  <FiTrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Trending Now
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Hot{' '}
                  <span className="gradient-text-accent">Destinations</span>
                </h2>
              </div>
              <Link
                href="/places?trending=true"
                className="inline-flex items-center gap-2 text-teal-400 hover:gap-3 transition-all duration-300 font-medium"
              >
                See All Trending
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trending Grid - Asymmetric Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Large Featured Card */}
              {trendingPlaces[0] && (
                <Link
                  href={`/places/${trendingPlaces[0]._id}`}
                  className="group md:col-span-2 lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden hover-lift aspect-[4/3] lg:aspect-auto min-h-[400px] lg:min-h-[500px]"
                >
                  <Image
                    src={trendingPlaces[0].images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                    alt={trendingPlaces[0].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
                  <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                        #1 Trending
                      </span>
                      {trendingPlaces[0].rating && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#0f0f0f]/80 backdrop-blur-sm text-sm">
                          <FiStar className="h-3 w-3 fill-orange-500 text-orange-500" />
                          {trendingPlaces[0].rating}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-3xl lg:text-4xl font-bold mb-2 group-hover:text-teal-400 transition-colors duration-300">
                      {trendingPlaces[0].name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <FiMapPin className="h-4 w-4" />
                      <span>{trendingPlaces[0].country}</span>
                    </div>
                    <p className="text-gray-300 max-w-lg line-clamp-2">
                      {trendingPlaces[0].shortDescription || trendingPlaces[0].description}
                    </p>
                  </div>
                </Link>
              )}

              {/* Smaller Cards */}
              {trendingPlaces.slice(1, 5).map((place, index) => (
                <Link
                  key={place._id}
                  href={`/places/${place._id}`}
                  className="group relative rounded-2xl overflow-hidden hover-lift aspect-[4/3]"
                >
                  <Image
                    src={place.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                    alt={place.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <span className="inline-block w-fit px-2 py-1 rounded-full bg-orange-500/90 text-white text-xs font-medium mb-2">
                      #{index + 2} Trending
                    </span>
                    <h3 className="font-display text-lg font-semibold group-hover:text-teal-400 transition-colors duration-300">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiMapPin className="h-3 w-3" />
                      <span>{place.country}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* World Wonders Section */}
      {!loading && worldWonders.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-[#111]/50 to-[#0f0f0f] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                <FiAward className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">
                  Seven Wonders of the World
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Marvel at{' '}
                <span className="gradient-text-accent">Ancient Wonders</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Witness humanity's greatest architectural achievements and immerse
                yourself in thousands of years of history
              </p>
            </div>

            {/* Wonders Horizontal Scroll */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {worldWonders.map((wonder, index) => (
                  <Link
                    key={wonder._id}
                    href={`/places/${wonder._id}`}
                    className="group flex-shrink-0 w-[300px] sm:w-[350px] snap-start"
                  >
                    <div className="glass-card overflow-hidden hover-lift h-full">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={wonder.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                          alt={wonder.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
                        
                        {/* Number Badge */}
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="font-display font-bold text-white">
                            {index + 1}
                          </span>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-6">
                          <h3 className="font-display text-xl font-bold mb-1 group-hover:text-teal-400 transition-colors duration-300">
                            {wonder.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {wonder.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Gradient Overlays for scroll indication */}
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none" />
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link href="/world-wonders">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold flex items-center gap-2 mx-auto">
                  Explore All World Wonders
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-24 bg-[#111] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Get <span className="gradient-text">Travel Inspiration</span>
              <br />
              Delivered to You
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ travelers who receive our weekly curated list of the
              world's most extraordinary destinations.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#0f0f0f] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <FiZap className="h-5 w-5" />
                Subscribe
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe anytime. Your email is safe with us.
            </p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
