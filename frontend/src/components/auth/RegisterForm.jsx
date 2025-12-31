"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: 'user',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
    } catch (err) {
      toast.error(err || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        required
      />
      <Dropdown
        label="I am a"
        value={form.userType}
        onChange={(value) => handleChange('userType', value)}
        options={[
          { label: 'User (seeking therapy)', value: 'user' },
          { label: 'Therapist (providing therapy)', value: 'therapist' },
        ]}
      />
      <textarea
        className="h-24 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-charcoal shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        placeholder="Bio (optional)"
        value={form.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
