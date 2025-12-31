"use client";

import { useTherapist, useTherapistMutations } from '@/hooks/useTherapists';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TherapistProfilePage() {
  const { user } = useAuth();
  const id = user?._id;
  const { data, isLoading, error } = useTherapist(id);
  const { updateProfile, uploadPhoto } = useTherapistMutations();
  const therapist = data?.data?.therapist || data?.therapist;
  const email = therapist?.user?.email || therapist?.email || user?.email;
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (therapist) {
      setFullName(therapist.fullName || therapist.user?.fullName || '');
      setBio(therapist.bio || therapist.user?.bio || '');
    }
  }, [therapist]);

  const handleSave = async () => {
    if (!id) return;
    await updateProfile.mutateAsync({ id, data: { fullName, bio } });
    toast.success('Profile updated');
  };

  const handlePhoto = async (file) => {
    if (!id) return;
    await uploadPhoto.mutateAsync({ id, file });
    toast.success('Photo updated');
  };

  return (
    <AnimatedSection className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Profile</h1>
      {isLoading && <LoadingSpinner label="Loading profile..." />}
      {error && <ErrorMessage message={String(error)} />}
      {therapist && (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">Email: {email}</p>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
          <textarea
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-charcoal shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save profile'}
          </Button>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-charcoal">Profile photo</p>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          </div>
        </div>
      )}
      {!id && <p className="text-sm text-slate-600">Login as therapist to load your profile.</p>}
    </AnimatedSection>
  );
}
