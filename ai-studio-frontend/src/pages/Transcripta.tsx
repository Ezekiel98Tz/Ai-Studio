import React, { useState, useEffect } from 'react';
import api from '../api/client';

const TranscriptaInner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/api/tools/transcripta/process', form);
      setResult(res.data.transcript?.text || '');
      const hx = await api.get('/api/tools/transcripta/history');
      setHistory(hx.data.history || []);
      setSuccess('Transcript created successfully!');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const copyTranscript = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setSuccess('Transcript copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadTranscript = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-secondary dark:text-text-light tracking-tight">Transcripta</h1>
        <p className="text-lg text-text-muted">Turn your audio and video into text instantly with AI precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm">
            <h2 className="font-semibold mb-4 text-secondary dark:text-text-light flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              Upload Media
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-secondary'}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <input 
                type="file" 
                id="file-upload"
                className="hidden" 
                accept="audio/*,video/*" 
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
              />
              
              {!file ? (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary dark:text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3-2zm0 0v-6" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-secondary dark:text-text-light">Click to upload or drag & drop</p>
                    <p className="text-sm text-text-muted mt-1">MP3, MP4, WAV, M4A (max 100MB)</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white dark:bg-secondary p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="text-left truncate">
                        <p className="font-medium text-secondary dark:text-text-light truncate">{file.name}</p>
                        <p className="text-xs text-text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); handleFileSelect(null); }} className="text-text-muted hover:text-destructive p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {previewUrl && (
                    <div className="rounded-lg overflow-hidden bg-black">
                      <video src={previewUrl} controls className="w-full max-h-48 mx-auto" />
                    </div>
                  )}

                  <button 
                    onClick={upload}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-black transition-all transform active:scale-[0.98] ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-glow shadow-lg shadow-primary/20'}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Transcribing...
                      </span>
                    ) : 'Start Transcription'}
                  </button>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {success}
              </div>
            )}
          </div>

          {/* History (Mobile/Desktop Split could go here, keeping it simple) */}
           <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm">
            <h2 className="font-semibold mb-4 text-secondary dark:text-text-light flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent Transcripts
            </h2>
            {history.length === 0 ? (
              <p className="text-sm text-text-muted italic">No history yet.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="text-sm p-3 rounded-lg bg-gray-50 dark:bg-secondary border border-border">
                    <div className="flex justify-between items-start">
                      <span className="text-secondary dark:text-text-light font-medium truncate max-w-[200px]">{h.input_path.split('/').pop()}</span>
                      <span className="text-xs text-text-muted">{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text-muted mt-1 line-clamp-2 text-xs">{h.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full">
           <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-secondary dark:text-text-light flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Transcription Result
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={copyTranscript}
                  disabled={!result}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary text-text-muted hover:text-primary transition-colors disabled:opacity-50"
                  title="Copy to Clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
                <button 
                  onClick={downloadTranscript}
                  disabled={!result}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary text-text-muted hover:text-primary transition-colors disabled:opacity-50"
                  title="Download Text"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 dark:bg-secondary/50 rounded-xl border border-border p-4 overflow-y-auto min-h-[400px]">
              {result ? (
                <p className="whitespace-pre-wrap text-secondary dark:text-text-light leading-relaxed">{result}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <p>Transcription will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transcripta: React.FC = () => (
  <TranscriptaInner />
);

export default Transcripta;
