import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api/client';

const BackgroundZapInner: React.FC = () => {
  const [imagePath, setImagePath] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const removeBg = async () => {
    if (!imagePath) return;
    setLoading(true);
    try {
      const res = await api.post('/api/tools/backgroundzap/remove', { imagePath });
      setResult(res.data);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">BackgroundZap</h1>
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <input className="border rounded px-3 py-2 w-full" placeholder="Image path or URL" value={imagePath} onChange={(e) => setImagePath(e.target.value)} />
        <button className="mt-2 px-3 py-1 rounded bg-blue-600 text-white" disabled={loading} onClick={removeBg}>
          {loading ? 'Processing…' : 'Remove Background'}
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

const BackgroundZap: React.FC = () => (
  <ProtectedRoute>
    <BackgroundZapInner />
  </ProtectedRoute>
);

export default BackgroundZap;