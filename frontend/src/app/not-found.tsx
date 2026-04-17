import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0f] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-[#555566] mb-6">Seite nicht gefunden</p>
      <Link
        href="/"
        className="bg-[#00e5a0] text-[#0c0c0f] px-6 py-2 rounded-lg font-bold hover:bg-[#00cc8e] transition-colors"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
