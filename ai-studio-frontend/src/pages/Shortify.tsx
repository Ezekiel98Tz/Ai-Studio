import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api/client';

const ShortifyInner: React.FC = () => {
  const [source, setSource] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!source) return;
    setLoading(true);
    try {
      const res = await api.post('/api/tools/shortify/generate', { source });
      setResult(res.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Shortify</h1>
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <input className="border rounded px-3 py-2 w-full" placeholder="Paste video URL or path" value={source} onChange={(e) => setSource(e.target.value)} />
        <button className="mt-2 px-3 py-1 rounded bg-blue-600 text-white" disabled={loading} onClick={generate}>
          {loading ? 'Generating…' : 'Generate Shorts'}
        </button>
      </div>
      {result && (
        <div className="border rounded p-4 bg-white dark:bg-gray-900">
          <h2 className="font-semibold mb-2">Result</h2>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const Shortify: React.FC = () => (
  <ProtectedRoute>
    <ShortifyInner />
  </ProtectedRoute>
);

export default Shortify;