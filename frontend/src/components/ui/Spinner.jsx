export function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  return (
    <div className={`inline-block ${sizes[size]} animate-spin rounded-full border-2 border-primary-500 border-t-transparent`}></div>
  );
}
