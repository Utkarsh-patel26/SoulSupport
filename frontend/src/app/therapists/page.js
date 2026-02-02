"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TherapistsPage() {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isTherapist = user?.userType === 'therapist';

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const data = await api.get('/therapists');
        setTherapists(data?.therapists || []);
      } catch (err) {
        setError('Failed to load therapists');
        toast.error('Failed to load therapists');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-teal-600 dark:bg-teal-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Therapist</h1>
          <p className="text-xl text-teal-50">
            Browse our network of licensed professionals
          </p>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner label="Loading therapists..." />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!loading && !error && therapists.length === 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Therapists Available Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to join our network as a therapist!
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Register as Therapist
              </Link>
            </div>
          )}

          {!loading && !error && therapists.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div
                  key={therapist._id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center text-2xl">
                      {therapist.user?.avatarUrl ? (
                        <img
                          src={therapist.user.avatarUrl}
                          alt={therapist.user?.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {therapist.user?.fullName || 'Therapist'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{therapist.rating?.toFixed(1) || '0.0'} ★</span>
                        <span>•</span>
                        <span>${therapist.hourlyRate || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  {therapist.specializations && therapist.specializations.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {therapist.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs rounded"
                        >
                          {spec}
                        </span>
                      ))}
                      {therapist.specializations.length > 3 && (
                        <span className="px-2 py-1 text-gray-600 dark:text-gray-400 text-xs">
                          +{therapist.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {therapist.user?.bio && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {therapist.user.bio}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/therapists/${therapist._id}`}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-center text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && therapists.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {therapists.length} therapist{therapists.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
