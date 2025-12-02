'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PlaceCard from '@/components/PlaceCard';
import {
  FiArrowLeft,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiLightbulb,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';

interface Place {
  _id: string;
  name: string;
  country: string;
  category: string;
  description: string;
  shortDescription?: string;
  bestTime: string;
  whySpecial: string;
  thingsToDo: string[];
  images: string[];
  mapLink: string;
  budget: string;
  safety: string;
  tips: string[];
  rating?: number;
  isWorldWonder?: boolean;
  isTrending?: boolean;
}

export default function PlaceDetailsPage() {
  const params = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPlace();
      fetchRelatedPlaces();
    }
  }, [params.id]);

  const fetchPlace = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/places/${params.id}`);
      const data = await res.json();
      setPlace(data.place);
    } catch (error) {
      console.error('Error fetching place:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPlaces = async () => {
    try {
      if (place?.category) {
        const res = await fetch(`/api/places?category=${place.category}&limit=4`);
        const data = await res.json();
        setRelatedPlaces(
          data.places?.filter((p: Place) => p._id !== params.id).slice(0, 3) || []
        );
      }
    } catch (error) {
      console.error('Error fetching related places:', error);
    }
  };

  useEffect(() => {
    if (place) {
      fetchRelatedPlaces();
    }
  }, [place]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Place Not Found</h1>
          <p className="text-gray-400 mb-6">The destination you're looking for doesn't exist.</p>
          <Link href="/places">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all">
              Browse All Destinations
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={place.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={place.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />

        {/* Back Button */}
        <Link
          href="/places"
          className="absolute top-24 left-4 sm:left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f0f]/80 backdrop-blur-sm text-white hover:bg-[#0f0f0f] transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Title Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {place.isWorldWonder && (
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                  World Wonder
                </span>
              )}
              {place.isTrending && (
                <span className="px-3 py-1 rounded-full bg-teal-500 text-white text-sm font-medium">
                  Trending
                </span>
              )}
              {place.rating && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#0f0f0f]/80 backdrop-blur-sm text-sm">
                  <FiStar className="h-4 w-4 fill-orange-500 text-orange-500" />
                  {place.rating}
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
              {place.name}
            </h1>
            <div className="flex items-center gap-2 text-lg text-gray-300">
              <FiMapPin className="h-5 w-5" />
              <span>{place.country}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  About {place.name}
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {place.description}
                </p>
              </div>

              {/* Why Special */}
              <div className="glass-card p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiLightbulb className="h-5 w-5 text-orange-400" />
                  Why This Place is Special
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {place.whySpecial}
                </p>
              </div>

              {/* Things to Do */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">
                  Things to Do
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {place.thingsToDo?.map((thing, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#111] border border-gray-800"
                    >
                      <FiCheckCircle className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{thing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Tips */}
              {place.tips && place.tips.length > 0 && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-6">
                    Travel Tips
                  </h3>
                  <div className="space-y-3">
                    {place.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-[#111]"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-gray-400">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="glass-card p-6 sticky top-24">
                <h3 className="font-display text-lg font-semibold mb-6">
                  Quick Info
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FiCalendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        Best Time to Visit
                      </p>
                      <p className="font-medium text-white">{place.bestTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <FiDollarSign className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        Estimated Budget
                      </p>
                      <p className="font-medium text-white">{place.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <FiShield className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        Safety Info
                      </p>
                      <p className="font-medium text-white text-sm">{place.safety}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold mb-3">
                    Plan Your Trip
                  </button>
                  <a
                    href={`https://www.google.com/search?q=hotels+in+${encodeURIComponent(
                      place.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111] text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    Find Hotels
                    <FiExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Places */}
      {relatedPlaces.length > 0 && (
        <section className="py-16 bg-[#111]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold mb-8">
              Similar Destinations
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPlaces.map((relatedPlace) => (
                <PlaceCard key={relatedPlace._id} place={relatedPlace} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
