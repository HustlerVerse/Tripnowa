'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PlaceCard from '@/components/PlaceCard';
import Button from '@/components/Button';

interface Place {
  _id: string;
  name: string;
  country: string;
  description: string;
  images: string[];
  bestTime: string;
  category: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchPlaces();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/places?limit=100');
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/places/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPlaces(places.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete place');
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <Link href="/admin/add-place">
            <Button>Add New Place</Button>
          </Link>
        </div>

        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <p className="text-blue-400">
            <strong>Total Places:</strong> {places.length}
          </p>
        </div>

        {places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place._id} className="relative group">
                <PlaceCard place={place} />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/edit-place/${place._id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(place._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-4">No places found.</p>
            <Link href="/admin/add-place">
              <Button>Add Your First Place</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

