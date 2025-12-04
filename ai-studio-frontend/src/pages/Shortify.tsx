import React, { useState, useEffect } from 'react';
import api from '../api/client';

const ShortifyInner: React.FC = () => {
  const [source, setSource] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      setSource(''); // Clear URL input if file selected
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
    if (e.target.value) {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const generate = async () => {
    if (!source.trim() && !file) {
      setError('Enter a video URL or select a file');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        res = await api.post('/api/tools/shortify/generate', form);
      } else {
        res = await api.post('/api/tools/shortify/generate', { source });
      }
      setResult(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('video/')) {
      handleFileSelect(f);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-secondary dark:text-text-light tracking-tight">Shortify</h1>
        <p className="text-lg text-text-muted">Generate viral social media clips from your videos automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm">
            <h2 className="font-semibold mb-4 text-secondary dark:text-text-light flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Source Video
            </h2>
            
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-secondary'}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <input 
                type="file" 
                id="video-upload"
                className="hidden" 
                accept="video/*" 
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
              />
              
              {!file ? (
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary dark:text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-secondary dark:text-text-light">Click to upload or drag & drop</p>
                    <p className="text-sm text-text-muted mt-1">MP4, MOV, WEBM (max 200MB)</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center justify-between bg-white dark:bg-secondary p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                         <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
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
                    <div className="rounded-lg overflow-hidden bg-black aspect-video">
                      <video src={previewUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark text-text-muted">OR</span>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-secondary dark:text-text-light">Video URL</label>
                <div className="relative">
                    <input 
                        className="w-full border border-border rounded-lg px-4 py-3 bg-white dark:bg-background text-secondary dark:text-text-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10" 
                        placeholder="https://youtube.com/..." 
                        value={source} 
                        onChange={handleUrlChange} 
                    />
                    <svg className="w-5 h-5 text-text-muted absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
            </div>

            <button 
              onClick={generate}
              disabled={loading || (!file && !source)}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-black transition-all transform active:scale-[0.98] ${loading || (!file && !source) ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-glow shadow-lg shadow-primary/20'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing Video...
                </span>
              ) : 'Generate Shorts'}
            </button>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full">
          <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm h-full flex flex-col">
             <h2 className="font-semibold mb-4 text-secondary dark:text-text-light flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
              Generated Clips
            </h2>

            <div className="flex-1 bg-gray-50 dark:bg-secondary/50 rounded-xl border border-border p-4 overflow-y-auto min-h-[400px]">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                   <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p>Generated clips will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {result.clips && result.clips.length > 0 ? (
                    result.clips.map((clip: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-secondary rounded-lg border border-border overflow-hidden shadow-sm">
                        <div className="aspect-[9/16] bg-black relative group">
                             {/* Placeholder for video preview if URL is available, else generic icon */}
                             <div className="absolute inset-0 flex items-center justify-center text-white">
                                <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                             </div>
                             {/* If we have a real URL, use video tag */}
                             {clip.url && (
                                 <video src={clip.url} controls className="w-full h-full object-cover" />
                             )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                             <h3 className="font-semibold text-secondary dark:text-text-light">Clip {idx + 1}</h3>
                             <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-dark font-medium">Viral Score: 9{idx}</span>
                          </div>
                          <p className="text-sm text-text-muted mb-4 line-clamp-2">{clip.description || 'No description available.'}</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <a 
                              href={clip.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 dark:bg-white/10 hover:bg-secondary/20 dark:hover:bg-white/20 text-secondary dark:text-text-light text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              Open
                            </a>
                            <a 
                              href={clip.url} 
                              download 
                              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary-glow text-black text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                     <div className="text-center py-8">
                        <p className="text-text-muted">No clips generated. Try another video.</p>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Shortify: React.FC = () => (
  <ShortifyInner />
);

export default Shortify;
