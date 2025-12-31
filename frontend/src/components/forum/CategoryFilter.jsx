import { Dropdown } from '@/components/ui/Dropdown';

export function CategoryFilter({ value, onChange, categories = [] }) {
  const base = [{ label: 'All', value: 'all' }];
  const opts = base.concat((categories || []).map((c) => ({ label: c, value: c })));
  return <Dropdown label="Category" value={value} onChange={onChange} options={opts} />;
}
