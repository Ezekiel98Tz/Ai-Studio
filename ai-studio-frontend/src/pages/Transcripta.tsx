import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api/client';

const TranscriptaInner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/api/tools/transcripta/process', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.transcript?.text || '');
      const hx = await api.get('/api/tools/transcripta/history');
      setHistory(hx.data.history || []);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Transcripta</h1>
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="ml-2 px-3 py-1 rounded bg-blue-600 text-white" disabled={loading} onClick={upload}>
          {loading ? 'Processing…' : 'Process'}
        </button>
      </div>
      {result && (
        <div className="border rounded p-4 bg-white dark:bg-gray-900">
          <h2 className="font-semibold mb-2">Transcript</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
      <div className="border rounded p-4 bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-2">Recent History</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {history.map((h) => (
            <li key={h.id}>{new Date(h.created_at).toLocaleString()} — {h.input_path}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Transcripta: React.FC = () => (
  <ProtectedRoute>
    <TranscriptaInner />
  </ProtectedRoute>
);

export default Transcripta;