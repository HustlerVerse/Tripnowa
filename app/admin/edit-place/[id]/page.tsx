'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    category: '',
    description: '',
    shortDescription: '',
    bestTime: '',
    whySpecial: '',
    thingsToDo: '',
    images: '',
    mapLink: '',
    budget: '',
    safety: '',
    tips: '',
    rating: '0',
    isWorldWonder: false,
    isTrending: false,
    isFeatured: false,
  });

  useEffect(() => {
    checkAuth();
    if (params.id) {
      fetchPlace();
    }
  }, [params.id]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user.role !== 'admin') {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchPlace = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/places/${params.id}`);
      const data = await res.json();

      if (data.place) {
        setFormData({
          name: data.place.name || '',
          country: data.place.country || '',
          category: data.place.category || '',
          description: data.place.description || '',
          shortDescription: data.place.shortDescription || '',
          bestTime: data.place.bestTime || '',
          whySpecial: data.place.whySpecial || '',
          thingsToDo: (data.place.thingsToDo || []).join('\n'),
          images: (data.place.images || []).join('\n'),
          mapLink: data.place.mapLink || '',
          budget: data.place.budget || '',
          safety: data.place.safety || '',
          tips: (data.place.tips || []).join('\n'),
          rating: (data.place.rating || 0).toString(),
          isWorldWonder: data.place.isWorldWonder || false,
          isTrending: data.place.isTrending || false,
          isFeatured: data.place.isFeatured || false,
        });
      }
    } catch (error) {
      console.error('Error fetching place:', error);
      setError('Failed to load place');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const placeData = {
        ...formData,
        thingsToDo: formData.thingsToDo
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        images: formData.images
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url.length > 0),
        tips: formData.tips
          .split('\n')
          .map((tip) => tip.trim())
          .filter((tip) => tip.length > 0),
        rating: parseFloat(formData.rating) || 0,
        isWorldWonder: formData.isWorldWonder,
        isTrending: formData.isTrending,
        isFeatured: formData.isFeatured,
      };

      const res = await fetch(`/api/admin/places/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update place');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to update place');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Edit Place</h1>

        <div className="bg-[#111] rounded-xl shadow-2xl p-8 border border-gray-800">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Place Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Country *"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <Input
              label="Category *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <Textarea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />

            <Input
              label="Short Description"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief one-line description for cards"
            />

            <Input
              label="Best Time to Visit *"
              value={formData.bestTime}
              onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
              required
            />

            <Textarea
              label="Why This Place is Special *"
              value={formData.whySpecial}
              onChange={(e) => setFormData({ ...formData, whySpecial: e.target.value })}
              rows={3}
              required
            />

            <Textarea
              label="Things to Do (one per line) *"
              value={formData.thingsToDo}
              onChange={(e) => setFormData({ ...formData, thingsToDo: e.target.value })}
              rows={4}
              required
            />

            <Textarea
              label="Image URLs (one per line) *"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={3}
              required
            />

            <Input
              label="Google Maps Embed Link"
              value={formData.mapLink}
              onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
            />

            <Input
              label="Estimated Budget *"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />

            <Textarea
              label="Safety Information *"
              value={formData.safety}
              onChange={(e) => setFormData({ ...formData, safety: e.target.value })}
              rows={3}
              required
            />

            <Textarea
              label="Travel Tips (one per line)"
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Rating (0-5)"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isWorldWonder}
                  onChange={(e) => setFormData({ ...formData, isWorldWonder: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 bg-[#111] text-blue-600 focus:ring-blue-600"
                />
                <span className="text-gray-300">Mark as World Wonder</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 bg-[#111] text-blue-600 focus:ring-blue-600"
                />
                <span className="text-gray-300">Mark as Trending</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 bg-[#111] text-blue-600 focus:ring-blue-600"
                />
                <span className="text-gray-300">Mark as Featured</span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" isLoading={saving} className="flex-1">
                Update Place
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

