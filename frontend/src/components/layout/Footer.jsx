export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-base font-semibold text-charcoal">SoulSupport</p>
          <p className="text-slate-500">Healing, learning, and thriving together.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="/about" className="hover:text-primary-700">
            About
          </a>
          <a href="/resources" className="hover:text-primary-700">
            Resources
          </a>
          <a href="/forum" className="hover:text-primary-700">
            Community
          </a>
        </div>
      </div>
    </footer>
  );
}
