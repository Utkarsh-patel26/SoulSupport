"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing token');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset');
      router.push('/login');
    } catch (err) {
      toast.error(err || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:text-gray-50">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset password</h1>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
