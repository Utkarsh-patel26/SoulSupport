"use client";

import { useState } from 'react';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Reset link sent if the email exists');
    } catch (err) {
      toast.error(err || 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:text-gray-50">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your email to receive a reset link.</p>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
