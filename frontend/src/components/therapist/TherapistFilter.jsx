"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';

const specialties = ['general', 'anxiety', 'relationships', 'work'];

export function TherapistFilter({ onFilter }) {
  const [keyword, setKeyword] = useState('');
  const [specialization, setSpecialization] = useState('all');

  const handleApply = () => {
    onFilter?.({ q: keyword, specialization });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-soft md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Search</label>
        <Input
          placeholder="Name, focus area, language..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="w-full md:w-64">
        <Dropdown
          label="Specialization"
          value={specialization}
          onChange={setSpecialization}
          options={[{ label: 'All', value: 'all' }, ...specialties.map((s) => ({ label: s, value: s }))]}
        />
      </div>
      <Button onClick={handleApply}>Apply filters</Button>
    </div>
  );
}
