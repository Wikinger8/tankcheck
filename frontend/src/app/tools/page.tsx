'use client';

import Link from 'next/link';

const tools = [
  {
    title: 'Kostenrechner',
    desc: 'Tankkosten berechnen und vergleichen',
    href: '/tools/calculator',
    color: '#00e5a0',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm2.25-6.75h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15v-.008Zm-2.25-4.5h.008v.008H12.75v-.008ZM7.5 6.75V4.875c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125V6.75" />
      </svg>
    ),
  },
  {
    title: 'Verbrauchstracker',
    desc: 'Tankfüllungen und Verbrauch analysieren',
    href: '/tools/tracker',
    color: '#60a5fa',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: 'Stationsvergleich',
    desc: 'Favoriten Seite an Seite vergleichen',
    href: '/tools/compare',
    color: '#fbbf24',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0f] pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-white mb-6">Tools</h1>
        <div className="space-y-2">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4 flex items-center gap-4 active:bg-[#1c1c22] transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#1c1c22] border border-[#2a2a34] flex items-center justify-center" style={{ color: tool.color }}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-[15px]">{tool.title}</p>
                  <p className="text-sm text-[#555566]">{tool.desc}</p>
                </div>
                <svg className="w-4 h-4 text-[#555566] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
