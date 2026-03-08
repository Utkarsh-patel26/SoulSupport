"use client";

import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DashboardProfilePage() {
  const { me, updateProfile, updateAvatar } = useUser();
  const user = me.data?.data?.user || me.data?.user;
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?._id) return;
    try {
      await updateProfile.mutateAsync({ id: user._id, data: { fullName, bio } });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatar = async (file) => {
    if (!user?._id) return;
    try {
      await updateAvatar.mutateAsync({ id: user._id, file });
      toast.success('Avatar updated');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-h3 font-bold text-charcoal">Profile Settings</h1>
        <p className="mt-1 text-base text-text-muted">Manage your personal information and account details.</p>
      </div>

      {me.isLoading && (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
      )}
      
      {me.error && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
          <ErrorMessage message={String(me.error)} />
        </div>
      )}
      
      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your name and bio visible to the community.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Input 
                  label="Full Name" 
                  placeholder="e.g. Jane Doe" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                />
                <Textarea
                  label="Bio"
                  placeholder="Share a little bit about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  helperText="Brief description for your profile. 500 characters maximum."
                />
              </CardContent>
              <CardFooter className="bg-surface-alt/30 border-t border-border/50">
                <div className="flex justify-end w-full">
                  <Button 
                    onClick={handleSave} 
                    disabled={updateProfile.isPending || (user.fullName === fullName && (user.bio || '') === bio)}
                    isLoading={updateProfile.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative group mb-6">
                  <Avatar name={user.fullName || user.email} size={96} className="ring-4 ring-primary-soft shadow-md" />
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 bg-surface border border-border shadow-sm rounded-full flex items-center justify-center cursor-pointer text-text-muted hover:text-primary hover:border-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <input 
                      id="avatar-upload"
                      type="file" 
                      className="hidden"
                      accept="image/*" 
                      onChange={(e) => e.target.files?.[0] && handleAvatar(e.target.files[0])} 
                    />
                  </label>
                </div>
                
                <div className="w-full space-y-4">
                  <div className="bg-surface-alt/50 rounded-xl p-3 border border-border/50">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-sm font-medium text-charcoal">{user.email}</p>
                  </div>
                  <div className="bg-surface-alt/50 rounded-xl p-3 border border-border/50">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Account Role</p>
                    <Badge tone="primary" className="mt-1 capitalize">{user.userType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
