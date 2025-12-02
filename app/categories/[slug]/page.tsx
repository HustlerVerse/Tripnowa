'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PlaceCard from '@/components/PlaceCard';
import Image from 'next/image';

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

interface Place {
  _id: string;
  name: string;
  country: string;
  description: string;
  images: string[];
  bestTime: string;
  category: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, placesRes] = await Promise.all([
        fetch(`/api/categories/${params.slug}`),
        fetch(`/api/places?category=${params.slug}&limit=100`),
      ]);

      const categoryData = await categoryRes.json();
      const placesData = await placesRes.json();

      setCategory(categoryData.category);
      setPlaces(placesData.places || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center">
        <p className="text-gray-400 text-xl">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Category Hero */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={category.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={category.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {category.title}
            </h1>
            <p className="text-white/80 text-lg max-w-3xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            {places.length} Destination{places.length !== 1 ? 's' : ''} Found
          </h2>

          {places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No places found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

