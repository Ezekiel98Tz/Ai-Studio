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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">AI Tools</h1>
      {isLoading && <div>Loading tools…</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((t) => (
          <Link key={t.slug} to={`/ai-studio/${t.slug}`} className="border rounded p-4 bg-white dark:bg-gray-900 hover:shadow">
            <div className="font-semibold">{t.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t.description}</div>
            <div className="mt-2 text-xs text-gray-500">{t.category}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AiStudio;