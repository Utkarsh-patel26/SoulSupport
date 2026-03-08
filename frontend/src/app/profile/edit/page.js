"use client";

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileService } from '@/services/profileService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

function EditProfileContent() {
  const queryClient = useQueryClient();
  const [photoFile, setPhotoFile] = useState(null);

  const { data } = useQuery({
    queryKey: ['my-profile'],
    queryFn: profileService.getMyProfile,
  });

  const profile = data?.data?.profile;
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName || '',
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      mentalHealthGoals: (profile.mentalHealthGoals || []).join(', '),
      preferredTherapyTypes: (profile.preferredTherapyTypes || []).join(', '),
      qualifications: profile.therapistProfile?.qualifications || '',
      languages: (profile.therapistProfile?.languages || []).join(', '),
      sessionPricing: profile.therapistProfile?.sessionPricing || 0,
    });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(String(error || 'Failed to update profile')),
  });

  const uploadMutation = useMutation({
    mutationFn: profileService.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Photo uploaded');
      setPhotoFile(null);
    },
    onError: (error) => toast.error(String(error || 'Failed to upload photo')),
  });

  if (!form) return <p className="px-4 py-10 text-sm text-slate-600">Loading...</p>;

  const submit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      ...form,
      mentalHealthGoals: form.mentalHealthGoals
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      preferredTherapyTypes: form.preferredTherapyTypes
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      languages: form.languages
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      sessionPricing: Number(form.sessionPricing) || 0,
    });

    if (photoFile) {
      await uploadMutation.mutateAsync(photoFile);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <Input label="Mental Health Goals (comma-separated)" value={form.mentalHealthGoals} onChange={(e) => setForm({ ...form, mentalHealthGoals: e.target.value })} />
            <Input label="Preferred Therapy Types (comma-separated)" value={form.preferredTherapyTypes} onChange={(e) => setForm({ ...form, preferredTherapyTypes: e.target.value })} />

            {profile.userType === 'therapist' && (
              <>
                <Textarea label="Qualifications" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
                <Input label="Languages (comma-separated)" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
                <Input type="number" label="Session Pricing" value={form.sessionPricing} onChange={(e) => setForm({ ...form, sessionPricing: e.target.value })} />
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Profile Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </div>

            <Button type="submit" disabled={updateMutation.isPending || uploadMutation.isPending}>
              {updateMutation.isPending || uploadMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}
