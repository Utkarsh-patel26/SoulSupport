"use client";

import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DashboardProfilePage() {
  const { me, updateProfile, updateAvatar } = useUser();
  const user = me.data?.data?.user || me.data?.user;
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = async () => {
    if (!user?._id) return;
    await updateProfile.mutateAsync({ id: user._id, data: { fullName, bio } });
    toast.success('Profile updated');
  };

  const handleAvatar = async (file) => {
    if (!user?._id) return;
    await updateAvatar.mutateAsync({ id: user._id, file });
    toast.success('Avatar updated');
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Profile</h1>
      {me.isLoading && <LoadingSpinner label="Loading profile..." />}
      {me.error && <ErrorMessage message={String(me.error)} />}
      {user && (
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-700">Email: {user.email}</p>
            <p className="text-sm text-slate-700">Role: {user.userType}</p>
          </div>
          <div className="space-y-2">
            <Input placeholder={user.fullName} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-charcoal shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={3}
              placeholder={user.bio || 'Your bio'}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-charcoal">Avatar</p>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatar(e.target.files[0])} />
          </div>
        </Card>
      )}
    </div>
  );
}
