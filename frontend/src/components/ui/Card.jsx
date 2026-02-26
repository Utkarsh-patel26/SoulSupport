export function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
}
