import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Link } from 'react-router-dom';

const AiStudio: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const res = await api.get('/api/tools');
      return res.data.tools as Array<{ slug: string; name: string; description: string; category: string }>;
    },
  });
  const fallback = [
    { slug: 'transcripta', name: 'Transcripta', description: 'Audio/Video → Text', category: 'Audio/Video' },
    { slug: 'shortify', name: 'Shortify', description: 'Video → Reels generator', category: 'Video' },
    { slug: 'backgroundzap', name: 'BackgroundZap', description: 'Image background remover', category: 'Image' },
  ];
  const items = data && data.length ? data : fallback;

  return (
    <div className="relative">
      <div className="bg-white dark:bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-secondary dark:text-text-light">ELS Digital AI Studio</h1>
            <p className="mt-3 text-text-muted">Process audio, video, and images with beautiful, fast tools.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link to="/ai-studio/transcripta" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-glow text-black font-medium transition-colors">Transcripta</Link>
              <Link to="/ai-studio/shortify" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-glow text-black font-medium transition-colors">Shortify</Link>
              <Link to="/ai-studio/backgroundzap" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-glow text-black font-medium transition-colors">BackgroundZap</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading && <div className="text-sm text-text-muted">Loading tools…</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.slug} className="group rounded-2xl border border-border bg-white dark:bg-dark shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-secondary flex items-center justify-center text-secondary dark:text-primary">
                    {t.slug === 'transcripta' ? '🎧' : t.slug === 'shortify' ? '🎬' : '🖼️'}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-secondary dark:text-text-light">{t.name}</div>
                    <div className="text-sm text-text-muted">{t.description}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-text-muted">{t.category}</div>
                <div className="mt-5">
                  <Link to={`/ai-studio/${t.slug}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-glow text-black font-medium transition-colors">
                    Open <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiStudio;
