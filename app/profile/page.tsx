'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/login');
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="bg-[#111] rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-lg">
              <FiMail className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-lg">
              <FiShield className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="text-white capitalize">{user.role}</p>
              </div>
            </div>

            {user.role === 'admin' && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <a
                  href="/admin"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Go to Admin Panel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

