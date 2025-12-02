'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CategoryCard from '@/components/CategoryCard';
import { FiArrowRight } from 'react-icons/fi';

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#111] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Browse by{' '}
            <span className="gradient-text">Category</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Find your perfect getaway based on your travel style and
            preferences
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group glass-card overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={category.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-display text-2xl font-semibold mb-2 group-hover:text-teal-400 transition-colors duration-300">
                      {category.title}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Explore destinations
                      </span>
                      <span className="inline-flex items-center gap-1 text-teal-400 font-medium group-hover:gap-2 transition-all duration-300">
                        Explore
                        <FiArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No categories found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
