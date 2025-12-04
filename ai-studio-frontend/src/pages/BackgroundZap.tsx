import React, { useState, useEffect } from 'react';
import api from '../api/client';

const BackgroundZapInner: React.FC = () => {
  const [imagePath, setImagePath] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setImagePath('');
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePath(e.target.value);
    if (e.target.value) {
      setFile(null);
      setPreviewUrl(e.target.value); // Ideally validate this
    } else {
      setPreviewUrl(null);
    }
  };

  const removeBg = async () => {
    if (!file && !imagePath.trim()) {
      setError('Select an image file or enter URL/path');
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
        res = await api.post('/api/tools/backgroundzap/remove', form);
      } else {
        res = await api.post('/api/tools/backgroundzap/remove', { image: imagePath });
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
    if (f && f.type.startsWith('image/')) {
      handleFileSelect(f);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-secondary dark:text-text-light tracking-tight">BackgroundZap</h1>
        <p className="text-lg text-text-muted">Remove image backgrounds instantly with AI precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white dark:bg-dark p-6 shadow-sm">
            <h2 className="font-semibold mb-4 text-secondary dark:text-text-light flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Original Image
            </h2>
            
             <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-secondary'}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <input 
                type="file" 
                id="image-upload"
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
              />
              
              {!file && !previewUrl ? (
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary dark:text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-secondary dark:text-text-light">Click to upload or drag & drop</p>
                    <p className="text-sm text-text-muted mt-1">PNG, JPG, WEBP (max 10MB)</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  {file && (
                     <div className="flex items-center justify-between bg-white dark:bg-secondary p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                           <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
                  )}
                  
                  {previewUrl && (
                    <div className="rounded-lg overflow-hidden border border-border bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross-hatch.png')]">
                      <img src={previewUrl} alt="Original" className="w-full h-auto max-h-[300px] object-contain mx-auto" />
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
                <label className="text-sm font-medium text-secondary dark:text-text-light">Image URL</label>
                <div className="relative">
                    <input 
                        className="w-full border border-border rounded-lg px-4 py-3 bg-white dark:bg-background text-secondary dark:text-text-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10" 
                        placeholder="https://example.com/image.png" 
                        value={imagePath} 
                        onChange={handleUrlChange} 
                    />
                     <svg className="w-5 h-5 text-text-muted absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
            </div>

            <button 
              onClick={removeBg}
              disabled={loading || (!file && !imagePath)}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-black transition-all transform active:scale-[0.98] ${loading || (!file && !imagePath) ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-glow shadow-lg shadow-primary/20'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Removing Background...
                </span>
              ) : 'Remove Background'}
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
               <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Processed Image
            </h2>
            
            <div className="flex-1 bg-gray-50 dark:bg-secondary/50 rounded-xl border border-border p-4 flex flex-col items-center justify-center min-h-[400px]">
               {!result ? (
                 <div className="text-center text-text-muted opacity-50">
                   <svg className="w-16 h-16 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <p>Processed image will appear here</p>
                 </div>
               ) : (
                 <div className="w-full space-y-6">
                    <div className="rounded-lg overflow-hidden border border-border bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross-hatch.png')] shadow-lg">
                      <img src={result.url} alt="Removed Background" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                    </div>
                    
                    <div className="flex justify-center">
                       <a 
                          href={result.url} 
                          download 
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-glow text-black font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download Image
                        </a>
                    </div>
                 </div>
               )}
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundZap: React.FC = () => (
  <BackgroundZapInner />
);

export default BackgroundZap;
