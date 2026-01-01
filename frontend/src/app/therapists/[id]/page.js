"use client";

import { useParams } from 'next/navigation';
import { useTherapist } from '@/hooks/useTherapists';
import { useAuth } from '@/hooks/useAuth';
import { ReviewCard } from '@/components/therapist/ReviewCard';
import { BookingModal } from '@/components/therapist/BookingModal';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useSessionMutations } from '@/hooks/useSessions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function TherapistPage() {
  const params = useParams();
  const therapistId = params?.id;
  const { user } = useAuth();
  const { data, isLoading, error } = useTherapist(therapistId);
  const { createSession } = useSessionMutations();
  const [open, setOpen] = useState(false);

  const therapist = data?.data?.therapist || data?.therapist;
  const reviews = data?.data?.reviews || therapist?.reviews || [];
  const isTherapist = user?.userType === 'therapist';

  const handleBook = async (payload) => {
    // Extract the userId from the therapist object
    const therapistUserId = therapist?.user?._id || therapist?.userId;
    await createSession.mutateAsync({
      ...payload,
      therapistId: therapistUserId,
    });
    toast.success('Session requested');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      {isLoading && <LoadingSpinner label="Loading therapist..." />}
      {error && <ErrorMessage message={String(error)} />}
      {therapist && (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <Avatar src={therapist.photoUrl} name={therapist.fullName} size={72} />
            <div className="space-y-1">
              <p className="font-heading text-2xl font-bold text-charcoal">{therapist.fullName}</p>
              <p className="text-sm text-slate-600">{therapist.specialization || 'Therapist'}</p>
              <div className="flex flex-wrap gap-2">
                {(therapist.tags || []).map((tag) => (
                  <Badge key={tag} tone="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {isTherapist ? (
              <div className="ml-auto px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm">
                Therapists cannot book sessions
              </div>
            ) : (
              <Button className="ml-auto" onClick={() => setOpen(true)}>
                Book session
              </Button>
            )}
          </div>
          <p className="text-slate-700">{therapist.bio}</p>
        </div>
      )}

      {reviews?.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Reviews</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}

      <BookingModal
        open={open}
        therapist={therapist}
        onClose={() => setOpen(false)}
        onBook={handleBook}
      />
    </div>
  );
}
