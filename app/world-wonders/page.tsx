'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiAward, FiStar, FiMapPin, FiArrowLeft } from 'react-icons/fi';

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
  budget?: string;
  whySpecial?: string;
}

export default function WorldWondersPage() {
  const [wonders, setWonders] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWonders();
  }, []);

  const fetchWonders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/places?category=World Wonders&limit=100');
      const data = await res.json();
      setWonders(data.places?.filter((p: Place) => p.isWorldWonder) || []);
    } catch (error) {
      console.error('Error fetching wonders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#111] to-[#0f0f0f] relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <FiAward className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">
                Humanity's Greatest Achievements
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Seven{' '}
              <span className="gradient-text-accent">Wonders</span>
              <br />
              of the World
            </h1>
            <p className="text-xl text-gray-400">
              Witness the most magnificent structures ever built, each
              representing the pinnacle of human creativity and engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Wonders List */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {wonders.map((wonder, index) => (
              <Link
                key={wonder._id}
                href={`/places/${wonder._id}`}
                className="group block glass-card overflow-hidden hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div
                    className={`relative aspect-[4/3] md:aspect-auto overflow-hidden ${
                      index % 2 === 1 ? 'md:order-2' : ''
                    }`}
                  >
                    <Image
                      src={wonder.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                      alt={wonder.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-transparent md:bg-none" />

                    {/* Number Badge */}
                    <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg">
                      <span className="font-display text-2xl font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {wonder.rating && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#111] text-sm">
                          <FiStar className="h-3 w-3 fill-orange-500 text-orange-500" />
                          {wonder.rating}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium">
                        World Wonder
                      </span>
                    </div>

                    <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3 group-hover:text-teal-400 transition-colors duration-300">
                      {wonder.name}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                      <FiMapPin className="h-4 w-4" />
                      <span>{wonder.country}</span>
                    </div>

                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {wonder.whySpecial || wonder.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Best Time:</span>
                        <span className="ml-2 font-medium text-gray-300">
                          {wonder.bestTime?.split(',')[0] || wonder.bestTime}
                        </span>
                      </div>
                      {wonder.budget && (
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="ml-2 font-medium text-gray-300">
                            {wonder.budget}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 text-teal-400 font-medium group-hover:gap-3 transition-all duration-300">
                        Explore this wonder →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

